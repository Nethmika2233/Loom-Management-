import { Link } from "react-router-dom";
import { format, isPast, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/common/priority-badge";
import { AvatarStack } from "@/components/common/avatar-stack";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

export function UpcomingTasks() {
  const tasks = useTaskStore((s) => s.tasks);

  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== "done")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.map((task) => {
          const due = new Date(task.dueDate!);
          const overdue = isPast(due) && !isToday(due);

          return (
            <Link
              key={task.id}
              to={`/boards/${task.boardId}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/60 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className={cn("text-xs", overdue ? "text-danger-600 font-medium" : "text-muted-foreground")}>
                  {overdue ? "Overdue · " : ""}
                  {format(due, "MMM d, yyyy")}
                </p>
              </div>
              <PriorityBadge priority={task.priority} />
              <AvatarStack userIds={task.assigneeIds} max={2} />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
