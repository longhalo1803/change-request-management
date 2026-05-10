import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskStatuses1720000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE task_statuses SET name = 'ON_GOING', description = 'Change request is on going', color = '#0066FF' WHERE name = 'IN_PROGRESS'`
    );
    await queryRunner.query(
      `UPDATE task_statuses SET name = 'REJECTED', description = 'Change request has been rejected', color = '#FF0000' WHERE name = 'COMPLETED'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE task_statuses SET name = 'IN_PROGRESS', description = 'Change request is being implemented', color = '#0066FF' WHERE name = 'ON_GOING'`
    );
    await queryRunner.query(
      `UPDATE task_statuses SET name = 'COMPLETED', description = 'Change request has been completed', color = '#00CC00' WHERE name = 'REJECTED'`
    );
  }
}
