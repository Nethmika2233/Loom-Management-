import { AtSign, Bell, CalendarClock, MessageSquare, UserPlus, UserSquare2 } from "lucide-react";
import type { NotificationType } from "@/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<NotificationType, { icon: typeof Bell; className: string }> = {
  task_assigned: { icon: UserSquare2, className: "bg-primary-50 text-primary-600 dark:bg-primary-500/10" },
  task_updated: { icon: Bell, className: "bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10" },
  comment_added: { icon: MessageSquare, className: "bg-warning-50 text-warning-600 dark:bg-warning-500/10" },
  mention: { icon: AtSign, className: "bg-danger-50 text-danger-600 dark:bg-danger-500/10" },
  deadline_reminder: { icon: CalendarClock, className: "bg-danger-50 text-danger-600 dark:bg-danger-500/10" },
  board_invitation: { icon: UserPlus, className: "bg-success-50 text-success-600 dark:bg-success-500/10" },
};

export function NotificationIcon({ type }: { type: NotificationType }) {
  const { icon: Icon, className } = CONFIG[type];
  return (
    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10", className)}>
      <Icon className="h-4 w-4" />
    </div>
  );
}
