import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStartDateToChangeRequest1776717110816 implements MigrationInterface {
    name = 'AddStartDateToChangeRequest1776717110816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`change_requests\` ADD \`start_date\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`change_requests\` DROP COLUMN \`start_date\``);
    }
}
