import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTaskStore } from "@/store/taskStore";
import { useUserStore } from "@/store/userStore";

export function MemberActivityChart() {
  const tasks = useTaskStore((s) => s.tasks);
  const currentUser = useUserStore((s) => s.user);

  // Build chart data from actual tasks
  const data = currentUser
    ? [
        {
          name: currentUser.name.split(" ")[0],
          tasks: tasks.filter((t) => (t.assigneeIds || []).includes(currentUser.id)).length,
        },
      ]
    : [];

  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No activity data yet. Create tasks to see your activity chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", fontSize: 13 }}
        />
        <Bar dataKey="tasks" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
