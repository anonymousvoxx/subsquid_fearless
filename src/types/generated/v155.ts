import type {Result} from './support'

export type AccountId = Uint8Array

export type BalanceOf = bigint

export type NominatorAdded = NominatorAdded_AddedToTop | NominatorAdded_AddedToBottom

export interface NominatorAdded_AddedToTop {
  __kind: 'AddedToTop'
  value: Balance
}

export interface NominatorAdded_AddedToBottom {
  __kind: 'AddedToBottom'
  value: null
}

export type Balance = bigint
