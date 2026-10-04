import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-maternity.jpg";
import { BotanicalBranch } from "@/components/landing/BotanicalAccents";
import { Badge } from "@/components/landing/ui/Badge";

/** Les quatre promesses resumees sous le titre. */
const points = [
  {
    title: "Déclaration de naissance simplifiée",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Suivi vaccinal personnalisé",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Accès au dossier en ligne",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Sécurité des données garantie",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[94vh] flex-col justify-between overflow-hidden bg-[#fbfcfa] pb-12 pt-28 sm:pt-36"
    >
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob" />
      </div>
      <div className="grid-pattern-hero" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
        <div className="absolute right-0 top-0 h-full w-full lg:w-[62%] xl:w-[58%]">
          <img
            src={heroImage}
            alt="Une mère tenant tendrement son nouveau-né à la maternité"
            className="h-full w-full object-cover object-right opacity-95 lg:object-center lg:opacity-100"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcfa] via-[#fbfcfa]/85 lg:via-[#fbfcfa]/35 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fbfcfa] via-[#fbfcfa]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fbfcfa] to-transparent" />
        </div>

        <BotanicalBranch className="absolute left-0 top-0 h-auto w-36 opacity-75 sm:w-56" />
        <BotanicalBranch className="absolute bottom-0 left-[-20px] h-auto w-28 opacity-60 sm:w-44" />

        <div className="absolute bottom-5 right-5 hidden items-center gap-3.5 rounded-3xl border border-white/25 bg-gradient-to-r from-[#29574b]/95 via-[#1e4b3f]/95 to-[#133e33]/98 px-6 py-3.5 text-white shadow-[0_16px_36px_rgba(16,61,52,0.35)] backdrop-blur-xl md:flex lg:bottom-9 lg:right-12">
          <div className="flex flex-col text-right">
            <span className="font-script text-xl leading-tight tracking-wide text-emerald-100 lg:text-2xl">
              Un bon départ
            </span>
            <span className="flex items-center justify-end gap-1.5 font-script text-lg leading-tight tracking-wide text-emerald-200 lg:text-xl">
              <span>pour une vie meilleure</span>
              <span className="text-sm">♡</span>
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center border-l border-white/20 pl-2.5 opacity-75">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6 text-emerald-200"
              aria-hidden="true"
            >
              <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.2 3 12 4 12 4C12 4 12.8 3 14.5 3C17.5 3 20 5.5 20 8.5C20 13.5 12 21 12 21Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-6 pt-4 sm:space-y-8 sm:pt-6 lg:max-w-xl xl:max-w-2xl"
        >
          <div>
            <Badge variant="ghost">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#1b5e52]">
                Plateforme numérique
              </span>
              <span className="mx-1 text-[#134e43]/20">·</span>
              <span className="text-xs font-medium text-[#4e6c64]">Santé &amp; État civil</span>
            </Badge>
          </div>

          <h1 className="font-cormorant text-4xl leading-[1.08] tracking-tight text-[#103d34] sm:text-5xl lg:text-[4rem] xl:text-[4.45rem]">
            Chaque naissance <br />
            <span className="gradient-text-green italic font-normal">est un nouveau départ</span>
          </h1>

          <div className="max-w-lg space-y-2 text-base leading-relaxed text-[#314f47] sm:text-[1.05rem]">
            <p>
              Enroll Baby, c’est le dossier numérique de votre nouveau-né, de la maternité à l’état
              civil, jusqu’au suivi vaccinal.
            </p>
            <p className="font-semibold text-[#113f36]">Simple, sécurisé, accessible.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              to="/signup"
              className="shimmer-brand group"
              style={{ "--shimmer-color": "#2dd4bf" } as CSSProperties}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Créer un compte</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <a href="#a-propos" className="btn-velora btn-velora-ghost px-6">
              En savoir plus
            </a>
          </div>

          <div className="pt-2 md:hidden">
            <span className="font-script text-xl text-[#1e4b3f]">
              Un bon départ pour une vie meilleure ♡
            </span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-12 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl border-t border-[#113f36]/10 pt-6">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {points.map((point) => (
              <li key={point.title}>
                <div className="group space-y-2.5 rounded-2xl p-3 transition-all duration-200 hover:bg-white/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1b5e52]/30 bg-white/90 text-[#1b5e52] shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:border-[#1b5e52] group-hover:bg-[#1b5e52] group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(27,94,82,0.35)]">
                    {point.icon}
                  </div>
                  <p className="text-xs font-medium leading-snug text-[#103d34] transition-colors group-hover:text-[#1b5e52] sm:text-[0.82rem]">
                    {point.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
