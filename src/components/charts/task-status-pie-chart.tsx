import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTaskStore } from "@/store/taskStore";

export function TaskStatusPieChart() {
  const tasks = useTaskStore((s) => s.tasks);

  // Build chart data from actual tasks
  const taskStatusDistribution = [
    { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#94A3B8" },
    { name: "Doing", value: tasks.filter((t) => t.status === "doing").length, color: "#4F46E5" },
    { name: "Review", value: tasks.filter((t) => t.status === "review").length, color: "#F97316" },
    { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#16A34A" },
  ].filter((d) => d.value > 0);

  if (taskStatusDistribution.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No tasks yet. Create tasks to see distribution.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={taskStatusDistribution}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          strokeWidth={0}
        >
          {taskStatusDistribution.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--popover))",
            fontSize: 13,
          }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
