import { useMemo, useState } from "react";
import { Plus, Search, Trello } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/empty-state";
import { BoardCard } from "@/components/board/board-card";
import { RenameBoardDialog } from "@/components/board/rename-board-dialog";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";
import { useBoardStore } from "@/store/boardStore";
import type { Board } from "@/types";

export default function Boards() {
  const boards = useBoardStore((s) => s.boards);
  const isLoading = useBoardStore((s) => (s as unknown as { isLoading?: boolean }).isLoading ?? false);
  const [tab, setTab] = useState<"all" | "favorites" | "archived">("all");
  const [query, setQuery] = useState("");
  const [renameTarget, setRenameTarget] = useState<Board | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const archivedCount = useMemo(() => boards.filter((b) => b.archived).length, [boards]);

  const filtered = useMemo(() => {
    return boards
      .filter((b) => (tab === "archived" ? b.archived : !b.archived))
      .filter((b) => (tab === "favorites" ? b.favorite : true))
      .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (tab === "all") {
          if (a.favorite && !b.favorite) return -1;
          if (!a.favorite && b.favorite) return 1;
        }
        return 0;
      });
  }, [boards, tab, query]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Boards</h1>
          <p className="text-sm text-muted-foreground">Manage and organize all of your team's project boards.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> New Board
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All Boards</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="archived">Archived {archivedCount > 0 ? `(${archivedCount})` : ""}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search boards..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg border bg-muted/40 animate-pulse p-4 space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Trello}
          title={query ? "No matching boards" : "No boards found"}
          description={
            query
              ? `No boards matched "${query}". Try searching for something else.`
              : tab === "archived"
              ? "You haven't archived any boards yet."
              : tab === "favorites"
              ? "You haven't starred any favorite boards yet."
              : "No boards exist yet. Create your first board to start organizing tasks."
          }
          action={
            tab !== "archived" && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Create board
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((board, i) => (
            <BoardCard key={board.id} board={board} index={i} onRename={setRenameTarget} />
          ))}
        </div>
      )}

      <RenameBoardDialog board={renameTarget} onOpenChange={(v) => !v && setRenameTarget(null)} />
      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}