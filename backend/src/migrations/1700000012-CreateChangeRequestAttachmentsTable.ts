import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateChangeRequestAttachmentsTable1700000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "change_request_attachments",
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
            name: "file_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "file_url",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "bigint",
            isNullable: false,
          },
          {
            name: "mime_type",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "uploaded_by",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [new TableIndex({ columnNames: ["change_request_id"] })],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "change_request_attachments",
      new TableForeignKey({
        columnNames: ["change_request_id"],
        referencedTableName: "change_requests",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "change_request_attachments",
      new TableForeignKey({
        columnNames: ["uploaded_by"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("change_request_attachments");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("change_request_attachments", fk);
      }
    }
    await queryRunner.dropTable("change_request_attachments", true);
  }
}
