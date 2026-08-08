import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockWorkspaces } from "@/mock";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const [active, setActive] = useState(mockWorkspaces[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: active.logoColor }}
          >
            {active.name[0]}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">{active.name}</p>
                <p className="truncate text-xs text-muted-foreground">Workspace</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {mockWorkspaces.map((ws) => (
          <DropdownMenuItem key={ws.id} onClick={() => setActive(ws)}>
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
              style={{ backgroundColor: ws.logoColor }}
            >
              {ws.name[0]}
            </div>
            <span className="flex-1 truncate">{ws.name}</span>
            {ws.id === active.id && <Check className="h-4 w-4 text-primary-600" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="h-4 w-4" />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
