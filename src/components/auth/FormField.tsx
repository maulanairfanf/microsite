"use client";

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
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-white mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all"
      />
      {(hint || error) && (
        <p className={`mt-1 text-xs ${error ? "text-red-200" : "text-white/70"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}