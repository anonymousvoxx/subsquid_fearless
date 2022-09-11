import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Round} from "./round.model"
import {CollatorRound} from "./collatorRound.model"
import {RoundNominator} from "./roundNominator.model"

@Entity_()
export class RoundDelegation {
  constructor(props?: Partial<RoundDelegation>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Round, {nullable: false})
  round!: Round

  @Index_()
  @ManyToOne_(() => CollatorRound, {nullable: false})
  collator!: CollatorRound

  @Index_()
  @ManyToOne_(() => RoundNominator, {nullable: false})
  delegator!: RoundNominator

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint
}
