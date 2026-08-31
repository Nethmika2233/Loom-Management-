import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { CommandPalette } from "@/components/layout/command-palette";
import { FloatingCreateButton } from "@/components/layout/floating-create-button";
import { useBoardStore } from "@/store/boardStore";
import { useTaskStore } from "@/store/taskStore";

export default function AppLayout() {
  const loadBoards = useBoardStore((s) => s.loadBoards);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  // Load boards and tasks from MongoDB on app start so data survives refreshes
  useEffect(() => {
    loadBoards();
    loadTasks();
  }, [loadBoards, loadTasks]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNavDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
      <FloatingCreateButton />
      <CommandPalette />
    </div>
  );
}
