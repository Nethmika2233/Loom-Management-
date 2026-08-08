import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, PlusSquare, Trello, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";

export function QuickActions() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const actions = [
    { label: "New Board", icon: Trello, onClick: () => setCreateOpen(true) },
    { label: "New Task", icon: PlusSquare, onClick: () => navigate("/boards") },
    { label: "View Calendar", icon: CalendarDays, onClick: () => navigate("/calendar") },
    { label: "Invite Member", icon: UserPlus, onClick: () => navigate("/team") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
              <action.icon className="h-4.5 w-4.5" />
            </div>
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </CardContent>
      <CreateBoardDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Card>
  );
}
