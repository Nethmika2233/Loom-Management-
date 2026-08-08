import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useBoardStore } from "@/store/boardStore";
import { Fragment } from "react";

const LABELS: Record<string, string> = {
  boards: "Boards",
  calendar: "Calendar",
  analytics: "Analytics",
  team: "Team",
  profile: "Profile",
  notifications: "Notifications",
  settings: "Settings",
  help: "Help Center",
};

export function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const boards = useBoardStore((s) => s.boards);

  const segments = location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return <span className="text-sm font-medium">Dashboard</span>;

  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    let label = LABELS[seg] ?? seg;
    if (seg === params.boardId) {
      label = boards.find((b) => b.id === seg)?.name ?? seg;
    }
    return { path, label };
  });

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {crumbs.map((c, i) => (
        <Fragment key={c.path}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-foreground">{c.label}</span>
          ) : (
            <Link to={c.path} className="text-muted-foreground hover:text-foreground">
              {c.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
