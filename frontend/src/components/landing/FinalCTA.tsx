import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { BotanicalBranch } from "./BotanicalAccents";
import { Badge } from "./ui/Badge";
import { BorderBeam } from "./ui/BorderBeam";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#fbfcfa] py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#12493e] via-[#0f3d34] to-[#0a2923] p-8 text-center text-white shadow-[0_24px_60px_-15px_rgba(16,61,52,0.45)] sm:p-14 lg:p-20">
          <BorderBeam size={300} duration={14} colorFrom="#2dd4bf" colorTo="#10b981" />
          <div className="grid-pattern-hero opacity-30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf]/10 blur-[100px]"
            aria-hidden="true"
          />
          <BotanicalBranch className="pointer-events-none absolute right-0 top-0 h-auto w-48 opacity-20 sm:w-72" />
          <BotanicalBranch
            className="pointer-events-none absolute bottom-0 left-0 h-auto w-44 opacity-15 sm:w-64"
            flip
          />

          <div className="relative z-10 mx-auto max-w-3xl space-y-6 sm:space-y-8">
            <Badge variant="glow">Dossier de naissance &amp; suivi vaccinal</Badge>

            <h2 className="font-cormorant text-3xl leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[3.3rem]">
              Ensemble, pour un meilleur départ.
            </h2>

            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-emerald-100/90 sm:text-lg">
              Chaque naissance compte. Chaque étape compte. Enroll Baby accompagne les parents dès
              les premiers jours pour les aider à savoir quoi faire, quand le faire et où retrouver
              les informations essentielles de leur enfant.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Link
                to="/signup"
                className="shimmer-brand shimmer-brand-light group"
                style={
                  {
                    "--shimmer-color": "#a7f3d0",
                    "--shimmer-bg": "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                  } as CSSProperties
                }
              >
                <span className="relative z-10 flex items-center gap-2 text-base font-bold">
                  <span>Créer mon compte</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                to="/login"
                className="btn-velora inline-flex items-center gap-2 border border-white/30 bg-transparent px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Se connecter</span>
              </Link>
            </div>

            <p className="font-script text-2xl text-emerald-200/90">
              Un avenir en bonne santé pour chaque enfant ♡
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
