import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { CheckSquare, GripVertical, MessageSquare, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/common/priority-badge";
import { DueDateBadge } from "@/components/common/due-date-badge";
import { AvatarStack } from "@/components/common/avatar-stack";
import { Progress } from "@/components/ui/progress";
import { mockLabels } from "@/mock";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const checklistDone = task.checklist.filter((c) => c.done).length;
  const checklistTotal = task.checklist.length;
  const labels = task.labelIds.map((id) => mockLabels.find((l) => l.id === id)).filter(Boolean) as (typeof mockLabels)[number][];

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-40 z-50")}>
      <motion.div layout whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
        <Card
          onClick={onClick}
          className="group cursor-pointer p-3.5 hover:shadow-elevated hover:border-primary-200 dark:hover:border-primary-800 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {labels.slice(0, 3).map((label) => (
                  <span
                    key={label.id}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
            <button
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 active:cursor-grabbing"
              aria-label="Drag task"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-sm font-medium leading-snug">{task.title}</p>
          {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}

          {checklistTotal > 0 && (
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" /> {checklistDone}/{checklistTotal}
                </span>
              </div>
              <Progress value={(checklistDone / checklistTotal) * 100} className="h-1" />
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <DueDateBadge dueDate={task.dueDate} done={task.status === "done"} />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              {task.comments.length > 0 && (
                <span className="flex items-center gap-1 text-[11px]">
                  <MessageSquare className="h-3.5 w-3.5" /> {task.comments.length}
                </span>
              )}
              {task.attachments.length > 0 && (
                <span className="flex items-center gap-1 text-[11px]">
                  <Paperclip className="h-3.5 w-3.5" /> {task.attachments.length}
                </span>
              )}
              {(task.estimatedHours ?? 0) > 0 && (
                <span className="text-[11px]">{task.estimatedHours}h est.</span>
              )}
            </div>
            <AvatarStack userIds={task.assigneeIds} users={[]} max={3} size="h-6 w-6" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
