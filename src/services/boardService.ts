import API from "./api";
import type { Board } from "@/types";

// Map MongoDB doc -> frontend Board shape
const mapBoard = (b: any): Board => ({
  ...b,
  id: b._id ?? b.id,
  columns: (b.columns ?? []).map((c: any, i: number) => ({
    ...c,
    id: c.id ?? `${b._id ?? b.id}-col${i}`,
    boardId: c.boardId ?? b._id ?? b.id,
  })),
  memberIds: b.memberIds ?? [],
});

export const boardService = {
  async getBoards(): Promise<Board[]> {
    const res = await API.get("/boards");
    return res.data.map(mapBoard);
  },
  async getBoard(id: string): Promise<Board | undefined> {
    const res = await API.get(`/boards/${id}`);
    return mapBoard(res.data);
  },
  async createBoard(data: Partial<Board>): Promise<Board> {
    const id = data.id ?? `b${Date.now()}`;
    const payload: Record<string, unknown> = { ...data, _id: id };
    delete payload.id;
    if (!payload.columns || (payload.columns as Board["columns"]).length === 0) {
      payload.columns = [
        { id: `${id}-c1`, boardId: id, title: "To Do", order: 0, color: "#94A3B8" },
        { id: `${id}-c2`, boardId: id, title: "Doing", order: 1, color: "#4F46E5" },
        { id: `${id}-c3`, boardId: id, title: "Review", order: 2, color: "#F97316" },
        { id: `${id}-c4`, boardId: id, title: "Done", order: 3, color: "#16A34A" },
      ];
    }
    const res = await API.post("/boards", payload);
    return mapBoard(res.data);
  },
  async updateBoard(id: string, updates: Partial<Board>): Promise<Board | undefined> {
    const payload = { ...updates };
    delete (payload as { id?: string }).id;
    const res = await API.put(`/boards/${id}`, payload);
    return mapBoard(res.data);
  },
  async deleteBoard(id: string): Promise<void> {
    await API.delete(`/boards/${id}`);
  },
};
