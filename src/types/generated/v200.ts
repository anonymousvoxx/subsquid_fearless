import type {Result} from './support'

export type AccountId = Uint8Array

export interface Nominator2 {
  nominations: Bond[]
  revocations: AccountId[]
  total: Balance
  scheduledRevocationsCount: number
  scheduledRevocationsTotal: Balance
  status: NominatorStatus
}

export interface Bond {
  owner: AccountId
  amount: Balance
}

export type Balance = bigint

export type NominatorStatus = NominatorStatus_Active | NominatorStatus_Leaving

export interface NominatorStatus_Active {
  __kind: 'Active'
  value: null
}

export interface NominatorStatus_Leaving {
  __kind: 'Leaving'
  value: RoundIndex
}

export type RoundIndex = number
