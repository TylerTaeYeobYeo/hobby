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
  return (
    <div
      role="tablist"
      className={`inline-flex gap-1 rounded-xl border border-white/40 bg-white/20 p-1 backdrop-blur-md shadow-inner ${className}`}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 ${
              selected
                ? "bg-white/70 text-gray-900 shadow-md backdrop-blur-md"
                : "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-white/30"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
