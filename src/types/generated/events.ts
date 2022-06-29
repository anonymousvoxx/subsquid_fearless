import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'
import * as v900 from './v900'
import * as v1001 from './v1001'
import * as v1300 from './v1300'

export class ParachainStakingCandidateBondedLessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CandidateBondedLess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Candidate, Amount, New Bond
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateBondedLess') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Candidate, Amount, New Bond
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Сandidate has decreased a self bond.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateBondedLess') === '03199d60c293c383f981694ba4310b187ed4a6b79fcc52e6fbccc691153b8f28'
  }

  /**
   * Сandidate has decreased a self bond.
   */
  get asV1300(): {candidate: v1300.AccountId20, amount: bigint, newBond: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingCandidateBondedMoreEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CandidateBondedMore')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Candidate, Amount, New Bond Total
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateBondedMore') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Candidate, Amount, New Bond Total
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Сandidate has increased a self bond.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateBondedMore') === 'd6e6bcd7c6de9403e85285e3685e6774d7d1d129d84c7cfe9a4806c5ff5a4e54'
  }

  /**
   * Сandidate has increased a self bond.
   */
  get asV1300(): {candidate: v1300.AccountId20, amount: bigint, newTotalBond: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingCandidateLeftEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CandidateLeft')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Ex-Candidate, Amount Unlocked, New Total Amt Locked
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateLeft') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Ex-Candidate, Amount Unlocked, New Total Amt Locked
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Candidate has left the set of candidates.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.CandidateLeft') === '39a5d795682d6a8426e0ee9f0ed61cb5d0d803a9c4303d42f2db829df56877b2'
  }

  /**
   * Candidate has left the set of candidates.
   */
  get asV1300(): {exCandidate: v1300.AccountId20, unlockedAmount: bigint, newTotalAmtLocked: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingCollatorBondedLessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CollatorBondedLess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Collator Account, Old Bond, New Bond
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.CollatorBondedLess') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Collator Account, Old Bond, New Bond
   */
  get asV900(): [v900.H160, bigint, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingCollatorBondedMoreEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CollatorBondedMore')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Collator Account, Old Bond, New Bond
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.CollatorBondedMore') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Collator Account, Old Bond, New Bond
   */
  get asV900(): [v900.H160, bigint, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingCollatorLeftEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.CollatorLeft')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Account, Amount Unlocked, New Total Amt Locked
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.CollatorLeft') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Account, Amount Unlocked, New Total Amt Locked
   */
  get asV900(): [v900.H160, bigint, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegationEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.Delegation')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.Delegation') === '9e88e3dd4dec21ca4744b0264c96a88bfef8fa4f3a42c495ba697dcf51165507'
  }

  /**
   * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
   */
  get asV1001(): [v1001.AccountId20, bigint, v1001.AccountId20, v1001.DelegatorAdded] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * New delegation (increase of the existing one).
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.Delegation') === 'a85b3e0f4dad63b1b710d554a6b0a8aa64b90a755bcae7ea3f4b677b36e5df82'
  }

  /**
   * New delegation (increase of the existing one).
   */
  get asV1300(): {delegator: v1300.AccountId20, lockedAmount: bigint, candidate: v1300.AccountId20, delegatorPosition: v1300.DelegatorAdded} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegationDecreasedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegationDecreased')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationDecreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, boolean] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationDecreased') === '8ae2ca952b0b00ca6619c82b53d155a37de0be62eb9e8c32f4dad72b695e010b'
  }

  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegationIncreasedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegationIncreased')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationIncreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, boolean] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationIncreased') === '8ae2ca952b0b00ca6619c82b53d155a37de0be62eb9e8c32f4dad72b695e010b'
  }

  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegationRevokedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegationRevoked')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Delegator, Candidate, Amount Unstaked
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationRevoked') === 'dfcae516f053c47e7cb49e0718f01587efcb64cea4e3baf4c6973a29891f7841'
  }

  /**
   * Delegator, Candidate, Amount Unstaked
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Delegation revoked.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegationRevoked') === '013eacc8d6813b22ecdad778ecfffcc25ea1f31117d857d64978c177696e8697'
  }

  /**
   * Delegation revoked.
   */
  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegatorLeftEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegatorLeft')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Delegator, Amount Unstaked
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegatorLeft') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Delegator, Amount Unstaked
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Delegator has left the set of delegators.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegatorLeft') === '77f204dee4c5a51e392aac1d070198e23c536d0b97569fee0484578613cd8777'
  }

  /**
   * Delegator has left the set of delegators.
   */
  get asV1300(): {delegator: v1300.AccountId20, unstakedAmount: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingDelegatorLeftCandidateEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.DelegatorLeftCandidate')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegatorLeftCandidate') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  /**
   * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Delegation from candidate state has been remove.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.DelegatorLeftCandidate') === 'f72ae455b6ae66e6fabad54fadb0ae26f7136099a377372b74890536d4007422'
  }

  /**
   * Delegation from candidate state has been remove.
   */
  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint, totalCandidateStaked: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingJoinedCollatorCandidatesEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.JoinedCollatorCandidates')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Account, Amount Locked, New Total Amt Locked
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.JoinedCollatorCandidates') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Account, Amount Locked, New Total Amt Locked
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Account joined the set of collator candidates.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.JoinedCollatorCandidates') === '227a8d2310a3cd3b98057acb86b906dcde376e61a13f5a50db8589a31b218c17'
  }

  /**
   * Account joined the set of collator candidates.
   */
  get asV1300(): {account: v1300.AccountId20, amountLocked: bigint, newTotalAmtLocked: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Account, Amount Locked, New Total Amt Locked
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.JoinedCollatorCandidates') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Account, Amount Locked, New Total Amt Locked
   */
  get asV900(): [v900.H160, bigint, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNewRoundEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.NewRound')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.NewRound') === '40ffda4d99fbb38b23cc20386a7f622d64120f24ccc70b9f85ce7612cd87c3b7'
  }

  /**
   * Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get asV1001(): [number, number, number, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Started new round.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.NewRound') === '36b479d535ff0b4066a6ca7641a4dba5e090be428fc6b6e9fe8fec13d953fcfb'
  }

  /**
   * Started new round.
   */
  get asV1300(): {startingBlock: number, round: number, selectedCollatorsNumber: number, totalBalance: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.NewRound') === '40ffda4d99fbb38b23cc20386a7f622d64120f24ccc70b9f85ce7612cd87c3b7'
  }

  /**
   * Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get asV900(): [number, number, number, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNominationEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.Nomination')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Nominator, Amount Locked, Collator, Nominator Position with New Total Counted if in Top
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.Nomination') === '9e88e3dd4dec21ca4744b0264c96a88bfef8fa4f3a42c495ba697dcf51165507'
  }

  /**
   * Nominator, Amount Locked, Collator, Nominator Position with New Total Counted if in Top
   */
  get asV900(): [v900.H160, bigint, v900.H160, v900.NominatorAdded] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNominationDecreasedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.NominationDecreased')
    this._chain = ctx._chain
    this.event = event
  }

  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.NominationDecreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV900(): [v900.H160, v900.H160, bigint, boolean] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNominationIncreasedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.NominationIncreased')
    this._chain = ctx._chain
    this.event = event
  }

  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.NominationIncreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV900(): [v900.H160, v900.H160, bigint, boolean] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNominatorLeftEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.NominatorLeft')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Nominator, Amount Unstaked
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.NominatorLeft') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Nominator, Amount Unstaked
   */
  get asV900(): [v900.H160, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingNominatorLeftCollatorEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.NominatorLeftCollator')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Nominator, Collator, Amount Unstaked, New Total Amt Staked for Collator
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.NominatorLeftCollator') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  /**
   * Nominator, Collator, Amount Unstaked, New Total Amt Staked for Collator
   */
  get asV900(): [v900.H160, v900.H160, bigint, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainStakingRewardedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainStaking.Rewarded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('ParachainStaking.Rewarded') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get isV1300(): boolean {
    return this._chain.getEventHash('ParachainStaking.Rewarded') === '44a7364018ebad92746e4ca7c7c23d24d5da43cda2e63a90c665b522994ef1e2'
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get asV1300(): {account: v1300.AccountId20, rewards: bigint} {
    assert(this.isV1300)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Paid the account (nominator or collator) the balance as liquid rewards
   */
  get isV900(): boolean {
    return this._chain.getEventHash('ParachainStaking.Rewarded') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Paid the account (nominator or collator) the balance as liquid rewards
   */
  get asV900(): [v900.H160, bigint] {
    assert(this.isV900)
    return this._chain.decodeEvent(this.event)
  }
}
