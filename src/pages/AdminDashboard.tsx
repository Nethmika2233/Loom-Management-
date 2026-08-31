import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ListTodo, ShieldCheck, Trello, UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { getInitials, cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { teamService } from "@/services/teamService";
import type { User } from "@/types";

const STATUS_DOT: Record<User["status"], string> = {
  online: "bg-success-500",
  away: "bg-warning-500",
  offline: "bg-slate-400",
};

const ROLE_VARIANT: Record<User["role"], "default" | "info" | "secondary" | "outline"> = {
  admin: "default",
  manager: "info",
  member: "secondary",
  viewer: "outline",
};

const ROLE_COLORS: Record<User["role"], string> = {
  admin: "#4F46E5",
  manager: "#06B6D4",
  member: "#94A3B8",
  viewer: "#F97316",
};

export default function AdminDashboard() {
  const admin = useUserStore((s) => s.user);
  const tasks = useTaskStore((s) => s.tasks);
  const boards = useBoardStore((s) => s.boards);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    teamService.getMembers().then(setMembers);
  }, []);

  const onlineNow = members.filter((u) => u.status === "online").length;
  const adminCount = members.filter((u) => u.role === "admin").length;

  const roleDistribution = useMemo(() => {
    const counts = members.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([role, value]) => ({
      name: role,
      value,
      color: ROLE_COLORS[role as User["role"]],
    }));
  }, [members]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as {admin?.name} · workspace-wide overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Users" value={members.length} icon={Users} accent="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" delay={0} />
        <StatCard label="Admins" value={adminCount} icon={ShieldCheck} accent="bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400" delay={0.03} />
        <StatCard label="Online Now" value={onlineNow} icon={UserCheck} accent="bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" delay={0.06} />
        <StatCard label="Workspaces" value={0} icon={Trello} accent="bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" delay={0.09} />
        <StatCard label="Total Tasks" value={tasks.length} icon={ListTodo} accent="bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500" delay={0.12} />
      </div>

      // Admin Stat Cards Section 
      


      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle> // Role Distribution Chart 
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={roleDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {roleDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", fontSize: 13 }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No workspaces yet.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">User</th>
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Department</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No users yet. Invite team members to get started.
                    </td>
                  </tr>
                ) : (
                  members.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatarUrl} alt={u.name} />
                              <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                            </Avatar>
                            <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card", STATUS_DOT[u.status])} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{u.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={ROLE_VARIANT[u.role]} className="capitalize">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{u.department}</td>
                      <td className="px-4 py-2.5 capitalize text-muted-foreground">{u.status}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{u.joinedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );  // End of Admin Dashboard
}
