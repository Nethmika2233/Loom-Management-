import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Mail, MailOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { NotificationIcon } from "@/components/notifications/notification-icon";
import { useNotificationStore } from "@/store/notificationStore";
import { formatNotificationTime } from "@/lib/notifications";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread" | "read";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

export default function Notifications() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = useNotificationStore((s) => s.unreadCount());
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAsUnread = useNotificationStore((s) => s.markAsUnread);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === "all" || (filter === "unread" && !notification.read) || (filter === "read" && notification.read);
      const matchesSearch =
        !normalizedQuery ||
        `${notification.title} ${notification.description}`.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, notifications, query]);

  const read = notifications.length - unread;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay up to date with your team's activity.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unread === 0}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-bold">{notifications.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Unread</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">{unread}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">Resolved</p>
          <p className="mt-1 text-2xl font-bold">{read}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search notifications"
            className="pl-9"
            placeholder="Search notifications"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              variant={filter === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here." />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState icon={Search} title="No matching notifications" description="Try another search or filter." />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "group flex items-start gap-3 p-4 transition-colors hover:bg-muted/50",
                !notification.read && "bg-primary-50/50 dark:bg-primary-500/5"
              )}
            >
              <NotificationIcon type={notification.type} />
              <Link to={notification.link ?? "#"} onClick={() => markAsRead(notification.id)} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  {!notification.read && <Badge variant="info">New</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatNotificationTime(notification.createdAt)}
                </p>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)
                }
              >
                {notification.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                {notification.read ? "Unread" : "Read"}
              </Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
