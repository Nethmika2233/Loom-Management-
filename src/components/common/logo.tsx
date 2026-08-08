import { Infinity as LoomGlyph } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoomIcon({ className }: { className?: string }) {
  return <LoomGlyph className={cn("h-5 w-5", className)} strokeWidth={2.75} />;
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow",
          markClassName
        )}
      >
        <LoomIcon className="h-5 w-5" />
      </div>
      {showWordmark && <span className={cn("text-lg font-bold tracking-tight", wordmarkClassName)}>Loom</span>}
    </div>
  );
}
