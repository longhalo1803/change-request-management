import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertInitialPriorities1700000017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO task_priorities (id, name, description, color, level, created_at, updated_at)
      VALUES
        (UUID(), 'CRITICAL', 'Critical priority - system is down', '#FF0000', 1, NOW(), NOW()),
        (UUID(), 'HIGH', 'High priority - urgent work required', '#FF6600', 2, NOW(), NOW()),
        (UUID(), 'MEDIUM', 'Medium priority - standard work', '#FFCC00', 3, NOW(), NOW()),
        (UUID(), 'LOW', 'Low priority - can be deferred', '#00CC00', 4, NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM task_priorities`);
  }
}
