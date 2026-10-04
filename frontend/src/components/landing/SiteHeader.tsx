import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Brand } from "./Brand";

interface NavLink {
  /** In-page anchor id, matching the section id rendered by the landing page. */
  anchor: string;
  label: string;
}

/** Section anchors on the landing page. */
const navLinks: NavLink[] = [
  { anchor: "hero", label: "Accueil" },
  { anchor: "a-propos", label: "À propos" },
  { anchor: "securite", label: "Sécurité" },
  { anchor: "temoignages", label: "Témoignages" },
  { anchor: "faq", label: "FAQ" },
];

function isCurrent(anchor: string) {
  return (
    typeof window !== "undefined" &&
    window.location.pathname === "/" &&
    window.location.hash === "" &&
    anchor === "hero"
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-6 sm:py-3 ${
          scrolled
            ? "border-[#134e43]/15 bg-white/90 shadow-[0_12px_36px_-12px_rgba(19,78,67,0.12)] backdrop-blur-xl"
            : "border-[#134e43]/10 bg-white/70 shadow-[0_4px_20px_-4px_rgba(19,78,67,0.06)] backdrop-blur-md"
        }`}
      >
        <Brand />

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 lg:flex xl:gap-8"
        >
          {navLinks.map((link, index) => (
            <a
              key={link.anchor}
              href={`#${link.anchor}`}
              aria-current={isCurrent(link.anchor) ? "page" : undefined}
              className={`relative py-1 text-[0.92rem] font-medium transition-colors ${
                index === 0
                  ? "font-semibold text-[#103d34] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#1b5e52]"
                  : "text-[#38554d] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#1b5e52] after:transition-all after:duration-200 hover:text-[#103d34] hover:after:w-full"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="btn-velora btn-velora-ghost h-10 px-5 text-sm font-medium"
          >
            Se connecter
          </Link>
          <Link
            to="/signup"
            className="shimmer-brand shimmer-brand-sm shadow-[0_4px_16px_rgba(27,94,82,0.4)]"
          >
            <span className="relative z-10">Créer un compte</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/login"
            aria-label="Se connecter"
            className="rounded-full p-2 text-[#103d34] transition-colors hover:bg-[#eaf3ef] sm:hidden"
          >
            <span className="font-semibold">Connexion</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
            className="rounded-full p-2 text-[#103d34] transition-colors hover:bg-[#eaf3ef]"
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2.5 max-w-7xl rounded-3xl border border-[#134e43]/15 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden">
          <nav aria-label="Navigation mobile" className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.anchor}
                href={`#${link.anchor}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-base font-medium text-[#2d4a43] transition-colors hover:bg-[#f1f7f4] hover:text-[#103d34]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-[#134e43]/10 pt-4">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#f1f6f3] py-2.5 text-center text-sm font-medium text-[#103d34] transition-colors hover:bg-[#e3eee9]"
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#1b5e52] py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#144c42]"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
