import { CheckCircle2, Database, FileKey, Lock, ShieldCheck, UserCheck } from "lucide-react";

const points = [
  {
    title: "Données protégées",
    text: "Les données sont chiffrées en transit et au repos, et hébergées dans le respect des exigences applicables aux données de santé.",
    icon: Lock,
  },
  {
    title: "Accès personnel",
    text: "Authentification par mot de passe. Seuls les parents rattachés au dossier et le personnel habilité peuvent le consulter.",
    icon: UserCheck,
  },
  {
    title: "Informations centralisées",
    text: "Un dossier unique qui évite les doublons, les carnets égarés et les erreurs administratives.",
    icon: Database,
  },
  {
    title: "Confidentialité dès la conception",
    text: "La vie privée de l’enfant est protégée dès la conception et le cadre réglementaire applicable est respecté.",
    icon: FileKey,
  },
];

export function SecuritySection() {
  return (
    <section id="securite" className="relative bg-[#f8faf7] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ebf5f0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#134e43]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sécurité &amp; Confidentialité</span>
          </div>

          <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance text-[#103d34] sm:text-4xl lg:text-[2.65rem]">
            Les informations de votre enfant méritent une protection particulière.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4a6b61] sm:text-lg">
            Enroll Baby protège les informations liées au dossier de l’enfant et en limite l’accès
            aux personnes autorisées.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <li
                key={point.title}
                className="soft-card-shadow soft-card-shadow-hover space-y-4 rounded-2xl border border-[#134e43]/10 bg-white p-6 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ebf5f0] text-[#134e43]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-[#1b7e5c]"
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-bold text-[#103d34]">{point.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-[#526f67] sm:text-sm">{point.text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#134e43]/15 bg-[#edf4f1] p-5 sm:flex-row sm:p-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#134e43] text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-[#2b4c42] sm:text-sm">
              Conformité réglementaire · Aucune donnée cédée à des tiers · Droit d’accès et de
              rectification.
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full border border-[#134e43]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#134e43] shadow-xs">
            Données de santé protégées
          </span>
        </div>
      </div>
    </section>
  );
}
