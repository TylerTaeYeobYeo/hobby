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
      className={`inline-flex gap-1 rounded-md bg-gray-100 p-1 ${className}`}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={`px-4 py-2 rounded-md font-medium cursor-pointer transition-colors ${
              selected
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
