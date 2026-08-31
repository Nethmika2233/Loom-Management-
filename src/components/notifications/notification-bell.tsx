import { Link } from "react-router-dom";
import { Bell, CheckCheck, Inbox } from "lucide-react";
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
import { formatNotificationTime } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = useNotificationStore((s) => s.unreadCount());
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const previewNotifications = notifications.slice(0, 6);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`${unread} unread notifications`}>
          <Bell className={cn("h-4.5 w-4.5", unread > 0 && "text-primary-600")} />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-hidden p-0 sm:w-96">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unread > 0 ? `${unread} unread update${unread === 1 ? "" : "s"}` : "All caught up"}
            </p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" /> Read all
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {previewNotifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium">No notifications yet</p>
              <p className="mx-auto mt-1 max-w-52 text-xs text-muted-foreground">
                Assignment updates, mentions, and reminders will appear here.
              </p>
            </div>
          ) : (
            previewNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild onClick={() => markAsRead(notification.id)}>
                <Link
                  to={notification.link ?? "#"}
                  className={cn(
                    "flex items-start gap-3 border-l-2 border-transparent px-3 py-3",
                    !notification.read && "border-primary-600 bg-primary-50/70 dark:bg-primary-500/10"
                  )}
                >
                  <NotificationIcon type={notification.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("truncate text-sm", notification.read ? "font-medium" : "font-semibold text-foreground")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600 ring-2 ring-primary-100 dark:ring-primary-500/20" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{notification.description}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <Link to="/notifications" className="block px-3 py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-muted">
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
