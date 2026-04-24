import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordResetTokensTable1777002000001 implements MigrationInterface {
  name = "CreatePasswordResetTokensTable1777002000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`password_reset_tokens\` (
        \`id\` VARCHAR(36) PRIMARY KEY,
        \`user_id\` VARCHAR(36) NOT NULL,
        \`token_hash\` VARCHAR(255) UNIQUE NOT NULL,
        \`expires_at\` TIMESTAMP NOT NULL,
        \`used_at\` TIMESTAMP NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        INDEX \`idx_user_id\` (\`user_id\`),
        INDEX \`idx_token_hash\` (\`token_hash\`),
        INDEX \`idx_expires_at\` (\`expires_at\`),
        UNIQUE KEY \`unique_active_token\` (\`user_id\`, \`used_at\`)
      ) ENGINE=InnoDB;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
  }
}
