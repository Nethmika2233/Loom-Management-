import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyProductivity } from "@/mock/analytics";

export function WeeklyProductivityChart() {
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
