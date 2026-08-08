import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme();
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, [theme, applyTheme]);

  return <>{children}</>;
}
