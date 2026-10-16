import {
  Activity,
  Bell,
  FileText,
  FolderOpen,
  Home,
  Menu,
  Plus,
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
  /** Compteur d'alerte : pastille rouge au lieu de la pastille neutre. */
  badgeAlert?: boolean;
}

/**
 * Nature d'un onglet de la barre basse.
 * - `link` : navigation vers une route.
 * - `menu` : ouvre le tiroir de navigation (aucune route).
 * - `action`: action rapide surélevée au centre (Agent uniquement).
 */
export type BottomNavItemKind = "link" | "menu" | "action";

export interface BottomNavItem {
  /** Route cible. Vide pour l'onglet `menu`. */
  to: string;
  /** Libelle court : l'espace horizontal sur un telephone est rare. */
  label: string;
  icon: LucideIcon;
  kind: BottomNavItemKind;
  /** Correspondance exacte pour l'accueil. */
  end?: boolean;
  badge?: number;
  badgeAlert?: boolean;
}

/** Navigation du dashboard Parent, dans l'ordre d'affichage. */
export const parentNavItems: DashboardNavItem[] = [
  { to: "/parent/dashboard", label: "Accueil", icon: Home, end: true },
  { to: "/parent/enfants", label: "Mes enfants", icon: Users, end: false, badge: 1 },
  { to: "/parent/vaccinations", label: "Vaccinations", icon: Syringe, end: false },
  { to: "/parent/documents", label: "Documents", icon: FileText, end: false },
  {
    to: "/parent/notifications",
    label: "Notifications",
    icon: Bell,
    end: false,
    badge: 2,
    badgeAlert: true,
  },
  { to: "/parent/parametres", label: "Paramètres", icon: Settings, end: false },
];

/** Navigation du dashboard Agent de maternite, dans l'ordre d'affichage. */
export const agentNavItems: DashboardNavItem[] = [
  { to: "/agent/dashboard", label: "Tableau de bord", icon: Activity, end: true },
  { to: "/agent/nouveau-ne", label: "Nouveau-né", icon: UserRoundPlus, end: false },
  {
    to: "/agent/dossiers",
    label: "Registre",
    icon: FolderOpen,
    end: false,
    badge: 3,
  },
  { to: "/agent/vaccinations", label: "Vaccinations", icon: Syringe, end: false, badge: 5 },
  /* Pas d'entrée « Confirmation Statuts » : la page Vaccinations s'ouvre déjà
     sur cet onglet, une entrée de plus dans la sidebar était redondante. La
     route `/agent/statuts` reste accessible par URL. */
  { to: "/agent/parametres", label: "Paramètres", icon: Settings, end: false },
];

/**
 * Barre basse Parent : 5 onglets.
 * Les libelles sont raccourcis par rapport a la sidebar ("Vaccins" au lieu de
 * "Vaccinations") : sur 375px, un libelle long force la troncature.
 */
export const parentBottomNavItems: BottomNavItem[] = [
  { to: "/parent/dashboard", label: "Accueil", icon: Home, kind: "link", end: true },
  {
    to: "/parent/enfants",
    label: "Enfants",
    icon: Users,
    kind: "link",
    badge: 1,
  },
  { to: "/parent/vaccinations", label: "Vaccins", icon: Syringe, kind: "link" },
  { to: "/parent/documents", label: "Documents", icon: FileText, kind: "link" },
  { to: "", label: "Menu", icon: Menu, kind: "menu" },
];

/**
 * Barre basse Agent : 4 onglets autour d'une action rapide surelevee au centre.
 * L'action centrale remplace ici "Nouveau-né", qui reste accessible depuis le
 * tiroir et depuis l'accueil.
 */
export const agentBottomNavItems: BottomNavItem[] = [
  { to: "/agent/dashboard", label: "Aperçu", icon: Activity, kind: "link", end: true },
  { to: "/agent/nouveau-ne", label: "Déclarer", icon: Plus, kind: "action" },
  {
    to: "/agent/dossiers",
    label: "Registre",
    icon: FolderOpen,
    kind: "link",
    badge: 3,
  },
  { to: "/agent/vaccinations", label: "Vaccins", icon: Syringe, kind: "link", badge: 5 },
  { to: "", label: "Menu", icon: Menu, kind: "menu" },
];

/** Cible du basculement de role depuis le tiroir. */
export const roleSwitchTarget = {
  parent: "/parent/dashboard",
  agent: "/agent/dashboard",
} as const;

/** Titre affiche dans l'en-tete, resolu a partir de l'URL courante. */
export const pageTitles: Record<string, string> = {
  "/parent/dashboard": "Accueil",
  "/parent/enfants": "Mes enfants",
  "/parent/vaccinations": "Vaccinations",
  "/parent/documents": "Documents",
  "/parent/notifications": "Notifications",
  "/parent/parametres": "Paramètres",
  "/agent/dashboard": "Tableau de bord",
  "/agent/nouveau-ne": "Nouveau-né",
  "/agent/dossiers": "Registre",
  "/agent/vaccinations": "Vaccinations",
  "/agent/statuts": "Confirmation Statuts",
  "/agent/parametres": "Paramètres",
};

/** Titre de repli, utilise quand l'URL ne correspond a aucune page connue. */
export const defaultPageTitle = "Tableau de bord";