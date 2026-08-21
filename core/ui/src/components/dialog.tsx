import type { FC, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/theme-context";

export type DialogProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  closeOnBackdropClick?: boolean;
};

export const Dialog: FC<DialogProps> = ({
  open,
  onClose,
  title,
  closeOnBackdropClick = true,
  children,
  className = "",
  ...props
}) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";

  if (!open) return null;

  const panelClasses = isNeu
    ? "bg-gray-200 rounded-2xl shadow-[12px_12px_24px_rgba(0,0,0,0.25),-12px_-12px_24px_rgba(255,255,255,0.7)] p-6 min-w-[20rem]"
    : "bg-white/30 border border-white/40 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 min-w-[20rem]";

  return createPortal(
    <div
      className={`fixed inset-0 z-999 flex items-center justify-center ${
        isNeu ? "bg-black/40" : "bg-black/30 backdrop-blur-sm"
      }`}
      onClick={() => {
        if (closeOnBackdropClick) onClose?.();
      }}
    >
      <div
        className={`${panelClasses} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {onClose && (
              <button
                className="text-gray-500 hover:text-gray-800 cursor-pointer transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
};
