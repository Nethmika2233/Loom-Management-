import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notificationStore";
import { NotificationIcon } from "@/components/notifications/notification-icon";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = useNotificationStore((s) => s.unreadCount());
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger-500 ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button onClick={markAllAsRead} className="text-xs font-medium text-primary-600 hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.slice(0, 6).map((n) => (
            <DropdownMenuItem key={n.id} asChild onClick={() => markAsRead(n.id)}>
              <Link to={n.link ?? "#"} className={cn("flex items-start gap-3 px-3 py-2.5", !n.read && "bg-primary-50/50 dark:bg-primary-500/5")}>
                <NotificationIcon type={n.type} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <Link to="/notifications" className="block px-3 py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-muted">
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
