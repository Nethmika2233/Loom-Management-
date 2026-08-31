import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberCard } from "@/components/team/member-card";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { Users } from "lucide-react";
import { teamService } from "@/services/teamService";
import type { User } from "@/types";

export default function Team() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    teamService.getMembers().then(setMembers);
  }, []);

  const departments = Array.from(new Set(members.map((u) => u.department)));

  const filtered = useMemo(() => {
    return members
      .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
      .filter((u) => (department === "all" ? true : u.department === department));
  }, [query, department, members]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">{members.length} members across your workspace.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No members found" description="Invite team members to get started." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      )}

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
