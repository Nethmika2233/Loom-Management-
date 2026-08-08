import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { mockUsers } from "@/mock";
import { getInitials } from "@/lib/utils";

export function AvatarStack({ userIds, max = 3, size = "h-6 w-6" }: { userIds: string[]; max?: number; size?: string }) {
  const users = userIds.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean) as (typeof mockUsers)[number][];
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;

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
