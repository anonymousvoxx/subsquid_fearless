import { UnknownVersionError } from '../../../common/errors'
import { decodeId, encodeId } from '../../../common/tools'
import {
    ParachainStakingNominatorState2Storage,
    ParachainStakingNominatorStateStorage,
} from '../../../types/generated/storage'
import { StorageContext } from '../../../types/generated/support'

interface StorageData {
    nominations: {
        owner: Uint8Array
        amount: bigint
    }[]
    total: bigint
}

async function getOldStorageData(
    ctx: StorageContext,
    accounts: Uint8Array[]
): Promise<(StorageData | undefined)[] | undefined> {
    const storage = new ParachainStakingNominatorStateStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV49) {
        return await storage.getManyAsV49(accounts)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

async function getStorageData(
    ctx: StorageContext,
    accounts: Uint8Array[]
): Promise<(StorageData | undefined)[] | undefined> {
    const storage = new ParachainStakingNominatorState2Storage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV900) {
        return await storage.getManyAsV900(accounts)
    } else if (storage.isV200) {
        return await storage.getManyAsV200(accounts)
    } else if (storage.isV1001) {
        const data = await storage.getManyAsV1001(accounts)
        if (!data) return

        return data.map((d) =>
            d != null
                ? {
                      ...d,
                      nominations: d.delegations,
                  }
                : undefined
        )
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

interface NominatorState {
    id: string
    bond: bigint
    nominations: {
        id: string
        amount: bigint
    }[]
}

async function queryStorageFunction(
    ctx: StorageContext,
    accounts: string[]
): Promise<(NominatorState | undefined)[] | undefined> {
    if (accounts.length === 0) return []

    const u8 = accounts.map((a) => decodeId(a))

    const data = (await getStorageData(ctx, u8)) || (await getOldStorageData(ctx, u8))
    if (!data) return undefined

    return data.map((d, i) =>
        d != null
            ? {
                  id: accounts[i],
                  bond: d.total,
                  nominations: d.nominations.map((nomination) => ({
                      id: encodeId(nomination.owner),
                      amount: nomination.amount,
                  })),
              }
            : undefined
    )
}

export async function getNominatorState(ctx: StorageContext, account: string): Promise<NominatorState | undefined>
export async function getNominatorState(
    ctx: StorageContext,
    accounts: string[]
): Promise<(NominatorState | undefined)[] | undefined>
export async function getNominatorState(ctx: StorageContext, accountOrAccounts: string | string[]) {
    if (Array.isArray(accountOrAccounts)) {
        return await queryStorageFunction(ctx, accountOrAccounts)
    } else {
        return (await queryStorageFunction(ctx, [accountOrAccounts]))?.[0]
    }
}
