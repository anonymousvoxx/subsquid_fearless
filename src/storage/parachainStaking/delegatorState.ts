import { UnknownVersionError } from '../../common/errors'
import { decodeId, encodeId } from '../../common/tools'
import { ParachainStakingDelegatorStateStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

interface StorageData {
    id: Uint8Array
    delegations: {
        owner: Uint8Array
        amount: bigint
    }[]
    total: bigint
}

async function getStorageData(
    ctx: StorageContext,
    accounts: Uint8Array[]
): Promise<(StorageData | undefined)[] | undefined> {
    const storage = new ParachainStakingDelegatorStateStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1001) {
        return await storage.getManyAsV1001(accounts)
    } else if (storage.isV1502) {
        return await storage.getManyAsV1502(accounts)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

interface DelegatorState {
    id: string
    bond: bigint
    delegations: {
        id: string
        amount: bigint
    }[]
}

async function queryStorageFunction(ctx: StorageContext, accounts: string[]) {
    if (accounts.length === 0) return []

    const u8 = accounts.map((a) => decodeId(a))

    const data = await getStorageData(ctx, u8)
    if (!data) return undefined

    return data.map((d) =>
        d != null
            ? {
                  id: encodeId(d.id),
                  bond: d.total,
                  delegations: d.delegations.map((delegation) => ({
                      id: encodeId(delegation.owner),
                      amount: delegation.amount,
                  })),
              }
            : undefined
    )
}

export async function getDelegatorState(ctx: StorageContext, account: string): Promise<DelegatorState | undefined>
export async function getDelegatorState(
    ctx: StorageContext,
    accounts: string[]
): Promise<(DelegatorState | undefined)[] | undefined>
export async function getDelegatorState(ctx: StorageContext, accountOrAccounts: string | string[]) {
    if (Array.isArray(accountOrAccounts)) {
        return await queryStorageFunction(ctx, accountOrAccounts)
    } else {
        return (await queryStorageFunction(ctx, [accountOrAccounts]))?.[0]
    }
}
