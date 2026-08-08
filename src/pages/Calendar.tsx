import { useState } from "react";
import { addMonths, addWeeks, format, subMonths, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { AgendaView } from "@/components/calendar/agenda-view";
import { TaskDetailModal } from "@/components/board/task-detail-modal";
import { useTaskStore } from "@/store/taskStore";
import type { Task } from "@/types";

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "agenda">("month");
  const [cursor, setCursor] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = useTaskStore((s) => s.tasks);

  const goPrev = () => setCursor((d) => (view === "week" ? subWeeks(d, 1) : subMonths(d, 1)));
  const goNext = () => setCursor((d) => (view === "week" ? addWeeks(d, 1) : addMonths(d, 1)));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Track deadlines and plan your team's schedule.</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view !== "agenda" && (
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={goPrev} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goNext} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{format(cursor, view === "week" ? "'Week of' MMM d, yyyy" : "MMMM yyyy")}</h2>
          <Button variant="ghost" size="sm" onClick={() => setCursor(new Date())}>
            Today
          </Button>
        </div>
      )}

      {view === "month" && <MonthView month={cursor} tasks={tasks} onTaskClick={setSelectedTask} />}
      {view === "week" && <WeekView week={cursor} tasks={tasks} onTaskClick={setSelectedTask} />}
      {view === "agenda" && <AgendaView tasks={tasks} onTaskClick={setSelectedTask} />}

      <TaskDetailModal task={selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)} />
    </div>
  );
}
