import { BorderBeam } from "./ui/BorderBeam";
import { steps } from "@/lib/landingContent";

/** The five hand-offs of the journey, from the maternity ward to daily life. */
export function JourneySection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f8f6] py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="velora-brow">De la maternité à votre quotidien</span>
          <h2 className="mt-4 font-cormorant text-3xl leading-tight tracking-tight text-[#103d34] sm:text-4xl lg:text-[2.65rem]">
            Un parcours simple, dès la naissance
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4a6b61] sm:text-lg">
            Chaque étape est prise en charge par le bon interlocuteur, et les parents gardent la
            main sur les dates qui comptent.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(([title, text], index) => (
            <li key={title} className="relative">
              <div className="soft-card-shadow soft-card-shadow-hover relative h-full overflow-hidden rounded-2xl border border-[#134e43]/10 bg-white p-6">
                <BorderBeam
                  size={140}
                  duration={9}
                  borderWidth={1}
                  colorFrom="#2dd4bf"
                  colorTo="#10b981"
                  delay={index * 0.6}
                />
                <span className="font-mono-velora text-xs font-semibold tracking-[0.14em] text-[#1b5e52]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug text-[#103d34]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#526f67]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
