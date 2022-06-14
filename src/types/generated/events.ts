import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v49 from './v49'
import * as v53 from './v53'
import * as v155 from './v155'
import * as v501 from './v501'
import * as v900 from './v900'
import * as v1001 from './v1001'
import * as v1300 from './v1300'

export class ParachainStakingCandidateBondedLessEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CandidateBondedLess')
  }

  /**
   * Candidate, Amount, New Bond
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateBondedLess') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Candidate, Amount, New Bond
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Сandidate has decreased a self bond.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateBondedLess') === '03199d60c293c383f981694ba4310b187ed4a6b79fcc52e6fbccc691153b8f28'
  }

  /**
   * Сandidate has decreased a self bond.
   */
  get asV1300(): {candidate: v1300.AccountId20, amount: bigint, newBond: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {candidate: v1300.AccountId20, amount: bigint, newBond: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingCandidateBondedMoreEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CandidateBondedMore')
  }

  /**
   * Candidate, Amount, New Bond Total
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateBondedMore') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Candidate, Amount, New Bond Total
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Сandidate has increased a self bond.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateBondedMore') === 'd6e6bcd7c6de9403e85285e3685e6774d7d1d129d84c7cfe9a4806c5ff5a4e54'
  }

  /**
   * Сandidate has increased a self bond.
   */
  get asV1300(): {candidate: v1300.AccountId20, amount: bigint, newTotalBond: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {candidate: v1300.AccountId20, amount: bigint, newTotalBond: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingCandidateLeftEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CandidateLeft')
  }

  /**
   * Ex-Candidate, Amount Unlocked, New Total Amt Locked
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateLeft') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * Ex-Candidate, Amount Unlocked, New Total Amt Locked
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Candidate has left the set of candidates.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CandidateLeft') === '39a5d795682d6a8426e0ee9f0ed61cb5d0d803a9c4303d42f2db829df56877b2'
  }

  /**
   * Candidate has left the set of candidates.
   */
  get asV1300(): {exCandidate: v1300.AccountId20, unlockedAmount: bigint, newTotalAmtLocked: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {exCandidate: v1300.AccountId20, unlockedAmount: bigint, newTotalAmtLocked: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingCollatorBondedLessEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CollatorBondedLess')
  }

  /**
   *  Collator Account, Old Bond, New Bond
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CollatorBondedLess') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   *  Collator Account, Old Bond, New Bond
   */
  get asV49(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    deprecateLatest()
    return this.asV49
  }
}

export class ParachainStakingCollatorBondedMoreEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CollatorBondedMore')
  }

  /**
   *  Collator Account, Old Bond, New Bond
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CollatorBondedMore') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   *  Collator Account, Old Bond, New Bond
   */
  get asV49(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    deprecateLatest()
    return this.asV49
  }
}

export class ParachainStakingCollatorLeftEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.CollatorLeft')
  }

  /**
   *  Account, Amount Unlocked, New Total Amt Locked
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.CollatorLeft') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   *  Account, Amount Unlocked, New Total Amt Locked
   */
  get asV49(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    deprecateLatest()
    return this.asV49
  }
}

export class ParachainStakingDelegationEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.Delegation')
  }

  /**
   * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Delegation') === '9e88e3dd4dec21ca4744b0264c96a88bfef8fa4f3a42c495ba697dcf51165507'
  }

  /**
   * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
   */
  get asV1001(): [v1001.AccountId20, bigint, v1001.AccountId20, v1001.DelegatorAdded] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * New delegation (increase of the existing one).
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Delegation') === 'a85b3e0f4dad63b1b710d554a6b0a8aa64b90a755bcae7ea3f4b677b36e5df82'
  }

  /**
   * New delegation (increase of the existing one).
   */
  get asV1300(): {delegator: v1300.AccountId20, lockedAmount: bigint, candidate: v1300.AccountId20, delegatorPosition: v1300.DelegatorAdded} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, lockedAmount: bigint, candidate: v1300.AccountId20, delegatorPosition: v1300.DelegatorAdded} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingDelegationDecreasedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.DelegationDecreased')
  }

  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationDecreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, boolean] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationDecreased') === '8ae2ca952b0b00ca6619c82b53d155a37de0be62eb9e8c32f4dad72b695e010b'
  }

  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingDelegationIncreasedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.DelegationIncreased')
  }

  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationIncreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, boolean] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationIncreased') === '8ae2ca952b0b00ca6619c82b53d155a37de0be62eb9e8c32f4dad72b695e010b'
  }

  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, amount: bigint, inTop: boolean} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingDelegationRevokedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.DelegationRevoked')
  }

  /**
   * Delegator, Candidate, Amount Unstaked
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationRevoked') === 'dfcae516f053c47e7cb49e0718f01587efcb64cea4e3baf4c6973a29891f7841'
  }

  /**
   * Delegator, Candidate, Amount Unstaked
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Delegation revoked.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegationRevoked') === '013eacc8d6813b22ecdad778ecfffcc25ea1f31117d857d64978c177696e8697'
  }

  /**
   * Delegation revoked.
   */
  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingDelegatorLeftEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.DelegatorLeft')
  }

  /**
   * Delegator, Amount Unstaked
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegatorLeft') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Delegator, Amount Unstaked
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Delegator has left the set of delegators.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegatorLeft') === '77f204dee4c5a51e392aac1d070198e23c536d0b97569fee0484578613cd8777'
  }

  /**
   * Delegator has left the set of delegators.
   */
  get asV1300(): {delegator: v1300.AccountId20, unstakedAmount: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, unstakedAmount: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingDelegatorLeftCandidateEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.DelegatorLeftCandidate')
  }

  /**
   * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
   */
  get isV1001(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegatorLeftCandidate') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  /**
   * Delegator, Candidate, Amount Unstaked, New Total Amt Staked for Candidate
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Delegation from candidate state has been remove.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.DelegatorLeftCandidate') === 'f72ae455b6ae66e6fabad54fadb0ae26f7136099a377372b74890536d4007422'
  }

  /**
   * Delegation from candidate state has been remove.
   */
  get asV1300(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint, totalCandidateStaked: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {delegator: v1300.AccountId20, candidate: v1300.AccountId20, unstakedAmount: bigint, totalCandidateStaked: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingJoinedCollatorCandidatesEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.JoinedCollatorCandidates')
  }

  /**
   *  Account, Amount Locked, New Total Amt Locked
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.JoinedCollatorCandidates') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   *  Account, Amount Locked, New Total Amt Locked
   */
  get asV49(): [v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Account joined the set of collator candidates.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.JoinedCollatorCandidates') === '227a8d2310a3cd3b98057acb86b906dcde376e61a13f5a50db8589a31b218c17'
  }

  /**
   * Account joined the set of collator candidates.
   */
  get asV1300(): {account: v1300.AccountId20, amountLocked: bigint, newTotalAmtLocked: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {account: v1300.AccountId20, amountLocked: bigint, newTotalAmtLocked: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingNewRoundEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.NewRound')
  }

  /**
   *  Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NewRound') === '40ffda4d99fbb38b23cc20386a7f622d64120f24ccc70b9f85ce7612cd87c3b7'
  }

  /**
   *  Starting Block, Round, Number of Collators Selected, Total Balance
   */
  get asV49(): [v49.BlockNumber, v49.RoundIndex, number, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Started new round.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NewRound') === '36b479d535ff0b4066a6ca7641a4dba5e090be428fc6b6e9fe8fec13d953fcfb'
  }

  /**
   * Started new round.
   */
  get asV1300(): {startingBlock: number, round: number, selectedCollatorsNumber: number, totalBalance: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {startingBlock: number, round: number, selectedCollatorsNumber: number, totalBalance: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}

export class ParachainStakingNominationEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.Nomination')
  }

  /**
   *  Nominator, Amount Locked, Collator, New Total Amt backing Collator
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Nomination') === 'f83c084062244bcc7149405c98c7c4e2a16809a87e76da05297caea15bec2db3'
  }

  /**
   *  Nominator, Amount Locked, Collator, New Total Amt backing Collator
   */
  get asV49(): [v49.AccountId, v49.BalanceOf, v49.AccountId, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   *  Nominator, Amount Locked, Collator, Nominator Position with New Total Backing if in Top
   */
  get isV53(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Nomination') === 'dd3e964791a24ea7be2acca430c914c1f3e81d5df11a43408f85c1514fc05d76'
  }

  /**
   *  Nominator, Amount Locked, Collator, Nominator Position with New Total Backing if in Top
   */
  get asV53(): [v53.AccountId, v53.BalanceOf, v53.AccountId, v53.NominatorAdded] {
    assert(this.isV53)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   *  Nominator, Amount Locked, Collator, Nominator Position with New Total Backing if in Top
   */
  get isV155(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Nomination') === 'b26738c647293ed4aac6dddaee1ffb213c8b985f9207b490577ef361bde362ac'
  }

  /**
   *  Nominator, Amount Locked, Collator, Nominator Position with New Total Backing if in Top
   */
  get asV155(): [v155.AccountId, v155.BalanceOf, v155.AccountId, v155.NominatorAdded] {
    assert(this.isV155)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Nominator, Amount Locked, Collator, Nominator Position with New Total Counted if in Top
   */
  get isV900(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Nomination') === '9e88e3dd4dec21ca4744b0264c96a88bfef8fa4f3a42c495ba697dcf51165507'
  }

  /**
   * Nominator, Amount Locked, Collator, Nominator Position with New Total Counted if in Top
   */
  get asV900(): [v900.H160, bigint, v900.H160, v900.NominatorAdded] {
    assert(this.isV900)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV900
  }

  get asLatest(): [v900.H160, bigint, v900.H160, v900.NominatorAdded] {
    deprecateLatest()
    return this.asV900
  }
}

export class ParachainStakingNominationDecreasedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.NominationDecreased')
  }

  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationDecreased') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  get asV49(): [v49.AccountId, v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV53(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationDecreased') === '0802fb52e763fad9c1e2d7470ade03f120ed84392caab7558db05d830982247c'
  }

  get asV53(): [v53.AccountId, v53.AccountId, v53.BalanceOf, boolean, v53.BalanceOf] {
    assert(this.isV53)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV501(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationDecreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV501(): [v501.AccountId, v501.AccountId, v501.BalanceOf, boolean] {
    assert(this.isV501)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV501
  }

  get asLatest(): [v501.AccountId, v501.AccountId, v501.BalanceOf, boolean] {
    deprecateLatest()
    return this.asV501
  }
}

export class ParachainStakingNominationIncreasedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.NominationIncreased')
  }

  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationIncreased') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  get asV49(): [v49.AccountId, v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV53(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationIncreased') === '0802fb52e763fad9c1e2d7470ade03f120ed84392caab7558db05d830982247c'
  }

  get asV53(): [v53.AccountId, v53.AccountId, v53.BalanceOf, boolean, v53.BalanceOf] {
    assert(this.isV53)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV501(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominationIncreased') === 'cb87cf94019b8ebc544a6a9a05c01f439fe3dea8cbed08c97f1a1e60dd6ad4f3'
  }

  get asV501(): [v501.AccountId, v501.AccountId, v501.BalanceOf, boolean] {
    assert(this.isV501)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV501
  }

  get asLatest(): [v501.AccountId, v501.AccountId, v501.BalanceOf, boolean] {
    deprecateLatest()
    return this.asV501
  }
}

export class ParachainStakingNominatorLeftEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.NominatorLeft')
  }

  /**
   *  Nominator, Amount Unstaked
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominatorLeft') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  Nominator, Amount Unstaked
   */
  get asV49(): [v49.AccountId, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): [v49.AccountId, v49.BalanceOf] {
    deprecateLatest()
    return this.asV49
  }
}

export class ParachainStakingNominatorLeftCollatorEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.NominatorLeftCollator')
  }

  /**
   *  Nominator, Collator, Amount Unstaked, New Total Amt Staked for Collator
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.NominatorLeftCollator') === 'c5569fad693da6ab49df69c2cc3a1767b0c18bfc1f206847e0946659f6cd24ef'
  }

  /**
   *  Nominator, Collator, Amount Unstaked, New Total Amt Staked for Collator
   */
  get asV49(): [v49.AccountId, v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV49
  }

  get asLatest(): [v49.AccountId, v49.AccountId, v49.BalanceOf, v49.BalanceOf] {
    deprecateLatest()
    return this.asV49
  }
}

export class ParachainStakingRewardedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'ParachainStaking.Rewarded')
  }

  /**
   *  Paid the account (nominator or collator) the balance as liquid rewards
   */
  get isV49(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Rewarded') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  Paid the account (nominator or collator) the balance as liquid rewards
   */
  get asV49(): [v49.AccountId, v49.BalanceOf] {
    assert(this.isV49)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get isV1300(): boolean {
    return this.ctx._chain.getEventHash('ParachainStaking.Rewarded') === '44a7364018ebad92746e4ca7c7c23d24d5da43cda2e63a90c665b522994ef1e2'
  }

  /**
   * Paid the account (delegator or collator) the balance as liquid rewards.
   */
  get asV1300(): {account: v1300.AccountId20, rewards: bigint} {
    assert(this.isV1300)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1300
  }

  get asLatest(): {account: v1300.AccountId20, rewards: bigint} {
    deprecateLatest()
    return this.asV1300
  }
}
