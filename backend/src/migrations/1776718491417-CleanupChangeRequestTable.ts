import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupChangeRequestTable1776718491417 implements MigrationInterface {
    name = 'CleanupChangeRequestTable1776718491417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`change_requests\` DROP COLUMN \`assigned_to\``);
        await queryRunner.query(`ALTER TABLE \`change_requests\` DROP COLUMN \`estimated_hours\``);
        await queryRunner.query(`ALTER TABLE \`change_requests\` DROP COLUMN \`actual_hours\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`change_requests\` ADD \`actual_hours\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`change_requests\` ADD \`estimated_hours\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`change_requests\` ADD \`assigned_to\` varchar(255) NULL`);
    }

}
