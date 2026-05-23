"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Theme } from "@/types/components";

interface ThemePreviewProps {
  theme: Theme;
  onSelect: (themeId: string) => void;
  isSelected?: boolean;
}

export function ThemePreview({ theme, onSelect, isSelected }: ThemePreviewProps) {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncedThemeId, setDebouncedThemeId] = useState<string | null>(null);

  const handleSelect = useCallback(() => {
    if (!theme.id) return;
    const themeId = theme.id;
    setIsDebouncing(true);
    setDebouncedThemeId(themeId);

    const timer = setTimeout(() => {
      onSelect(themeId);
      setIsDebouncing(false);
      setDebouncedThemeId(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [theme.id, onSelect]);

  useEffect(() => {
    return () => {
      if (debouncedThemeId) {
        setIsDebouncing(false);
        setDebouncedThemeId(null);
      }
    };
  }, [debouncedThemeId]);

  const pageBg = theme.theme?.page?.background || "#ccc";
  const cardBg = theme.theme?.card?.background || "#fff";
  const containerBg = theme.theme?.container?.background || "#fff";
  const containerRadius = theme.theme?.container?.radius || "0.75rem";
  const cardRadius = theme.theme?.card?.radius || "0.5rem";

  return (
    <Card
      className={`p-4 cursor-pointer transition-all relative overflow-hidden ${
        isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
      }`}
      onClick={handleSelect}
    >
      {isDebouncing && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-50">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-lg shrink-0 border border-border"
          style={{ backgroundColor: pageBg }}
        >
          <div
            className="w-full h-full rounded-lg"
            style={{
              backgroundColor: containerBg,
              borderRadius: containerRadius,
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{theme.name}</h3>
            {isSelected && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Slug: {theme.slug}</p>
          <div className="mt-2 flex gap-2">
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: cardBg, borderRadius: cardRadius }}
              title="Card"
            />
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: containerBg }}
              title="Container"
            />
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: pageBg }}
              title="Page"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ThemePreviewSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24 mt-2" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-6 h-6 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
