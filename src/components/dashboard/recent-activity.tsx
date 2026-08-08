import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers, mockTasks } from "@/mock";
import { getInitials } from "@/lib/utils";

const recentItems = mockTasks
  .flatMap((t) => t.activity.map((a) => ({ ...a, taskTitle: t.title })))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 6);

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentItems.map((item) => {
          const actor = mockUsers.find((u) => u.id === item.actorId);
          if (!actor) return null;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={actor.avatarUrl} alt={actor.name} />
                <AvatarFallback className="text-[10px]">{getInitials(actor.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{actor.name}</span> <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span className="font-medium">{item.taskTitle}</span>
                </p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
