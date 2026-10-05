import {
  Bell,
  FileText,
  FolderOpen,
  Home,
  Syringe,
  Settings,
  UserRoundPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  /** Route absolue du dashboard. */
  to: string;
  label: string;
  icon: LucideIcon;
  /** Correspondance exacte pour la page d'accueil (evite `/parent/dashboard` actif partout). */
  end: boolean;
  /** Compteur affiche a droite du libelle. */
  badge?: number;
}

/** Navigation du dashboard Parent, dans l'ordre d'affichage. */
export const parentNavItems: DashboardNavItem[] = [
  { to: "/parent/dashboard", label: "Accueil", icon: Home, end: true },
  { to: "/parent/enfants", label: "Mes enfants", icon: Users, end: false },
  { to: "/parent/vaccinations", label: "Vaccinations", icon: Syringe, end: false, badge: 1 },
  { to: "/parent/documents", label: "Documents", icon: FileText, end: false },
  {
    to: "/parent/notifications",
    label: "Notifications",
    icon: Bell,
    end: false,
    badge: 2,
  },
  { to: "/parent/parametres", label: "Paramètres", icon: Settings, end: false },
];

/** Navigation du dashboard Agent de maternite, dans l'ordre d'affichage. */
export const agentNavItems: DashboardNavItem[] = [
  { to: "/agent/dashboard", label: "Accueil", icon: Home, end: true },
  { to: "/agent/nouveau-ne", label: "Nouveau-né", icon: UserRoundPlus, end: false },
  { to: "/agent/dossiers", label: "Dossiers", icon: FolderOpen, end: false, badge: 3 },
  { to: "/agent/vaccinations", label: "Vaccinations", icon: Syringe, end: false, badge: 5 },
  { to: "/agent/parametres", label: "Paramètres", icon: Settings, end: false },
];

/** Titre affiche dans l'en-tete, resolu a partir de l'URL courante. */
export const pageTitles: Record<string, string> = {
  "/parent/dashboard": "Accueil",
  "/parent/enfants": "Mes enfants",
  "/parent/vaccinations": "Vaccinations",
  "/parent/documents": "Documents",
  "/parent/notifications": "Notifications",
  "/parent/parametres": "Paramètres",
  "/agent/dashboard": "Accueil",
  "/agent/nouveau-ne": "Nouveau-né",
  "/agent/dossiers": "Dossiers",
  "/agent/vaccinations": "Vaccinations",
  "/agent/parametres": "Paramètres",
};

/** Titre de repli, utilise quand l'URL ne correspond a aucune page connue. */
export const defaultPageTitle = "Tableau de bord";