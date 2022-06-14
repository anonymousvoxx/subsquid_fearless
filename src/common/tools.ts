import { getAddress } from '@ethersproject/address'
import { decodeHex, toHex } from '@subsquid/substrate-processor'

export function saturatingSumBigInt(
    a: bigint,
    b: bigint,
    { max, min }: { max: null | bigint; min: bigint } = { max: null, min: 0n }
): bigint {
    const sum = BigInt(a) + BigInt(b)
    if (sum < min) {
        return min
    } else if (max && sum > max) {
        return max
    } else {
        return sum
    }
}

export function decodeId(id: string): Uint8Array {
    return Buffer.from(id.slice(2), 'hex')
}

export function encodeId(id: Uint8Array): string {
    return getAddress(toHex(id))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginAccountId(origin: any) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (origin.__kind) {
        case 'system':
            // eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
            switch (origin.value.__kind) {
                case 'Signed':
                    return encodeId(decodeHex(origin.value.value))
                default:
                    throw new Error(`Unknown origin type ${origin.__kind}.${origin.value.__kind}`)
            }
        default:
            throw new Error(`Unknown origin type ${origin.__kind}`)
    }
}
