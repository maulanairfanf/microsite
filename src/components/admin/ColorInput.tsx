"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ColorInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

function isValidColor(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();

  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return true;
  }

  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(trimmed)) return true;
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(trimmed)) return true;
  if (/^(rgb|hsl|color)\(.+\)$/.test(trimmed)) return true;

  return false;
}

function normalizeToHex(value: string): string {
  const trimmed = value.trim();
  if (/^#([0-9a-fA-F]{6})$/i.test(trimmed)) return trimmed.toLowerCase();

  const hex3Match = trimmed.match(/^#([0-9a-fA-F]{3})$/i);
  if (hex3Match) {
    return (
      "#" +
      hex3Match[1]
        .split("")
        .map((c) => c + c)
        .join("")
    ).toLowerCase();
  }

  return trimmed;
}

export function ColorInput({
  label,
  value,
  onChange,
  error,
  className,
  disabled,
}: ColorInputProps) {
  const [textValue, setTextValue] = React.useState(value);
  const [lastValue, setLastValue] = React.useState(value);

  if (value !== lastValue) {
    setLastValue(value);
    setTextValue(value);
  }

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    onChange(newValue);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    if (isValidColor(newValue)) {
      onChange(newValue);
    }
  };

  const handleTextBlur = () => {
    if (isValidColor(textValue)) {
      const normalized = normalizeToHex(textValue);
      setTextValue(normalized);
      onChange(normalized);
    } else {
      setTextValue(value);
    }
  };

  const pickerValue = isValidColor(value) ? normalizeToHex(value).slice(0, 7) : "#000000";

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}
      <div className="flex gap-2">
        <div
          className={cn(
            "relative w-12 h-10 rounded-md border border-input overflow-hidden shrink-0",
            disabled && "opacity-50 cursor-not-allowed",
            error && "ring-[2px] ring-destructive",
          )}
        >
          <input
            type="color"
            value={pickerValue}
            onChange={handlePickerChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            aria-label={label ? `${label} color picker` : "Color picker"}
          />
          <div
            className="w-full h-full pointer-events-none"
            style={{ backgroundColor: isValidColor(value) ? value : "#000000" }}
          />
        </div>
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          disabled={disabled}
          placeholder="#ffffff"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "ring-[2px] ring-destructive",
            className,
          )}
        />
      </div>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
