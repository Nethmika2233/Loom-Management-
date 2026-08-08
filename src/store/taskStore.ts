import { create } from "zustand";
import { mockTasks } from "@/mock";
import type { Task, TaskStatus } from "@/types";

interface TaskState {
  tasks: Task[];
  getTasksByBoard: (boardId: string) => Task[];
  moveTask: (taskId: string, columnId: string, status: TaskStatus, order: number) => void;
  reorderColumn: (columnId: string, orderedIds: string[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addComment: (taskId: string, content: string, authorId: string) => void;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: mockTasks,
  getTasksByBoard: (boardId) => get().tasks.filter((t) => t.boardId === boardId),
  moveTask: (taskId, columnId, status, order) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId, status, order, updatedAt: new Date().toISOString() } : t
      ),
    })),
  reorderColumn: (_columnId, orderedIds) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        const idx = orderedIds.indexOf(t.id);
        return idx === -1 ? t : { ...t, order: idx };
      }),
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  toggleChecklistItem: (taskId, itemId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
            }
          : t
      ),
    })),
  addComment: (taskId, content, authorId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                { id: `c${Date.now()}`, authorId, content, createdAt: new Date().toISOString() },
              ],
            }
          : t
      ),
    })),
}));
