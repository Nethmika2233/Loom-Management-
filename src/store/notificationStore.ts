import { create } from "zustand";
import { mockNotifications } from "@/mock";
import type { AppNotification } from "@/types";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: mockNotifications,
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),
}));
