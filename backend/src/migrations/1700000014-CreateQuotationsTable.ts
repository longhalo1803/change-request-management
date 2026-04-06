import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateQuotationsTable1700000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "quotations",
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
            name: "project_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "quoted_by",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "amount",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'PENDING'",
          },
          {
            name: "valid_until",
            type: "date",
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
          new TableIndex({ columnNames: ["project_id"] }),
          new TableIndex({ columnNames: ["status"] }),
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "quotations",
      new TableForeignKey({
        columnNames: ["project_id"],
        referencedTableName: "projects",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "quotations",
      new TableForeignKey({
        columnNames: ["quoted_by"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("quotations");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("quotations", fk);
      }
    }
    await queryRunner.dropTable("quotations", true);
  }
}
