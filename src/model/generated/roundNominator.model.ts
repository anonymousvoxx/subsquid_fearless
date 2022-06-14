import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Round} from "./round.model"
import {RoundDelegation} from "./roundDelegation.model"

@Entity_()
export class RoundNominator {
  constructor(props?: Partial<RoundNominator>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Round, {nullable: false})
  round!: Round

  @Index_()
  @Column_("text", {nullable: false})
  account!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bond!: bigint | undefined | null

  @OneToMany_(() => RoundDelegation, e => e.nominator)
  collators!: RoundDelegation[]
}
