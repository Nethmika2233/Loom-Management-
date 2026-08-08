import { create } from "zustand";
import { mockNotifications } from "@/mock";
import { notificationService } from "@/services/notificationService";
import type { AppNotification } from "@/types";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: () => number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  // seed with mock data for immediate UI responsiveness
  notifications: mockNotifications,
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      const updated = await notificationService.getNotifications();
      set(() => ({ notifications: updated }));
    } catch (e) {
      // fallback: mark locally if service fails
      set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
    }
  },
  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const updated = await notificationService.getNotifications();
      set(() => ({ notifications: updated }));
    } catch (e) {
      set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) }));
    }
  },
}));
