"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePreview, ThemePreviewSkeleton } from "@/components/admin/ThemePreview";
import { Theme } from "@/types/components";
import { setTenantTheme } from "@/app/admin/theme/actions";

interface ThemeClientProps {
  themes: Theme[];
  currentThemeId: string | null;
  tenantId: string;
  tenantSlug: string;
}

export function ThemeClient({ themes, currentThemeId, tenantId, tenantSlug }: ThemeClientProps) {
  const [isPending, startTransition] = useTransition();
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(currentThemeId);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectTheme = useCallback((themeId: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsDebouncing(true);
    setPreviewThemeId(themeId);

    debounceRef.current = setTimeout(() => {
      setIsDebouncing(false);
      setIframeKey((k) => k + 1);
    }, 500);
  }, []);

  const handleApplyTheme = useCallback(() => {
    if (!previewThemeId || previewThemeId === currentThemeId) return;
    startTransition(async () => {
      await setTenantTheme(tenantId, previewThemeId);
    });
  }, [previewThemeId, currentThemeId, tenantId]);

  const handleResetPreview = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setPreviewThemeId(currentThemeId);
    setIsDebouncing(false);
    setIframeKey((k) => k + 1);
  }, [currentThemeId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const iframeSrc = `/${tenantSlug}${previewThemeId ? `?preview=${previewThemeId}` : ''}`;

  return (
    <div className="flex gap-6 h-[calc(100vh-150px)]">
      <div className="w-[340px] overflow-y-auto p-4">
        <div className="space-y-4">
          {isPending ? (
            <>
              {themes.map((theme) => (
                <ThemePreviewSkeleton key={theme.id} />
              ))}
            </>
          ) : (
            themes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isSelected={previewThemeId === theme.id}
                onSelect={handleSelectTheme}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Preview
          </h3>
          <div className="flex gap-2">
            {previewThemeId !== currentThemeId && !isDebouncing && (
              <>
                <Button variant="outline" size="sm" onClick={handleResetPreview}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApplyTheme}>
                  Apply Theme
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
          {isDebouncing ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={iframeSrc}
              className="w-full h-full border-0"
              title="Theme Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}
