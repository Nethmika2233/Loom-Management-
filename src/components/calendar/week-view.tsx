import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { PriorityBadge } from "@/components/common/priority-badge";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export function WeekView({ week, tasks, onTaskClick }: { week: Date; tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const start = startOfWeek(week);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));
        return (
          <div key={day.toISOString()} className={cn("rounded-xl border border-border p-3", isToday(day) && "border-primary-400 bg-primary-50/40 dark:bg-primary-500/5")}>
            <p className="text-xs font-semibold text-muted-foreground">{format(day, "EEE")}</p>
            <p className={cn("text-lg font-bold", isToday(day) && "text-primary-600")}>{format(day, "d")}</p>
            <div className="mt-2 space-y-1.5">
              {dayTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="block w-full rounded-lg border border-border bg-card p-2 text-left hover:shadow-card transition-shadow"
                >
                  <p className="truncate text-xs font-medium">{ task.title }</p>
                  <div className="mt-1">
                    <PriorityBadge priority={task.priority} />
                  </div>
                </button>
              ))}
              {dayTasks.length === 0 && <p className="text-xs text-muted-foreground/60">No tasks</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
