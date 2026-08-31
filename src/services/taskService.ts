import API from "./api";
import type { Task } from "@/types";

// Map MongoDB doc -> frontend Task shape
const mapTask = (t: any): Task => ({
  ...t,
  id: t._id ?? t.id,
  checklist: t.checklist ?? [],
  comments: t.comments ?? [],
  attachments: t.attachments ?? [],
  activity: t.activity ?? [],
  assigneeIds: t.assigneeIds ?? [],
  labelIds: t.labelIds ?? [],
  order: t.order ?? 0,
});

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const res = await API.get("/tasks");
    return res.data.map(mapTask);
  },
  async getTasksByBoard(boardId: string): Promise<Task[]> {
    const res = await API.get("/tasks", { params: { boardId } });
    return res.data.map(mapTask);
  },
  async getTask(id: string): Promise<Task | undefined> {
    const res = await API.get(`/tasks/${id}`).catch(() => null);
    return res?.data ? mapTask(res.data) : undefined;
  },
  async createTask(data: Partial<Task>): Promise<Task> {
    const id = data.id ?? `t${Date.now()}`;
    const payload: Record<string, unknown> = { ...data, _id: id };
    delete payload.id;
    const res = await API.post("/tasks", payload);
    return mapTask(res.data);
  },
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const payload = { ...updates };
    delete (payload as { id?: string }).id;
    const res = await API.put(`/tasks/${id}`, payload);
    return mapTask(res.data);
  },
  async moveTask(id: string, columnId: string, status: Task["status"], order?: number): Promise<void> {
    await API.put(`/tasks/${id}`, { columnId, status, ...(order !== undefined ? { order } : {}) });
  },
  async deleteTask(id: string): Promise<void> {
    await API.delete(`/tasks/${id}`);
  },
};
