import { differenceInCalendarDays, format, isPast, isToday } from "date-fns";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export function DueDateBadge({ dueDate, done }: { dueDate?: string; done?: boolean }) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const overdue = !done && isPast(date) && !isToday(date);
  const dueSoon = !done && !overdue && differenceInCalendarDays(date, new Date()) <= 2;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        overdue
          ? "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500"
          : dueSoon
          ? "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500"
          : "bg-muted text-muted-foreground"
      )}
    >
      <CalendarClock className="h-3 w-3" />
      {format(date, "MMM d")}
    </span>
  );
}
