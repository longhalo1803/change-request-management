import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateChangeRequestStatusHistoryTable1700000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "change_request_status_history",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "UUID()",
          },
          {
            name: "change_request_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "status_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "changed_by",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          new TableIndex({ columnNames: ["change_request_id"] }),
          new TableIndex({ columnNames: ["status_id"] }),
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "change_request_status_history",
      new TableForeignKey({
        columnNames: ["change_request_id"],
        referencedTableName: "change_requests",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "change_request_status_history",
      new TableForeignKey({
        columnNames: ["status_id"],
        referencedTableName: "task_statuses",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );

    await queryRunner.createForeignKey(
      "change_request_status_history",
      new TableForeignKey({
        columnNames: ["changed_by"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("change_request_status_history");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("change_request_status_history", fk);
      }
    }
    await queryRunner.dropTable("change_request_status_history", true);
  }
}
