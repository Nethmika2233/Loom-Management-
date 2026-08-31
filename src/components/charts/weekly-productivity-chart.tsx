import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTaskStore } from "@/store/taskStore";
import { format, subDays } from "date-fns";

// --- NEW: CUSTOM TOOLTIP COMPONENT ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completed = payload[0]?.value || 0;
    const created = payload[1]?.value || 0;
    // Calculate the extra detail: Daily completion rate
    const dailyRate = created > 0 ? Math.round((completed / created) * 100) : 0;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg outline-none">
        <p className="mb-2 border-b border-slate-100 pb-1 text-sm font-bold text-slate-700">
          {label} Overview
        </p>
        <div className="space-y-1.5 text-sm">
          <p className="flex items-center gap-2 font-medium text-[#4F46E5]">
            <span className="h-2 w-2 rounded-full bg-[#4F46E5]"></span>
            Completed: <span className="font-bold">{completed} tasks</span>
          </p>
          <p className="flex items-center gap-2 font-medium text-[#06B6D4]">
            <span className="h-2 w-2 rounded-full bg-[#06B6D4]"></span>
            Created: <span className="font-bold">{created} tasks</span>
          </p>
          <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            Daily Rate: <span className="font-semibold text-slate-700">{dailyRate}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function WeeklyProductivityChart() {
  const tasks = useTaskStore((s) => s.tasks);

  // Build weekly productivity from actual tasks
  const weeklyProductivity = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayTasks = tasks.filter((t) => t.createdAt?.startsWith(dateStr));
    const completed = dayTasks.filter((t) => t.status === "done").length;
    const created = dayTasks.length;
    return {
      date: format(date, "EEE"),
      completed,
      created,
    };
  });

  const hasData = weeklyProductivity.some((d) => d.completed > 0 || d.created > 0);

  if (!hasData) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
        No activity yet. Create and complete tasks to see productivity.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={weeklyProductivity} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        
        {/* USING THE NEW CUSTOM TOOLTIP */}
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }} 
        />
        
        <Line type="monotone" dataKey="completed" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Completed" />
        <Line type="monotone" dataKey="created" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Created" />
      </LineChart>
    </ResponsiveContainer>
  );
}