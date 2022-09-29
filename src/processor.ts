import { CommonHandlerContext, SubstrateProcessor } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { BlockContext, EventContext } from './types/generated/support'
import {
    ParachainStakingDelegationDecreasedEvent,
    ParachainStakingDelegationEvent,
    ParachainStakingDelegationIncreasedEvent,
    ParachainStakingDelegationRevokedEvent,
    ParachainStakingNewRoundEvent,
    ParachainStakingRewardedEvent,
} from './types/generated/events'

import { UnknownVersionError } from './common/errors'
import {
    Collator,
    CollatorRound,
    Delegator,
    DelegatorHistoryElement,
    Round,
    RoundDelegation,
    RoundNominator,
} from './model'
import { encodeId } from './common/tools'
import storage from './storage'
import assert from 'assert'

const database = new TypeormDatabase()
const processor = new SubstrateProcessor(database)

processor.setTypesBundle('moonriver')
processor.setBatchSize(10)
processor.setDataSource({
    archive: 'https://moonbeam.archive.subsquid.io/graphql',
    chain: 'wss://wss.api.moonbeam.network',
})
processor.setBlockRange({ from: 0 })

processor.addEventHandler('ParachainStaking.NewRound', async (ctx) => {
    const roundData = getNewRoundEventData(ctx)

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

    const collators = new Map<string, CollatorRound>()

    const delegatorIds: string[] = []
    const delegationsData: { vote: bigint; delegator: string; collator: string }[] = []

    for (const collatorData of collatorsData) {
        if (!collatorData || collators.has(collatorData.id)) continue

        let totalBond = collatorData.bond

        for (const nomination of collatorData.nominators) {
            totalBond += nomination.amount
            delegatorIds.push(nomination.id)
            delegationsData.push({ vote: nomination.amount, delegator: nomination.id, collator: collatorData.id })
        }

        collators.set(
            collatorData.id,
            new CollatorRound({
                id: `${round.index}-${collatorData.id}`,
                round,
                collator: collatorData.id,
                ownBond: collatorData.bond,
                totalBond: totalBond,
                rewardAmount: null,
            })
        )
        new Collator({
            id: `${round.index}-${collatorData.id}`,
            bond: collatorData.bond,
        })
    }

    await ctx.store.save([...collators.values()])

    const nominatorsData = await getNominatorsData(prevCtx, delegatorIds)
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
        new Delegator({
            id: `${nominatorData.id}`,
        })
    }

    await ctx.store.save([...nominators.values()])

    const delegations = new Map<string, RoundDelegation>()

    for (const delegationData of delegationsData) {
        const collator = collators.get(delegationData.collator)
        const delegator = nominators.get(delegationData.delegator)
        assert(collator != null && delegator != null)

        const id = `${round.index}-${collator.collator}-${delegator.account}`

        delegations.set(
            id,
            new RoundDelegation({
                id,
                round,
                collator,
                delegator,
                amount: delegationData.vote,
            })
        )
    }

    await ctx.store.save([...delegations.values()])
})
processor.addEventHandler('ParachainStaking.Rewarded', async (ctx) => {
    const rewardData = getRewardedEventData(ctx)
    const lastRound = await ctx.store.find(Round, {
        order: {
            id: 'DESC',
        },
        take: 1,
    })
    if (lastRound && rewardData) {
        const collator = await ctx.store.find(Collator, { where: { id: encodeId(rewardData.account) }, take: 1 })
        const delegator = await ctx.store.find(Delegator, { where: { id: encodeId(rewardData.account) }, take: 1 })
        ctx.log.info({ collator })
        if (collator[0] !== undefined) {
            const collatorLastRoundId = `${lastRound[0].index}-${encodeId(rewardData.account)}`
            const collatorLastRound = await ctx.store.find(CollatorRound, {
                where: { id: collatorLastRoundId },
                take: 1,
            })
            ctx.log.info('adding rewards')
            collatorLastRound[0].rewardAmount = rewardData.rewards
            if (collatorLastRound[0].totalBond) {
                const rel = (BigInt(100000) * rewardData.rewards) / collatorLastRound[0].totalBond
                collatorLastRound[0].apr = Number(BigInt(100000) * rewardData.rewards / collatorLastRound[0].totalBond)
                ctx.log.info('apr_calc')
                ctx.log.info(`${collatorLastRound[0].apr}`)
            }
            await ctx.store.save(collatorLastRound[0])
            const collatorSearch = await ctx.store.find(Collator, {
                where: { id: encodeId(rewardData.account) },
                take: 1,
            })
            if (collatorSearch[0] === undefined) {
                ctx.log.info('creating collator rewarded')
                const collatorEntity = new Collator({ id: encodeId(rewardData.account) })
                await ctx.store.insert(collatorEntity)
                ctx.log.info(collatorEntity.id)
            }
            const collator = await ctx.store.find(Collator, {
                where: { id: encodeId(rewardData.account) },
                take: 1,
            })
            ctx.log.info('get collator')
            ctx.log.info(collator[0].id)
            const reward = new DelegatorHistoryElement({
                id: `${lastRound[0].index}-${encodeId(rewardData.account)}-${rewardData.rewards}-${
                    ctx.block.timestamp
                }`,
                blockNumber: ctx.block.height,
                collator: collator[0],
                timestamp: new Date(ctx.block.timestamp),
                type: 2,
                round: lastRound[0],
                amount: rewardData.rewards,
            })
            await ctx.store.insert(reward)
            const roundFirst = await ctx.store.find(Round, { where: { index: lastRound[0].index - 4 }, take: 1 })

            if (roundFirst) {
                const collatorFirstRoundId = `${roundFirst[0].index}-${encodeId(rewardData.account)}`
                const collatorFirstRound = await ctx.store.find(CollatorRound, {
                    where: { id: collatorFirstRoundId },
                    take: 1,
                })
                if (collatorFirstRound[0]) {
                    ctx.log.info(collator[0].id)
                    const apr = collatorFirstRound[0].apr || 0
                    const lastApr = collatorLastRound[0].apr || 0
                    const agrApr = collator[0].apr24h || 0
                    collator[0].apr24h = Number((agrApr * 4 - apr + lastApr) / 4)
                    await ctx.store.save(collator[0])
                }
            }
        } else {
            if (delegator[0] === undefined) {
                ctx.log.info('creating delegator')
                const delegator = new Delegator({ id: encodeId(rewardData.account) })
                await ctx.store.insert(delegator)
                ctx.log.info('created delegator')
                ctx.log.info(delegator.id)
            }
            const reward = new DelegatorHistoryElement({
                id: `${lastRound[0].index}-${encodeId(rewardData.account)}-${rewardData.rewards}-${
                    ctx.block.timestamp
                }`,
                blockNumber: ctx.block.height,
                delegator: delegator[0],
                timestamp: new Date(ctx.block.timestamp),
                type: 2,
                round: lastRound[0],
                amount: rewardData.rewards,
            })

            await ctx.store.insert(reward)
        }
    }
})
processor.addEventHandler('ParachainStaking.Delegation', async (ctx) => {
    const delegationData = getNewDelegationEventData(ctx)
    const lastRound = await ctx.store.find(Round, {
        order: {
            id: 'DESC',
        },
        take: 1,
    })
    if (lastRound) {
        const delegatorRoundId = `${lastRound[0].index}-${encodeId(delegationData.delegator)}`
        ctx.log.info(delegatorRoundId)
        const delegatorSearch = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })
        if (delegatorSearch[0] === undefined) {
            ctx.log.info('delegation delegator round search undefined')
            ctx.log.info(encodeId(delegationData.delegator))
            const delegatorEntitySearch = await ctx.store.find(Delegator, {
                where: { id: encodeId(delegationData.delegator) },
                take: 1,
            })
            if (delegatorEntitySearch[0] === undefined) {
                ctx.log.info('delegation delegator entity undefined')
                const newDelegator = new Delegator({ id: encodeId(delegationData.delegator) })
                await ctx.store.insert(newDelegator)
                ctx.log.info('delegation delegator created')
                ctx.log.info(newDelegator.id)
            }
            const newDelegatorRound = new RoundNominator({
                id: delegatorRoundId,
                round: lastRound[0],
                account: encodeId(delegationData.delegator),
                bond: delegationData.lockedAmount,
            })
            await ctx.store.insert(newDelegatorRound)
            ctx.log.info('delegation delegator round created')
            ctx.log.info(newDelegatorRound.id)
        }
        const delegator = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })
        const collatorRoundId = `${lastRound[0].index}-${encodeId(delegationData.candidate)}`
        ctx.log.info(delegator[0].id)
        const collatorEntitySearch = await ctx.store.find(Collator, {
            where: { id: encodeId(delegationData.candidate) },
            take: 1,
        })
        if (collatorEntitySearch[0] === undefined) {
            ctx.log.info('collator search undefined')
            const newCollator = new Collator({
                id: encodeId(delegationData.candidate),
                bond: delegationData.lockedAmount,
                apr24h: 0.0,
            })
            await ctx.store.insert(newCollator)
            ctx.log.info(newCollator.id)
        }
        const collatorSearch = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        if (collatorSearch[0] === undefined) {
            ctx.log.info('collator search undefined')
            const prevCtx = createPrevBlockContext(ctx)
            const collatorsData = await getCollatorsData(prevCtx, [encodeId(delegationData.candidate)])
            if (collatorsData) {
                ctx.log.info('collatorsData')
                for (const collatorData of collatorsData) {
                    if (!collatorData) continue

                    let totalBond = collatorData.bond

                    for (const nomination of collatorData.nominators) {
                        totalBond += nomination.amount
                    }
                    const newCollatorRound = new CollatorRound({
                        id: collatorRoundId,
                        round: lastRound[0],
                        collator: encodeId(delegationData.candidate),
                        ownBond: collatorData.bond,
                        totalBond: totalBond,
                        rewardAmount: null,
                    })
                    await ctx.store.insert(newCollatorRound)
                    ctx.log.info('newCollatorRound created')
                    ctx.log.info(newCollatorRound.collator)
                    ctx.log.info(newCollatorRound.id)
                }
            }
        }
        const collator = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        ctx.log.info('finding collator')
        ctx.log.info(`${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}-delegation`)
        ctx.log.info(collator[0].collator)
        ctx.log.info('found this collator')
        const delegation = new RoundDelegation({
            id: `${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}`,
            round: lastRound[0],
            collator: collator[0],
            delegator: delegator[0],
            amount: delegationData.lockedAmount,
        })
        ctx.log.info(delegation)
        await ctx.store.insert(delegation)
        const collatorEntity = await ctx.store.find(Collator, {
            where: {
                id: encodeId(delegationData.candidate),
            },
            take: 1,
        })
        const delegatorEntity = await ctx.store.find(Delegator, {
            where: {
                id: delegator[0].account,
            },
            take: 1,
        })
        ctx.log.info('collatorEntity start')
        ctx.log.info(collatorEntity[0])
        if (collatorEntity[0] === undefined) {
            ctx.log.info('a')
        } else {
            ctx.log.info('b')
        }
        ctx.log.info('collatorEntity end')
        ctx.log.info(collatorEntity[0].id)
        const historyElement = new DelegatorHistoryElement({
            id: `${lastRound[0].index}-${collatorEntity[0].id}-${delegator[0].account}-delegation`,
            blockNumber: ctx.block.height,
            delegator: delegatorEntity[0],
            collator: collatorEntity[0],
            timestamp: new Date(ctx.block.timestamp),
            type: 0,
            round: lastRound[0],
            amount: delegationData.lockedAmount,
        })
        ctx.log.info(historyElement)
        await ctx.store.insert(historyElement)
    }
})
processor.addEventHandler('ParachainStaking.DelegationDecreased', async (ctx) => {
    const decreaseData = getBondedLessEventData(ctx)
    const lastRound = await ctx.store.find(Round, {
        order: {
            id: 'DESC',
        },
        take: 1,
    })
    if (lastRound) {
        const delegatorRoundId = `${lastRound[0].index}-${encodeId(decreaseData.delegator)}`
        const delegator = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })

        const collatorRoundId = `${lastRound[0].index}-${encodeId(decreaseData.candidate)}`
        const collatorSearch = await ctx.store.find(CollatorRound, { where: { id: delegatorRoundId }, take: 1 })
        if (collatorSearch[0] === undefined) {
            const collatorEntitySearch = await ctx.store.find(Collator, {
                where: { id: encodeId(decreaseData.candidate) },
                take: 1,
            })
            const collatorsData = await getCollatorsData(ctx, [encodeId(decreaseData.candidate)])
            if (collatorsData) {
                ctx.log.info('collatorsData')
                ctx.log.info(collatorsData)
                for (const collatorData of collatorsData) {
                    if (!collatorData) continue

                    let totalBond = collatorData.bond
                    if (collatorEntitySearch === undefined) {
                        const newCollator = new Collator({
                            id: encodeId(decreaseData.candidate),
                            bond: collatorData.bond,
                            apr24h: 0.0,
                        })
                        await ctx.store.insert(newCollator)
                    }

                    for (const nomination of collatorData.nominators) {
                        totalBond += nomination.amount
                    }
                    const newCollatorRound = new CollatorRound({
                        id: collatorRoundId,
                        round: lastRound[0],
                        collator: encodeId(decreaseData.candidate),
                        ownBond: collatorData.bond,
                        totalBond: totalBond,
                        rewardAmount: null,
                    })
                    await ctx.store.insert(newCollatorRound)
                }
            }
        }
        const collator = await ctx.store.find(CollatorRound, { where: { id: delegatorRoundId }, take: 1 })
        ctx.log.info(`${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}`)
        const delegation = await ctx.store.find(RoundDelegation, {
            where: {
                collator: { collator: collator[0].collator },
                delegator: { account: delegator[0].account },
            },
            take: 1,
        })
        delegation[0].amount = delegation[0].amount - decreaseData.amount
        if (delegation[0].round === undefined) {
            const round = await ctx.store.find(Round, {
                where: { index: Number(delegation[0].id.split('-')[0]) },
                take: 1,
            })
            delegation[0].round = round[0]
            delegation[0].collator = collator[0]
            delegation[0].delegator = delegator[0]
        }
        await ctx.store.save(delegation)
        const collatorEntity = await ctx.store.find(Collator, { where: { id: collator[0].collator }, take: 1 })
        const delegatorEntity = await ctx.store.find(Delegator, { where: { id: delegator[0].account }, take: 1 })
        const historyElement = new DelegatorHistoryElement({
            id: `${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}-${ctx.block.timestamp}`,
            blockNumber: ctx.block.height,
            delegator: delegatorEntity[0],
            collator: collatorEntity[0],
            timestamp: new Date(ctx.block.timestamp),
            type: 1,
            round: lastRound[0],
            amount: decreaseData.amount,
        })

        await ctx.store.insert(historyElement)
    }
})
processor.addEventHandler('ParachainStaking.DelegationIncreased', async (ctx) => {
    const increaseData = getDelegatorBondedMoreEventData(ctx)
    const lastRound = await ctx.store.find(Round, {
        order: {
            id: 'DESC',
        },
        take: 1,
    })
    if (lastRound) {
        ctx.log.info('lstRound')
        ctx.log.info(`${lastRound[0].id}`)
        const delegatorRoundId = `${lastRound[0].index}-${encodeId(increaseData.delegator)}`
        ctx.log.info('delegatorRoundId')
        ctx.log.info(`${delegatorRoundId}`)
        const delegatorSearch = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })
        if (delegatorSearch[0] === undefined) {
            ctx.log.info('delegator undefined')
            ctx.log.info(encodeId(increaseData.delegator))
            const delegatorEntitySearch = await ctx.store.find(Delegator, {
                where: { id: encodeId(increaseData.delegator) },
                take: 1,
            })
            if (delegatorEntitySearch === undefined) {
                const newDelegator = new Delegator({ id: encodeId(increaseData.delegator) })
                await ctx.store.insert(newDelegator)
            }
            const newDelegatorRound = new RoundNominator({
                id: delegatorRoundId,
                round: lastRound[0],
                account: encodeId(increaseData.delegator),
                bond: increaseData.amount,
            })
            await ctx.store.insert(newDelegatorRound)
        }
        const delegator = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })
        const collatorRoundId = `${encodeId(increaseData.delegator)}-${encodeId(increaseData.candidate)}`
        const collatorSearch = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        if (collatorSearch[0] === undefined) {
            ctx.log.info('collator undefined')
            const collatorEntitySearch = await ctx.store.find(Collator, {
                where: { id: encodeId(increaseData.candidate) },
                take: 1,
            })
            const collatorsData = await getCollatorsData(ctx, [encodeId(increaseData.candidate)])
            if (collatorsData) {
                ctx.log.info('collatorsData')
                ctx.log.info(collatorsData)
                for (const collatorData of collatorsData) {
                    if (!collatorData) continue

                    let totalBond = collatorData.bond
                    if (collatorEntitySearch === undefined) {
                        const newCollator = new Collator({
                            id: encodeId(increaseData.candidate),
                            bond: collatorData.bond,
                            apr24h: 0.0,
                        })
                        await ctx.store.insert(newCollator)
                    }

                    for (const nomination of collatorData.nominators) {
                        totalBond += nomination.amount
                    }
                    const newCollatorRound = new CollatorRound({
                        id: collatorRoundId,
                        round: lastRound[0],
                        collator: encodeId(increaseData.candidate),
                        ownBond: collatorData.bond,
                        totalBond: totalBond,
                        rewardAmount: null,
                    })
                    await ctx.store.insert(newCollatorRound)
                }
            }
        }
        const collator = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        ctx.log.info(`${lastRound[0].index}-${encodeId(increaseData.delegator)}-${encodeId(increaseData.candidate)}`)
        const delegation = await ctx.store.find(RoundDelegation, {
            where: {
                collator: { collator: encodeId(increaseData.candidate) },
                delegator: { account: encodeId(increaseData.delegator) },
            },
            take: 1,
        })
        ctx.log.info(`${delegation[0].round}`)
        delegation[0].amount = increaseData.amount + increaseData.amount
        ctx.log.info('delegator round')
        if (delegation[0].round === undefined) {
            const round = await ctx.store.find(Round, {
                where: { index: Number(delegation[0].id.split('-')[0]) },
                take: 1,
            })
            delegation[0].round = round[0]
            delegation[0].collator = collator[0]
            delegation[0].delegator = delegator[0]
        }
        await ctx.store.save(delegation[0])
        const collatorEntity = await ctx.store.find(Collator, { where: { id: collator[0].collator }, take: 1 })
        const delegatorEntity = await ctx.store.find(Delegator, { where: { id: delegator[0].account }, take: 1 })
        const historyElement = new DelegatorHistoryElement({
            id: `${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}-${ctx.block.timestamp}`,
            blockNumber: ctx.block.height,
            delegator: delegatorEntity[0],
            collator: collatorEntity[0],
            timestamp: new Date(ctx.block.timestamp),
            type: 1,
            round: lastRound[0],
            amount: increaseData.amount,
        })

        await ctx.store.insert(historyElement)
    }
})
processor.addEventHandler('ParachainStaking.DelegationRevoked', async (ctx) => {
    const revokeData = getDelegationRevokedEventData(ctx)
    const lastRound = await ctx.store.find(Round, {
        order: {
            id: 'DESC',
        },
        take: 1,
    })
    if (lastRound) {
        const delegatorRoundId = `${lastRound[0].index}-${encodeId(revokeData.delegator)}`
        const delegator = await ctx.store.find(RoundNominator, { where: { id: delegatorRoundId }, take: 1 })

        const collatorRoundId = `${lastRound[0].index}-${encodeId(revokeData.candidate)}`
        const collatorSearch = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        if (collatorSearch[0] === undefined) {
            ctx.log.info('collator undefined')
            const collatorEntitySearch = await ctx.store.find(Collator, {
                where: { id: encodeId(revokeData.candidate) },
                take: 1,
            })
            const collatorsData = await getCollatorsData(ctx, [encodeId(revokeData.candidate)])
            if (collatorsData) {
                ctx.log.info('collatorsData')
                ctx.log.info(collatorsData)
                for (const collatorData of collatorsData) {
                    if (!collatorData) continue

                    let totalBond = collatorData.bond
                    if (collatorEntitySearch === undefined) {
                        const newCollator = new Collator({
                            id: encodeId(revokeData.candidate),
                            bond: collatorData.bond,
                            apr24h: 0.0,
                        })
                        await ctx.store.insert(newCollator)
                    }

                    for (const nomination of collatorData.nominators) {
                        totalBond += nomination.amount
                    }
                    const newCollatorRound = new CollatorRound({
                        id: collatorRoundId,
                        round: lastRound[0],
                        collator: encodeId(revokeData.candidate),
                        ownBond: collatorData.bond,
                        totalBond: totalBond,
                        rewardAmount: null,
                    })
                    await ctx.store.insert(newCollatorRound)
                }
            }
        }
        const collator = await ctx.store.find(CollatorRound, { where: { id: collatorRoundId }, take: 1 })
        ctx.log.info(`${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}`)
        const delegation = await ctx.store.find(RoundDelegation, {
            where: {
                collator: { collator: collator[0].collator },
                delegator: { account: delegator[0].account },
            },
            take: 1,
        })
        delegation[0].amount = delegation[0].amount - revokeData.unstakedAmount
        const round = await ctx.store.find(Round, { where: { index: Number(delegation[0].id.split('-')[0]) }, take: 1 })
        ctx.log.info(`${round[0].id}-here`)
        delegation[0].round = round[0]
        delegation[0].collator = collator[0]
        delegation[0].delegator = delegator[0]
        await ctx.store.save(delegation[0])
        const collatorEntity = await ctx.store.find(Collator, { where: { id: collator[0].collator }, take: 1 })
        const delegatorEntity = await ctx.store.find(Delegator, { where: { id: delegator[0].account }, take: 1 })
        const historyElement = new DelegatorHistoryElement({
            id: `${lastRound[0].index}-${collator[0].collator}-${delegator[0].account}-${ctx.block.timestamp}`,
            blockNumber: ctx.block.height,
            delegator: delegatorEntity[0],
            collator: collatorEntity[0],
            timestamp: new Date(ctx.block.timestamp),
            type: 1,
            round: lastRound[0],
            amount: revokeData.unstakedAmount,
        })

        await ctx.store.insert(historyElement)
    }
})

processor.run()

export interface NewRoundEventData {
    startingBlock: number
    round: number
    selectedCollatorsNumber: number
    totalBalance: bigint
}

function getNewRoundEventData(ctx: EventContext): NewRoundEventData {
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

export interface NewDelegationEventData {
    delegator: Uint8Array
    lockedAmount: bigint
    candidate: Uint8Array
}

function getNewDelegationEventData(ctx: EventContext): NewDelegationEventData {
    const event = new ParachainStakingDelegationEvent(ctx)

    if (event.isV1001) {
        const [delegator, lockedAmount, candidate, delegatorPosition] = event.asV1001
        return { delegator, lockedAmount, candidate }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

export interface BondedLessEventData {
    delegator: Uint8Array
    candidate: Uint8Array
    amount: bigint
    inTop: boolean
}

function getBondedLessEventData(ctx: EventContext): BondedLessEventData {
    const event = new ParachainStakingDelegationDecreasedEvent(ctx)

    if (event.isV1001) {
        const [delegator, candidate, amount, inTop] = event.asV1001
        return { delegator, candidate, amount, inTop }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

export interface DelegationRevokedEventData {
    delegator: Uint8Array
    candidate: Uint8Array
    unstakedAmount: bigint
}

function getDelegationRevokedEventData(ctx: EventContext): DelegationRevokedEventData {
    const event = new ParachainStakingDelegationRevokedEvent(ctx)

    if (event.isV1001) {
        const [delegator, candidate, unstakedAmount] = event.asV1001
        return { delegator, candidate, unstakedAmount }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

export interface DelegatorBondedMoreEventData {
    delegator: Uint8Array
    candidate: Uint8Array
    amount: bigint
    inTop: boolean
}

function getDelegatorBondedMoreEventData(ctx: EventContext): DelegatorBondedMoreEventData {
    const event = new ParachainStakingDelegationIncreasedEvent(ctx)

    if (event.isV1001) {
        const [delegator, candidate, amount, inTop] = event.asV1001
        return { delegator, candidate, amount, inTop }
    } else if (event.isV1300) {
        return event.asV1300
    }
    throw new UnknownVersionError(event.constructor.name)
}

function getRewardedEventData(ctx: EventContext): { account: Uint8Array; rewards: bigint } {
    const event = new ParachainStakingRewardedEvent(ctx)

    if (event.isV900) {
        const [account, rewards] = event.asV900
        return { account, rewards }
    } else if (event.isV1001) {
        const [account, rewards] = event.asV1001
        return { account, rewards }
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
