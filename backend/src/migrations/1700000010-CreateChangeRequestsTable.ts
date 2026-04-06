import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateChangeRequestsTable1700000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "change_requests",
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
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "cr_key",
            type: "varchar",
            length: "50",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "space_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "sprint_id",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "status_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "priority_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "worktype_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "created_by",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "assigned_to",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "due_date",
            type: "date",
            isNullable: true,
          },
          {
            name: "estimated_hours",
            type: "int",
            isNullable: true,
          },
          {
            name: "actual_hours",
            type: "int",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          new TableIndex({ columnNames: ["title"] }),
          new TableIndex({ columnNames: ["cr_key"] }),
          new TableIndex({ columnNames: ["space_id"] }),
          new TableIndex({ columnNames: ["status_id"] }),
          new TableIndex({ columnNames: ["priority_id"] }),
          new TableIndex({ columnNames: ["assigned_to"] }),
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["space_id"],
        referencedTableName: "spaces",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["sprint_id"],
        referencedTableName: "sprints",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["status_id"],
        referencedTableName: "task_statuses",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["priority_id"],
        referencedTableName: "task_priorities",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["worktype_id"],
        referencedTableName: "task_worktypes",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["created_by"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );

    await queryRunner.createForeignKey(
      "change_requests",
      new TableForeignKey({
        columnNames: ["assigned_to"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("change_requests");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("change_requests", fk);
      }
    }
    await queryRunner.dropTable("change_requests", true);
  }
}
