import { create } from "zustand";
import { mockBoards } from "@/mock";
import type { Board } from "@/types";

interface BoardState {
  boards: Board[];
  toggleFavorite: (id: string) => void;
  archiveBoard: (id: string) => void;
  deleteBoard: (id: string) => void;
  duplicateBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  createBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
}

export const useBoardStore = create<BoardState>()((set) => ({
  boards: mockBoards,
  toggleFavorite: (id) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)),
    })),
  archiveBoard: (id) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, archived: !b.archived } : b)),
    })),
  deleteBoard: (id) =>
    set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
  duplicateBoard: (id) =>
    set((state) => {
      const board = state.boards.find((b) => b.id === id);
      if (!board) return state;
      const copy: Board = {
        ...board,
        id: `b${Date.now()}`,
        name: `${board.name} (Copy)`,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { boards: [copy, ...state.boards] };
    }),
  renameBoard: (id, name) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, name } : b)),
    })),
  createBoard: (board) => set((state) => ({ boards: [board, ...state.boards] })),
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)),
    })),
}));
