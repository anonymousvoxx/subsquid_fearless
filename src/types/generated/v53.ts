import type {Result} from './support'

export type AccountId = Uint8Array

export type BalanceOf = bigint

export type NominatorAdded = NominatorAdded_AddedToBottom | NominatorAdded_AddedToTop

export interface NominatorAdded_AddedToBottom {
  __kind: 'AddedToBottom'
  value: null
}

export interface NominatorAdded_AddedToTop {
  __kind: 'AddedToTop'
  value: Balance
}

export interface Collator2 {
  id: AccountId
  bond: Balance
  nominators: AccountId[]
  topNominators: Bond[]
  bottomNominators: Bond[]
  totalCounted: Balance
  totalBacking: Balance
  state: CollatorStatus
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

export type RoundIndex = number
