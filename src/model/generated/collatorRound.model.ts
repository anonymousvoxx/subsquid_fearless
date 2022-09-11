import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Round} from "./round.model"
import {RoundDelegation} from "./roundDelegation.model"

@Entity_()
export class CollatorRound {
  constructor(props?: Partial<CollatorRound>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Round, {nullable: true})
  round!: Round | undefined | null

  @Column_("text", {nullable: false})
  collator!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  ownBond!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalBond!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  rewardAmount!: bigint | undefined | null

  @Column_("numeric", {nullable: true})
  apr!: number | undefined | null

  @Column_("numeric", {nullable: true})
  aprTechnNumerator!: number | undefined | null

  @Column_("numeric", {nullable: true})
  aprTechnDenominator!: number | undefined | null

  @OneToMany_(() => RoundDelegation, e => e.collator)
  nominators!: RoundDelegation[]
}
