const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdPerson1689953963340 {
    name = 'UpdPerson1689953963340'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "birthdate" date`);
        await queryRunner.query(`ALTER TABLE "auth"."person" ADD "document" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "auth"."person" DROP COLUMN "name"`);
    }
}
