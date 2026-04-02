import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

/**
 * Create Users Table Migration
 *
 * Creates the users table with all necessary fields and indexes
 */

export class CreateUsersTable1700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "full_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "role",
            type: "enum",
            enum: ["admin", "brse", "developer", "qa", "customer"],
            default: "'customer'",
            isNullable: false,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "last_login_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_email",
        columnNames: ["email"],
      }),
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_role",
        columnNames: ["role"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
