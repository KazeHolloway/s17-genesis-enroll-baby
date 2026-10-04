import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";

import { Brand } from "@/components/layout/Brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <Brand />
          <nav aria-label="Liens de pied de page">
            <Link to="/">Accueil</Link>
            <Link to="/login">Se connecter</Link>
            <Link to="/signup">Créer mon compte</Link>
          </nav>
          <p className="footer-access">
            <Accessibility size={18} aria-hidden="true" />
            Un site pensée pour être accessible à tous
          </p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Enroll Baby</span>
          <span>Données protégées — France</span>
        </div>
      </div>
    </footer>
  );
}