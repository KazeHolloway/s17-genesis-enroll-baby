// components/vaccines/VaccineStatus.tsx

import type { VaccineStatus } from "../../lib/types";

const STYLES: Record<VaccineStatus, string> = {
  realise: "bg-green-100 text-green-800 border-green-300",
  avenir: "bg-blue-100 text-blue-800 border-blue-300",
  retard: "bg-red-100 text-red-800 border-red-300",
};

const LABELS: Record<VaccineStatus, string> = {
  realise: "✓ Réalisé",
  avenir: "À venir",
  retard: "⚠ En retard",
};

export default function VaccineStatus({ status }: { status: VaccineStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
