"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = resolvedTheme ?? theme;
  const isDark = currentTheme === "dark";

  return (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      className="h-10 w-10 rounded-full p-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
