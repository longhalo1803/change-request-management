import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertInitialWorktypes1700000018000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO task_worktypes (id, name, description, icon, created_at, updated_at)
      VALUES
        (UUID(), 'BUG', 'Bug fix', '🐛', NOW(), NOW()),
        (UUID(), 'FEATURE', 'New feature', '⭐', NOW(), NOW()),
        (UUID(), 'IMPROVEMENT', 'Process improvement', '📈', NOW(), NOW()),
        (UUID(), 'DOCUMENTATION', 'Documentation update', '📝', NOW(), NOW()),
        (UUID(), 'TESTING', 'Testing and QA', '🧪', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM task_worktypes`);
  }
}
