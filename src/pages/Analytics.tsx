import React, { useMemo, useState, useEffect } from "react";
import { Award, CheckCircle2, TrendingUp, Zap, Download, Calendar, Filter, RefreshCw, AlertCircle, Clock, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProjectProgressChart } from "@/components/charts/project-progress-chart";
import { TaskStatusPieChart } from "@/components/charts/task-status-pie-chart";
import { CompletionRateChart } from "@/components/charts/completion-rate-chart";
import { MemberActivityChart } from "@/components/charts/member-activity-chart";
import { WeeklyProductivityChart } from "@/components/charts/weekly-productivity-chart";
import { useTaskStore } from "@/store/taskStore";
import { motion } from "framer-motion";
import { Component, ReactNode } from "react";

// Proper React Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ChartErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const chartFallback = (
  <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
    Unable to load chart. Please try refreshing.
  </div>
);

const ChartSkeleton = () => (
  <div className="h-[260px] w-full animate-pulse rounded-md bg-slate-200"></div>
);

const EmptyStatCard = ({ label, icon: Icon }: { label: string; icon: any }) => (
  <div className="rounded-xl border border-slate-200 bg-white/50 p-6 shadow-sm opacity-70">
    <div className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-sm font-medium text-slate-500">{label}</h3>
      <Icon className="h-4 w-4 text-slate-400" />
    </div>
    <div className="mt-2 flex items-center">
      <span className="text-lg font-semibold text-slate-400">No data yet</span>
    </div>
  </div>
);

// Animated counter hook
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);
  
  const [timeRange, setTimeRange] = useState(() => {
    const savedRange = localStorage.getItem("loom-analytics-time-range");
    return savedRange ? savedRange : "30d";
  });

  useEffect(() => {
    localStorage.setItem("loom-analytics-time-range", timeRange);
  }, [timeRange]);

  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true); 
    
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
    }, 1200);
  };

  // Comprehensive Metrics Calculations
  const { totalTasks, completedTasks, completionRate, priorityBreakdown, statusBreakdown } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;

    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;

    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => {
      const status = String(t.status);
      return status === "in-progress" || status === "in_progress";
    }).length;

    return { 
      totalTasks: total, 
      completedTasks: completed, 
      completionRate: rate,
      priorityBreakdown: { high, medium, low },
      statusBreakdown: { todo, inProgress, done: completed }
    };
  }, [tasks]);

  // --- NEW: REAL CSV EXPORT FUNCTIONALITY ---
  const handleDownload = () => {
    setIsDownloading(true);
    
    setTimeout(() => {
      // Build the CSV content
      const csvHeaders = "Metric,Value\n";
      const csvRows = [
        `Total Tasks,${totalTasks}`,
        `Completed Tasks,${completedTasks}`,
        `Completion Rate,${completionRate}%`,
        `High Priority Tasks,${priorityBreakdown.high}`,
        `Medium Priority Tasks,${priorityBreakdown.medium}`,
        `Low Priority Tasks,${priorityBreakdown.low}`,
        `Tasks To Do,${statusBreakdown.todo}`,
        `Tasks In Progress,${statusBreakdown.inProgress}`
      ].join("\n");
      
      const csvContent = csvHeaders + csvRows;
      
      // Create a downloadable blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `loom-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1500); // Small delay for the animation effect
  };

  const getSmartInsight = () => {
    if (totalTasks === 0) return "Start assigning tasks to your team to generate real-time analytics and insights.";
    if (priorityBreakdown.high > 5 && completionRate < 50) {
      return "Attention: High-priority tasks are accumulating while completion rates are low. Consider reallocating team bandwidth.";
    }
    if (completionRate > 75) {
      return "Outstanding performance! Your team is clearing tasks highly efficiently. Keep up the great momentum.";
    }
    return `Steady progress. You currently have ${statusBreakdown.inProgress} active tasks in the pipeline. Keep pushing forward!`;
  };

  const animatedCompletionRate = useCountUp(completionRate);
  const animatedProductivity = useCountUp(tasks.length ? completionRate : 0);
  const animatedCompletedTasks = useCountUp(completedTasks);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#141e30]">
              Analytics Overview
            </h1>
            {/* --- NEW: LIVE SYSTEM PULSE --- */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 mt-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Deep insights into your team's performance and project trajectory.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-0">
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            title="Refresh Data"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin text-[#4F46E5]" : ""}`} />
          </button>

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

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-all shadow-md focus:ring-2 focus:ring-[#D4AF37] focus:outline-none ${
              isDownloading 
                ? "bg-green-600 text-white cursor-default" 
                : "bg-[#141e30] text-[#D4AF37] hover:bg-[#243b55] hover:text-white"
            }`}
          >
            {isDownloading ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isDownloading ? "Exported!" : "Download Data"}
          </button>
        </div>
      </motion.div>

      {/* Smart Insights Banner */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#141e30] to-[#243b55] rounded-xl p-4 shadow-md flex items-center gap-4 text-white">
        <div className="bg-[#D4AF37]/20 p-2.5 rounded-lg border border-[#D4AF37]/30">
          <Sparkles className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-0.5">Smart Insight</h4>
          <p className="text-sm text-slate-200">{getSmartInsight()}</p>
        </div>
      </motion.div>

      {/* Top Level Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {totalTasks === 0 ? (
          <>
            <EmptyStatCard label="Completion Rate" icon={CheckCircle2} />
            <EmptyStatCard label="Avg. Productivity" icon={TrendingUp} />
            <EmptyStatCard label="Tasks Closed" icon={Zap} />
            <EmptyStatCard label="Top Performer" icon={Award} />
          </>
        ) : (
          <>
            <StatCard
              label="Completion Rate"
              value={animatedCompletionRate}
              suffix="%"
              trend={0}
              icon={CheckCircle2}
              accent="bg-[#141e30]/10 text-[#141e30]" 
            />
            <StatCard
              label="Avg. Productivity"
              value={animatedProductivity}
              suffix="%"
              trend={0}
              icon={TrendingUp}
              accent="bg-slate-200 text-slate-700" 
            />
            <StatCard
              label="Tasks Closed"
              value={animatedCompletedTasks}
              trend={0}
              icon={Zap}
              accent="bg-[#243b55]/10 text-[#243b55]" 
            />
            <StatCard
              label="Top Performer"
              value={0}
              suffix=" tasks"
              icon={Award}
              accent="bg-[#D4AF37]/15 text-[#b5952f]" 
            />
          </>
        )}
      </motion.div>

      {/* Workload Health & Priority Breakdown */}
      <motion.div variants={itemVariants}>
        <Card className="border-t-4 border-t-[#4F46E5] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#141e30]">Workload Health & Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tasks by Priority</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-red-500"/> High Priority</span>
                    <span>{priorityBreakdown.high} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (priorityBreakdown.high / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500"/> Medium Priority</span>
                    <span>{priorityBreakdown.medium} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (priorityBreakdown.medium / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500"/> Low Priority</span>
                    <span>{priorityBreakdown.low} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (priorityBreakdown.low / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Task Pipeline Status</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>To Do</span>
                    <span>{statusBreakdown.todo} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (statusBreakdown.todo / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>In Progress</span>
                    <span>{statusBreakdown.inProgress} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (statusBreakdown.inProgress / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Completed</span>
                    <span>{statusBreakdown.done} tasks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${totalTasks ? (statusBreakdown.done / totalTasks) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Primary Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-t-4 border-t-[#141e30] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#141e30]">Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartErrorBoundary fallback={chartFallback}>
              {isLoading ? <ChartSkeleton /> : <ProjectProgressChart />}
            </ChartErrorBoundary>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#243b55] shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#141e30]">Task Distribution</CardTitle>
            <Filter className="h-4 w-4 text-slate-400 cursor-pointer hover:text-[#141e30] transition-colors" />
          </CardHeader>
          <CardContent className="pt-4">
            <ChartErrorBoundary fallback={chartFallback}>
               {isLoading ? <ChartSkeleton /> : <TaskStatusPieChart />}
            </ChartErrorBoundary>
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
            <ChartErrorBoundary fallback={chartFallback}>
               {isLoading ? <ChartSkeleton /> : <CompletionRateChart />}
            </ChartErrorBoundary>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-slate-400 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartErrorBoundary fallback={chartFallback}>
               {isLoading ? <ChartSkeleton /> : <WeeklyProductivityChart />}
            </ChartErrorBoundary>
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
            <ChartErrorBoundary fallback={chartFallback}>
               {isLoading ? <ChartSkeleton /> : <MemberActivityChart />}
            </ChartErrorBoundary>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}