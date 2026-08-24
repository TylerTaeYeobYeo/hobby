import { useTheme } from "../../theme";
import { tabsThemeClasses } from "./tabs.styles";

export type TabItem<T extends string> = {
  value: T;
  label: string;
};

export type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export const Tabs = <T extends string>({
  items,
  value,
  onChange,
  className = "",
}: TabsProps<T>) => {
  const { theme } = useTheme();
  const styles = tabsThemeClasses[theme];

  return (
    <div
      role="tablist"
      className={`inline-flex gap-1 ${styles.track} ${className}`}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={`px-4 py-1.5 rounded-lg font-medium cursor-pointer transition-all duration-200 ${styles.tab(selected)}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
