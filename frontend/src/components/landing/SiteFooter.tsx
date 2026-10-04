import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Shield } from "lucide-react";
import { Brand } from "./Brand";

interface NavLink {
  anchor: string;
  label: string;
}

const navLinks: NavLink[] = [
  { anchor: "hero", label: "Accueil" },
  { anchor: "a-propos", label: "À propos" },
  { anchor: "securite", label: "Sécurité" },
  { anchor: "temoignages", label: "Témoignages" },
  { anchor: "faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-950 bg-[#0c2f28] pb-12 pt-16 text-white sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-4">
            <Brand variant="white" />
            <p className="max-w-sm pt-2 text-sm leading-relaxed text-emerald-100/80">
              Le dossier numérique du nouveau-né, de la maternité à l’état civil, jusqu’au suivi
              vaccinal. Un service public et solidaire pour un départ sain et protégé.
            </p>
            <p className="flex items-center gap-2 pt-2 text-xs text-emerald-200/90">
              <Shield className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <span>Hébergement sécurisé des données de santé</span>
            </p>
          </div>

          <nav aria-label="Navigation de pied de page" className="space-y-3.5 lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              {navLinks.map((link) => (
                <li key={link.anchor}>
                  <a href={`#${link.anchor}`} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3.5 lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Espace</h2>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link to="/login" className="transition-colors hover:text-white">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/signup" className="transition-colors hover:text-white">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-xs text-emerald-100/70 transition-colors hover:text-white"
                >
                  Espace parent
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3.5 lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Informations
            </h2>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <a
                  href="mailto:support@enrollbaby.org"
                  className="transition-colors hover:text-white"
                >
                  Contact &amp; assistance
                </a>
              </li>
            </ul>

            <div className="space-y-1 pt-2 text-xs text-emerald-200/70">
              <p>Permanence soignants &amp; familles :</p>
              <a href="mailto:support@enrollbaby.org" className="font-semibold text-white">
                support@enrollbaby.org
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-b border-white/5 pb-4 pt-8 text-xs text-emerald-200/70 sm:flex-row">
          <p>© 2026 Enroll Baby. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            <span>Conçu avec</span>
            <Heart className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" aria-hidden="true" />
            <span>pour la santé de chaque nouveau-né</span>
          </p>
        </div>

        <div className="overflow-hidden pb-2 pt-6 text-center select-none sm:pt-10">
          <span className="block bg-gradient-to-b from-white/[0.12] via-emerald-300/[0.05] to-transparent bg-clip-text font-cormorant text-[3.5rem] font-bold uppercase leading-none tracking-[0.18em] text-transparent sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] xl:text-[12.5rem]">
            <Link to="/" className="pointer-events-none">
              Enroll Baby
            </Link>
          </span>
        </div>

        <p className="flex items-center justify-center gap-1.5 pt-6 text-xs text-emerald-200/60">
          <a href="#faq" className="inline-flex items-center gap-1 hover:text-white">
            Questions fréquentes
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      </div>
    </footer>
  );
}
