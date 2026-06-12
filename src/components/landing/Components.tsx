import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "colorful";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25",
    secondary: "bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50",
    outline: "border-2 border-current text-violet-700 hover:bg-violet-50",
    ghost: "text-violet-700 hover:bg-violet-50",
    colorful:
      "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 text-white hover:shadow-xl hover:scale-105 transition-all",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  light = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center")}>
      <h2 className={cn("text-3xl md:text-4xl font-bold", light ? "text-white" : "text-gray-900")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg", light ? "text-purple-200" : "text-gray-600")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  hover = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm p-6",
        hover && "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function FeatureIcon({
  children,
  color = "purple",
}: {
  children: React.ReactNode;
  color?: "purple" | "green" | "blue" | "orange";
}) {
  const colors = {
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", colors[color])}>
      {children}
    </div>
  );
}
