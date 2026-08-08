import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { CommandPalette } from "@/components/layout/command-palette";
import { FloatingCreateButton } from "@/components/layout/floating-create-button";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNavDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileBottomNav />
      <FloatingCreateButton />
      <CommandPalette />
    </div>
  );
}
