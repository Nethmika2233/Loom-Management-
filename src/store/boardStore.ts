import { create } from "zustand";
import type { Board } from "@/types";
import { boardService } from "@/services/boardService";

interface BoardState {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  loadBoards: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  archiveBoard: (id: string) => void;
  deleteBoard: (id: string) => void;
  duplicateBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  createBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
}

// Fire-and-forget persistence to MongoDB (never blocks the UI)
const persist = (fn: () => Promise<unknown>) => {
  fn().catch((err) => console.error("Failed to save board to database:", err?.message || err));
};

export const useBoardStore = create<BoardState>()((set, get) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
  loadBoards: async () => {
    try {
      const boards = await boardService.getBoards();
      set({ boards });
    } catch (err) {
      console.error("Failed to load boards from database:", err);
    }
  },
  toggleFavorite: (id) => {
    const board = get().boards.find((b) => b.id === id);
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)),
    }));
    if (board) persist(() => boardService.updateBoard(id, { favorite: !board.favorite }));
  },
  archiveBoard: (id) => {
    const board = get().boards.find((b) => b.id === id);
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, archived: !b.archived } : b)),
    }));
    if (board) persist(() => boardService.updateBoard(id, { archived: !board.archived }));
  },
  deleteBoard: (id) => {
    set((state) => ({ boards: state.boards.filter((b) => b.id !== id) }));
    persist(() => boardService.deleteBoard(id));
  },
  duplicateBoard: (id) => {
    const board = get().boards.find((b) => b.id === id);
    if (!board) return;
    const copy: Board = {
      ...board,
      id: `b${Date.now()}`,
      name: `${board.name} (Copy)`,
      favorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ boards: [copy, ...state.boards] }));
    persist(() => boardService.createBoard(copy));
  },
  renameBoard: (id, name) => {
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, name } : b)),
    }));
    persist(() => boardService.updateBoard(id, { name }));
  },
  createBoard: (board) => {
    set((state) => ({ boards: [board, ...state.boards] }));
    persist(() => boardService.createBoard(board));
  },
  updateBoard: (id, updates) => {
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)),
    }));
    persist(() => boardService.updateBoard(id, updates));
  },
}));
