import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { projectProgress } from "@/mock/analytics";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#16A34A", "#EC4899"];

export function ProjectProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={projectProgress} layout="vertical" margin={{ left: 12, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", fontSize: 13 }}
        />
        <Bar dataKey="progress" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {projectProgress.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
