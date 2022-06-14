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

async function getStorageData(ctx: StorageContext, account: Uint8Array): Promise<StorageData | undefined> {
    const storage = new ParachainStakingDelegatorStateStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1001) {
        return await storage.getAsV1001(account)
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

const storageCache: {
    hash?: string
    values: Map<string, DelegatorState>
} = {
    values: new Map(),
}

interface DelegatorState {
    id: string
    bond: bigint
    delegations: {
        id: string
        amount: bigint
    }[]
}

export async function getDelegatorState(ctx: StorageContext, account: string): Promise<DelegatorState | undefined> {
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
            bond: data.total,
            delegations: data.delegations.map((delegation) => ({
                id: encodeId(delegation.owner),
                amount: delegation.amount,
            })),
        }

        storageCache.values.set(key, value)
    }

    return value
}
