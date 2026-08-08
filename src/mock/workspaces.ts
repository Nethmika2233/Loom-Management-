import type { Workspace } from "@/types";

export const mockWorkspaces: Workspace[] = [
  { id: "w1", name: "Loom Inc.", slug: "loom", logoColor: "#4F46E5" },
  { id: "w2", name: "Acme Startup", slug: "acme", logoColor: "#06B6D4" },
  { id: "w3", name: "Personal", slug: "personal", logoColor: "#F97316" },
];

export const currentWorkspace = mockWorkspaces[0];
