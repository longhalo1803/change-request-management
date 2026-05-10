/**
 * Dev Tools Service
 *
 * API client for dev tools endpoints
 * Handles communication with backend dev tools
 */

import axiosInstance from "@/lib/axios";
import axios from "axios";

export interface DevEmail {
  id: string;
  to: string;
  subject: string;
  token: string;
  tokenHash: string;
  expiresAt: string;
  sentAt: string;
}

export const devToolsService = {
  /**
   * Get all mock emails for a specific email address
   */
  async getEmails(email: string): Promise<DevEmail[]> {
    try {
      const { data } = await axiosInstance.get("/dev/mock-emails", {
        params: { email },
      });
      return data.data.emails || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        // Dev tools disabled in this environment
        return [];
      }
      throw error;
    }
  },

  /**
   * Get a single mock email by ID
   */
  async getEmail(id: string): Promise<DevEmail> {
    const { data } = await axiosInstance.get(`/dev/mock-emails/${id}`);
    return data.data;
  },

  /**
   * Clear mock emails (all or for specific email)
   */
  async clearEmails(email?: string): Promise<void> {
    await axiosInstance.post("/dev/mock-emails/clear", { email });
  },

  /**
   * Generate a complete reset password link
   */
  generateResetLink(email: string, token: string): string {
    const baseUrl = window.location.origin;
    const encodedEmail = encodeURIComponent(email);
    return `${baseUrl}/reset-password?token=${token}&email=${encodedEmail}`;
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  },

  /**
   * Format email data for display
   */
  formatEmailForDisplay(email: DevEmail): DevEmail & { displayToken: string } {
    return {
      ...email,
      displayToken: email.token.substring(0, 16) + "...",
    };
  },
};
