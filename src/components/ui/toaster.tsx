import { Toaster as Sonner } from "sonner";
import { useThemeStore } from "@/store/themeStore";

export function Toaster() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  return (
    <Sonner
      theme={resolvedTheme}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-card text-card-foreground border border-border shadow-elevated rounded-xl",
          description: "text-muted-foreground",
          actionButton: "bg-primary-600 text-white",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}
