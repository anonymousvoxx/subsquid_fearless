import { UnknownVersionError } from '../../common/errors'
import { encodeId } from '../../common/tools'
import { ParachainStakingSelectedCandidatesStorage } from '../../types/generated/storage'
import { BlockContext } from '../../types/generated/support'

type StorageData = Uint8Array[]

async function getStorageData(ctx: BlockContext): Promise<StorageData | undefined> {
    const storage = new ParachainStakingSelectedCandidatesStorage(ctx)
    if (!storage.isExists) return undefined

    if (storage.isV1001) {
        return await storage.getAsV1001()
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

export async function getSelectedCandidates(ctx: BlockContext): Promise<string[] | undefined> {
    const data = await getStorageData(ctx)
    if (!data) return undefined

    return data.map((id) => encodeId(id))
}
