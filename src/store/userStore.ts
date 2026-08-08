import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentUser } from "@/mock";
import type { User } from "@/types";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: currentUser,
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : state.user })),
    }),
    { name: "loop-user" }
  )
);
