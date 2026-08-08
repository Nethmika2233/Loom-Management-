import { mockTasks } from "@/mock";
import type { Task } from "@/types";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

let tasks = [...mockTasks];

export const taskService = {
  async getTasksByBoard(boardId: string): Promise<Task[]> {
    await delay();
    return tasks.filter((t) => t.boardId === boardId);
  },
  async getAllTasks(): Promise<Task[]> {
    await delay();
    return tasks;
  },
  async getTask(id: string): Promise<Task | undefined> {
    await delay();
    return tasks.find((t) => t.id === id);
  },
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    await delay(100);
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    return tasks.find((t) => t.id === id);
  },
  async moveTask(id: string, columnId: string, status: Task["status"]): Promise<void> {
    await delay(80);
    tasks = tasks.map((t) => (t.id === id ? { ...t, columnId, status, updatedAt: new Date().toISOString() } : t));
  },
  async createTask(data: Partial<Task>): Promise<Task> {
    await delay();
    const newTask: Task = {
      id: `t${Date.now()}`,
      boardId: data.boardId!,
      columnId: data.columnId!,
      title: data.title ?? "Untitled task",
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      assigneeIds: data.assigneeIds ?? [],
      labelIds: data.labelIds ?? [],
      checklist: [],
      comments: [],
      attachments: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          actorId: "u1",
          action: "created this task",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: tasks.length,
    };
    tasks = [...tasks, newTask];
    return newTask;
  },
  async deleteTask(id: string): Promise<void> {
    await delay();
    tasks = tasks.filter((t) => t.id !== id);
  },
};
