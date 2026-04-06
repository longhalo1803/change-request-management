/**
 * Projects Pool for Mock Data
 */

export const PROJECTS = [
  { id: "proj-001", name: "Project Alpha - CMS" },
  { id: "proj-002", name: "Project Beta - Mobile" },
  { id: "proj-003", name: "Project Gamma - Web" },
  { id: "proj-004", name: "Project Delta - API" },
  { id: "proj-005", name: "Project Epsilon - Analytics" },
];

export const ISSUE_TYPES = [
  { label: "📋 Change Request", value: "Change Request" },
  { label: "🐛 Bug", value: "Bug" },
  { label: "✨ Feature", value: "Feature" },
  { label: "📚 Documentation", value: "Documentation" },
  { label: "⚡ Performance", value: "Performance" },
];

export const getRandomProject = () =>
  PROJECTS[Math.floor(Math.random() * PROJECTS.length)];

export const getRandomIssueType = () =>
  ISSUE_TYPES[Math.floor(Math.random() * ISSUE_TYPES.length)];
