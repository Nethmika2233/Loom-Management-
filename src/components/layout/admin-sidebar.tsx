import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true }];

export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky top-0">
      <div className="flex items-center gap-2 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <span className="text-base font-semibold">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
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
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ArrowLeftRight className="h-4.5 w-4.5 shrink-0" />
          Exit to Workspace
        </button>
      </div>
    </aside>
  );
}
