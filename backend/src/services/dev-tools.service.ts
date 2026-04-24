/**
 * Dev Tools Service
 *
 * Provides mock email inbox and debugging utilities for development.
 * Stores reset tokens and metadata for inspection in dev panel.
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles dev tool operations
 * - Dependency Inversion: Can be extended with different storage backends
 */

import crypto from "crypto";
import { AppError } from "@/utils/app-error";

export interface MockEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  token: string;
  tokenHash: string;
  expiresAt: Date;
  sentAt: Date;
}

export class DevToolsService {
  private static instance: DevToolsService;
  private mockInbox = new Map<string, MockEmail[]>();
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = process.env.NODE_ENV === "development";
  }

  static getInstance(): DevToolsService {
    if (!DevToolsService.instance) {
      DevToolsService.instance = new DevToolsService();
    }
    return DevToolsService.instance;
  }

  /**
   * Assert dev tools are enabled, throw error if not
   */
  private assertEnabled(): void {
    if (!this.isEnabled) {
      throw new AppError("dev_tools.disabled", 403);
    }
  }

  /**
   * Store an email in the mock inbox
   * Called from forgotPassword in dev mode
   */
  storeMockEmail(
    to: string,
    subject: string,
    body: string,
    token: string,
    tokenHash: string,
    expiresAt: Date
  ): MockEmail {
    this.assertEnabled();

    const email: MockEmail = {
      id: crypto.randomUUID(),
      to,
      subject,
      body,
      token,
      tokenHash,
      expiresAt,
      sentAt: new Date(),
    };

    if (!this.mockInbox.has(to)) {
      this.mockInbox.set(to, []);
    }

    this.mockInbox.get(to)!.push(email);

    console.log(
      `[DevTools] Stored mock email for ${to}, token: ${token.substring(0, 8)}...`
    );

    return email;
  }

  /**
   * Get all mock emails for an email address
   * Returns sorted by sentAt (newest first)
   */
  getMockEmails(email: string): MockEmail[] {
    this.assertEnabled();

    const emails = this.mockInbox.get(email) || [];
    return emails.sort(
      (a, b) => b.sentAt.getTime() - a.sentAt.getTime()
    );
  }

  /**
   * Get a single mock email by ID
   */
  getMockEmail(id: string): MockEmail | null {
    this.assertEnabled();

    for (const emails of this.mockInbox.values()) {
      const email = emails.find((e) => e.id === id);
      if (email) return email;
    }

    return null;
  }

  /**
   * Clear all mock emails from all users
   */
  clearMockInbox(): void {
    this.assertEnabled();
    const count = this.mockInbox.size;
    this.mockInbox.clear();
    console.log(`[DevTools] Cleared mock inbox (${count} users)`);
  }

  /**
   * Clear all mock emails for a specific user
   */
  clearUserEmails(email: string): void {
    this.assertEnabled();
    if (this.mockInbox.has(email)) {
      const count = this.mockInbox.get(email)!.length;
      this.mockInbox.delete(email);
      console.log(`[DevTools] Cleared ${count} emails for ${email}`);
    }
  }

  /**
   * Get total count of stored mock emails
   */
  getEmailCount(): number {
    let total = 0;
    for (const emails of this.mockInbox.values()) {
      total += emails.length;
    }
    return total;
  }

  /**
   * Get all unique email addresses with stored mails
   */
  getEmailAddresses(): string[] {
    return Array.from(this.mockInbox.keys());
  }
}
