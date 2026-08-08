import { Menu } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";

export function Navbar() {
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:block">
        <Breadcrumbs />
      </div>

      <div className="flex-1 flex justify-center md:justify-start">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <NotificationBell />
        <div className="mx-1 h-6 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  );
}
