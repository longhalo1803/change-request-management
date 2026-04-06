/**
 * Common Utilities for Data Generation
 */

/**
 * Generate random date between today and daysAgo days in the past
 */
export const generateRandomDate = (daysAgo: number): Date => {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  date.setDate(date.getDate() - randomDays);
  return date;
};

/**
 * Generate a fixed date (for consistent seed data)
 */
export const generateFixedDate = (
  year: number,
  month: number,
  day: number
): Date => {
  return new Date(year, month - 1, day);
};

/**
 * Generate user initials from first and last name
 */
export const generateInitials = (
  firstName: string,
  lastName: string
): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Generate phone number
 */
export const generatePhoneNumber = (baseNumber: string = "091"): string => {
  const randomPart = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `${baseNumber}${randomPart}`;
};

/**
 * Generate fixed phone number (for consistent seed data)
 */
export const generateFixedPhoneNumber = (
  areaCode: string,
  sequenceNumber: number
): string => {
  return `${areaCode}${(2000000 + sequenceNumber).toString().padStart(7, "0")}`;
};

/**
 * Generate avatar color based on name hash
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#52c41a",
    "#eb2f96",
  ];
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[hash % colors.length];
};

/**
 * Generate random CR title variations
 */
export const CR_TITLE_TEMPLATES = [
  "Update {feature} UI",
  "Fix {issue} bug in {module}",
  "Implement {feature} functionality",
  "Refactor {module} module",
  "Improve {feature} performance",
  "Add {feature} to {module}",
  "Migrate {module} to {technology}",
  "Integrate {service} with {module}",
  "Update {module} documentation",
  "Optimize {feature} loading speed",
];

export const CR_FEATURES = [
  "login page",
  "dashboard",
  "user profile",
  "settings",
  "search functionality",
  "export feature",
  "notifications",
  "analytics",
  "payment gateway",
  "authentication",
];

export const CR_MODULES = [
  "frontend",
  "backend",
  "database",
  "API",
  "cache layer",
  "logging system",
  "reporting",
];

export const CR_ISSUES = [
  "performance",
  "memory leak",
  "data validation",
  "null pointer",
  "timeout",
  "concurrent access",
  "file upload",
];

/**
 * Generate a CR title based on template
 */
export const generateCRTitle = (): string => {
  const template =
    CR_TITLE_TEMPLATES[Math.floor(Math.random() * CR_TITLE_TEMPLATES.length)];
  const feature = CR_FEATURES[Math.floor(Math.random() * CR_FEATURES.length)];
  const module = CR_MODULES[Math.floor(Math.random() * CR_MODULES.length)];
  const issue = CR_ISSUES[Math.floor(Math.random() * CR_ISSUES.length)];
  const service = ["Stripe", "SendGrid", "AWS", "Firebase"][
    Math.floor(Math.random() * 4)
  ];
  const technology = ["React", "Node.js", "PostgreSQL", "MongoDB"][
    Math.floor(Math.random() * 4)
  ];

  return template
    .replace("{feature}", feature)
    .replace("{module}", module)
    .replace("{issue}", issue)
    .replace("{service}", service)
    .replace("{technology}", technology);
};

/**
 * Generate CR description
 */
export const CR_DESCRIPTIONS = [
  "We need to update the user interface to match the new design specifications. This includes color scheme changes, layout adjustments, and improved user experience elements.",
  "There is a performance issue that needs to be addressed. Users are experiencing slow loading times, which impacts the overall system responsiveness.",
  "Please implement the new feature as per the requirements. This should include proper validation, error handling, and comprehensive documentation.",
  "The current implementation needs refactoring to improve code maintainability and reduce technical debt.",
  "We need to integrate this service to streamline our workflow and improve efficiency.",
  "Critical security vulnerability needs to be patched immediately.",
  "User feedback indicates we should improve this area. Please review and implement necessary changes.",
];

export const generateCRDescription = (): string => {
  return CR_DESCRIPTIONS[Math.floor(Math.random() * CR_DESCRIPTIONS.length)];
};
