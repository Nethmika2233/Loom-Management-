import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { NotificationIcon } from "@/components/notifications/notification-icon";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay up to date with your team's activity.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here." />
      ) : (
        <Card className="divide-y divide-border">
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={n.link ?? "#"}
              onClick={() => markAsRead(n.id)}
              className={cn("flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors", !n.read && "bg-primary-50/40 dark:bg-primary-500/5")}
            >
              <NotificationIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-600" />}
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
