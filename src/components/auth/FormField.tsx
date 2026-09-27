"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
  autoComplete,
  hint,
  error,
  className = "",
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && isPasswordVisible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:ring-3 focus:ring-primary/20 ${isPassword ? "pr-11" : ""}`}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
      {(hint || error) && (
        <p className={`mt-1 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
