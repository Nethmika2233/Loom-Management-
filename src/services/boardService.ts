import { mockBoards } from "@/mock";
import type { Board } from "@/types";

// NOTE: Replace bodies with real fetch("/api/boards") calls when backend is available.
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

let boards = [...mockBoards];

export const boardService = {
  async getBoards(): Promise<Board[]> {
    await delay();
    return boards;
  },
  async getBoard(id: string): Promise<Board | undefined> {
    await delay();
    return boards.find((b) => b.id === id);
  },
  async createBoard(data: Partial<Board>): Promise<Board> {
    await delay();
    const newBoard: Board = {
      id: `b${Date.now()}`,
      name: data.name ?? "Untitled Board",
      description: data.description,
      workspaceId: "w1",
      columns: [
        { id: `col-${Date.now()}-1`, boardId: `b${Date.now()}`, title: "To Do", order: 0, color: "#94A3B8" },
        { id: `col-${Date.now()}-2`, boardId: `b${Date.now()}`, title: "Doing", order: 1, color: "#4F46E5" },
        { id: `col-${Date.now()}-3`, boardId: `b${Date.now()}`, title: "Review", order: 2, color: "#F97316" },
        { id: `col-${Date.now()}-4`, boardId: `b${Date.now()}`, title: "Done", order: 3, color: "#16A34A" },
      ],
      memberIds: ["u1"],
      favorite: false,
      archived: false,
      color: "from-indigo-500 to-violet-500",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    boards = [newBoard, ...boards];
    return newBoard;
  },
  async updateBoard(id: string, updates: Partial<Board>): Promise<Board | undefined> {
    await delay();
    boards = boards.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
    return boards.find((b) => b.id === id);
  },
  async deleteBoard(id: string): Promise<void> {
    await delay();
    boards = boards.filter((b) => b.id !== id);
  },
};
