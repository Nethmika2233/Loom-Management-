import type { Priority, TaskStatus } from "@/types";

export const PRIORITY_CONFIG: Record<Priority, { label: string; className: string; dot: string }> = {
  low: { label: "Low", className: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400", dot: "bg-slate-400" },
  medium: { label: "Medium", className: "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-400", dot: "bg-secondary-500" },
  high: { label: "High", className: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500", dot: "bg-warning-500" },
  urgent: { label: "Urgent", className: "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500", dot: "bg-danger-500" },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400" },
  doing: { label: "Doing", className: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" },
  review: { label: "Review", className: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500" },
  done: { label: "Done", className: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500" },
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Boards", href: "/boards", icon: "Trello" },
  { label: "Calendar", href: "/calendar", icon: "CalendarDays" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Team", href: "/team", icon: "Users" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
] as const;

export const SETTINGS_NAV = [
  { label: "General", href: "/settings" },
  { label: "Appearance", href: "/settings/appearance" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Privacy", href: "/settings/privacy" },
  { label: "Accessibility", href: "/settings/accessibility" },
] as const;
