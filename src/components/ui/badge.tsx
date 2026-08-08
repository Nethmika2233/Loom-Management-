import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-600 text-white",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500",
        warning: "border-transparent bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500",
        danger: "border-transparent bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500",
        info: "border-transparent bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
