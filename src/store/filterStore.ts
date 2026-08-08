import { create } from "zustand";
import type { Priority, TaskStatus } from "@/types";

interface FilterState {
  priority: Priority | "all";
  status: TaskStatus | "all";
  assigneeId: string | "all";
  labelId: string | "all";
  setPriority: (v: Priority | "all") => void;
  setStatus: (v: TaskStatus | "all") => void;
  setAssignee: (v: string) => void;
  setLabel: (v: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  priority: "all",
  status: "all",
  assigneeId: "all",
  labelId: "all",
  setPriority: (priority) => set({ priority }),
  setStatus: (status) => set({ status }),
  setAssignee: (assigneeId) => set({ assigneeId }),
  setLabel: (labelId) => set({ labelId }),
  reset: () => set({ priority: "all", status: "all", assigneeId: "all", labelId: "all" }),
}));
