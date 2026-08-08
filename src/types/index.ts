export type ID = string;

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "doing" | "review" | "done";
export type UserRole = "admin" | "manager" | "member" | "viewer";
export type OnlineStatus = "online" | "away" | "offline";

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department: string;
  status: OnlineStatus;
  bio?: string;
  title?: string;
  joinedAt: string;
}

export interface Label {
  id: ID;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: ID;
  text: string;
  done: boolean;
}

export interface Comment {
  id: ID;
  authorId: ID;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: ID;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ActivityLogEntry {
  id: ID;
  actorId: ID;
  action: string;
  target?: string;
  createdAt: string;
}

export interface Task {
  id: ID;
  boardId: ID;
  columnId: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  assigneeIds: ID[];
  labelIds: ID[];
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  activity: ActivityLogEntry[];
  estimatedHours?: number;
  loggedHours?: number;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Column {
  id: ID;
  boardId: ID;
  title: string;
  order: number;
  color: string;
}

export interface Board {
  id: ID;
  name: string;
  description?: string;
  workspaceId: ID;
  columns: Column[];
  memberIds: ID[];
  favorite: boolean;
  archived: boolean;
  color: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: ID;
  name: string;
  slug: string;
  logoColor: string;
}

export type NotificationType =
  | "task_assigned"
  | "task_updated"
  | "comment_added"
  | "mention"
  | "deadline_reminder"
  | "board_invitation";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  description: string;
  actorId?: ID;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DailyProductivity {
  date: string;
  completed: number;
  created: number;
}
