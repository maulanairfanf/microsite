"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadFile, UploadError, DEFAULT_ALLOWED_TYPES, DEFAULT_MAX_SIZE } from "@/lib/uploadFile";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError ?? internalError;

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

  function handleRemove() {
    onChange("");
    onRemove?.();
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      {value && (
        <div
          className="relative w-full rounded-md overflow-hidden border border-border"
          style={{ height: previewHeight, width: previewWidth }}
        >
          <Image
            src={value}
            alt={label || "Uploaded file"}
            fill
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs p-1 rounded disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
