import { useState } from "react";
import { ArrowRight } from "lucide-react";
import handImage from "@/assets/baby-hand-parent.jpg";
import { faqs } from "@/lib/landingContent";
import { Badge } from "@/components/landing/ui/Badge";
import { BorderBeam } from "@/components/landing/ui/BorderBeam";
import { SpotlightCard } from "@/components/landing/ui/SpotlightCard";

const advantages = [
  {
    title: "Gain de temps",
    text: "Plus besoin de multiplier les déplacements. Tout est centralisé dans un seul espace.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Sécurité des données",
    text: "Vos informations sont protégées dans le respect du cadre applicable aux données de santé.",
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
    title: "Accessible à tous",
    text: "Une plateforme en ligne et une alternative papier pour les parents sans smartphone.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "Suivi complet",
    text: "De la naissance aux vaccins, restez informé à chaque étape du parcours.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Partenaires engagés",
    text: "Maternité, état civil et parents : tous connectés pour le bien de l’enfant.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <line x1="3" y1="21" x2="21" y2="21" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <polyline points="5 6 12 3 19 6" />
        <line x1="4" y1="10" x2="4" y2="21" />
        <line x1="20" y1="10" x2="20" y2="21" />
        <line x1="8" y1="14" x2="8" y2="17" />
        <line x1="12" y1="14" x2="12" y2="17" />
        <line x1="16" y1="14" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    title: "Pour un avenir en bonne santé",
    text: "Parce que chaque enfant mérite un suivi et une protection dès la naissance.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export function WhyChoose() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const sideFaqs = faqs.slice(0, 5);

  return (
    <section
      id="a-propos"
      className="relative overflow-hidden border-t border-[#134e43]/10 bg-[#f8faf7] py-20 sm:py-28 dark:border-[#ffffff]/10 dark:bg-[#0a0a0a]"
    >
      <div
        className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-[#2dd4bf]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 xl:gap-12">
          <div className="space-y-6 lg:col-span-6">
            <div>
              <Badge className="mb-3">Avantages clés du dossier</Badge>
              <h2 className="font-cormorant text-3xl leading-tight tracking-tight text-[#103d34] sm:text-[2.5rem] dark:text-[#fafafa]">
                Pourquoi choisir Enroll Baby ?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#4d6a62] sm:text-base dark:text-[#a1a1a1]">
                Une solution complète et fiable pour accompagner chaque famille dans les premières
                étapes de la vie de leur enfant.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              {advantages.map((advantage) => (
                <li key={advantage.title}>
                  <SpotlightCard
                    spotlightColor="rgba(45, 212, 191, 0.15)"
                    className="group h-full cursor-default"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ebf5f0] text-[#1b5e52] transition-all duration-200 group-hover:bg-[#1b5e52] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(27,94,82,0.35)] dark:bg-[#1a1a1a] dark:text-[#5eead4] dark:group-hover:bg-[#5eead4] dark:group-hover:text-[#0a0a0a] dark:group-hover:shadow-[0_4px_12px_rgba(45,212,191,0.3)]">
                      {advantage.icon}
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-bold tracking-tight text-[#103d34] transition-colors group-hover:text-[#1b5e52] dark:text-[#fafafa] dark:group-hover:text-[#7fe8d0]">
                        {advantage.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#526f67] dark:text-[#8a8a8a]">
                        {advantage.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:col-span-3">
            <figure className="relative w-full max-w-xs overflow-hidden rounded-3xl border border-[#134e43]/15 bg-white shadow-[0_18px_40px_-12px_rgba(19,78,67,0.18)] transition-transform duration-300 hover:scale-[1.02] dark:border-[#ffffff]/20 dark:bg-white/[0.04] dark:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">
              <BorderBeam size={220} duration={10} colorFrom="#1b5e52" colorTo="#2dd4bf" />
              <div className="relative aspect-[3/4.4] w-full overflow-hidden">
                <img
                  src={handImage}
                  alt="La petite main d’un nouveau-né tenant le doigt de son parent"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-4 top-5 rounded-2xl border border-white/25 bg-[#6c8f82]/90 p-4 text-center text-white shadow-lg backdrop-blur-md">
                  <span className="block font-script text-2xl leading-tight text-emerald-50">
                    Ensemble
                  </span>
                  <span className="block font-script text-lg leading-tight text-emerald-100">
                    pour un meilleur
                  </span>
                  <span className="block font-script text-xl leading-tight text-emerald-50">
                    demain
                  </span>
                  <span className="mt-1 block text-lg text-emerald-200">♡</span>
                </figcaption>
              </div>
            </figure>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <div>
              <Badge variant="ghost" className="mb-2">
                Support &amp; Réponses
              </Badge>
              <h2 className="font-cormorant text-2xl leading-tight tracking-tight text-[#103d34] sm:text-[1.85rem] dark:text-[#fafafa]">
                Questions fréquentes
              </h2>
              <p className="mt-1 text-xs text-[#526f67] dark:text-[#8a8a8a]">
                Trouvez rapidement les réponses à vos questions.
              </p>
            </div>

            <ul className="space-y-2 pt-2">
              {sideFaqs.map(([question, answer], index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <li
                    key={question}
                    className="border-b border-[#134e43]/10 pb-2.5 transition-colors dark:border-[#ffffff]/12"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-2 py-1 text-left text-xs font-semibold text-[#103d34] transition-colors hover:text-[#1b5e52] dark:text-[#fafafa] dark:hover:text-[#7fe8d0]"
                    >
                      <span className="leading-snug">{question}</span>
                      <span
                        aria-hidden="true"
                        className="flex-shrink-0 text-sm font-bold text-[#1b5e52] dark:text-[#5eead4]"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-1.5 animate-in fade-in text-xs leading-relaxed text-[#48675e] duration-150 dark:text-[#9c9c9c]">
                        {answer}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="pt-2">
              <a href="#faq" className="btn-velora btn-velora-ghost w-full text-xs">
                <span>Voir toutes les questions</span>
                <ArrowRight className="btn-arrow h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}