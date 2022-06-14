import type {Result} from './support'

export type AccountId20 = Uint8Array

export interface Delegator {
  id: AccountId20
  delegations: Bond[]
  total: bigint
  lessTotal: bigint
  status: DelegatorStatus
}

export interface Bond {
  owner: AccountId20
  amount: bigint
}

export type DelegatorStatus = DelegatorStatus_Active | DelegatorStatus_Leaving

export interface DelegatorStatus_Active {
  __kind: 'Active'
}

export interface DelegatorStatus_Leaving {
  __kind: 'Leaving'
  value: number
}
