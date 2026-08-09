import React, { useMemo, useState } from "react";
import { Award, CheckCircle2, TrendingUp, Zap, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProjectProgressChart } from "@/components/charts/project-progress-chart";
import { TaskStatusPieChart } from "@/components/charts/task-status-pie-chart";
import { CompletionRateChart } from "@/components/charts/completion-rate-chart";
import { MemberActivityChart } from "@/components/charts/member-activity-chart";
import { WeeklyProductivityChart } from "@/components/charts/weekly-productivity-chart";
import { useTaskStore } from "@/store/taskStore";
import { motion } from "framer-motion";

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);
  const [timeRange, setTimeRange] = useState("30d");

  // Memoized calculations to optimize rendering performance
  const { totalTasks, completedTasks, completionRate } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;
    return { totalTasks: total, completedTasks: completed, completionRate: rate };
  }, [tasks]);

  // Framer Motion variants for a smooth, staggered load effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 bg-slate-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-300 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#141e30]">
            Analytics Overview
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Deep insights into your team's performance and project trajectory.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-0">
          {/* Time Range Context Selector */}
          <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
            <Calendar className="h-4 w-4 text-[#243b55]" />
            <select
              className="bg-transparent outline-none cursor-pointer focus:ring-0"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
            </select>
          </div>

          <button className="flex items-center gap-2 rounded-md bg-[#141e30] px-5 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#243b55] hover:text-white transition-all shadow-md focus:ring-2 focus:ring-[#D4AF37] focus:outline-none">
            <Download className="h-4 w-4" />
            Download Data
          </button>
        </div>
      </motion.div>

      {/* Top Level Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Completion Rate"
          value={completionRate}
          suffix="%"
          trend={6}
          icon={CheckCircle2}
          accent="bg-[#141e30]/10 text-[#141e30]" 
        />
        <StatCard
          label="Avg. Productivity"
          value={78}
          suffix="%"
          trend={4}
          icon={TrendingUp}
          accent="bg-slate-200 text-slate-700" 
        />
        <StatCard
          label="Tasks Closed"
          value={completedTasks}
          trend={11}
          icon={Zap}
          accent="bg-[#243b55]/10 text-[#243b55]" 
        />
        <StatCard
          label="Top Performer"
          value={31}
          suffix=" tasks"
          icon={Award}
          accent="bg-[#D4AF37]/15 text-[#b5952f]" 
        />
      </motion.div>

      {/* Primary Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-t-4 border-t-[#141e30] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#141e30]">Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ProjectProgressChart />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#243b55] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#141e30]">Task Distribution</CardTitle>
            <Filter className="h-4 w-4 text-slate-400 cursor-pointer hover:text-[#141e30] transition-colors" />
          </CardHeader>
          <CardContent className="pt-4">
            <TaskStatusPieChart />
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Trend Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-t-4 border-t-slate-400 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700">Completion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionRateChart />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-slate-400 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyProductivityChart />
          </CardContent>
        </Card>
      </motion.div>

      {/* Full Width Activity Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border-t-4 border-t-[#D4AF37] shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#141e30]">Team Activity Metrics</CardTitle>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b5952f] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                Live Overview
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <MemberActivityChart />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}