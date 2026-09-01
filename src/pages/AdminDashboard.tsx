import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ListTodo, ShieldCheck, Trello, UserCheck, Users, Search, UserX, Trash2, AlertTriangle } from "lucide-react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    teamService.getMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
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

  const filteredMembers = useMemo(() => {
    return members.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "all" || u.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setMembers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

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
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-muted/60" />
          ))
        ) : (
          <>
            <StatCard label="Total Users" value={members.length} icon={Users} accent="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" delay={0} />
            <StatCard label="Admins" value={adminCount} icon={ShieldCheck} accent="bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400" delay={0.03} />
            <StatCard label="Online Now" value={onlineNow} icon={UserCheck} accent="bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" delay={0.06} />
            <StatCard label="Workspaces" value={0} icon={Trello} accent="bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" delay={0.09} />
            <StatCard label="Total Tasks" value={tasks.length} icon={ListTodo} accent="bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500" delay={0.12} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
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
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-4">
          <CardTitle>User Management</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="relative w-full sm:w-36">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring capitalize"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
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
                  <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserX className="h-8 w-8 text-muted-foreground/60" />
                        <p className="font-medium text-foreground">
                          {members.length === 0 ? "No users yet." : "No matching users found"}
                        </p>
                        <p className="text-xs">
                          {members.length === 0
                            ? "Invite team members to get started."
                            : "Try adjusting your search query or role filter."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((u) => (
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
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Remove user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Confirm User Removal</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{userToDelete.name}</span> from the workspace?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="h-9 px-4 rounded-md border border-input bg-transparent text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-9 px-4 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}