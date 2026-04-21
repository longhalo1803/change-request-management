import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Split full_name into first_name + last_name, add phone column
 *
 * Migration strategy:
 * 1. Add new columns first_name, last_name, phone
 * 2. Migrate existing full_name data (first word → first_name, rest → last_name)
 * 3. Drop old full_name column
 */

export class SplitFullNameAddPhone1776800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add new columns with defaults so existing rows don't break
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN last_name VARCHAR(255) NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL`
    );

    // Step 2: Migrate existing full_name data
    // first_name = first word, last_name = remaining words
    await queryRunner.query(`
      UPDATE users SET 
        first_name = SUBSTRING_INDEX(full_name, ' ', 1),
        last_name = CASE 
          WHEN LOCATE(' ', full_name) > 0 
          THEN TRIM(SUBSTRING(full_name FROM LOCATE(' ', full_name) + 1))
          ELSE ''
        END
    `);

    // Step 3: Drop old full_name column
    await queryRunner.query(`ALTER TABLE users DROP COLUMN full_name`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse: recreate full_name from first_name + last_name
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NOT NULL DEFAULT ''`
    );

    await queryRunner.query(`
      UPDATE users SET full_name = TRIM(CONCAT(first_name, ' ', last_name))
    `);

    await queryRunner.query(`ALTER TABLE users DROP COLUMN first_name`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN last_name`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN phone`);
  }
}
