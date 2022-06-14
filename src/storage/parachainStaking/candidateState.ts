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

async function getStorageData(ctx: StorageContext, account: Uint8Array): Promise<StorageData | undefined> {
    const storage = new ParachainStakingCandidateStateStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1001) {
        return await storage.getAsV1001(account)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

const storageCache: {
    hash?: string
    values: Map<string, CandidateState>
} = {
    values: new Map(),
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

export async function getCandidateState(ctx: StorageContext, account: string): Promise<CandidateState | undefined> {
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
            id: encodeId(data.id),
            bond: data.bond,
            topDelegations: data.topDelegations.map((delegation) => ({
                id: encodeId(delegation.owner),
                amount: delegation.amount,
            })),
            bottomDelegations: data.bottomDelegations.map((delegation) => ({
                id: encodeId(delegation.owner),
                amount: delegation.amount,
            })),
        }

        storageCache.values.set(key, value)
    }

    return value
}
