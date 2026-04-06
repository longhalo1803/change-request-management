-- Initialize database with timezone and encoding
SET GLOBAL time_zone = '+07:00';

-- Ensure database exists
CREATE DATABASE IF NOT EXISTS cr_management;
USE cr_management;

-- Set character set for database
ALTER DATABASE cr_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create migration history table (TypeORM requirement)
CREATE TABLE IF NOT EXISTS migrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  timestamp BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  UNIQUE KEY unique_migration (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify tables exist
SELECT 'Database initialized successfully' as status;
