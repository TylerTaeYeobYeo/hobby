import type { ButtonHTMLAttributes, FC } from "react";
import { useTheme } from "../../theme";
import { buttonThemeClasses, type ButtonVariant } from "./button.styles";

export type { ButtonVariant } from "./button.styles";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const { base, variants, disabled } = buttonThemeClasses[theme];

  return (
    <button
      className={`px-4 py-2 font-medium cursor-pointer disabled:cursor-not-allowed ${base} ${variants[variant]} ${disabled} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
