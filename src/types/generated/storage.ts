import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result} from './support'
import * as v900 from './v900'
import * as v1001 from './v1001'
import * as v1201 from './v1201'
import * as v1502 from './v1502'

export class ParachainStakingBottomDelegationsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Bottom delegations for collator candidate
   */
  get isV1201() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'BottomDelegations') === 'e681b7cbb9992622456e4ee66d20daa7968a64b6a52ef599f5992850855cc3ee'
  }

  /**
   *  Bottom delegations for collator candidate
   */
  async getAsV1201(key: v1201.AccountId20): Promise<v1201.Delegations_209 | undefined> {
    assert(this.isV1201)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'BottomDelegations', key)
  }

  async getManyAsV1201(keys: v1201.AccountId20[]): Promise<(v1201.Delegations_209 | undefined)[]> {
    assert(this.isV1201)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'BottomDelegations', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'BottomDelegations') != null
  }
}

export class ParachainStakingCandidateInfoStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get collator candidate info associated with an account if account is candidate else None
   */
  get isV1201() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CandidateInfo') === '248231639cd86f1a3ffea0da2b9ed3fc64e1b7784d3759f68d733ac1ef08db19'
  }

  /**
   *  Get collator candidate info associated with an account if account is candidate else None
   */
  async getAsV1201(key: v1201.AccountId20): Promise<v1201.CandidateMetadata | undefined> {
    assert(this.isV1201)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'CandidateInfo', key)
  }

  async getManyAsV1201(keys: v1201.AccountId20[]): Promise<(v1201.CandidateMetadata | undefined)[]> {
    assert(this.isV1201)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'CandidateInfo', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CandidateInfo') != null
  }
}

export class ParachainStakingCandidateStateStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get collator candidate state associated with an account if account is a candidate else None
   */
  get isV1001() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CandidateState') === '84ab01b9f5d971571bb4cd8288174dc552c917250ba2c5256263959a40438f09'
  }

  /**
   *  Get collator candidate state associated with an account if account is a candidate else None
   */
  async getAsV1001(key: v1001.AccountId20): Promise<v1001.CollatorCandidate | undefined> {
    assert(this.isV1001)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'CandidateState', key)
  }

  async getManyAsV1001(keys: v1001.AccountId20[]): Promise<(v1001.CollatorCandidate | undefined)[]> {
    assert(this.isV1001)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'CandidateState', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CandidateState') != null
  }
}

export class ParachainStakingCollatorState2Storage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  DEPRECATED in favor of CandidateState
   *  Get collator state associated with an account if account is collating else None
   */
  get isV1001() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CollatorState2') === 'a4d9c3541b410bd0ebf9e6919cad26ad7aa3481dd09c1495650af46ea30787a9'
  }

  /**
   *  DEPRECATED in favor of CandidateState
   *  Get collator state associated with an account if account is collating else None
   */
  async getAsV1001(key: v1001.AccountId20): Promise<v1001.Collator2 | undefined> {
    assert(this.isV1001)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'CollatorState2', key)
  }

  async getManyAsV1001(keys: v1001.AccountId20[]): Promise<(v1001.Collator2 | undefined)[]> {
    assert(this.isV1001)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'CollatorState2', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'CollatorState2') != null
  }
}

export class ParachainStakingDelegatorStateStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get delegator state associated with an account if account is delegating else None
   */
  get isV1001() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'DelegatorState') === '03dfb3b8e1ca16deb35d7040cc81f72b135e75c4caeea578cfc2294e1f1f41ad'
  }

  /**
   *  Get delegator state associated with an account if account is delegating else None
   */
  async getAsV1001(key: v1001.AccountId20): Promise<v1001.Delegator | undefined> {
    assert(this.isV1001)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'DelegatorState', key)
  }

  async getManyAsV1001(keys: v1001.AccountId20[]): Promise<(v1001.Delegator | undefined)[]> {
    assert(this.isV1001)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'DelegatorState', keys.map(k => [k]))
  }

  /**
   *  Get delegator state associated with an account if account is delegating else None
   */
  get isV1502() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'DelegatorState') === '637263cfee3190d24faafd4e41f925a782ec1a9b5d80de08bd6ae287d0f0a10a'
  }

  /**
   *  Get delegator state associated with an account if account is delegating else None
   */
  async getAsV1502(key: v1502.AccountId20): Promise<v1502.Delegator | undefined> {
    assert(this.isV1502)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'DelegatorState', key)
  }

  async getManyAsV1502(keys: v1502.AccountId20[]): Promise<(v1502.Delegator | undefined)[]> {
    assert(this.isV1502)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'DelegatorState', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'DelegatorState') != null
  }
}

export class ParachainStakingNominatorState2Storage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  DEPRECATED in favor of DelegatorState
   *  Get nominator state associated with an account if account is nominating else None
   */
  get isV1001() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'NominatorState2') === 'c33bf4fdf125c8070ffd27253f9a811a9a2b244a0af652bf531999872325e904'
  }

  /**
   *  DEPRECATED in favor of DelegatorState
   *  Get nominator state associated with an account if account is nominating else None
   */
  async getAsV1001(key: v1001.AccountId20): Promise<v1001.Nominator2 | undefined> {
    assert(this.isV1001)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'NominatorState2', key)
  }

  async getManyAsV1001(keys: v1001.AccountId20[]): Promise<(v1001.Nominator2 | undefined)[]> {
    assert(this.isV1001)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'NominatorState2', keys.map(k => [k]))
  }

  /**
   *  Get nominator state associated with an account if account is nominating else None
   */
  get isV900() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'NominatorState2') === 'adc9b2765bcd5aa9c2ac9f93cd108b87d508a8d5494c318bf18ee6f4b599b8ed'
  }

  /**
   *  Get nominator state associated with an account if account is nominating else None
   */
  async getAsV900(key: v900.H160): Promise<v900.Nominator2 | undefined> {
    assert(this.isV900)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'NominatorState2', key)
  }

  async getManyAsV900(keys: v900.H160[]): Promise<(v900.Nominator2 | undefined)[]> {
    assert(this.isV900)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'NominatorState2', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'NominatorState2') != null
  }
}

export class ParachainStakingSelectedCandidatesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The collator candidates selected for the current round
   */
  get isV1001() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'SelectedCandidates') === 'd14508def9da76532021b53d553e9048fd079e2e735d2393e6d531e6d1fd29ca'
  }

  /**
   *  The collator candidates selected for the current round
   */
  async getAsV1001(): Promise<v1001.AccountId20[]> {
    assert(this.isV1001)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'SelectedCandidates')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'SelectedCandidates') != null
  }
}

export class ParachainStakingTopDelegationsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Top delegations for collator candidate
   */
  get isV1201() {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'TopDelegations') === 'e681b7cbb9992622456e4ee66d20daa7968a64b6a52ef599f5992850855cc3ee'
  }

  /**
   *  Top delegations for collator candidate
   */
  async getAsV1201(key: v1201.AccountId20): Promise<v1201.Delegations_209 | undefined> {
    assert(this.isV1201)
    return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'TopDelegations', key)
  }

  async getManyAsV1201(keys: v1201.AccountId20[]): Promise<(v1201.Delegations_209 | undefined)[]> {
    assert(this.isV1201)
    return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'TopDelegations', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainStaking', 'TopDelegations') != null
  }
}
