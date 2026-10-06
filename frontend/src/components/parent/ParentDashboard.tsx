import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Home,
  LogOut,
  Settings,
  Syringe,
  Users,
  ChevronRight,
  ArrowRight,
  User,
  Baby,
  Menu,
  X,
  KeyRound,
  Printer,
  Heart,
} from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';
import type { Child, VaccineItem, DocumentItem, NotificationItem } from '../../types/dashboard';
import { ParentChildren } from './ParentChildren';
import { ParentVaccinations } from './ParentVaccinations';
import { ParentDocuments } from './ParentDocuments';
import { ParentNotifications } from './ParentNotifications';
import { ParentSettings } from './ParentSettings';
import { ChildRegisterWizard } from '../dashboard/ChildRegisterWizard';
import { AppointmentModal } from '../dashboard/AppointmentModal';
import { CivilDeclarationCountdown } from '../CivilDeclarationCountdown';
import { LinkChildByCodeModal } from '../LinkChildByCodeModal';

interface ParentDashboardProps {
  childrenList: Child[];
  vaccines: VaccineItem[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  initialChildId?: string | null;
  onAddChild: (child: Child) => void;
  onUpdateChild?: (child: Child) => void;
  onUpdateVaccines?: (vaccines: VaccineItem[]) => void;
  onLogout: () => void;
  onSwitchToAgent: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childrenList,
  vaccines,
  documents,
  notifications,
  initialChildId,
  onAddChild,
  onUpdateChild,
  onUpdateVaccines,
  onLogout,
}) => {
  const [currentNav, setCurrentNav] = useState<'accueil' | 'enfants' | 'vaccins' | 'documents' | 'notifications' | 'parametres'>(initialChildId ? 'enfants' : 'accueil');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(initialChildId || null);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [, setShowDeclarationModal] = useState(false);
  const [, setShowDossierModal] = useState(false);
  const [, setChildForModal] = useState<Child | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completedDeadlines, setCompletedDeadlines] = useState<string[]>([]);

  // Mobile Drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Notifications dropdown
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.lu).length;

  const handleOpenChildDossier = (childId: string) => {
    setSelectedChildId(childId);
    setCurrentNav('enfants');
  };

  const handleCompleteDeadline = (
    deadlineKey: string,
    type: 'declaration' | 'vaccination' | 'visite',
    childId: string,
    meta?: { vaccineId?: string }
  ) => {
    setCompletedDeadlines((prev) => [...prev, deadlineKey]);

    if (type === 'declaration') {
      const child = childrenList.find((c) => c.id === childId);
      if (child && onUpdateChild) {
        onUpdateChild({
          ...child,
          status: 'complet',
          delaiDeclarationJours: 0,
          numeroActe: 'ACT-' + new Date().getFullYear() + '-VALIDE',
          etapes: child.etapes.map((e) =>
            e.titre.toLowerCase().includes('acte') || e.titre.toLowerCase().includes('déclaration')
              ? { ...e, complete: true, date: 'Aujourd’hui' }
              : e
          ),
        });
      }
      showToast("Déclaration de naissance enregistrée comme effectuée en mairie ! Le dossier de l'enfant est maintenant complet.");
    } else if (type === 'vaccination') {
      if (meta?.vaccineId && onUpdateVaccines) {
        const updated = vaccines.map((v) =>
          v.id === meta.vaccineId
            ? { ...v, statut: 'administre' as const, dateEffective: new Date().toLocaleDateString('fr-FR') }
            : v
        );
        onUpdateVaccines(updated);
      }
      showToast("Vaccin confirmé comme administré. Suivi vaccinal mis à jour.");
    } else {
      showToast("Échéance mise à jour avec succès dans le dossier.");
    }
  };

  // Find child with pending civil registration (Ticket 3)
  const pendingDeclarationChild = childrenList.find(
    (c) =>
      (c.status !== 'complet' || (c.delaiDeclarationJours !== undefined && c.delaiDeclarationJours > 0)) &&
      !completedDeadlines.includes(`decl-${c.id}`)
  );

  // Find next vaccine (Ticket 3)
  const upcomingVaccineItem = vaccines.find(
    (v) => v.statut === 'a_venir' && !completedDeadlines.includes(`vac-${v.id}`)
  );

  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0] || null;

  // Dynamic Upcoming Deadlines (Ticket 2)
  const upcomingDeadlinesList = [
    ...(pendingDeclarationChild
      ? [
          {
            id: `decl-${pendingDeclarationChild.id}`,
            key: `decl-${pendingDeclarationChild.id}`,
            type: 'declaration' as const,
            title: `Déclaration de naissance à l'État Civil (${pendingDeclarationChild.prenom})`,
            description: "Présentez la déclaration imprimée remise par la maternité à la mairie dans le délai légal de 30 jours.",
            badge: `J-${pendingDeclarationChild.delaiDeclarationJours || 18} restant(s)`,
            badgeColor: 'amber',
            date: 'Sous 30 jours',
            urgent: true,
            childId: pendingDeclarationChild.id,
            actionLabel: "Marquer comme déclarée en mairie",
          },
        ]
      : []),
    ...(upcomingVaccineItem
      ? [
          {
            id: `vac-${upcomingVaccineItem.id}`,
            key: `vac-${upcomingVaccineItem.id}`,
            type: 'vaccination' as const,
            title: `${upcomingVaccineItem.nom} (${upcomingVaccineItem.dose})`,
            description: `Vaccination PEV recommandée à ${upcomingVaccineItem.ageRecommande}. Lieu : Centre de santé ou CSI.`,
            badge: upcomingVaccineItem.datePrevue,
            badgeColor: 'emerald',
            date: upcomingVaccineItem.datePrevue,
            urgent: false,
            childId: upcomingVaccineItem.childId,
            meta: { vaccineId: upcomingVaccineItem.id },
            actionLabel: "Confirmer administré",
          },
        ]
      : []),
    {
      id: 'visite-postnatale-1',
      key: 'visite-postnatale-1',
      type: 'visite' as const,
      title: 'Consultation pédiatrique & pesée du 1er mois',
      description: 'Contrôle de croissance (poids, taille, périmètre crânien) et motricité du nouveau-né.',
      badge: 'Dans 12 jours',
      badgeColor: 'blue',
      date: 'Novembre 2026',
      urgent: false,
      childId: childrenList[0]?.id || '',
      actionLabel: "Marquer effectuée",
    },
    {
      id: 'vac-penta2',
      key: 'vac-penta2',
      type: 'vaccination' as const,
      title: 'Pentavalent 2 + Polio 2 + Rota 2 (10 semaines)',
      description: 'Deuxième injection du calendrier vaccinal du Programme Élargi de Vaccination.',
      badge: 'Dans 35 jours',
      badgeColor: 'emerald',
      date: 'Décembre 2026',
      urgent: false,
      childId: childrenList[0]?.id || '',
      actionLabel: "Confirmer administré",
    },
  ].filter((d) => !completedDeadlines.includes(d.key));

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-black text-[#103d34] dark:text-[#e6f4f1] flex transition-colors duration-300">
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-[#134e43] dark:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR matching image.png */}
      <aside className="w-64 xl:w-72 bg-[#123830] dark:bg-[#070707] text-white flex-shrink-0 hidden md:flex flex-col justify-between p-5 border-r border-[#194c41]/50 dark:border-white/10 transition-colors">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="px-2 pt-2">
            <Logo variant="white" />
          </div>

          {/* Navigation Links matching image.png */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => {
                setCurrentNav('accueil');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'accueil' && !selectedChildId
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-300" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => {
                setCurrentNav('enfants');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'enfants'
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Mes enfants</span>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full">
                {childrenList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentNav('vaccins');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'vaccins'
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Syringe className="w-4 h-4 text-emerald-300" />
              <span>Vaccinations</span>
            </button>

            <button
              onClick={() => {
                setCurrentNav('documents');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'documents'
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Documents</span>
            </button>

            <button
              onClick={() => {
                setCurrentNav('notifications');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'notifications'
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-300" />
                <span>Notifications</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentNav('parametres');
                setSelectedChildId(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentNav === 'parametres'
                  ? 'bg-[#1b4d42] dark:bg-[#1a2b27] text-emerald-200 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-300" />
              <span>Paramètres</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-100/75 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-emerald-400" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header matching image.png */}
        <header className="sticky top-0 z-30 px-3 sm:px-6 py-3 sm:py-4 bg-white/90 dark:bg-[#070707]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-[#103d34] dark:text-emerald-300 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu mobile"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo Indicator matching iPhone 1 mockup */}
            <div className="md:hidden flex items-center">
              <Logo className="scale-[0.85] origin-left" />
            </div>

            {/* Desktop Greetings */}
            <div className="hidden md:block">
              <h1 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9] leading-tight">
                Bonjour, Awa !
              </h1>
              <p className="text-xs sm:text-sm text-[#4d6a62] dark:text-emerald-200/70">
                Voici un aperçu de votre espace et du dossier de votre enfant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Velora UI Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="relative p-2 rounded-full bg-white dark:bg-[#121c19] hover:bg-[#f0f6f3] dark:hover:bg-[#1b2b27] border border-slate-200 dark:border-emerald-500/30 text-[#134e43] dark:text-emerald-200 transition-colors cursor-pointer"
                aria-label="Voir les notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-black" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-emerald-500/25 shadow-2xl p-4 z-40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#103d34] dark:text-emerald-100">
                      Notifications ({unreadNotifsCount})
                    </span>
                    <button
                      onClick={() => {
                        notifications.forEach((n) => (n.lu = true));
                        setShowNotificationsDropdown(false);
                        showToast('Toutes les notifications sont marquées comme lues.');
                      }}
                      className="text-[11px] font-semibold text-[#1b7e5c] dark:text-emerald-300 hover:underline"
                    >
                      Tout marquer lu
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2.5 rounded-xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-100 dark:border-emerald-500/15 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#103d34] dark:text-emerald-100">
                            {notif.titre}
                          </h4>
                          <span className="text-[10px] text-slate-400">{notif.date}</span>
                        </div>
                        <p className="text-xs text-[#526f67] dark:text-emerald-200/80">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar "A" */}
            <div
              onClick={() => {
                setCurrentNav('parametres');
                setSelectedChildId(null);
              }}
              className="flex items-center gap-2 pl-0.5 sm:pl-2 cursor-pointer"
              title="Mon profil"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b5e52] dark:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#103d34] dark:text-emerald-100">
                Awa Moussana
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Views with mobile padding pb-28 */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 pb-28 md:pb-8">
          {/* ACCUEIL VIEW matching image.png */}
          {currentNav === 'accueil' && (
            <div className="space-y-6">
              {/* Mobile Greeting matching Screen 1 (iPhone 1) */}
              <div className="md:hidden space-y-1">
                <h1 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                  Bonjour, Awa !
                </h1>
                <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                  Voici un aperçu de votre espace et des échéances de votre enfant.
                </p>
              </div>

              {/* COMPTE À REBOURS LÉGAL DE 30 JOURS ÉTAT CIVIL */}
              {pendingDeclarationChild && (
                <CivilDeclarationCountdown
                  child={pendingDeclarationChild}
                  onOpenDeclarationModal={() => {
                    setChildForModal(pendingDeclarationChild);
                    setShowDeclarationModal(true);
                  }}
                  onMarkDeclared={() =>
                    handleCompleteDeadline(
                      `decl-${pendingDeclarationChild.id}`,
                      'declaration',
                      pendingDeclarationChild.id
                    )
                  }
                />
              )}

              {/* RAPPELS PRIORITAIRES DANS L'ESPACE PARENT (Ticket 3) */}
              <div className="space-y-3">
                {/* 1. Rappel Vaccination Approchante (24h / Date proche) */}
                {upcomingVaccineItem && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-800/40 text-[#103d34] dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs animate-in fade-in">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#1b5e52] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Syringe className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                            Rappel Vaccination : {upcomingVaccineItem.nom}
                          </h4>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                            Prévu le {upcomingVaccineItem.datePrevue}
                          </span>
                        </div>
                        <p className="text-xs text-[#3b6357] dark:text-emerald-300/85 leading-relaxed">
                          Dose recommandée à {upcomingVaccineItem.ageRecommande}. Munissez-vous du carnet de santé de votre enfant lors de votre visite au centre.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCompleteDeadline(`vac-${upcomingVaccineItem.id}`, 'vaccination', upcomingVaccineItem.childId, { vaccineId: upcomingVaccineItem.id })}
                        className="px-3.5 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmer administré</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAppointmentOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-black border border-emerald-500/30 text-[#134e43] dark:text-emerald-200 text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Gérer RDV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: PROCHAINES ÉCHÉANCES DÉCLARATION & VACCINATIONS (Ticket 2) */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#103d34] dark:text-[#f0fdf9]">
                        Prochaines échéances de suivi ({upcomingDeadlinesList.length} restante{upcomingDeadlinesList.length > 1 ? 's' : ''})
                      </h3>
                      {upcomingDeadlinesList.length === 0 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                          À jour
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                      Démarches prioritaires enregistrées pour votre enfant : déclaration d'état civil, vaccinations et bilans.
                    </p>
                  </div>
                </div>

                {upcomingDeadlinesList.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Toutes les échéances actuelles sont à jour !
                    </h4>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 max-w-md mx-auto">
                      La déclaration de naissance est enregistrée et tous les vaccins prévus pour cette période ont été confirmés.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlinesList.map((d) => (
                      <div
                        key={d.id}
                        className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-[#134e43]/30"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              d.type === 'declaration'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : d.type === 'vaccination'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {d.type === 'declaration' ? (
                              <FileText className="w-4 h-4" />
                            ) : d.type === 'vaccination' ? (
                              <Syringe className="w-4 h-4" />
                            ) : (
                              <Heart className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                                {d.title}
                              </h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  d.badgeColor === 'amber'
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                    : d.badgeColor === 'emerald'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                                }`}
                              >
                                {d.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#526f67] dark:text-emerald-200/75 mt-0.5">
                              {d.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          {d.type === 'declaration' && (
                            <button
                              type="button"
                              onClick={() => {
                                setChildForModal(childrenList.find((c) => c.id === d.childId) || null);
                                setShowDeclarationModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-black text-[#134e43] dark:text-emerald-200 text-xs font-semibold cursor-pointer"
                            >
                              Imprimer
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCompleteDeadline(d.key, d.type, d.childId, (d as { meta?: { vaccineId?: string } }).meta)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{d.actionLabel}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CARTES ACCÈS DIRECT PARCOURS PAPIER & CERTIFICAT NUMÉRIQUE (Ticket 4 & 5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setChildForModal(activeChild);
                    setShowDeclarationModal(true);
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 group-hover:text-emerald-600 transition-colors">
                      Déclaration de Naissance Officielle & Certificat Numérique
                    </h4>
                    <p className="text-xs text-[#526f67] dark:text-emerald-200/70 mt-0.5">
                      Générer la version imprimable pour l'Officier d'État Civil avec certificat certifié (Loi 30j).
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setChildForModal(activeChild);
                    setShowDossierModal(true);
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 group-hover:text-emerald-600 transition-colors">
                      Parcours Papier & Dossier de Santé Imprimé
                    </h4>
                    <p className="text-xs text-[#526f67] dark:text-emerald-200/70 mt-0.5">
                      Carnet de santé physique autonome complet pour parents sans smartphone ou sans connexion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. TOP-LEFT: Child Card matching image.png */}
                {childrenList.map((child) => (
                  <div
                    key={child.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:shadow-md"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#1b5e52]/30 dark:border-emerald-400/40 shadow-xs flex-shrink-0">
                      <img
                        src={child.photoUrl}
                        alt={`${child.prenom} ${child.nom}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                          {child.prenom} {child.nom}
                        </h2>
                        <p className="text-xs text-[#526f67] dark:text-emerald-200/70 mt-0.5">
                          Né le {child.dateNaissance} · {child.poids} · {child.taille}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f7f2] dark:bg-emerald-950/60 text-[#1b7e5c] dark:text-emerald-300 border border-[#1b7e5c]/20 dark:border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dossier complet</span>
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenChildDossier(child.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Voir le dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 2. TOP-RIGHT: Prochaine vaccination card matching image.png */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                          Prochaine vaccination
                        </h3>
                        <span className="text-xs text-slate-400">Rappel automatique</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                        15 oct. 2025
                      </div>
                      <p className="text-sm font-medium text-[#2d4d44] dark:text-emerald-200">
                        VPI - 2ème dose
                      </p>
                      <p className="text-xs font-semibold text-[#1b7e5c] dark:text-emerald-400">
                        Il reste 17 jours
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => setCurrentNav('vaccins')}
                      className="text-xs font-semibold text-[#1b5e52] dark:text-emerald-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir le calendrier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. BOTTOM-LEFT: Dernières étapes card matching image.png */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 pb-2">
                      Dernières étapes
                    </h3>

                    <div className="space-y-3 pt-1">
                      {[
                        { titre: 'Déclaration de naissance', date: '12 avr. 2025' },
                        { titre: 'Acte de naissance', date: '20 avr. 2025' },
                        { titre: 'Carnet de santé', date: '25 avr. 2025' },
                        { titre: 'Compte parent créé', date: '28 avr. 2025' },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400 flex-shrink-0" />
                            <span className="font-medium text-[#103d34] dark:text-emerald-100">
                              {step.titre}
                            </span>
                          </div>
                          <span className="text-slate-400 text-xs font-mono">
                            {step.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => {
                        if (childrenList[0]) handleOpenChildDossier(childrenList[0].id);
                      }}
                      className="text-xs font-semibold text-[#1b5e52] dark:text-emerald-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir tout le parcours</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. BOTTOM-RIGHT: Affirmation Card matching image.png */}
                <div className="relative rounded-3xl overflow-hidden shadow-xs border border-[#134e43]/15 dark:border-emerald-500/25 min-h-[220px] flex items-center justify-center p-6 text-center group">
                  <img
                    src="/src/assets/images/baby_hands_parent_1791124506831.jpg"
                    alt="Mains parentales tenant les pieds du bébé"
                    className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/20" />

                  <div className="relative z-10 text-white space-y-1">
                    <p className="font-script text-2xl sm:text-3xl text-emerald-100 drop-shadow-md">
                      Parce que chaque enfant compte
                    </p>
                    <p className="text-xl sm:text-2xl text-emerald-200">
                      ♡
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Banner to link child with maternity code (FRD Rule) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#ebf5f0] dark:bg-[#0a0a0a] border border-[#134e43]/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#134e43] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                      Rattacher un autre enfant avec son code maternité
                    </h4>
                    <p className="text-xs text-[#4b6a62] dark:text-emerald-200/70">
                      Entrez le code d'accès unique remis par la sage-femme pour consulter son dossier.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLinkModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Rattacher avec code</span>
                </button>
              </div>
            </div>
          )}

          {/* SUB-COMPONENTS VIEW */}
          {currentNav === 'enfants' && (
            <ParentChildren
              childrenList={childrenList}
              vaccines={vaccines}
              documents={documents}
              selectedChildId={selectedChildId}
              onSelectChild={(id) => setSelectedChildId(id)}
              onOpenLinkModal={() => setIsLinkModalOpen(true)}
              onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentNav === 'vaccins' && (
            <ParentVaccinations
              vaccines={vaccines}
              onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentNav === 'documents' && (
            <ParentDocuments
              documents={documents}
              onShowToast={showToast}
            />
          )}

          {currentNav === 'notifications' && (
            <ParentNotifications
              notifications={notifications}
              onMarkAllRead={() => {
                notifications.forEach((n) => (n.lu = true));
                showToast('Toutes les notifications sont marquées comme lues.');
              }}
            />
          )}

          {currentNav === 'parametres' && (
            <ParentSettings
              onShowToast={showToast}
              onNavigateToChildren={() => {
                setCurrentNav('enfants');
                setSelectedChildId(null);
              }}
            />
          )}
        </main>

        {/* MOBILE-FIRST BOTTOM NAVIGATION TAB BAR matching the 4 iPhone mockups */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#070707]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
          {/* 1. Accueil (iPhone 1) */}
          <button
            onClick={() => {
              setCurrentNav('accueil');
              setSelectedChildId(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-h-[50px] min-w-[62px] transition-all active:scale-95 cursor-pointer ${
              currentNav === 'accueil' && !selectedChildId
                ? 'text-[#1b5e52] dark:text-emerald-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${currentNav === 'accueil' && !selectedChildId ? 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Accueil</span>
          </button>

          {/* 2. Vaccinations (iPhone 2) */}
          <button
            onClick={() => {
              setCurrentNav('vaccins');
              setSelectedChildId(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-h-[50px] min-w-[62px] transition-all active:scale-95 cursor-pointer ${
              currentNav === 'vaccins'
                ? 'text-[#1b5e52] dark:text-emerald-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${currentNav === 'vaccins' ? 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300' : ''}`}>
              <Syringe className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Vaccinations</span>
          </button>

          {/* 3. Documents (iPhone 3) */}
          <button
            onClick={() => {
              setCurrentNav('documents');
              setSelectedChildId(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-h-[50px] min-w-[62px] transition-all active:scale-95 cursor-pointer ${
              currentNav === 'documents'
                ? 'text-[#1b5e52] dark:text-emerald-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${currentNav === 'documents' ? 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Documents</span>
          </button>

          {/* 4. Profil (iPhone 4: Mon profil) */}
          <button
            onClick={() => {
              setCurrentNav('parametres');
              setSelectedChildId(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-h-[50px] min-w-[62px] transition-all active:scale-95 cursor-pointer ${
              currentNav === 'parametres'
                ? 'text-[#1b5e52] dark:text-emerald-400 font-bold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${currentNav === 'parametres' ? 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Profil</span>
          </button>
        </nav>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#123830] dark:bg-[#0a0a0a] text-white h-full flex flex-col justify-between p-5 z-50 shadow-2xl animate-in slide-in-from-left duration-200 border-r border-[#194c41]/50 dark:border-white/10">
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pt-1">
                <Logo variant="white" />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User profile mini badge */}
              <div className="p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b5e52] dark:bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  A
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    Awa Moussana
                  </h4>
                  <p className="text-[11px] text-emerald-300/80 truncate">
                    Mère de {childrenList[0]?.prenom || 'Moussa'}
                  </p>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1.5 pt-1">
                <button
                  onClick={() => {
                    setCurrentNav('accueil');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'accueil' && !selectedChildId
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home className="w-4 h-4 text-emerald-300" />
                  <span>Accueil</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentNav('enfants');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'enfants'
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Baby className="w-4 h-4 text-emerald-300" />
                    <span>Mes enfants</span>
                  </div>
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full">
                    {childrenList.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setCurrentNav('vaccins');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'vaccins'
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Syringe className="w-4 h-4 text-emerald-300" />
                  <span>Vaccinations</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentNav('documents');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'documents'
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-300" />
                  <span>Documents</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentNav('notifications');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'notifications'
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-emerald-300" />
                    <span>Notifications</span>
                  </div>
                  {unreadNotifsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentNav('parametres');
                    setSelectedChildId(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentNav === 'parametres'
                      ? 'bg-[#1b4d42] text-emerald-200 font-semibold shadow-xs'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4 text-emerald-300" />
                  <span>Paramètres</span>
                </button>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-100/75 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-emerald-400" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Child Register Wizard Modal (Reserved for administrative flows) */}
      <ChildRegisterWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={(newChild) => {
          onAddChild(newChild);
          showToast(`L'enfant ${newChild.prenom} ${newChild.nom} a été enregistré avec succès.`);
        }}
      />

      {/* Link Child By Maternity Access Code Modal (FRD Rule: Parent does not register newborn) */}
      <LinkChildByCodeModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        childrenList={childrenList}
        onSuccessLinked={(linkedChild) => {
          setSelectedChildId(linkedChild.id);
          setCurrentNav('enfants');
          showToast(`Le dossier de ${linkedChild.prenom} ${linkedChild.nom} est maintenant rattaché à votre espace.`);
        }}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onBookSuccess={(details) => showToast(details)}
      />
    </div>
  );
};
