import { UnknownVersionError } from '../../common/errors'
import { decodeId } from '../../common/tools'
import { ParachainStakingCandidateInfoStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

interface StorageData {
    bond: bigint
}

async function getStorageData(
    ctx: StorageContext,
    accounts: Uint8Array[]
): Promise<(StorageData | undefined)[] | undefined> {
    const storage = new ParachainStakingCandidateInfoStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1201) {
        return await storage.getManyAsV1201(accounts)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

interface CandidateInfo {
    id: string
    bond: bigint
}

async function queryStorageFunction(
    ctx: StorageContext,
    accounts: string[]
): Promise<(CandidateInfo | undefined)[] | undefined> {
    if (accounts.length === 0) return []

    const u8 = accounts.map((a) => decodeId(a))

    const data = await getStorageData(ctx, u8)
    if (!data) return undefined

    return data.map((d, i) =>
        d != null
            ? {
                  id: accounts[i],
                  bond: d.bond,
              }
            : undefined
    )
}

export async function getCandidateInfo(ctx: StorageContext, account: string): Promise<CandidateInfo | undefined>
export async function getCandidateInfo(
    ctx: StorageContext,
    accounts: string[]
): Promise<(CandidateInfo | undefined)[] | undefined>
export async function getCandidateInfo(ctx: StorageContext, accountOrAccounts: string | string[]) {
    if (Array.isArray(accountOrAccounts)) {
        return await queryStorageFunction(ctx, accountOrAccounts)
    } else {
        return (await queryStorageFunction(ctx, [accountOrAccounts]))?.[0]
    }
}
