import { Check, Printer, Smartphone } from "lucide-react";

/** Reassures parents without a smartphone that the paper journey still exists. */
export function AccessibilitySection() {
  return (
    <section className="relative border-b border-[#134e43]/10 bg-[#fbfcfa] py-20 sm:py-28 dark:border-[#ffffff]/10 dark:bg-[#000000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#165347] to-[#0f3d34] p-8 text-white shadow-2xl sm:p-12 lg:p-16 dark:from-[#141414] dark:to-[#000000] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
          <div
            className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-teal-300/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-6 lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-[0.78rem]">
                Accessibilité universelle
              </span>

              <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance text-white sm:text-4xl lg:text-[2.65rem]">
                Le numérique, sans exclure personne
              </h2>

              <div className="max-w-xl space-y-4 text-base leading-relaxed text-emerald-100/90 sm:text-lg">
                <p className="font-medium text-white">
                  Vous n’avez pas de smartphone ou d’accès à Internet ?
                </p>
                <p>
                  Le parcours papier reste disponible. Les informations essentielles et les dates
                  importantes peuvent être remises au parent sous format papier.
                </p>
              </div>

              <blockquote className="max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                <p className="font-serif text-lg italic leading-snug text-emerald-100 sm:text-xl">
                  « Avec ou sans smartphone, chaque parent doit pouvoir suivre le parcours de son
                  enfant. »
                </p>
              </blockquote>
            </div>

            <ul className="space-y-4 lg:col-span-5">
              <li className="rounded-2xl border border-white/20 bg-white p-5 text-[#103d34] shadow-lg sm:p-6 dark:border-[#ffffff]/20 dark:bg-[#141414] dark:text-[#fafafa]">
                <div className="mb-3 flex items-center gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ebf5f0] text-[#134e43] dark:bg-[#1a1a1a] dark:text-[#5eead4]">
                    <Printer className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#103d34] dark:text-[#fafafa]">
                      Format papier officiel
                    </h3>
                    <span className="text-xs font-medium text-[#1b7e5c] dark:text-[#34d399]">
                      Remis à la maternité
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[#4d6a62] sm:text-sm dark:text-[#a1a1a1]">
                  Fiche de naissance et calendrier vaccinal remis en main propre par la sage-femme,
                  avec le code d’accès nécessaire à votre compte.
                </p>
                <p className="mt-3.5 flex items-center gap-2 border-t border-[#134e43]/10 pt-3 text-xs font-semibold text-[#134e43] dark:border-[#ffffff]/12 dark:text-[#7fe8d0]">
                  <Check className="h-4 w-4 text-[#1b7e5c] dark:text-[#34d399]" aria-hidden="true" />
                  <span>Aucun téléphone ni connexion requis</span>
                </p>
              </li>

              <li className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white shadow-md backdrop-blur-md sm:p-6 dark:border-[#ffffff]/15 dark:bg-white/[0.06]">
                <div className="mb-3 flex items-center gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-emerald-200">
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Espace mobile &amp; web</h3>
                    <span className="text-xs font-medium text-emerald-200/90">
                      Accessible à tout moment
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-emerald-100/90 sm:text-sm">
                  Rappels, carnet vaccinal et accès au dossier familial depuis n’importe quel
                  navigateur.
                </p>
                <p className="mt-3.5 flex items-center gap-2 border-t border-white/15 pt-3 text-xs font-semibold text-emerald-200">
                  <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  <span>Synchronisé avec le parcours papier</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
