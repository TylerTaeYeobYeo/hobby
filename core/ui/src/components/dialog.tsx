import type { FC, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";

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
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => {
        if (closeOnBackdropClick) onClose?.();
      }}
    >
      <div
        className={`bg-white/30 border border-white/40 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 min-w-[20rem] ${className}`}
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
