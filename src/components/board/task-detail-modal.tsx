import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  CheckSquare,
  Clock,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriorityBadge } from "@/components/common/priority-badge";
import { DueDatePicker } from "@/components/common/due-date-picker";
import { mockLabels } from "@/mock";
import { useTaskStore } from "@/store/taskStore";
import { useUserStore } from "@/store/userStore";
import { teamService } from "@/services/teamService";
import { STATUS_CONFIG } from "@/constants";
import { getInitials, cn } from "@/lib/utils";
import type { Task, TaskStatus, Priority, User } from "@/types";

export function TaskDetailModal({ task, onOpenChange }: { task: Task | null; onOpenChange: (open: boolean) => void }) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleChecklistItem = useTaskStore((s) => s.toggleChecklistItem);
  const addComment = useTaskStore((s) => s.addComment);
  const currentUser = useUserStore((s) => s.user);
  const [members, setMembers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [commentText, setCommentText] = useState("");
  const [loggedHours, setLoggedHours] = useState(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setLoggedHours(task.loggedHours ?? 0);
    }
  }, [task]);

  useEffect(() => {
    teamService.getMembers().then(setMembers);
  }, []);

  if (!task) return null;

  const checklistDone = task.checklist.filter((c) => c.done).length;
  const checklistTotal = task.checklist.length;

  const saveTitle = () => {
    if (title.trim() && title !== task.title) updateTask(task.id, { title: title.trim() });
  };

  const saveDescription = () => {
    if (description !== task.description) updateTask(task.id, { description });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    updateTask(task.id, {
      checklist: [...task.checklist, { id: `cl${Date.now()}`, text: newChecklistItem.trim(), done: false }],
    });
    setNewChecklistItem("");
  };

  const handleRemoveChecklistItem = (id: string) => {
    updateTask(task.id, { checklist: task.checklist.filter((c) => c.id !== id) });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !currentUser) return;
    addComment(task.id, commentText.trim(), currentUser.id);
    setCommentText("");
  };

  const toggleAssignee = (userId: string) => {
    const has = task.assigneeIds.includes(userId);
    updateTask(task.id, {
      assigneeIds: has ? task.assigneeIds.filter((id) => id !== userId) : [...task.assigneeIds, userId],
    });
  };

  const toggleLabel = (labelId: string) => {
    const has = task.labelIds.includes(labelId);
    updateTask(task.id, {
      labelIds: has ? task.labelIds.filter((id) => id !== labelId) : [...task.labelIds, labelId],
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success("Task deleted");
    onOpenChange(false);
  };

  const assignees = task.assigneeIds.map((id) => members.find((u) => u.id === id)).filter(Boolean) as User[];
  const labels = task.labelIds.map((id) => mockLabels.find((l) => l.id === id)).filter(Boolean) as typeof mockLabels;

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] max-h-[85vh]">
          <div className="overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-2">
              {STATUS_CONFIG[task.status] && (
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CONFIG[task.status].className)}>
                  {STATUS_CONFIG[task.status].label}
                </span>
              )}
              <PriorityBadge priority={task.priority} />
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              className="border-none px-0 text-xl font-bold shadow-none focus-visible:ring-0 h-auto py-0"
            />

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={saveDescription}
                placeholder="Add a more detailed description..."
                className="min-h-[90px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <CheckSquare className="h-3.5 w-3.5" /> Checklist
                </p>
                {checklistTotal > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {checklistDone}/{checklistTotal}
                  </span>
                )}
              </div>
              {checklistTotal > 0 && <Progress value={(checklistDone / checklistTotal) * 100} className="h-1.5" />}
              <div className="space-y-1.5">
                {task.checklist.map((item) => (
                  <div key={item.id} className="group flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/60">
                    <Checkbox checked={item.done} onCheckedChange={() => toggleChecklistItem(task.id, item.id)} />
                    <span className={cn("flex-1 text-sm", item.done && "text-muted-foreground line-through")}>{item.text}</span>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger-600"
                      aria-label="Remove item"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                  className="h-8 text-sm"
                />
                <Button size="sm" variant="outline" onClick={handleAddChecklistItem}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">
                  <MessageSquare className="h-3.5 w-3.5" /> Comments ({task.comments.length})
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  <Paperclip className="h-3.5 w-3.5" /> Attachments ({task.attachments.length})
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock className="h-3.5 w-3.5" /> Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comments" className="space-y-3">
                {task.comments.map((comment) => {
                  const author = members.find((u) => u.id === comment.authorId);
                  return (
                    <div key={comment.id} className="flex items-start gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={author?.avatarUrl} />
                        <AvatarFallback className="text-[10px]">{author ? getInitials(author.name) : "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 rounded-xl bg-muted/60 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{author?.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button size="icon" onClick={handleAddComment} aria-label="Send comment">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-2">
                {task.attachments.length === 0 && <p className="text-sm text-muted-foreground">No attachments yet.</p>}
                {task.attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{att.name}</p>
                      <p className="text-xs text-muted-foreground">{att.size}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => toast.info("File upload requires a backend")}>
                  <Plus className="h-3.5 w-3.5" /> Upload file
                </Button>
              </TabsContent>

              <TabsContent value="activity" className="space-y-3">
                {task.activity
                  .slice()
                  .reverse()
                  .map((entry) => {
                    const actor = members.find((u) => u.id === entry.actorId);
                    return (
                      <div key={entry.id} className="flex items-start gap-2.5">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={actor?.avatarUrl} />
                          <AvatarFallback className="text-[9px]">{actor ? getInitials(actor.name) : "?"}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">
                          <span className="font-medium">{actor?.name}</span> <span className="text-muted-foreground">{entry.action}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-5 border-t md:border-t-0 md:border-l border-border bg-muted/30 p-5">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">Status</p>
              <Select value={task.status} onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">Priority</p>
              <Select value={task.priority} onValueChange={(v) => updateTask(task.id, { priority: v as Priority })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">Due date</p>
              <DueDatePicker
                value={task.dueDate}
                onChange={(iso) => updateTask(task.id, { dueDate: iso })}
              />
            </div>

            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Assignees
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex w-full items-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1.5 hover:bg-muted">
                    <div className="flex -space-x-2">
                      {assignees.map((a) => (
                        <Avatar key={a.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={a.avatarUrl} />
                          <AvatarFallback className="text-[9px]">{getInitials(a.name)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{assignees.length === 0 ? "Assign" : "Edit"}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="space-y-1">
                    {members.length === 0 ? (
                      <p className="px-2 py-1.5 text-xs text-muted-foreground">No members yet</p>
                    ) : (
                      members.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => toggleAssignee(u.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"
                        >
                          <Checkbox checked={task.assigneeIds.includes(u.id)} />
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={u.avatarUrl} />
                            <AvatarFallback className="text-[9px]">{getInitials(u.name)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm">{u.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Tag className="h-3.5 w-3.5" /> Labels
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex w-full flex-wrap gap-1 rounded-lg border border-input bg-background px-2 py-1.5 hover:bg-muted min-h-[34px]">
                    {labels.length === 0 && <span className="text-xs text-muted-foreground">Add labels</span>}
                    {labels.map((l) => (
                      <span key={l.id} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: l.color }}>
                        {l.name}
                      </span>
                    ))}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="space-y-1">
                    {mockLabels.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => toggleLabel(l.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"
                      >
                        <Checkbox checked={task.labelIds.includes(l.id)} />
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-sm">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Time Tracking
              </p>
              <div className="space-y-1.5 rounded-lg border border-border bg-background p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Estimated</span>
                  <span className="font-medium">{task.estimatedHours ?? 0}h</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Logged</span>
                  <Input
                    type="number"
                    min={0}
                    value={loggedHours}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoggedHours(val);
                      updateTask(task.id, { loggedHours: val });
                    }}
                    className="h-6 w-16 text-right text-xs"
                  />
                </div>
                <Progress value={task.estimatedHours ? Math.min(100, (loggedHours / task.estimatedHours) * 100) : 0} className="h-1.5" />
              </div>
            </div>

            <Button variant="outline" className="w-full text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Delete task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
