import { CommonHandlerContext, SubstrateProcessor } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { EventContext, BlockContext } from './types/generated/support'
import { ParachainStakingNewRoundEvent } from './types/generated/events'
import { UnknownVersionError } from './common/errors'
import { Round, RoundCollator, RoundDelegation, RoundNominator } from './model'
import storage from './storage'
import assert from 'assert'

const database = new TypeormDatabase()
const processor = new SubstrateProcessor(database)

processor.setTypesBundle('moonriver')
processor.setBatchSize(500)
processor.setDataSource({
    archive: 'https://moonbeam.archive.subsquid.io/graphql',
    chain: 'wss://wss.api.moonbeam.network',
})
processor.setBlockRange({ from: 0 })

processor.addEventHandler('ParachainStaking.NewRound', async (ctx) => {
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

    const prevCtx = createPrevBlockContext(ctx)

    const collatorIds = await storage.parachainStaking.getSelectedCandidates(ctx)
    if (!collatorIds) return

    const collatorsData = await getCollatorsData(prevCtx, collatorIds)
    if (!collatorsData) return

    const collators = new Map<string, RoundCollator>()

    const nominatorIds: string[] = []
    const delegationsData: { vote: bigint; nominatorId: string; collatorId: string }[] = []

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

    const nominatorsData = await getNominatorsData(prevCtx, nominatorIds)
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

    const delegations = new Map<string, RoundDelegation>()

    for (const delegationData of delegationsData) {
        const collator = collators.get(delegationData.collatorId)
        const nominator = nominators.get(delegationData.nominatorId)
        assert(collator != null && nominator != null)

        const id = `${round.index}-${collator.account}-${nominator.account}`

        delegations.set(
            id,
            new RoundDelegation({
                id,
                round,
                collator,
                nominator,
                vote: delegationData.vote,
            })
        )
    }

    await ctx.store.save([...delegations.values()])
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

    if (event.isV900) {
        const [startingBlock, round, selectedCollatorsNumber, totalBalance] = event.asV900
        return { startingBlock, round, selectedCollatorsNumber, totalBalance }
    } else if (event.isV1001) {
        const [startingBlock, round, selectedCollatorsNumber, totalBalance] = event.asV1001
        return { startingBlock, round, selectedCollatorsNumber, totalBalance }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

export function createPrevBlockContext(ctx: CommonHandlerContext<Store>) {
    return {
        _chain: ctx._chain,
        block: {
            ...ctx.block,
            hash: ctx.block.parentHash,
            height: ctx.block.height,
        },
    }
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
    ctx: BlockContext,
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

    return undefined
}

interface NominatorData {
    id: string
    bond: bigint
}

async function getNominatorsData(
    ctx: BlockContext,
    accounts: string[]
): Promise<(NominatorData | undefined)[] | undefined> {
    const delegatorState = await storage.parachainStaking.getDelegatorState(ctx, accounts)
    if (delegatorState) {
        return delegatorState
    }

    return undefined
}
