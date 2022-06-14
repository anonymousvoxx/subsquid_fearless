import type {Result} from './support'

export type AccountId20 = Uint8Array

export interface Delegations_209 {
  delegations: Bond[]
  total: bigint
}

export interface CandidateMetadata {
  bond: bigint
  delegationCount: number
  totalCounted: bigint
  lowestTopDelegationAmount: bigint
  highestBottomDelegationAmount: bigint
  lowestBottomDelegationAmount: bigint
  topCapacity: CapacityStatus
  bottomCapacity: CapacityStatus
  request: (CandidateBondLessRequest | undefined)
  status: CollatorStatus
}

export interface Bond {
  owner: AccountId20
  amount: bigint
}

export type CapacityStatus = CapacityStatus_Full | CapacityStatus_Empty | CapacityStatus_Partial

export interface CapacityStatus_Full {
  __kind: 'Full'
}

export interface CapacityStatus_Empty {
  __kind: 'Empty'
}

export interface CapacityStatus_Partial {
  __kind: 'Partial'
}

export interface CandidateBondLessRequest {
  amount: bigint
  whenExecutable: number
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
