const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UserDevices1691164857107 {
    name = 'UserDevices1691164857107'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "auth"."user_devices" ("id" BIGSERIAL NOT NULL, "uuid" character varying, "status" character NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "device_id" character varying NOT NULL, "device_name" character varying, "auth_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "user_id" bigint, CONSTRAINT "PK_c9e7e648903a9e537347aba4371" PRIMARY KEY ("id")); COMMENT ON COLUMN "auth"."user_devices"."uuid" IS 'identificador unico do registro'; COMMENT ON COLUMN "auth"."user_devices"."status" IS 'situacao do registro. 1 - ativo, 0 - inativo'; COMMENT ON COLUMN "auth"."user_devices"."created_at" IS 'data de criacao do registro'; COMMENT ON COLUMN "auth"."user_devices"."updated_at" IS 'data de ALTERACAO do registro'; COMMENT ON COLUMN "auth"."user_devices"."deleted_at" IS 'data de EXCLUSAO do registro(soft-delete)'`);
        await queryRunner.query(`ALTER TABLE "auth"."user_devices" ADD CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "auth"."user_devices" DROP CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241"`);
        await queryRunner.query(`DROP TABLE "auth"."user_devices"`);
    }
}
