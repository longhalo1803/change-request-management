import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Add CHANGE_REQUEST worktype to task_worktypes table
 *
 * The system was missing a critical worktype for Change Requests.
 */

export class AddChangeRequestWorktype1776950000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO task_worktypes (id, name, description, icon, created_at, updated_at)
      VALUES (UUID(), 'CHANGE_REQUEST', 'Change request type', '🔄', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM task_worktypes WHERE name = 'CHANGE_REQUEST'`
    );
  }
}
