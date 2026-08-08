import { AlertTriangle, CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { TaskStatusPieChart } from "@/components/charts/task-status-pie-chart";
import { WeeklyProductivityChart } from "@/components/charts/weekly-productivity-chart";
import { TasksPerDayChart } from "@/components/charts/tasks-per-day-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BoardListWidget } from "@/components/dashboard/board-list-widget";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useTaskStore } from "@/store/taskStore";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { isPast, isToday } from "date-fns";

export default function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const boards = useBoardStore((s) => s.boards);
  const user = useUserStore((s) => s.user);

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "doing").length;
  const overdue = tasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)) && t.status !== "done").length;
  const productivity = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across your projects today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Projects" value={boards.filter((b) => !b.archived).length} icon={ListTodo} accent="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" delay={0} />
        <StatCard label="Total Tasks" value={totalTasks} icon={ListTodo} accent="bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400" delay={0.03} />
        <StatCard label="Completed" value={completed} trend={12} icon={CheckCircle2} accent="bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" delay={0.06} />
        <StatCard label="In Progress" value={inProgress} icon={Clock} accent="bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" delay={0.09} />
        <StatCard label="Overdue" value={overdue} trend={-4} invertTrend icon={AlertTriangle} accent="bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500" delay={0.12} />
        <StatCard label="Productivity" value={productivity} suffix="%" trend={8} icon={TrendingUp} accent="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyProductivityChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusPieChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksPerDayChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentActivity />
        <BoardListWidget title="Recent Boards" />
        <BoardListWidget title="Favorite Boards" favoritesOnly />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingTasks />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
