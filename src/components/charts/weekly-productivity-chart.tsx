import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTaskStore } from "@/store/taskStore";
import { format, subDays } from "date-fns";

export function WeeklyProductivityChart() {
  const tasks = useTaskStore((s) => s.tasks);

  // Build weekly productivity from actual tasks
  const weeklyProductivity = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayTasks = tasks.filter((t) => t.createdAt?.startsWith(dateStr));
    const completed = dayTasks.filter((t) => t.status === "done").length;
    const created = dayTasks.length;
    return {
      date: format(date, "EEE"),
      completed,
      created,
    };
  });

  const hasData = weeklyProductivity.some((d) => d.completed > 0 || d.created > 0);

  if (!hasData) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No activity yet. Create and complete tasks to see productivity.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={weeklyProductivity} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--popover))",
            fontSize: 13,
          }}
        />
        <Line type="monotone" dataKey="completed" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3 }} name="Completed" />
        <Line type="monotone" dataKey="created" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} name="Created" />
      </LineChart>
    </ResponsiveContainer>
  );
}
