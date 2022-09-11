import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Collator {
  constructor(props?: Partial<Collator>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bond!: bigint | undefined | null

  @Column_("numeric", {nullable: true})
  apr24h!: number | undefined | null
}
