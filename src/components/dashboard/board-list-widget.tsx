import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";
import { cn } from "@/lib/utils";

export function BoardListWidget({ title, favoritesOnly = false }: { title: string; favoritesOnly?: boolean }) {
  const boards = useBoardStore((s) => s.boards);
  const tasks = useTaskStore((s) => s.tasks);

  const list = boards
    .filter((b) => !b.archived)
    .filter((b) => (favoritesOnly ? b.favorite : true))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((board) => {
          const boardTasks = tasks.filter((t) => t.boardId === board.id);
          const done = boardTasks.filter((t) => t.status === "done").length;
          const progress = boardTasks.length ? Math.round((done / boardTasks.length) * 100) : 0;

          return (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="block rounded-xl border border-border p-3 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br", board.color)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{board.name}</p>
                    {board.favorite && <Star className="h-3.5 w-3.5 shrink-0 fill-warning-500 text-warning-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{boardTasks.length} tasks</p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-2.5 h-1.5" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
