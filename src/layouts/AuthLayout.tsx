import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutGrid, Sparkles, Users } from "lucide-react";
import { LoomIcon } from "@/components/common/logo";

const highlights = [
  { icon: LayoutGrid, text: "Beautiful drag-and-drop Kanban boards" },
  { icon: Users, text: "Real-time team collaboration" },
  { icon: Sparkles, text: "Insightful analytics & productivity tracking" },
];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500 p-12 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2 text-lg font-semibold"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <LoomIcon className="h-5 w-5" />
          </div>
          Loom
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 space-y-8"
        >
          <h1 className="text-4xl font-bold leading-tight">
            Ship work faster,<br /> together.
          </h1>
          <p className="max-w-md text-white/80">
            Loom brings your team's projects, tasks, and conversations into one elegant workspace.
          </p>
          <div className="space-y-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-white/90"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <item.icon className="h-4 w-4" />
                </div>
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 flex items-center gap-2 text-sm text-white/70"
        >
          <CheckCircle2 className="h-4 w-4" />
          Trusted by 4,000+ product teams worldwide
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
