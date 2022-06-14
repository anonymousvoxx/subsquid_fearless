import type {Result} from './support'

export type H160 = Uint8Array

export type NominatorAdded = NominatorAdded_AddedToTop | NominatorAdded_AddedToBottom

export interface NominatorAdded_AddedToTop {
  __kind: 'AddedToTop'
  newTotal: bigint
}

export interface NominatorAdded_AddedToBottom {
  __kind: 'AddedToBottom'
}

export interface Collator2 {
  id: H160
  bond: bigint
  nominators: H160[]
  topNominators: Bond[]
  bottomNominators: Bond[]
  totalCounted: bigint
  totalBacking: bigint
  state: CollatorStatus
}

export interface Nominator2 {
  nominations: Bond[]
  revocations: H160[]
  total: bigint
  scheduledRevocationsCount: number
  scheduledRevocationsTotal: bigint
  status: NominatorStatus
}

export interface Bond {
  owner: H160
  amount: bigint
}

export type CollatorStatus = CollatorStatus_Active | CollatorStatus_Idle | CollatorStatus_Leaving

export interface CollatorStatus_Active {
  __kind: 'Active'
}

export interface CollatorStatus_Idle {
  __kind: 'Idle'
}

export interface CollatorStatus_Leaving {
  __kind: 'Leaving'
  value: number
}

export type NominatorStatus = NominatorStatus_Active | NominatorStatus_Leaving

export interface NominatorStatus_Active {
  __kind: 'Active'
}

export interface NominatorStatus_Leaving {
  __kind: 'Leaving'
  value: number
}
