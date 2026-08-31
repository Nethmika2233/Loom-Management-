import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTaskStore } from "@/store/taskStore";

export function CompletionRateChart() {
  const tasks = useTaskStore((s) => s.tasks);

  // Build completion rate trend from actual tasks
  // Group tasks by month and calculate completion rate
  const monthlyData: Record<string, { total: number; completed: number }> = {};
  tasks.forEach((task) => {
    const month = task.createdAt?.slice(0, 7) || "Unknown";
    if (!monthlyData[month]) monthlyData[month] = { total: 0, completed: 0 };
    monthlyData[month].total++;
    if (task.status === "done") monthlyData[month].completed++;
  });

  const completionRateTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month,
      rate: data.total ? Math.round((data.completed / data.total) * 100) : 0,
    }));

  if (completionRateTrend.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No data yet. Complete tasks to see trends.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={completionRateTrend} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", fontSize: 13 }} />
        <Area type="monotone" dataKey="rate" stroke="#4F46E5" strokeWidth={2.5} fill="url(#completionGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
