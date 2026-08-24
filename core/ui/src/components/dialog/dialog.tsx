import type { FC, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../theme";
import { dialogThemeClasses } from "./dialog.styles";

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
  const styles = dialogThemeClasses[theme];

  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-999 flex items-center justify-center ${styles.backdrop}`}
      onClick={() => {
        if (closeOnBackdropClick) onClose?.();
      }}
    >
      <div
        className={`${styles.panel} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
        style={styles.panelStyle}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xl font-bold ${styles.title}`}>{title}</h2>
            {onClose && (
              <button
                className={`cursor-pointer transition-colors ${styles.closeButton}`}
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
