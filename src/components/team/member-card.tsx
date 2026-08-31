import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import type { User } from "@/types";

// Maps user availability status to corresponding Tailwind color classes
const STATUS_DOT: Record<User["status"], string> = {
  online: "bg-success-500 animate-pulse",
  away: "bg-warning-500",
  offline: "bg-slate-400",
};

// Maps user roles to specific Badge component visual variants
const ROLE_VARIANT: Record<User["role"], "default" | "info" | "secondary" | "outline"> = {
  admin: "default",
  manager: "info",
  member: "secondary",
  viewer: "outline",
};

/**
 * MemberCard Component
 * Displays a single team member's profile information, status, and task completion stats.
 * Animated on render using framer-motion.
 */
export function MemberCard({ member, index = 0, onRemove }: { member: User; index?: number; onRemove?: () => void }) {
  const tasks = useTaskStore((s) => s.tasks);
  
  // Calculate how many tasks are assigned and completed for this specific member
  const assigned = tasks.filter((t) => t.assigneeIds.includes(member.id));
  const completed = assigned.filter((t) => t.status === "done");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
      <Card className="p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <span 
              className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card", STATUS_DOT[member.status])} 
              aria-label={`Status: ${member.status}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{member.name}</p>
              {member.status === "online" ? (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" aria-label="Online" />
              ) : (
                <span className="text-[10px] font-medium text-slate-400">Last seen recently</span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">{member.title}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={ROLE_VARIANT[member.role]} className="capitalize">
              {member.role}
            </Badge>
            {onRemove && (
              <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span 
            className="uppercase text-[10px] font-medium tracking-wider cursor-help" 
            title={`Department: ${member.department}`}
          >
            {member.department}
          </span>
          <span className="capitalize">{member.status}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
          <div>
            <p className="text-lg font-bold">{assigned.length}</p>
            <p className="text-xs text-muted-foreground">Assigned</p>
          </div>
          <div>
            <p className="text-lg font-bold">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}