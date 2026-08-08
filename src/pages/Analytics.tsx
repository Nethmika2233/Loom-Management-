import { Award, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProjectProgressChart } from "@/components/charts/project-progress-chart";
import { TaskStatusPieChart } from "@/components/charts/task-status-pie-chart";
import { CompletionRateChart } from "@/components/charts/completion-rate-chart";
import { MemberActivityChart } from "@/components/charts/member-activity-chart";
import { WeeklyProductivityChart } from "@/components/charts/weekly-productivity-chart";
import { useTaskStore } from "@/store/taskStore";

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);
  const completed = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#141e30]">Analytics</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Deep insights into your team's performance and progress.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Completion Rate" value={completionRate} suffix="%" trend={6} icon={CheckCircle2} accent="bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" />
        <StatCard label="Avg. Productivity" value={78} suffix="%" trend={4} icon={TrendingUp} accent="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" />
        <StatCard label="Tasks Closed (30d)" value={completed} trend={11} icon={Zap} accent="bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400" />
        <StatCard label="Top Performer" value={31} suffix=" tasks" icon={Award} accent="bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectProgressChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusPieChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionRateChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyProductivityChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberActivityChart />
        </CardContent>
      </Card>
    </div>
  );
}