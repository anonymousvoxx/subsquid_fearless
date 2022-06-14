import type {Result} from './support'

export type AccountId = Uint8Array

export type BalanceOf = bigint

export type BlockNumber = number

export type RoundIndex = number

export interface Collator {
  id: AccountId
  bond: Balance
  nominators: Bond[]
  total: Balance
  state: CollatorStatus
}

export interface Nominator {
  nominations: Bond[]
  total: Balance
}

export type Balance = bigint

export interface Bond {
  owner: AccountId
  amount: Balance
}

export type CollatorStatus = CollatorStatus_Active | CollatorStatus_Idle | CollatorStatus_Leaving

export interface CollatorStatus_Active {
  __kind: 'Active'
  value: null
}

export interface CollatorStatus_Idle {
  __kind: 'Idle'
  value: null
}

export interface CollatorStatus_Leaving {
  __kind: 'Leaving'
  value: RoundIndex
}
