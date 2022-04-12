import { MigrationInterface, QueryRunner } from 'typeorm';

export class accountMovement1646931138217 implements MigrationInterface {
  name = 'accountMovement1646931138217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "cpf" character varying(12) NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "account"."created_at" IS 'data de criacao do registro'; COMMENT ON COLUMN "account"."cpf" IS 'cpf do proprietario da conta'; COMMENT ON COLUMN "account"."name" IS 'nome do proprietario da conta'`,
    );
    await queryRunner.query(
      `CREATE TABLE "movement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "value" numeric(10,2) NOT NULL, "account_id" uuid, CONSTRAINT "PK_079f005d01ebda984e75c2d67ee" PRIMARY KEY ("id")); COMMENT ON COLUMN "movement"."created_at" IS 'data de criacao do registro'; COMMENT ON COLUMN "movement"."value" IS 'valor do saldo'`,
    );
    await queryRunner.query(
      `ALTER TABLE "movement" ADD CONSTRAINT "FK_d91b6304186711230e9cab2bb40" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movement" DROP CONSTRAINT "FK_d91b6304186711230e9cab2bb40"`,
    );
    await queryRunner.query(`DROP TABLE "movement"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
