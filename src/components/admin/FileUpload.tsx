"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadFile, UploadError, DEFAULT_ALLOWED_TYPES, DEFAULT_MAX_SIZE } from "@/lib/uploadFile";
import { cn } from "@/lib/utils";
import { Trash2, Link, Upload } from "lucide-react";
import { Button } from "../ui/button";

export interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  externalError?: string;
  previewWidth?: number | string;
  previewHeight?: number | string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = DEFAULT_ALLOWED_TYPES.join(","),
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  className,
  label,
  externalError,
  previewWidth = 160,
  previewHeight = 160,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">(!value ? "upload" : "url");
  const inputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const error = externalError ?? internalError;
  const hasValue = !!value;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setInternalError(null);
    try {
      const url = await uploadFile(file, { allowedTypes: accept.split(","), maxSize });
      onChange(url);
    } catch (err) {
      const message =
        err instanceof UploadError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed";
      setInternalError(message);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleUrlSubmit() {
    const url = urlInputRef.current?.value?.trim();
    if (!url) return;
    setInternalError(null);
    onChange(url);
  }

  function handleRemove() {
    if (urlInputRef.current) urlInputRef.current.value = "";
    onChange("");
    onRemove?.();
  }

  function handleUrlKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      {hasValue && (
        <div
          className="relative w-full rounded-md overflow-hidden border border-border"
          style={{ height: previewHeight, width: previewWidth }}
        >
          <Image
            src={value!}
            alt={label || "Uploaded file"}
            fill
            className="object-cover"
            unoptimized
          />
          <Button
            type="button"
            onClick={handleRemove}
            disabled={uploading || disabled}
            className="absolute top-2 right-2 "
            variant="destructive"
            size="xs"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "text-xs px-2 py-1 rounded border",
              mode === "upload"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-accent",
            )}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "text-xs px-2 py-1 rounded border",
              mode === "url"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-accent",
            )}
          >
            <Link className="w-3 h-3 inline mr-1" />
            URL
          </button>
        </div>

        {mode === "upload" ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled || uploading}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:cursor-pointer disabled:opacity-50"
            />
            {uploading && <span className="text-sm text-muted-foreground">Uploading…</span>}
          </div>
        ) : (
          <div className="flex gap-1">
            <input
              ref={urlInputRef}
              type="url"
              placeholder="https://example.com/image.jpg"
              defaultValue={hasValue && !uploading ? value : ""}
              onKeyDown={handleUrlKeyDown}
              disabled={disabled}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-3"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
