/**
 * Change Request Data Generator
 */

import { ChangeRequest, CrStatus } from "@/lib/types";
import { AdminUser } from "@/lib/types";
import { generateCRDescription } from "./common";

type Priority = "low" | "medium" | "high" | "critical";

interface CRGeneratorOptions {
  id: string;
  title: string;
  status: CrStatus;
  priority: Priority;
  createdBy: AdminUser;
  createdDate: Date;
  project: string;
}

/**
 * Generate a single Change Request
 */
export const generateChangeRequest = (
  options: CRGeneratorOptions
): ChangeRequest => {
  return {
    id: options.id,
    title: options.title,
    description: generateCRDescription(),
    status: options.status,
    priority: options.priority,
    customerId: options.createdBy.id,
    createdBy: {
      id: options.createdBy.id,
      fullName: `${options.createdBy.firstName} ${options.createdBy.lastName}`,
      email: options.createdBy.email,
    },
    createdAt: options.createdDate.toISOString(),
    updatedAt: options.createdDate.toISOString(),
    attachments: [],
    comments: [],
  };
};

/**
 * Get random priority
 */
export const getRandomPriority = (): Priority => {
  const priorities: Priority[] = ["low", "medium", "high", "critical"];
  return priorities[Math.floor(Math.random() * priorities.length)];
};
