import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

/**
 * Add User Roles Lookup Table Migration
 *
 * Step 1: Create user_roles table
 * Step 2: Seed 3 default roles (admin, pm, customer)
 * Step 3: Add role_id column to users
 * Step 4: Migrate data from ENUM role → FK role_id
 * Step 5: Set NOT NULL + FK constraint
 * Step 6: Drop old role ENUM column
 */

export class AddUserRolesTable1776900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Create user_roles table
    await queryRunner.createTable(
      new Table({
        name: "user_roles",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Step 2: Seed 3 default roles
    await queryRunner.query(`
      INSERT INTO user_roles (id, code, name, description) VALUES
        (UUID(), 'admin',    'Administrator',   'Quản trị hệ thống, toàn quyền'),
        (UUID(), 'pm',       'Project Manager', 'Quản lý project, review CR, tạo quotation'),
        (UUID(), 'customer', 'Customer',        'Tạo và theo dõi change request')
    `);

    // Step 3: Add role_id column to users (nullable first for migration)
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN role_id VARCHAR(36) NULL
    `);

    // Step 4: Migrate data from ENUM role → FK role_id
    await queryRunner.query(`
      UPDATE users u
      INNER JOIN user_roles r ON r.code = u.role
      SET u.role_id = r.id
    `);

    // Step 5: Set NOT NULL constraint on role_id
    await queryRunner.query(`
      ALTER TABLE users MODIFY COLUMN role_id VARCHAR(36) NOT NULL
    `);

    // Add FK constraint
    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        name: "FK_users_role_id",
        columnNames: ["role_id"],
        referencedTableName: "user_roles",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    // Add index on role_id for performance
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_role_id",
        columnNames: ["role_id"],
      })
    );

    // Step 6: Drop old role ENUM column and its index
    // First drop the index on the old role column if it exists
    try {
      await queryRunner.dropIndex("users", "IDX_users_role");
    } catch {
      // Index may not exist, that's fine
    }

    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN role
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse: Recreate the old role ENUM column
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN role ENUM('admin', 'pm', 'customer') NOT NULL DEFAULT 'customer'
    `);

    // Migrate data back from FK to ENUM
    await queryRunner.query(`
      UPDATE users u
      INNER JOIN user_roles r ON r.id = u.role_id
      SET u.role = r.code
    `);

    // Recreate old index
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_role",
        columnNames: ["role"],
      })
    );

    // Drop FK and index on role_id
    try {
      await queryRunner.dropForeignKey("users", "FK_users_role_id");
    } catch {
      // May not exist
    }

    try {
      await queryRunner.dropIndex("users", "IDX_users_role_id");
    } catch {
      // May not exist
    }

    // Drop role_id column
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN role_id
    `);

    // Drop user_roles table
    await queryRunner.dropTable("user_roles");
  }
}
