import type { FC, HTMLAttributes, ReactNode } from "react";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => {
        if (closeOnBackdropClick) onClose?.();
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 min-w-[20rem] ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            {onClose && (
              <button
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
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
    </div>
  );
};
