"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Appearance = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const;

export type Appearance = (typeof Appearance)[keyof typeof Appearance];

const STORAGE_KEY = "halamanku-appearance";

function applyAppearance(value: Appearance) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme =
    value === Appearance.System ? (systemDark ? Appearance.Dark : Appearance.Light) : value;
  document.documentElement.dataset.appearance = value;
}

interface AppearanceToggleProps {
  className?: string;
}

export function AppearanceToggle({ className }: AppearanceToggleProps) {
  const [theme, setTheme] = useState<Appearance>(Appearance.Light);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemAppearance = () => {
      if (document.documentElement.dataset.appearance === Appearance.System) {
        applyAppearance(Appearance.System);
      }
      setTheme(
        document.documentElement.dataset.theme === Appearance.Dark
          ? Appearance.Dark
          : Appearance.Light,
      );
    };

    syncSystemAppearance();
    mediaQuery.addEventListener("change", syncSystemAppearance);
    return () => mediaQuery.removeEventListener("change", syncSystemAppearance);
  }, []);

  function toggleAppearance() {
    const nextTheme = theme === Appearance.Dark ? Appearance.Light : Appearance.Dark;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyAppearance(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleAppearance}
      aria-label={theme === Appearance.Dark ? "Use light appearance" : "Use dark appearance"}
      title={theme === Appearance.Dark ? "Use light appearance" : "Use dark appearance"}
    >
      {theme === Appearance.Dark ? <Moon /> : <Sun />}
    </Button>
  );
}

export function AppearanceScript() {
  const script = `(() => { const key = "${STORAGE_KEY}"; const stored = localStorage.getItem(key) || "${Appearance.System}"; const dark = matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.appearance = stored; document.documentElement.dataset.theme = stored === "${Appearance.System}" ? (dark ? "${Appearance.Dark}" : "${Appearance.Light}") : stored; })();`;

  // The script is static application code and runs before hydration to avoid a color-mode flash.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
