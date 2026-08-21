import type { ButtonHTMLAttributes, FC } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-500/70 text-white hover:bg-blue-500/85 active:bg-blue-600/90 border-white/40 shadow-lg shadow-blue-900/10 backdrop-blur-md",
  secondary:
    "bg-white/30 text-gray-900 hover:bg-white/50 active:bg-white/60 border-white/40 shadow-md shadow-black/5 backdrop-blur-md",
  ghost:
    "bg-white/10 text-gray-900 hover:bg-white/30 active:bg-white/40 border-transparent backdrop-blur-md",
  danger:
    "bg-red-500/70 text-white hover:bg-red-500/85 active:bg-red-600/90 border-white/40 shadow-lg shadow-red-900/10 backdrop-blur-md",
};

const disabledClasses =
  "disabled:bg-gray-200/40 disabled:text-gray-400 disabled:border-white/20 disabled:shadow-none disabled:hover:bg-gray-200/40 disabled:active:bg-gray-200/40";

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-xl border font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
