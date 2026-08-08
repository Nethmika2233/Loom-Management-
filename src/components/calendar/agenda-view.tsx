import { format, isPast, isToday } from "date-fns";
import { PriorityBadge } from "@/components/common/priority-badge";
import { AvatarStack } from "@/components/common/avatar-stack";
import { EmptyState } from "@/components/common/empty-state";
import { CalendarDays } from "lucide-react";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export function AgendaView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const sorted = tasks
    .filter((t) => t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  if (sorted.length === 0) {
    return <EmptyState icon={CalendarDays} title="No scheduled tasks" description="Tasks with due dates will appear here." />;
  }

  return (
    <div className="space-y-2">
      {sorted.map((task) => {
        const due = new Date(task.dueDate!);
        const overdue = isPast(due) && !isToday(due);
        return (
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-3.5 text-left hover:shadow-card transition-shadow"
          >
            <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-muted py-1.5">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">{format(due, "MMM")}</span>
              <span className={cn("text-lg font-bold", overdue && "text-danger-600")}>{format(due, "d")}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{task.title}</p>
              <p className="truncate text-xs text-muted-foreground">{task.description}</p>
            </div>
            <PriorityBadge priority={task.priority} />
            <AvatarStack userIds={task.assigneeIds} max={3} />
          </button>
        );
      })}
    </div>
  );
}
