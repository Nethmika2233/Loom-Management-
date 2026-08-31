import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { PriorityBadge } from "@/components/common/priority-badge";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export function MonthView({ month, tasks, onTaskClick, onDayClick, selectedDay }: { month: Date; tasks: Task[]; onTaskClick: (task: Task) => void; onDayClick?: (day: Date) => void; selectedDay?: Date | null }) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));

  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const tasksForDay = (day: Date) => tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayTasks = tasksForDay(day);
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "min-h-[110px] cursor-pointer border-b border-r border-border p-1.5 transition-colors last:border-r-0 hover:bg-muted/50",
                !isSameMonth(day, month) && "bg-muted/30 text-muted-foreground/50",
                selectedDay && isSameDay(day, selectedDay) && "bg-primary-50 ring-1 ring-inset ring-primary-300 dark:bg-primary-500/10"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday(day) && "bg-primary-600 text-white"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="block w-full truncate rounded-md bg-primary-50 px-1.5 py-0.5 text-left text-[11px] font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400"
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 3 && <p className="px-1.5 text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
