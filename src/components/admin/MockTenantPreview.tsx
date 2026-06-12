"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import { PREVIEW_SECTIONS } from "@/lib/themePreviewMockData";
import type { Theme, ThemeTokens } from "@/types/components";

interface MockTenantPreviewProps {
  tokens: ThemeTokens;
  fontFamily: string;
  themeName: string;
  className?: string;
}

export function MockTenantPreview({
  tokens,
  fontFamily,
  themeName,
  className = "",
}: MockTenantPreviewProps) {
  const inMemoryTheme: Theme = {
    id: "preview",
    name: themeName || "Preview",
    fontFamily,
    theme: tokens,
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <ThemeProvider theme={inMemoryTheme} />

      <div className="mx-auto">
        <div
          className="max-w-lg h-150 overflow-y-auto"
          style={{
            background: "linear-gradient(135deg, #730e9e 0%, #9916b3 50%, #c084fc 100%)",
            borderRadius: "32px",
          }}
        >
          <div className="w-full header-font bg-page">
            <div className="container-bg container-border container-shadow">
              {PREVIEW_SECTIONS.map((section) => {
                const componentType = section.component?.name
                  ? section.component.name.toLowerCase().replace(/\s+/g, "_")
                  : section.component;
                return (
                  <ComponentRenderer
                    key={section.id}
                    component={{
                      id: section.id,
                      type: componentType,
                      ...(section.configJson ? JSON.parse(section.configJson) : {}),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
