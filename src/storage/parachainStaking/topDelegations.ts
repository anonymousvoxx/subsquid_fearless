import { UnknownVersionError } from '../../common/errors'
import { decodeId, encodeId } from '../../common/tools'
import { ParachainStakingTopDelegationsStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

interface StorageData {
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
    const storage = new ParachainStakingTopDelegationsStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1201) {
        return await storage.getManyAsV1201(accounts)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

interface Delegations {
    id: string
    delegations: {
        id: string
        amount: bigint
    }[]
    total: bigint
}

async function queryStorageFunction(ctx: StorageContext, accounts: string[]) {
    if (accounts.length === 0) return []

    const u8 = accounts.map((a) => decodeId(a))

    const data = await getStorageData(ctx, u8)
    if (!data) return undefined

    return data.map((d, i) =>
        d != null
            ? {
                  id: accounts[i],
                  delegations: d.delegations.map((delegation) => ({
                      id: encodeId(delegation.owner),
                      amount: delegation.amount,
                  })),
                  total: d.total,
              }
            : undefined
    )
}

export async function getTopDelegations(ctx: StorageContext, account: string): Promise<Delegations | undefined>
export async function getTopDelegations(
    ctx: StorageContext,
    accounts: string[]
): Promise<(Delegations | undefined)[] | undefined>
export async function getTopDelegations(ctx: StorageContext, accountOrAccounts: string | string[]) {
    if (Array.isArray(accountOrAccounts)) {
        return await queryStorageFunction(ctx, accountOrAccounts)
    } else {
        return (await queryStorageFunction(ctx, [accountOrAccounts]))?.[0]
    }
}
