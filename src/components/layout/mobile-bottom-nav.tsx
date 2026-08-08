import { NavLink } from "react-router-dom";
import { BarChart3, CalendarDays, LayoutDashboard, Trello, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/", icon: LayoutDashboard, end: true },
  { label: "Boards", to: "/boards", icon: Trello },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Team", to: "/team", icon: Users },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-md px-2 py-1.5 lg:hidden">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "text-primary-600" : "text-muted-foreground"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
