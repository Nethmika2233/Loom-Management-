import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

export function AvatarStack({ userIds, users = [], max = 3, size = "h-6 w-6" }: { userIds: string[]; users?: User[]; max?: number; size?: string }) {
  const resolvedUsers = (users ?? []).filter(Boolean).filter((u) => userIds.includes(u.id));
  const visible = resolvedUsers.slice(0, max);
  const overflow = resolvedUsers.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger asChild>
            <Avatar className={`${size} border-2 border-background`}>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-[10px]">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{user.name}</TooltipContent>
        </Tooltip>
      ))}
      {overflow > 0 && (
        <div className={`${size} flex items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground`}>
          +{overflow}
        </div>
      )}
    </div>
  );
}
