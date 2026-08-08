import { ShieldCheck } from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { AdminUserMenu } from "@/components/layout/admin-user-menu";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">Admin Panel</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <div className="mx-1 h-6 w-px bg-border" />
        <AdminUserMenu />
      </div>
    </header>
  );
}
