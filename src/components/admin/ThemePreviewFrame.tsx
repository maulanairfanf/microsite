"use client";

import { Loader2 } from "lucide-react";

interface ThemePreviewFrameProps {
  iframeUrl: string;
  iframeKey?: number | string;
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export function ThemePreviewFrame({
  iframeUrl,
  iframeKey,
  isLoading = false,
  title,
  emptyMessage,
  className = "",
}: ThemePreviewFrameProps) {
  return (
    <div className={`flex-1 flex flex-col min-w-0 ${className}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}

      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 min-h-[400px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : emptyMessage ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 p-6 text-center">
            {emptyMessage}
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={iframeUrl}
            className="w-full h-full border-0"
            title={title || "Theme Preview"}
          />
        )}
      </div>
    </div>
  );
}
