// components/vaccines/VaccineFilter.tsx

import type { VaccineStatus } from "../../lib/types";

type Filter = "tous" | VaccineStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "realise", label: "✓ Réalisés" },
  { value: "avenir", label: "À venir" },
  { value: "retard", label: "⚠ En retard" },
];

export default function VaccineFilter({
  active,
  onChange,
  counts,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
            active === value
              ? "bg-primary text-white border-primary"
              : "bg-transparent text-primary border-primary/30 hover:bg-primary/10"
          }`}
        >
          {label} ({counts[value]})
        </button>
      ))}
    </div>
  );
}
