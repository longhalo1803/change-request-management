import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Manual migration: Drop the space_assignments table entirely.
 * This table stored internal team membership (TEAM_LEAD, DEVELOPER, REVIEWER)
 * but was incorrectly used to gate Customer CR creation, causing 403 errors.
 * The table is no longer referenced by any entity or service.
 */
export class DropSpaceAssignments1776722000000 implements MigrationInterface {
    name = 'DropSpaceAssignments1776722000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first to avoid constraint errors
        const table = await queryRunner.getTable("space_assignments");
        if (table) {
            for (const fk of table.foreignKeys) {
                await queryRunner.dropForeignKey("space_assignments", fk);
            }
            await queryRunner.dropTable("space_assignments");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate the table if we ever need to revert
        await queryRunner.query(`
            CREATE TABLE \`space_assignments\` (
                \`id\` varchar(36) NOT NULL,
                \`space_id\` varchar(36) NOT NULL,
                \`user_id\` varchar(36) NOT NULL,
                \`role\` varchar(50) NOT NULL,
                \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`IDX_space_user\` (\`space_id\`, \`user_id\`),
                CONSTRAINT \`FK_sa_space\` FOREIGN KEY (\`space_id\`) REFERENCES \`spaces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT \`FK_sa_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);
    }
}
