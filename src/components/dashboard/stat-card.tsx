import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/common/animated-counter";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  invertTrend?: boolean;
  accent: string;
  delay?: number;
}

export function StatCard({ label, value, suffix = "", icon: Icon, trend, invertTrend, accent, delay = 0 }: StatCardProps) {
  const positive = invertTrend ? (trend ?? 0) <= 0 : (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="p-5 hover:shadow-elevated transition-shadow">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accent)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend !== undefined && (
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                positive ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500" : "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500"
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold tracking-tight">
          <AnimatedCounter value={value} />
          {suffix}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </Card>
    </motion.div>
  );
}
