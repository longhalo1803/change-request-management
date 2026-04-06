import { AppDataSource } from "@/config/database";
import { Project } from "@/entities/project.entity";
import { Space } from "@/entities/project.entity";
import { Sprint } from "@/entities/project.entity";
import { ChangeRequest } from "@/entities/change-request.entity";
import { User, UserRole } from "@/entities/user.entity";
import { TaskStatus } from "@/entities/task-lookup.entity";
import { TaskPriority } from "@/entities/task-lookup.entity";
import { TaskWorktype } from "@/entities/task-lookup.entity";
import { ChangeRequestStatusHistory } from "@/entities/change-request.entity";
import { logger } from "./logger";

/**
 * Seed Test Data Script
 *
 * Creates test data for development:
 * - 1 test project with multiple spaces
 * - 1 sprint
 * - 14 test change requests (tasks) with full workflow history
 * - All tasks assigned to PM user
 * - Full status history: DRAFT → SUBMITTED → IN_DISCUSSION → APPROVED → IN_PROGRESS → COMPLETED → CLOSED
 *
 * Usage: ts-node -r tsconfig-paths/register src/utils/seed-test-data.ts
 */

const seedTestData = async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    logger.info("Database connected");

    const entityManager = AppDataSource.manager;

    // Get users
    const adminUser = await entityManager.findOne(User, {
      where: { role: UserRole.ADMIN },
    });
    const pmUser = await entityManager.findOne(User, {
      where: { role: UserRole.PM },
    });
    const customerUser = await entityManager.findOne(User, {
      where: { role: UserRole.CUSTOMER },
    });

    if (!pmUser || !adminUser || !customerUser) {
      throw new Error(
        "Required users not found. Please run seed-users.ts first."
      );
    }

    // Get lookup data
    const statuses = await entityManager.find(TaskStatus);
    const priorities = await entityManager.find(TaskPriority);
    const worktypes = await entityManager.find(TaskWorktype);

    if (
      statuses.length === 0 ||
      priorities.length === 0 ||
      worktypes.length === 0
    ) {
      throw new Error(
        "Required lookup data not found. Ensure migrations have run."
      );
    }

    // Create test project
    const existingProject = await entityManager.findOne(Project, {
      where: { projectKey: "TEST" },
    });
    if (existingProject) {
      logger.info("Test project already exists, skipping creation");
      process.exit(0);
    }

    const project = new Project();
    project.name = "Test Development Project";
    project.description =
      "Project for testing change request management system";
    project.projectKey = "TEST";
    project.owner = adminUser;
    await entityManager.save(project);
    logger.info("Created test project");

    // Create test spaces
    const space1 = new Space();
    space1.name = "Backend Development";
    space1.description = "Backend API and database work";
    space1.project = project;
    await entityManager.save(space1);

    const space2 = new Space();
    space2.name = "Frontend Development";
    space2.description = "Frontend UI and UX work";
    space2.project = project;
    await entityManager.save(space2);

    logger.info("Created test spaces");

    // Create test sprint
    const today = new Date();
    const sprintStart = new Date(today);
    sprintStart.setDate(today.getDate() - 7);
    const sprintEnd = new Date(today);
    sprintEnd.setDate(today.getDate() + 14);

    const sprint = new Sprint();
    sprint.name = "Sprint 1 - Test Sprint";
    sprint.description = "First test sprint for validation";
    sprint.space = space1;
    sprint.startDate = sprintStart;
    sprint.endDate = sprintEnd;
    sprint.status = "ACTIVE";
    await entityManager.save(sprint);
    logger.info("Created test sprint");

    // Define 14 test change requests
    const testChangeRequests = [
      {
        title: "Fix login timeout issue",
        description: "Users are being logged out after 5 minutes of inactivity",
        spaceId: space1.id,
        priorityName: "CRITICAL",
        worktypeName: "BUG",
        dueDays: 2,
      },
      {
        title: "Add database connection pooling",
        description:
          "Implement connection pooling to improve database performance",
        spaceId: space1.id,
        priorityName: "HIGH",
        worktypeName: "IMPROVEMENT",
        dueDays: 5,
      },
      {
        title: "Create API documentation",
        description: "Document all REST API endpoints with OpenAPI/Swagger",
        spaceId: space1.id,
        priorityName: "MEDIUM",
        worktypeName: "DOCUMENTATION",
        dueDays: 7,
      },
      {
        title: "Implement user role validation",
        description:
          "Add validation to ensure users can only access permitted endpoints",
        spaceId: space1.id,
        priorityName: "HIGH",
        worktypeName: "FEATURE",
        dueDays: 5,
      },
      {
        title: "Write unit tests for auth module",
        description: "Achieve 80% code coverage for authentication module",
        spaceId: space1.id,
        priorityName: "MEDIUM",
        worktypeName: "TESTING",
        dueDays: 5,
      },
      {
        title: "Fix null pointer exception in reports",
        description: "Fix NPE when generating reports with empty datasets",
        spaceId: space1.id,
        priorityName: "HIGH",
        worktypeName: "BUG",
        dueDays: 3,
      },
      {
        title: "Implement audit logging",
        description: "Log all user actions for compliance and debugging",
        spaceId: space1.id,
        priorityName: "MEDIUM",
        worktypeName: "FEATURE",
        dueDays: 10,
      },
      {
        title: "Fix responsive design issues on mobile",
        description: "Fix layout issues on screens smaller than 768px",
        spaceId: space2.id,
        priorityName: "MEDIUM",
        worktypeName: "BUG",
        dueDays: 4,
      },
      {
        title: "Implement dark mode",
        description: "Add dark mode theme for user interface",
        spaceId: space2.id,
        priorityName: "LOW",
        worktypeName: "FEATURE",
        dueDays: 14,
      },
      {
        title: "Update design system documentation",
        description: "Document all UI components and design tokens",
        spaceId: space2.id,
        priorityName: "LOW",
        worktypeName: "DOCUMENTATION",
        dueDays: 10,
      },
      {
        title: "Improve form validation UX",
        description: "Show validation errors inline as user types",
        spaceId: space2.id,
        priorityName: "MEDIUM",
        worktypeName: "IMPROVEMENT",
        dueDays: 5,
      },
      {
        title: "Performance testing and optimization",
        description: "Run performance tests and optimize slow endpoints",
        spaceId: space2.id,
        priorityName: "HIGH",
        worktypeName: "TESTING",
        dueDays: 8,
      },
      {
        title: "Implement internationalization (i18n)",
        description: "Support multiple languages in the application",
        spaceId: space2.id,
        priorityName: "MEDIUM",
        worktypeName: "FEATURE",
        dueDays: 14,
      },
      {
        title: "Security audit and fix vulnerabilities",
        description:
          "Perform security audit and fix identified vulnerabilities",
        spaceId: space2.id,
        priorityName: "CRITICAL",
        worktypeName: "IMPROVEMENT",
        dueDays: 3,
      },
    ];

    // Create change requests and status history
    for (let i = 0; i < testChangeRequests.length; i++) {
      const crData = testChangeRequests[i];
      const priority = priorities.find((p) => p.name === crData.priorityName);
      const worktype = worktypes.find((w) => w.name === crData.worktypeName);
      const draftStatus = statuses.find((s) => s.name === "DRAFT");

      if (!priority || !worktype || !draftStatus) {
        throw new Error("Lookup data not found");
      }

      // Create change request
      const cr = new ChangeRequest();
      cr.title = crData.title;
      cr.description = crData.description;
      cr.crKey = `TEST-${1001 + i}`;
      cr.space = space1; // All in first space for testing
      cr.sprint = i < 7 ? sprint : null; // First 7 in sprint
      cr.status = draftStatus;
      cr.priority = priority;
      cr.worktype = worktype;
      cr.creator = customerUser;
      cr.createdBy = customerUser.id;
      cr.assignee = pmUser;
      cr.assignedTo = pmUser.id;

      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + crData.dueDays);
      cr.dueDate = dueDate;

      cr.estimatedHours = Math.floor(Math.random() * 16) + 4; // 4-20 hours

      await entityManager.save(cr);

      // Create full status history workflow
      const statusWorkflow = [
        "DRAFT",
        "SUBMITTED",
        "IN_DISCUSSION",
        "APPROVED",
        "IN_PROGRESS",
        "COMPLETED",
        "CLOSED",
      ];
      let previousStatus = draftStatus;

      for (let j = 1; j < statusWorkflow.length; j++) {
        const newStatus = statuses.find((s) => s.name === statusWorkflow[j]);
        if (newStatus) {
          const history = new ChangeRequestStatusHistory();
          history.changeRequest = cr;
          history.status = newStatus;
          history.changedByUser = pmUser;
          history.changedBy = pmUser.id;
          history.notes = `Transitioned to ${statusWorkflow[j]}`;
          history.createdAt = new Date(today.getTime() + j * 3600000); // Each status 1 hour apart

          await entityManager.save(history);

          // Update CR current status
          cr.status = newStatus;
          await entityManager.save(cr);
        }
      }

      logger.info(
        `Created change request: ${cr.crKey} with full status history`
      );
    }

    logger.info("✅ Test data seeding completed successfully");
    logger.info(
      `Created 14 test change requests with full workflow history (DRAFT → SUBMITTED → IN_DISCUSSION → APPROVED → IN_PROGRESS → COMPLETED → CLOSED)`
    );
    process.exit(0);
  } catch (error) {
    logger.error("Seed failed:", error);
    process.exit(1);
  }
};

seedTestData();
