import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertInitialStatuses1700000016000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO task_statuses (id, name, description, color, \`order\`, created_at, updated_at)
      VALUES
        (UUID(), 'DRAFT', 'Change request is in draft state', '#808080', 1, NOW(), NOW()),
        (UUID(), 'SUBMITTED', 'Change request has been submitted', '#0066CC', 2, NOW(), NOW()),
        (UUID(), 'IN_DISCUSSION', 'Change request is under discussion', '#FF9900', 3, NOW(), NOW()),
        (UUID(), 'APPROVED', 'Change request has been approved', '#00AA44', 4, NOW(), NOW()),
        (UUID(), 'IN_PROGRESS', 'Change request is being implemented', '#0066FF', 5, NOW(), NOW()),
        (UUID(), 'COMPLETED', 'Change request has been completed', '#00CC00', 6, NOW(), NOW()),
        (UUID(), 'CLOSED', 'Change request is closed', '#CCCCCC', 7, NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM task_statuses`);
  }
}
