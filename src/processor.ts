import { SubstrateProcessor } from '@subsquid/substrate-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { EventContext, StorageContext } from './types/generated/support'
import { ParachainStakingNewRoundEvent } from './types/generated/events'
import { UnknownVersionError } from './common/errors'
import { Round, RoundCollator, RoundDelegation, RoundNominator } from './model'
import storage from './storage'
import assert from 'assert'

const database = new TypeormDatabase(`parachain_staking_squid`)
const processor = new SubstrateProcessor(database)

processor.setTypesBundle('moonriver')
processor.setBatchSize(500)
processor.setDataSource({
    archive: 'https://moonriver.archive.subsquid.io/graphql',
    chain: 'wss://wss.moonriver.moonbeam.network',
})
processor.setBlockRange({ from: 0 })

processor.addEventHandler('ParachainStaking.NewRound', async (ctx) => {
    console.time('round')
    const roundData = getEventData(ctx)

    const round = new Round({
        id: roundData.round.toString(),
        index: roundData.round,
        timestamp: new Date(ctx.block.timestamp),
        startedAt: ctx.block.height,
        collatorsCount: roundData.selectedCollatorsNumber,
        total: roundData.totalBalance,
    })

    await ctx.store.insert(round)

    const collatorIds = await storage.parachainStaking.getSelectedCandidates(ctx)
    if (!collatorIds) return

    const collatorsData = await getCollatorsData(ctx, collatorIds)
    if (!collatorsData) return

    const collators = new Map<string, RoundCollator>()

    const nominatorIds = new Array<string>()
    const delegationsData = new Array<{ vote: bigint; nominatorId: string; collatorId: string }>()
    for (const collatorData of collatorsData) {
        if (!collatorData || collators.has(collatorData.id)) continue

        let totalBond = collatorData.bond

        for (const nomination of collatorData.nominators) {
            totalBond += nomination.amount
            nominatorIds.push(nomination.id)
            delegationsData.push({ vote: nomination.amount, nominatorId: nomination.id, collatorId: collatorData.id })
        }

        collators.set(
            collatorData.id,
            new RoundCollator({
                id: `${round.index}-${collatorData.id}`,
                round,
                account: collatorData.id,
                selfBond: collatorData.bond,
                totalBond: totalBond,
            })
        )
    }

    await ctx.store.save([...collators.values()])

    const nominatorsData = await getNominatorsData(ctx, nominatorIds)
    if (!nominatorsData) return

    const nominators = new Map<string, RoundNominator>()

    for (const nominatorData of nominatorsData) {
        if (!nominatorData || nominators.has(nominatorData.id)) continue

        nominators.set(
            nominatorData.id,
            new RoundNominator({
                id: `${round.index}-${nominatorData.id}`,
                round,
                account: nominatorData.id,
                bond: nominatorData.bond,
            })
        )
    }

    await ctx.store.save([...nominators.values()])

    const delegations = new Array<RoundDelegation>(delegationsData.length)

    for (let i = 0; i < delegationsData.length; i++) {
        const collator = collators.get(delegationsData[i].collatorId)
        const nominator = nominators.get(delegationsData[i].nominatorId)
        assert(collator != null && nominator != null)

        delegations[i] = new RoundDelegation({
            id: `${round.index}-${collator.account}-${nominator.account}`,
            round,
            collator,
            nominator,
            vote: delegationsData[i].vote,
        })
    }

    await ctx.store.save(delegations)
    console.timeEnd('round')
})

processor.run()

export interface EventData {
    startingBlock: number
    round: number
    selectedCollatorsNumber: number
    totalBalance: bigint
}

function getEventData(ctx: EventContext): EventData {
    const event = new ParachainStakingNewRoundEvent(ctx)

    if (event.isV49) {
        const [startingBlock, round, selectedCollatorsNumber, totalBalance] = event.asV49
        return { startingBlock, round, selectedCollatorsNumber, totalBalance }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

interface CollatorData {
    id: string
    bond: bigint
    nominators: {
        id: string
        amount: bigint
    }[]
}

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getCollatorsData(
    ctx: StorageContext,
    accounts: string[]
): Promise<(CollatorData | undefined)[] | undefined> {
    const candidateInfo = await storage.parachainStaking.getCandidateInfo(ctx, accounts)
    if (candidateInfo) {
        const bottomDelegations = await storage.parachainStaking.getBottomDelegations(ctx, accounts)
        const topDelegations = await storage.parachainStaking.getTopDelegations(ctx, accounts)

        return candidateInfo.map((d, i) => {
            if (!d) return undefined

            const nominators = topDelegations?.[i]?.delegations
                ? topDelegations?.[i]?.delegations.concat(bottomDelegations?.[i]?.delegations || []) || []
                : []

            return {
                id: d.id,
                bond: d.bond,
                nominators,
            }
        })
    }

    const candidateState = await storage.parachainStaking.getCandidateState(ctx, accounts)
    if (candidateState) {
        return candidateState.map((d) => {
            if (!d) return undefined

            const nominators = d.topDelegations.concat(d.bottomDelegations)

            return {
                id: d.id,
                bond: d.bond,
                nominators,
            }
        })
    }

    const collatorState = await storage.parachainStaking.old.getCollatorState(ctx, accounts)
    if (collatorState) {
        return collatorState.map((d) => {
            if (!d) return undefined

            const nominators = d.topNominators.concat(d.bottomNominators)

            return {
                id: d.id,
                bond: d.bond,
                nominators,
            }
        })
    }

    return undefined
}

interface NominatorData {
    id: string
    bond: bigint
}

async function getNominatorsData(
    ctx: StorageContext,
    accounts: string[]
): Promise<(NominatorData | undefined)[] | undefined> {
    const delegatorState = await storage.parachainStaking.getDelegatorState(ctx, accounts)
    if (delegatorState) {
        return delegatorState
    }

    const nominatorState = await storage.parachainStaking.old.getNominatorState(ctx, accounts)
    if (nominatorState) {
        return nominatorState
    }

    return undefined
}
