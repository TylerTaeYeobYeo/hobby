import { useEffect, useRef, useState, type FC } from "react";
import { useTheme } from "../../theme";
import { VALID_THEMES, type UiTheme } from "../../theme/theme-types";

const THEME_LABELS: Record<UiTheme, string> = {
  material: "Material",
  glass: "Glass",
  neumorphism: "Neumorphism",
  cupertino: "Cupertino",
  cyberpunk: "Cyberpunk",
};

const PaletteIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

type ThemeToggleStyles = {
  button: string;
  dropdown: string;
  option: string;
  optionActive: string;
  checkmark: string;
};

const themeStyles: Record<UiTheme, ThemeToggleStyles> = {
  glass: {
    button:
      "bg-white/30 text-gray-800 border border-white/40 shadow-lg backdrop-blur-md hover:bg-white/50 active:bg-white/60 rounded-full",
    dropdown:
      "bg-white/70 border border-white/40 shadow-xl backdrop-blur-xl rounded-xl",
    option: "text-gray-800 hover:bg-white/50 rounded-lg",
    optionActive: "bg-white/60",
    checkmark: "text-blue-600",
  },
  neumorphism: {
    button:
      "bg-gray-200 text-gray-700 border-0 rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:brightness-105 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.7)]",
    dropdown:
      "bg-gray-200 shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)] rounded-xl",
    option: "text-gray-700 hover:bg-gray-300/50 rounded-lg",
    optionActive: "bg-gray-300/60",
    checkmark: "text-blue-500",
  },
  material: {
    button:
      "bg-blue-600 text-white border-0 shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-sm active:bg-blue-800 rounded-md uppercase text-xs tracking-wide",
    dropdown: "bg-white shadow-xl rounded-md border border-gray-100",
    option: "text-gray-800 hover:bg-gray-100 rounded",
    optionActive: "bg-blue-50 text-blue-700",
    checkmark: "text-blue-600",
  },
  cupertino: {
    button:
      "bg-white text-[#007AFF] border border-[#C7C7CC] shadow-sm hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-xl font-semibold",
    dropdown:
      "bg-white/95 border border-[#E5E5EA] shadow-lg rounded-2xl backdrop-blur-sm",
    option: "text-gray-800 hover:bg-[#F2F2F7] rounded-xl",
    optionActive: "bg-[#E5E5EA]",
    checkmark: "text-[#007AFF]",
  },
  cyberpunk: {
    button:
      "bg-[#12121f] text-[#00e5ff] border border-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.4)] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_16px_rgba(0,229,255,0.7)] rounded-sm font-mono uppercase tracking-widest text-xs",
    dropdown:
      "bg-[#0d0d1a] border border-[#00e5ff]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)] rounded-sm",
    option:
      "text-[#00e5ff] hover:bg-[#00e5ff]/10 font-mono uppercase tracking-wider text-xs rounded-sm",
    optionActive: "bg-[#00e5ff]/20",
    checkmark: "text-[#ff2d78]",
  },
};

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = themeStyles[theme];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-center w-9 h-9 transition-all duration-200 cursor-pointer ${styles.button}`}
        aria-label="Change theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <PaletteIcon />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className={`absolute right-0 top-11 z-50 min-w-36 py-1 ${styles.dropdown}`}
        >
          {VALID_THEMES.map((t) => (
            <button
              key={t}
              role="option"
              aria-selected={t === theme}
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 transition-colors duration-150 cursor-pointer ${styles.option} ${t === theme ? styles.optionActive : ""}`}
            >
              <span>{THEME_LABELS[t]}</span>
              {t === theme && (
                <span className={`ml-2 text-sm ${styles.checkmark}`}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
