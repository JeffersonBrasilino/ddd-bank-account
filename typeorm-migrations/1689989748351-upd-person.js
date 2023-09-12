const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdPerson1689989748351 {
    name = 'UpdPerson1689989748351'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "birth_date" date`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "cpf" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "birth_date"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "document" character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "birthdate" date`);
    }
}
