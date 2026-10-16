interface BotanicalBranchProps {
  className?: string;
  flip?: boolean;
}

/** Branche de sauge delicate, en accent decoratif derriere le hero et le CTA. */
export function BotanicalBranch({ className = "", flip = false }: BotanicalBranchProps) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`pointer-events-none select-none ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path
        d="M20 200C45 150 70 80 140 20"
        stroke="#658d7e"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M140 20C130 35 110 38 105 28C100 18 118 10 140 20Z" fill="#85ab9d" opacity="0.85" />
      <path d="M115 50C130 55 140 70 130 78C120 86 108 72 115 50Z" fill="#729b8c" opacity="0.8" />
      <path d="M90 85C75 80 65 95 72 105C79 115 92 108 90 85Z" fill="#96baa9" opacity="0.85" />
      <path d="M75 120C92 125 98 142 88 150C78 158 68 142 75 120Z" fill="#658d7e" opacity="0.75" />
      <path d="M48 155C32 150 25 168 35 178C45 188 56 175 48 155Z" fill="#85ab9d" opacity="0.8" />
      <path d="M30 185C42 190 45 205 38 212C31 219 22 208 30 185Z" fill="#729b8c" opacity="0.7" />
    </svg>
  );
}
