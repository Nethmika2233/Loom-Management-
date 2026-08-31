import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#16A34A", "#EC4899"];

export function ProjectProgressChart() {
  const boards = useBoardStore((s) => s.boards);
  const tasks = useTaskStore((s) => s.tasks);

  // Build chart data from actual boards and tasks
  const projectProgress = boards.slice(0, 5).map((board) => {
    const boardTasks = tasks.filter((t) => t.boardId === board.id);
    const completed = boardTasks.filter((t) => t.status === "done").length;
    const progress = boardTasks.length ? Math.round((completed / boardTasks.length) * 100) : 0;
    return { name: board.name, progress };
  });

  if (projectProgress.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No projects yet. Create boards and tasks to see progress.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={projectProgress} layout="vertical" margin={{ left: 12, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 15)}…` : value)}
          axisLine={false}
          tickLine={false}
        />
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
