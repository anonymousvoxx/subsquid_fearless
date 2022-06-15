import { UnknownVersionError } from '../../common/errors'
import { decodeId, encodeId } from '../../common/tools'
import { ParachainStakingCandidateStateStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

interface StorageData {
    id: Uint8Array
    bond: bigint
    topDelegations: {
        owner: Uint8Array
        amount: bigint
    }[]
    bottomDelegations: {
        owner: Uint8Array
        amount: bigint
    }[]
}

async function getStorageData(
    ctx: StorageContext,
    accounts: Uint8Array[]
): Promise<(StorageData | undefined)[] | undefined> {
    const storage = new ParachainStakingCandidateStateStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1001) {
        return await storage.getManyAsV1001(accounts)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

interface CandidateState {
    id: string
    bond: bigint
    topDelegations: {
        id: string
        amount: bigint
    }[]
    bottomDelegations: {
        id: string
        amount: bigint
    }[]
}

async function queryStorageFunction(
    ctx: StorageContext,
    accounts: string[]
): Promise<(CandidateState | undefined)[] | undefined> {
    if (accounts.length === 0) return []

    const u8 = accounts.map((a) => decodeId(a))

    const data = await getStorageData(ctx, u8)
    if (!data) return undefined

    return data.map((d, i) =>
        d != null
            ? {
                  id: accounts[i],
                  bond: d.bond,
                  topDelegations: d.topDelegations.map((delegation) => ({
                      id: encodeId(delegation.owner),
                      amount: delegation.amount,
                  })),
                  bottomDelegations: d.bottomDelegations.map((delegation) => ({
                      id: encodeId(delegation.owner),
                      amount: delegation.amount,
                  })),
              }
            : undefined
    )
}

/**
 * DEPRECATED. Use getCandidateInfo() + getTopDelegations() + getBottomDelegations()
 */
export async function getCandidateState(ctx: StorageContext, account: string): Promise<CandidateState | undefined>
export async function getCandidateState(
    ctx: StorageContext,
    accounts: string[]
): Promise<(CandidateState | undefined)[] | undefined>
export async function getCandidateState(ctx: StorageContext, accountOrAccounts: string | string[]) {
    if (Array.isArray(accountOrAccounts)) {
        return await queryStorageFunction(ctx, accountOrAccounts)
    } else {
        return (await queryStorageFunction(ctx, [accountOrAccounts]))?.[0]
    }
}
