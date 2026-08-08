import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, MoreHorizontal, Pencil, Star, Trash2, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AvatarStack } from "@/components/common/avatar-stack";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";
import type { Board } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BoardCard({ board, index = 0, onRename }: { board: Board; index?: number; onRename: (board: Board) => void }) {
  const toggleFavorite = useBoardStore((s) => s.toggleFavorite);
  const duplicateBoard = useBoardStore((s) => s.duplicateBoard);
  const archiveBoard = useBoardStore((s) => s.archiveBoard);
  const deleteBoard = useBoardStore((s) => s.deleteBoard);
  const tasks = useTaskStore((s) => s.tasks).filter((t) => t.boardId === board.id);

  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
    >
      <Card className="group relative overflow-hidden">
        <Link to={`/boards/${board.id}`} className="block">
          <div className={cn("h-20 bg-gradient-to-br", board.color)} />
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{board.name}</h3>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground min-h-[2rem]">{board.description}</p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{tasks.length} tasks</span>
              <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="mt-1.5 h-1.5" />

            <div className="mt-3 flex items-center justify-between">
              <AvatarStack userIds={board.memberIds} max={4} />
            </div>
          </div>
        </Link>

        <button
          onClick={() => toggleFavorite(board.id)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
          aria-label="Toggle favorite"
        >
          <Star className={cn("h-4 w-4 text-white", board.favorite && "fill-warning-500 text-warning-500")} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
              aria-label="Board options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRename(board)}>
              <Pencil className="h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { duplicateBoard(board.id); toast.success("Board duplicated"); }}>
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { archiveBoard(board.id); toast.success(board.archived ? "Board restored" : "Board archived"); }}>
              <Archive className="h-4 w-4" /> {board.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-danger-600 focus:bg-danger-50 dark:focus:bg-danger-500/10"
              onClick={() => { deleteBoard(board.id); toast.success("Board deleted"); }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </motion.div>
  );
}
