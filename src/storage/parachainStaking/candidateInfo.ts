import { UnknownVersionError } from '../../common/errors'
import { decodeId } from '../../common/tools'
import { ParachainStakingCandidateInfoStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

interface StorageData {
    bond: bigint
}

async function getStorageData(ctx: StorageContext, account: Uint8Array): Promise<StorageData | undefined> {
    const storage = new ParachainStakingCandidateInfoStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1201) {
        return await storage.getAsV1201(account)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

const storageCache: {
    hash?: string
    values: Map<string, CandidateInfo>
} = {
    values: new Map(),
}

interface CandidateInfo {
    id: string
    bond: bigint
}

export async function getCandidateInfo(ctx: StorageContext, account: string): Promise<CandidateInfo | undefined> {
    if (storageCache.hash !== ctx.block.hash) {
        storageCache.hash = ctx.block.hash
        storageCache.values.clear()
    }

    const key = account
    let value = storageCache.values.get(account)

    if (!value) {
        const u8 = decodeId(account)

        const data = await getStorageData(ctx, u8)
        if (!data) return undefined

        value = {
            id: account,
            bond: data.bond,
        }

        storageCache.values.set(key, value)
    }

    return value
}
