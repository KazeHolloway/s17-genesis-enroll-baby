import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleNavigate = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Brand />

        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Navigation principale"
        >
          <NavLink
            to="/"
            end
            onClick={handleNavigate}
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-active" : undefined
            }
          >
            Accueil
          </NavLink>
          <Link
            to="/login"
            className="mobile-menu-link"
            onClick={handleNavigate}
          >
            Se connecter
          </Link>
          <Link
            to="/signup"
            className="mobile-menu-link"
            onClick={handleNavigate}
          >
            Créer mon compte
          </Link>
        </nav>

        <div className="header-actions">
          <Button asChild variant="brandOutline" size="sm">
            <Link to="/login" onClick={handleNavigate}>
              Se connecter
            </Link>
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link to="/signup" onClick={handleNavigate}>
              Créer mon compte
            </Link>
          </Button>
          <Button
            variant="soft"
            size="icon"
            className="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}