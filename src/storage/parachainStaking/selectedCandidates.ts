import { UnknownVersionError } from '../../common/errors'
import { encodeId } from '../../common/tools'
import { ParachainStakingSelectedCandidatesStorage } from '../../types/generated/storage'
import { StorageContext } from '../../types/generated/support'

type StorageData = Uint8Array[]

async function getStorageData(ctx: StorageContext): Promise<StorageData | undefined> {
    const storage = new ParachainStakingSelectedCandidatesStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV49) {
        return await storage.getAsV49()
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

export async function getSelectedCandidates(ctx: StorageContext): Promise<string[] | undefined> {
    const data = await getStorageData(ctx)
    if (!data) return undefined

    return data.map((id) => encodeId(id))
}
