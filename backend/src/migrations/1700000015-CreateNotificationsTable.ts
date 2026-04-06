import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateNotificationsTable1700000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notifications",
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
            name: "user_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "message",
            type: "text",
            isNullable: false,
          },
          {
            name: "type",
            type: "varchar",
            length: "50",
            default: "'INFO'",
          },
          {
            name: "is_read",
            type: "boolean",
            default: false,
          },
          {
            name: "related_id",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "related_type",
            type: "varchar",
            length: "50",
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
          new TableIndex({ columnNames: ["user_id"] }),
          new TableIndex({ columnNames: ["is_read"] }),
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "notifications",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("notifications");
    if (table) {
      const foreignKey = table.foreignKeys.find((fk) =>
        fk.columnNames.includes("user_id")
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("notifications", foreignKey);
      }
    }
    await queryRunner.dropTable("notifications", true);
  }
}
