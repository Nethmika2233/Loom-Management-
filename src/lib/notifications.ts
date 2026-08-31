import { isToday, isYesterday, formatDistanceToNow } from "date-fns";
import type { AppNotification } from "@/types";

export function formatNotificationTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export function getNotificationDayLabel(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Earlier";
  }

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return "Earlier";
}

export function groupNotificationsByDay(notifications: AppNotification[]) {
  return notifications.reduce<Record<string, AppNotification[]>>((groups, notification) => {
    const label = getNotificationDayLabel(notification.createdAt);
    groups[label] = [...(groups[label] ?? []), notification];
    return groups;
  }, {});
}
