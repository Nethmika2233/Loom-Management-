import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import {
  BarChart3,
  CalendarDays,
  KanbanSquare,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Trello,
  Users,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useBoardStore } from "@/store/boardStore";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const navigate = useNavigate();
  const boards = useBoardStore((s) => s.boards);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[12vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Search boards, tasks, people..."
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

            <Command.Group heading="Quick Actions" className={groupClass}>
              <Command.Item onSelect={() => go("/boards")} className={itemClass}>
                <Plus className="h-4 w-4" /> Create new board
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigate" className={groupClass}>
              <Command.Item onSelect={() => go("/")} className={itemClass}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Command.Item>
              <Command.Item onSelect={() => go("/boards")} className={itemClass}>
                <Trello className="h-4 w-4" /> Boards
              </Command.Item>
              <Command.Item onSelect={() => go("/calendar")} className={itemClass}>
                <CalendarDays className="h-4 w-4" /> Calendar
              </Command.Item>
              <Command.Item onSelect={() => go("/analytics")} className={itemClass}>
                <BarChart3 className="h-4 w-4" /> Analytics
              </Command.Item>
              <Command.Item onSelect={() => go("/team")} className={itemClass}>
                <Users className="h-4 w-4" /> Team
              </Command.Item>
              <Command.Item onSelect={() => go("/settings")} className={itemClass}>
                <Settings className="h-4 w-4" /> Settings
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Boards" className={groupClass}>
              {boards.slice(0, 5).map((board) => (
                <Command.Item key={board.id} onSelect={() => go(`/boards/${board.id}`)} className={itemClass}>
                  <KanbanSquare className="h-4 w-4" /> {board.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

const groupClass = "px-2 py-1.5 text-xs font-semibold text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5";
const itemClass = cn(
  "flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer text-foreground",
  "data-[selected=true]:bg-primary-50 data-[selected=true]:text-primary-700 dark:data-[selected=true]:bg-primary-500/10 dark:data-[selected=true]:text-primary-400"
);
