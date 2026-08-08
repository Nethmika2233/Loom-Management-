import { Search } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export function GlobalSearch() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);

  return (
    <button
      onClick={() => setOpen(true)}
      className="hidden sm:flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors w-full max-w-xs"
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
    </button>
  );
}
