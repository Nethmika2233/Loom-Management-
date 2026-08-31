import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Inbox, Plus } from "lucide-react";
import { TaskCard } from "@/components/board/task-card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Column, Task } from "@/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string, title: string) => void;
}

const TITLE_MAX_LENGTH = 80;

export function KanbanColumn({ column, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const {
    attributes: columnDragAttributes,
    listeners: columnDragListeners,
    setNodeRef: setColumnDragRef,
    transform: columnTransform,
    isDragging: isColumnDragging,
  } = useDraggable({ id: column.id, data: { type: "column" } });
  const columnStyle = {
    transform: CSS.Translate.toString(columnTransform),
  };
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && trimmedTitle.length <= TITLE_MAX_LENGTH;

  const submit = () => {
    if (trimmedTitle.length === 0) {
      setError("Title is required");
      return;
    }
    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or fewer`);
      return;
    }
    onAddTask(column.id, trimmedTitle);
    setTitle("");
    setError(null);
    setAdding(false);
  };

  const cancelAdd = () => {
    setTitle("");
    setError(null);
    setAdding(false);
  };

  return (
    <div
      ref={setColumnDragRef}
      style={columnStyle}
      className={cn(
        "flex min-h-0 w-[min(82vw,20rem)] shrink-0 flex-col rounded-2xl border border-border/60 bg-muted/40 transition-all duration-200 sm:w-80",
        isOver && "border-primary/60 ring-2 ring-primary/30",
        isColumnDragging && "opacity-50"
      )}
    >
      <div className="sticky top-0 z-10 rounded-t-2xl bg-muted/40 backdrop-blur px-3.5 pb-2 pt-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              {...columnDragAttributes}
              {...columnDragListeners}
              className="cursor-grab touch-none text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
              aria-label="Drag column"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color }} />
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <span
              title={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
              className="rounded-full bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tasks.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAdding(true)} aria-label="Add task">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="mt-2 h-1" />
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-b-2xl px-3.5 pb-3.5 pt-1 min-h-[120px] transition-all duration-200",
          isOver && "bg-primary/5 shadow-inner shadow-primary/10"
        )}
      >
        {tasks.length === 0 && !adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 flex min-h-[130px] flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/40 px-3 text-center transition-colors hover:border-primary/50 hover:bg-background"
          >
            <div className="flex flex-col items-center">
              <Inbox className="mb-2 h-5 w-5 text-muted-foreground/60" />
              <p className="text-sm font-medium text-foreground">No tasks yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Add a task or drop one here</p>
            </div>
          </button>
        ) : (
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </SortableContext>
        )}

        {adding ? (
          <div className="space-y-2 rounded-xl border border-border bg-card p-2.5 shadow-sm">
            <Input
              autoFocus
              placeholder="Task title..."
              value={title}
              maxLength={TITLE_MAX_LENGTH}
              aria-invalid={!!error}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") cancelAdd();
              }}
              className={cn("h-9", error && "border-danger-500 focus-visible:ring-danger-500")}
            />
            {error && <p className="text-xs text-danger-600">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={submit} className="flex-1" disabled={!canSubmit}>
                Add task
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelAdd}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/80 bg-background/40 px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-background hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Add task
          </button>
        )}
      </div>
    </div>
  );
}
