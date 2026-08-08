import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Star,
  Trello,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useBoardStore } from "@/store/boardStore";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";

const NAV = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Boards", to: "/boards", icon: Trello },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Team", to: "/team", icon: Users },
];

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const boards = useBoardStore((s) => s.boards);
  const favorites = boards.filter((b) => b.favorite && !b.archived);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative hidden lg:flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky top-0"
    >
      <div className="p-3">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-0"
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        {!collapsed && favorites.length > 0 && (
          <div className="pt-4">
            <p className="px-2.5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favorites</p>
            {favorites.map((board) => (
              <NavLink
                key={board.id}
                to={`/boards/${board.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )
                }
              >
                <Star className="h-4 w-4 shrink-0 fill-warning-500 text-warning-500" />
                <span className="truncate">{board.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-sidebar-accent text-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-0"
            )
          }
        >
          <Settings className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <NavLink
          to="/help"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-sidebar-accent text-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-0"
            )
          }
        >
          <LifeBuoy className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
}
