import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  applyTheme: () => void;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme();
      },
      applyTheme: () => {
        const resolved = resolveTheme(get().theme);
        set({ resolvedTheme: resolved });
        document.documentElement.classList.toggle("dark", resolved === "dark");
      },
    }),
    { name: "loop-theme" }
  )
);
