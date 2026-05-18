import { useEffect, useState, useCallback } from "react";

const FONT_KEY = "biblia.reader.fontSize";
const THEME_KEY = "biblia.reader.theme";

export type Theme = "light" | "dark";

export function useReaderSettings() {
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const fs = Number(localStorage.getItem(FONT_KEY));
    if (fs) setFontSize(fs);
    const t = (localStorage.getItem(THEME_KEY) as Theme) || "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const updateFont = useCallback((next: number) => {
    const clamped = Math.min(28, Math.max(14, next));
    setFontSize(clamped);
    localStorage.setItem(FONT_KEY, String(clamped));
  }, []);

  const updateTheme = useCallback((next: Theme) => {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  return {
    fontSize,
    theme,
    increaseFont: () => updateFont(fontSize + 2),
    decreaseFont: () => updateFont(fontSize - 2),
    toggleTheme: () => updateTheme(theme === "light" ? "dark" : "light"),
  };
}
