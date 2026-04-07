import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from "typeorm";

export class CreateSpaceAssignmentsTable1700000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "space_assignments",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "space_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "role",
            type: "varchar",
            length: "50",
            isNullable: false,
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
          new TableIndex({
            columnNames: ["space_id", "user_id"],
            isUnique: true,
          }),
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "space_assignments",
      new TableForeignKey({
        columnNames: ["space_id"],
        referencedTableName: "spaces",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "space_assignments",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("space_assignments");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("space_assignments", fk);
      }
    }
    await queryRunner.dropTable("space_assignments", true);
  }
}
