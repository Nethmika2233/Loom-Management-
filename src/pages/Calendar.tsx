import { useMemo, useState } from "react";
import { addMonths, addWeeks, format, isSameDay, subMonths, subWeeks } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { AgendaView } from "@/components/calendar/agenda-view";
import { TaskDetailModal } from "@/components/board/task-detail-modal";
import { PriorityBadge } from "@/components/common/priority-badge";
import { useTaskStore } from "@/store/taskStore";
import { useBoardStore } from "@/store/boardStore";
import type { Task } from "@/types";

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "agenda">("month");
  const [cursor, setCursor] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const boards = useBoardStore((s) => s.boards);

  const goPrev = () => setCursor((d) => (view === "week" ? subWeeks(d, 1) : subMonths(d, 1)));
  const goNext = () => setCursor((d) => (view === "week" ? addWeeks(d, 1) : addMonths(d, 1)));

  const dayTasks = useMemo(
    () =>
      selectedDay
        ? tasks
            .filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDay))
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        : [],
    [selectedDay, tasks]
  );

  const boardName = (boardId: string) => boards.find((b) => b.id === boardId)?.name ?? "Unknown board";

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

      {view === "month" && (
        <MonthView month={cursor} tasks={tasks} onTaskClick={setSelectedTask} onDayClick={setSelectedDay} selectedDay={selectedDay} />
      )}
      {view === "week" && <WeekView week={cursor} tasks={tasks} onTaskClick={setSelectedTask} />}
      {view === "agenda" && <AgendaView tasks={tasks} onTaskClick={setSelectedTask} />}

      {view === "month" && selectedDay && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <CalendarDays className="h-4 w-4 text-primary-600" />
              {format(selectedDay, "EEEE, MMMM d, yyyy")}
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDay(null)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {dayTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks are due on this day.</p>
          ) : (
            <ul className="space-y-2">
              {dayTasks.map((task) => (
                <li key={task.id}>
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{task.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(new Date(task.dueDate!), "HH:mm")} · {boardName(task.boardId)}
                        {task.description ? ` · ${task.description}` : ""}
                      </p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs capitalize text-muted-foreground">{task.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <TaskDetailModal task={selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)} />
    </div>
  );
}
