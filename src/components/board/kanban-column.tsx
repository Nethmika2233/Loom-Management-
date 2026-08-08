import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
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

export function KanbanColumn({ column, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const submit = () => {
    if (title.trim()) {
      onAddTask(column.id, title.trim());
      setTitle("");
    }
    setAdding(false);
  };

  return (
    <div className="flex w-80 shrink-0 flex-col rounded-2xl bg-muted/40 border border-border/60">
      <div className="sticky top-0 z-10 rounded-t-2xl bg-muted/40 backdrop-blur px-3.5 pb-2 pt-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color }} />
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <span className="rounded-full bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
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
        className={cn("flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-3.5 pt-1 min-h-[120px] transition-colors rounded-b-2xl", isOver && "bg-primary-50/50 dark:bg-primary-500/5")}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {adding ? (
          <div className="space-y-2 rounded-xl border border-border bg-card p-2.5">
            <Input
              autoFocus
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={submit}>
                Add task
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" /> Add task
          </button>
        )}
      </div>
    </div>
  );
}
