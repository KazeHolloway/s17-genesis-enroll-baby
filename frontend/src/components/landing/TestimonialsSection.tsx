import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aminata Touré",
    role: "Jeune maman d’ Issa (3 mois)",
    location: "Dakar",
    text: "Avec la fatigue après l’accouchement, j’avais peur d’oublier la date limite de déclaration ou le premier vaccin. Les rappels clairs d’Enroll Baby m’ont apporté une sérénité totale.",
    tag: "Parent",
  },
  {
    name: "Jeanne Koffi",
    role: "Sage-femme responsable",
    location: "Maternité Mère-Enfant",
    text: "Enroll Baby nous permet d’enregistrer le nouveau-né en salle de naissance et de garder une trace fiable du dossier, ce qui sécurise le suivi vaccinal de chaque nourrisson.",
    tag: "Personnel médical",
  },
  {
    name: "Ibrahim Koné",
    role: "Père de deux enfants",
    location: "Abidjan",
    text: "Même sans connexion à la maison, le reçu papier remis à la sortie de la maternité contenait toutes les instructions. Dès que j’ai ouvert mon compte, j’ai retrouvé l’historique intact.",
    tag: "Parent",
  },
];

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="relative bg-[#f4f8f6] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1e584c] sm:text-[0.78rem]">
            Témoignages
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-[#103d34] sm:text-4xl lg:text-[2.65rem]">
            Ils nous font confiance dès les premiers jours
          </h2>
          <p className="mt-4 text-base text-[#4a6b61] sm:text-lg">
            Familles et soignants décrivent une continuité du parcours de naissance.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.name}
              className="soft-card-shadow soft-card-shadow-hover flex flex-col justify-between rounded-3xl border border-[#134e43]/10 bg-white p-7 sm:p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className="h-4 w-4 fill-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="rounded-full bg-[#ebf5f0] px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wider text-[#134e43]">
                    {testimonial.tag}
                  </span>
                </div>

                <p className="text-sm italic leading-relaxed text-[#38554d] sm:text-base">
                  « {testimonial.text} »
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#134e43]/10 pt-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#134e43] text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#103d34]">{testimonial.name}</h3>
                  <p className="text-xs text-[#526f67]">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
