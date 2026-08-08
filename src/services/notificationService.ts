import { mockNotifications } from "@/mock";
import type { AppNotification } from "@/types";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

let notifications = [...mockNotifications];

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    await delay();
    return notifications;
  },
  async markAsRead(id: string): Promise<void> {
    await delay(80);
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  },
  async markAllAsRead(): Promise<void> {
    await delay(80);
    notifications = notifications.map((n) => ({ ...n, read: true }));
  },
};
