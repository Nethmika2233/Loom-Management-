import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { ArrowLeft, Filter, MoreHorizontal, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarStack } from "@/components/common/avatar-stack";
import { KanbanColumn } from "@/components/board/kanban-column";
import { TaskCard } from "@/components/board/task-card";
import { TaskDetailModal } from "@/components/board/task-detail-modal";
import { EmptyState } from "@/components/common/empty-state";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";
import { useFilterStore } from "@/store/filterStore";
import { mockLabels } from "@/mock";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { KanbanSquare } from "lucide-react";

export default function BoardDetails() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const boards = useBoardStore((s) => s.boards);
  const toggleFavorite = useBoardStore((s) => s.toggleFavorite);
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const addTask = useTaskStore((s) => s.addTask);

  const { priority, labelId, assigneeId, setPriority, setLabel, setAssignee, reset } = useFilterStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const board = boards.find((b) => b.id === boardId);

  const boardTasks = useMemo(() => {
    return tasks
      .filter((t) => t.boardId === boardId)
      .filter((t) => (priority === "all" ? true : t.priority === priority))
      .filter((t) => (labelId === "all" ? true : t.labelIds.includes(labelId)))
      .filter((t) => (assigneeId === "all" ? true : t.assigneeIds.includes(assigneeId)));
  }, [tasks, boardId, priority, labelId, assigneeId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  if (!board) {
    return (
      <div className="p-6">
        <EmptyState icon={KanbanSquare} title="Board not found" description="This board may have been deleted." action={<Button onClick={() => navigate("/boards")}>Back to boards</Button>} />
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = boardTasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskItem = boardTasks.find((t) => t.id === active.id);
    if (!activeTaskItem) return;

    const overColumn = board.columns.find((c) => c.id === over.id);
    const overTask = boardTasks.find((t) => t.id === over.id);
    const targetColumnId = overColumn?.id ?? overTask?.columnId;
    if (!targetColumnId || targetColumnId === activeTaskItem.columnId) return;

    const statusMap: Record<string, TaskStatus> = {};
    board.columns.forEach((c, i) => {
      statusMap[c.id] = (["todo", "doing", "review", "done"] as TaskStatus[])[i] ?? "todo";
    });

    moveTask(activeTaskItem.id, targetColumnId, statusMap[targetColumnId] ?? activeTaskItem.status, 0);
    toast.success(`Moved to ${board.columns.find((c) => c.id === targetColumnId)?.title}`);
  };

  const handleAddTask = (columnId: string, title: string) => {
    const column = board.columns.find((c) => c.id === columnId)!;
    const statusIdx = board.columns.findIndex((c) => c.id === columnId);
    const status = (["todo", "doing", "review", "done"] as TaskStatus[])[statusIdx] ?? "todo";

    addTask({
      id: `t${Date.now()}`,
      boardId: board.id,
      columnId,
      title,
      description: "",
      status,
      priority: "medium",
      assigneeIds: [],
      labelIds: [],
      checklist: [],
      comments: [],
      attachments: [],
      activity: [{ id: `act${Date.now()}`, actorId: "u1", action: "created this task", createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0,
    });
    toast.success(`Task added to ${column.title}`);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b border-border px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/boards")} aria-label="Back to boards">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br", board.color)} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold">{board.name}</h1>
          </div>
          <button onClick={() => toggleFavorite(board.id)} aria-label="Toggle favorite">
            <Star className={cn("h-5 w-5 text-muted-foreground", board.favorite && "fill-warning-500 text-warning-500")} />
          </button>
          <AvatarStack userIds={board.memberIds} max={5} />
          <Button variant="outline" size="sm">
            <Users className="h-3.5 w-3.5" /> Invite
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Board options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Board settings</DropdownMenuItem>
              <DropdownMenuItem>Change background</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </span>
          <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={labelId} onValueChange={setLabel}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All labels</SelectItem>
              {mockLabels.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assigneeId} onValueChange={setAssignee}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {board.memberIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(priority !== "all" || labelId !== "all" || assigneeId !== "all") && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-xs">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex min-h-0 flex-1 items-start gap-3 overflow-x-auto overscroll-x-contain scroll-smooth p-4 pb-2 sm:gap-4 sm:p-6">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={boardTasks.filter((t) => t.columnId === column.id)}
              onTaskClick={setSelectedTask}
              onAddTask={handleAddTask}
            />
          ))}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} onClick={() => {}} />}</DragOverlay>
      </DndContext>

      <TaskDetailModal task={selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)} />
    </div>
  );
}
