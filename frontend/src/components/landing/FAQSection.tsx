import { useMemo, useState } from "react";
import { ArrowRight, HelpCircle, Minus, Plus, Search } from "lucide-react";
import { faqs } from "@/lib/landingContent";

type Category = "all" | "compte" | "maternite" | "vaccins" | "securite" | "accessibilite";

interface FaqEntry {
  question: string;
  answer: string;
  category: Exclude<Category, "all">;
}

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "compte", label: "Compte" },
  { id: "maternite", label: "Maternité" },
  { id: "vaccins", label: "Vaccins" },
  { id: "securite", label: "Sécurité" },
  { id: "accessibilite", label: "Accessibilité" },
];

/** Category for each shared question, so the filter chips can narrow the list. */
const categoryByQuestion: Record<string, Exclude<Category, "all">> = {
  "Qui peut créer un compte sur Enroll Baby ?": "compte",
  "Quand le dossier de mon enfant est-il créé ?": "maternite",
  "Comment fonctionne le suivi vaccinal ?": "vaccins",
  "Est-ce que mes données sont sécurisées ?": "securite",
  "Que se passe-t-il si je n’ai pas de smartphone ou Internet ?": "accessibilite",
  "Est-ce que je peux retrouver le dossier de mon enfant plus tard ?": "compte",
  "Quels documents sont nécessaires pour créer mon compte ?": "maternite",
  "Le certificat numérique remplace-t-il le document officiel ?": "maternite",
};

const entries: FaqEntry[] = faqs.map(([question, answer]) => ({
  question,
  answer,
  category: categoryByQuestion[question] ?? "compte",
}));

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showAll, setShowAll] = useState(false);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesQuery =
        query === "" ||
        entry.question.toLowerCase().includes(query) ||
        entry.answer.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const visibleFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 6);

  return (
    <section id="faq" className="relative bg-[#fbfcfa] py-20 sm:py-28 dark:bg-[#000000]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ebf5f0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#134e43] dark:bg-[#1a1a1a] dark:text-[#7fe8d0]">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Foire aux questions</span>
          </div>

          {/* `faq-title` prime sur la règle `.landing-root h2` (deux classes contre une
              classe + un élément) : le titre garde la police du texte de la
              section au lieu de la serif des hero. */}
          <h2 className="faq-title text-3xl leading-tight tracking-tight text-[#103d34] sm:text-4xl lg:text-[2.65rem] dark:text-[#fafafa]">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-base text-[#4a6b61] sm:text-lg dark:text-[#a1a1a1]">
            Trouvez rapidement les réponses à vos questions.
          </p>

          <div className="relative mx-auto mt-8 max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5c7a72] dark:text-[#737373]"
              aria-hidden="true"
            />
            <label htmlFor="faq-search" className="sr-only">
              Rechercher une question
            </label>
            <input
              id="faq-search"
              type="search"
              placeholder="Rechercher une question (vaccin, maternité, papier…)"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-[#134e43]/20 bg-white py-2.5 pl-10 pr-4 text-base text-[#103d34] shadow-xs placeholder:text-[#7d9b92] focus:border-transparent focus:ring-2 focus:ring-[#134e43] sm:text-sm dark:border-[#ffffff]/20 dark:bg-white/[0.05] dark:text-[#fafafa] dark:placeholder:text-[#737373] dark:focus:ring-[#5eead4]"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={activeCategory === category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenIndex(null);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#134e43] text-white dark:bg-[#5eead4] dark:text-[#0a0a0a]"
                    : "border border-[#134e43]/20 bg-white text-[#4d6a62] hover:bg-[#ebf5f0] hover:text-[#134e43] dark:border-[#ffffff]/20 dark:bg-white/[0.05] dark:text-[#a1a1a1] dark:hover:bg-white/10 dark:hover:text-[#fafafa]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {visibleFaqs.length > 0 ? (
          <ul className="space-y-3.5">
            {visibleFaqs.map((entry, index) => {
              const isOpen = openIndex === index;
              return (
                <li
                  key={entry.question}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "bg-white border-[#134e43]/30 shadow-md ring-1 ring-[#134e43]/10 dark:bg-white/[0.06] dark:border-[#5eead4]/30 dark:ring-[#5eead4]/15"
                      : "border-[#134e43]/10 bg-white/80 shadow-xs hover:border-[#134e43]/25 hover:bg-white dark:border-[#ffffff]/12 dark:bg-white/[0.03] dark:hover:border-[#5eead4]/25 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <span className="text-base font-semibold leading-snug text-[#103d34] sm:text-[1.05rem] dark:text-[#fafafa]">
                        {entry.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                          isOpen
                            ? "bg-[#134e43] text-white dark:bg-[#5eead4] dark:text-[#0a0a0a]"
                            : "bg-[#ebf5f0] text-[#134e43] dark:bg-[#1a1a1a] dark:text-[#5eead4]"
                        }`}
                      >
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="animate-in fade-in border-t border-[#134e43]/10 px-5 pb-6 pt-3 text-sm leading-relaxed text-[#46655c] sm:px-6 sm:text-base dark:border-[#ffffff]/12 dark:text-[#a1a1a1]">
                      <p>{entry.answer}</p>
                      {/* Les réponses sont rédigées par une IA : l'indiquer
                         ici évite de laisser croire à un avis de professionnel
                          de santé. */}
                      <p className="mt-3 text-xs text-[#7d9b92] dark:text-[#737373]">
                        Réponse générée automatiquement, à titre indicatif.
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-[#134e43]/15 bg-white p-6 py-12 text-center dark:border-[#ffffff]/15 dark:bg-white/[0.04]">
            <p className="text-[#4a6b61] dark:text-[#a1a1a1]">
              Aucune question ne correspond à cette recherche.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-3 text-xs font-semibold text-[#134e43] underline underline-offset-4 dark:text-[#7fe8d0]"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {filteredFaqs.length > 6 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll((previous) => !previous)}
              className="inline-flex items-center gap-2 rounded-full border border-[#134e43]/25 bg-white px-6 py-3 text-sm font-semibold text-[#134e43] shadow-xs transition-colors hover:bg-[#ebf5f0] dark:border-[#ffffff]/25 dark:bg-white/[0.05] dark:text-[#7fe8d0] dark:hover:bg-white/10"
            >
              <span>{showAll ? "Réduire les questions" : "Voir toutes les questions"}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
