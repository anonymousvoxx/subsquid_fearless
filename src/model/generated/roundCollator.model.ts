import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Round} from "./round.model"
import {RoundDelegation} from "./roundDelegation.model"

@Entity_()
export class RoundCollator {
  constructor(props?: Partial<RoundCollator>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Round, {nullable: true})
  round!: Round | undefined | null

  @Index_()
  @Column_("text", {nullable: false})
  account!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  selfBond!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalBond!: bigint | undefined | null

  @OneToMany_(() => RoundDelegation, e => e.collator)
  nominators!: RoundDelegation[]
}
