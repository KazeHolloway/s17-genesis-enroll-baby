import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  Home,
  LogOut,
  Plus,
  Settings,
  Syringe,
  Users,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';
import type { Child, VaccineItem, DocumentItem, NotificationItem } from '../../types/dashboard';
import { ChildDossierView } from './ChildDossierView';
import { ChildRegisterWizard } from './ChildRegisterWizard';
import { AppointmentModal } from './AppointmentModal';

interface ParentDashboardProps {
  childrenList: Child[];
  vaccines: VaccineItem[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  onAddChild: (child: Child) => void;
  onLogout: () => void;
  onSwitchToAgent: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  childrenList,
  vaccines,
  documents,
  notifications,
  onAddChild,
  onLogout,
}) => {
  const [currentNav, setCurrentNav] = useState<'accueil' | 'enfants' | 'vaccins' | 'documents' | 'notifications' | 'parametres'>('accueil');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notifications dropdown
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0] || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.lu).length;

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

          {/* Navigation Links */}
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
                currentNav === 'enfants' || selectedChildId
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
        <header className="sticky top-0 z-30 px-6 py-4 bg-white/80 dark:bg-[#070707]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
              Bonjour, Awa !
            </h1>
            <p className="text-xs sm:text-sm text-[#4d6a62] dark:text-emerald-200/70">
              Voici un aperçu de votre espace et de votre enfant.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-emerald-500/25 shadow-2xl p-4 z-40 space-y-3">
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
            <div className="flex items-center gap-2 pl-1 sm:pl-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b5e52] dark:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#103d34] dark:text-emerald-100">
                Awa Moussana
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Sub-view: Child Detailed Dossier */}
          {selectedChildId && selectedChild ? (
            <ChildDossierView
              child={selectedChild}
              vaccines={vaccines}
              documents={documents}
              onBack={() => setSelectedChildId(null)}
              onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
              onShowToast={showToast}
            />
          ) : (
            <>
              {/* PRIMARY ACCUEIL VIEW matching image.png (2x2 Grid) */}
              {currentNav === 'accueil' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. TOP-LEFT: Child Card matching image.png */}
                    {childrenList.map((child) => (
                      <div
                        key={child.id}
                        className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:shadow-md"
                      >
                        {/* Baby Picture avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#1b5e52]/30 dark:border-emerald-400/40 shadow-xs flex-shrink-0">
                          <img
                            src={child.photoUrl}
                            alt={`${child.prenom} ${child.nom}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
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
                              onClick={() => setSelectedChildId(child.id)}
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
                            if (childrenList[0]) setSelectedChildId(childrenList[0].id);
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

                  {/* Quick Action Banner to register child if multiple */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#ebf5f0] dark:bg-[#0a0a0a] border border-[#134e43]/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#134e43] dark:bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                          Vous avez un autre enfant ou un nouveau-né à déclarer ?
                        </h4>
                        <p className="text-xs text-[#4b6a62] dark:text-emerald-200/70">
                          Ajoutez un nouveau dossier en 3 étapes simples.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsWizardOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Déclarer un enfant
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-view: Mes Enfants List */}
              {currentNav === 'enfants' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                        Mes enfants ({childrenList.length})
                      </h2>
                      <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                        Consultez le dossier médical et d'état civil de chaque enfant.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsWizardOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un enfant</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {childrenList.map((child) => (
                      <div
                        key={child.id}
                        className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={child.photoUrl}
                            alt={child.prenom}
                            className="w-16 h-16 rounded-full object-cover border border-[#1b5e52]/30"
                          />
                          <div>
                            <h3 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                              {child.prenom} {child.nom}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Né le {child.dateNaissance} · {child.poids}
                            </p>
                            <span className="text-[11px] font-mono text-[#1b7e5c] dark:text-emerald-300">
                              {child.referenceMaternite}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            {child.status === 'complet' ? '✓ Dossier complet' : 'En cours de validation'}
                          </span>
                          <button
                            onClick={() => setSelectedChildId(child.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#134e43] text-white text-xs font-medium hover:bg-[#0e3b33] cursor-pointer"
                          >
                            Consulter le dossier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view: Vaccinations List */}
              {currentNav === 'vaccins' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                        Calendrier vaccinal national
                      </h2>
                      <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                        Suivi des doses administrées et à venir selon le calendrier PEV.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAppointmentOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Prendre rendez-vous
                    </button>
                  </div>

                  <div className="space-y-3">
                    {vaccines.map((v) => {
                      const isDone = v.statut === 'administre';
                      return (
                        <div
                          key={v.id}
                          className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isDone
                                  ? 'bg-[#1b7e5c] text-white'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              <Syringe className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                                {v.nom}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                                {v.dose} · Âge recommandé : {v.ageRecommande}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                isDone
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {isDone ? `Reçu le ${v.dateEffective}` : `Prévu : ${v.datePrevue}`}
                            </span>
                            <button
                              onClick={() => showToast(`Rappel activé pour le vaccin : ${v.nom}`)}
                              className="text-xs text-[#1b5e52] dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                            >
                              Rappel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-view: Documents List */}
              {currentNav === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                      Coffre-fort de documents
                    </h2>
                    <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                      Téléchargez vos actes officiels, attestations de maternité et carnets de santé.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-[#103d34] dark:text-emerald-100">
                              {doc.titre}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                              Réf : {doc.reference} · {doc.taille} · Signé par : {doc.signataire}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => showToast(`Téléchargement de : ${doc.titre}`)}
                          className="px-4 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Télécharger le PDF officiel</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view: Notifications */}
              {currentNav === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                      Historique des notifications
                    </h2>
                    <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                      Rappels vaccinaux, messages de la maternité et état de vos déclarations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex items-start gap-4 shadow-2xs"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                              {n.titre}
                            </h4>
                            <span className="text-xs text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#46655c] dark:text-emerald-200/80">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view: Paramètres */}
              {currentNav === 'parametres' && (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-6 max-w-2xl">
                  <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                    Paramètres du compte parent
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Nom complet</label>
                      <input
                        type="text"
                        defaultValue="Awa Moussana"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Numéro de téléphone (pour les rappels)</label>
                      <input
                        type="tel"
                        defaultValue="+242 06 12 34 56"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="awa.moussana@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => showToast('Paramètres mis à jour avec succès.')}
                        className="px-5 py-2.5 rounded-xl bg-[#1b5e52] text-white text-xs font-semibold cursor-pointer hover:bg-[#144b41]"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Wizard to Register New Child Modal */}
      <ChildRegisterWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={(newChild) => {
          onAddChild(newChild);
          showToast(`L'enfant ${newChild.prenom} ${newChild.nom} a été enregistré avec succès.`);
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
