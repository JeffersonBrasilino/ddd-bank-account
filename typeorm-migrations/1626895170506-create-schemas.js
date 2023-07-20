const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class createSchemas1626895170506 {
  async up(queryRunner) {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS auth');
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS log');
  }

  async down(queryRunner) {}
};
