import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "cinemora-theme";

/**
 * Dark is the default theme. A tiny inline script in the root head applies the
 * saved "light" class before first paint; this hook keeps React state in sync
 * (initialized to the default to avoid hydration mismatches).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("light", next === "light");
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
