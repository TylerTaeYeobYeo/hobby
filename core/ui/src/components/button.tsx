import type { ButtonHTMLAttributes, FC } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-transparent",
  secondary:
    "bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 border-gray-300",
  ghost:
    "bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-transparent",
};

const disabledClasses =
  "disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100 disabled:hover:bg-gray-100 disabled:active:bg-gray-100";

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md border font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
