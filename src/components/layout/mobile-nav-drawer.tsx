import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, CalendarDays, LayoutDashboard, LifeBuoy, Settings, Trello, Users, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";

const NAV = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Boards", to: "/boards", icon: Trello },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Team", to: "/team", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Help Center", to: "/help", icon: LifeBuoy },
];

export function MobileNavDrawer() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-sidebar border-r border-sidebar-border lg:hidden"
          >
            <div className="flex items-center justify-between p-3">
              <WorkspaceSwitcher />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-sidebar-accent" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )
                  }
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
