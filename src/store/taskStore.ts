import { create } from "zustand";
import type { Task, TaskStatus } from "@/types";
import { taskService } from "@/services/taskService";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loadTasks: () => Promise<void>;
  getTasksByBoard: (boardId: string) => Task[];
  moveTask: (taskId: string, columnId: string, status: TaskStatus, order: number) => void;
  reorderColumn: (columnId: string, orderedIds: string[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addComment: (taskId: string, content: string, authorId: string) => void;
}

// Fire-and-forget persistence to MongoDB (never blocks the UI)
const persist = (fn: () => Promise<unknown>) => {
  fn().catch((err) => console.error("Failed to save task to database:", err?.message || err));
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  loadTasks: async () => {
    try {
      const tasks = await taskService.getAllTasks();
      set({ tasks });
    } catch (err) {
      console.error("Failed to load tasks from database:", err);
    }
  },
  getTasksByBoard: (boardId) => get().tasks.filter((t) => t.boardId === boardId),
  moveTask: (taskId, columnId, status, order) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId, status, order, updatedAt: new Date().toISOString() } : t
      ),
    }));
    persist(() => taskService.moveTask(taskId, columnId, status, order));
  },
  reorderColumn: (_columnId, orderedIds) => {
    const tasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => {
        const idx = orderedIds.indexOf(t.id);
        return idx === -1 ? t : { ...t, order: idx };
      }),
    }));
    // Persist the new order for each affected task
    orderedIds.forEach((id, idx) => persist(() => taskService.updateTask(id, { order: idx })));
  },
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    }));
    persist(() => taskService.updateTask(id, updates));
  },
  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
    persist(() => taskService.createTask(task));
  },
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    persist(() => taskService.deleteTask(id));
  },
  toggleChecklistItem: (taskId, itemId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
            }
          : t
      ),
    }));
    if (task) {
      const updatedChecklist = task.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c));
      persist(() => taskService.updateTask(taskId, { checklist: updatedChecklist }));
    }
  },
  addComment: (taskId, content, authorId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    const comment = { id: `c${Date.now()}`, authorId, content, createdAt: new Date().toISOString() };
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [...t.comments, comment],
            }
          : t
      ),
    }));
    if (task) {
      const updatedComments = [...task.comments, comment];
      persist(() => taskService.updateTask(taskId, { comments: updatedComments }));
    }
  },
}));
