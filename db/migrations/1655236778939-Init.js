module.exports = class Init1655236778939 {
  name = 'Init1655236778939'

  async up(db) {
    await db.query(`CREATE TABLE "round_nominator" ("id" character varying NOT NULL, "account" text NOT NULL, "bond" numeric, "round_id" character varying NOT NULL, CONSTRAINT "PK_198962b34d30551579fc4fc9d1c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_51c3d9f8e416a26186881e95cc" ON "round_nominator" ("round_id") `)
    await db.query(`CREATE INDEX "IDX_321b9eb24f8fa2d07a70406a05" ON "round_nominator" ("account") `)
    await db.query(`CREATE TABLE "round_delegation" ("id" character varying NOT NULL, "vote" numeric NOT NULL, "round_id" character varying NOT NULL, "collator_id" character varying NOT NULL, "nominator_id" character varying NOT NULL, CONSTRAINT "PK_7c12d2edfea638d9d95be2d03b6" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d422204258bc95c2441764028b" ON "round_delegation" ("round_id") `)
    await db.query(`CREATE INDEX "IDX_c037d1fb98a6b0646ee5ea903a" ON "round_delegation" ("collator_id") `)
    await db.query(`CREATE INDEX "IDX_aa8d221a7660c462c83f42c1e3" ON "round_delegation" ("nominator_id") `)
    await db.query(`CREATE TABLE "round_collator" ("id" character varying NOT NULL, "account" text NOT NULL, "self_bond" numeric, "total_bond" numeric, "round_id" character varying, CONSTRAINT "PK_32b73164cfc62741feb236d9895" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_e6cfb8c046cfcdaffb6f40e1bf" ON "round_collator" ("round_id") `)
    await db.query(`CREATE INDEX "IDX_728de9ecba4527f605e83f29d6" ON "round_collator" ("account") `)
    await db.query(`CREATE TABLE "round" ("id" character varying NOT NULL, "index" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "started_at" integer NOT NULL, "ended_at" integer, "collators_count" integer NOT NULL, "total" numeric NOT NULL, CONSTRAINT "PK_34bd959f3f4a90eb86e4ae24d2d" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "round_nominator" ADD CONSTRAINT "FK_51c3d9f8e416a26186881e95ccf" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "round_delegation" ADD CONSTRAINT "FK_d422204258bc95c2441764028b5" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "round_delegation" ADD CONSTRAINT "FK_c037d1fb98a6b0646ee5ea903a5" FOREIGN KEY ("collator_id") REFERENCES "round_collator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "round_delegation" ADD CONSTRAINT "FK_aa8d221a7660c462c83f42c1e39" FOREIGN KEY ("nominator_id") REFERENCES "round_nominator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "round_collator" ADD CONSTRAINT "FK_e6cfb8c046cfcdaffb6f40e1bff" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "round_nominator"`)
    await db.query(`DROP INDEX "public"."IDX_51c3d9f8e416a26186881e95cc"`)
    await db.query(`DROP INDEX "public"."IDX_321b9eb24f8fa2d07a70406a05"`)
    await db.query(`DROP TABLE "round_delegation"`)
    await db.query(`DROP INDEX "public"."IDX_d422204258bc95c2441764028b"`)
    await db.query(`DROP INDEX "public"."IDX_c037d1fb98a6b0646ee5ea903a"`)
    await db.query(`DROP INDEX "public"."IDX_aa8d221a7660c462c83f42c1e3"`)
    await db.query(`DROP TABLE "round_collator"`)
    await db.query(`DROP INDEX "public"."IDX_e6cfb8c046cfcdaffb6f40e1bf"`)
    await db.query(`DROP INDEX "public"."IDX_728de9ecba4527f605e83f29d6"`)
    await db.query(`DROP TABLE "round"`)
    await db.query(`ALTER TABLE "round_nominator" DROP CONSTRAINT "FK_51c3d9f8e416a26186881e95ccf"`)
    await db.query(`ALTER TABLE "round_delegation" DROP CONSTRAINT "FK_d422204258bc95c2441764028b5"`)
    await db.query(`ALTER TABLE "round_delegation" DROP CONSTRAINT "FK_c037d1fb98a6b0646ee5ea903a5"`)
    await db.query(`ALTER TABLE "round_delegation" DROP CONSTRAINT "FK_aa8d221a7660c462c83f42c1e39"`)
    await db.query(`ALTER TABLE "round_collator" DROP CONSTRAINT "FK_e6cfb8c046cfcdaffb6f40e1bff"`)
  }
}
