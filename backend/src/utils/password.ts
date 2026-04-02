import bcrypt from "bcryptjs";

/**
 * Password Utility
 *
 * Handles password hashing and verification using bcrypt
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles password operations
 * - Dependency Inversion: Can be replaced with different hashing algorithm
 */

const SALT_ROUNDS = 10;

export class PasswordUtil {
  /**
   * Hash a plain text password
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare plain text password with hashed password
   */
  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   * Minimum 8 characters, at least one letter and one number
   */
  static validate(password: string): boolean {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasLetter && hasNumber;
  }
}
