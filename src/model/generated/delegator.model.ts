import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Delegator {
  constructor(props?: Partial<Delegator>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string
}
