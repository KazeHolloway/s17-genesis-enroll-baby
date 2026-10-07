import { useState } from 'react';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Search,
  Trash2,
  CheckCircle2,
  Edit2,
  Filter,
  BarChart3,
  Hospital,
  LogOut,
  Check,
  X,
} from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';
import type { AgentUser, Child } from '../../types/dashboard';

type RoleAgent = 'Sage-femme' | 'Officier État Civil' | 'Médecin Chef' | 'Administrateur';

interface AdminDashboardProps {
  agents: AgentUser[];
  childrenList: Child[];
  onAddAgent: (newAgent: AgentUser) => void;
  onUpdateAgent: (updatedAgent: AgentUser) => void;
  onDeleteAgent: (agentId: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  agents,
  childrenList,
  onAddAgent,
  onUpdateAgent,
  onDeleteAgent,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'statistiques' | 'etablissements'>('agents');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for creating/editing agent
  const [formNom, setFormNom] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelephone, setFormTelephone] = useState('+242 ');
  const [formRole, setFormRole] = useState<RoleAgent>('Sage-femme');
  const [formEtablissement, setFormEtablissement] = useState('Maternité Blanche Gomez');
  const [formMatricule, setFormMatricule] = useState('');
  const [formVille, setFormVille] = useState('Brazzaville');
  const [formService, setFormService] = useState('Maternité & Néonatalogie');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingAgent(null);
    setFormNom('');
    setFormEmail('');
    setFormTelephone('+242 06 ');
    setFormRole('Sage-femme');
    setFormEtablissement('Maternité Blanche Gomez');
    setFormMatricule(`SF-BZV-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 89)}`);
    setFormVille('Brazzaville');
    setFormService('Maternité & Néonatalogie');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (agent: AgentUser) => {
    setEditingAgent(agent);
    setFormNom(agent.nom);
    setFormEmail(agent.email || '');
    setFormTelephone(agent.telephone || '+242 ');
    setFormRole((agent.role || 'Sage-femme') as RoleAgent);
    setFormEtablissement(agent.etablissement);
    setFormMatricule(agent.matricule);
    setFormVille(agent.ville);
    setFormService(agent.service || '');
    setIsAddModalOpen(true);
  };

  const handleSubmitAgentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom.trim() || !formMatricule.trim()) {
      showToast('Veuillez renseigner le nom et le matricule de l’agent.');
      return;
    }

    if (editingAgent) {
      const updated: AgentUser = {
        ...editingAgent,
        nom: formNom.trim(),
        email: formEmail.trim(),
        telephone: formTelephone.trim(),
        role: formRole,
        etablissement: formEtablissement,
        matricule: formMatricule.trim(),
        ville: formVille,
        service: formService.trim(),
      };
      onUpdateAgent(updated);
      showToast(`Agent ${updated.nom} mis à jour avec succès.`);
    } else {
      const newAgent: AgentUser = {
        id: `agent-${Date.now()}`,
        nom: formNom.trim(),
        email: formEmail.trim() || `${formNom.toLowerCase().replace(/\s+/g, '.')}@sante.cg`,
        telephone: formTelephone.trim(),
        role: formRole,
        etablissement: formEtablissement,
        matricule: formMatricule.trim(),
        ville: formVille,
        service: formService.trim(),
        actif: true,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
      };
      onAddAgent(newAgent);
      showToast(`Nouvel agent ${newAgent.nom} créé avec succès.`);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleAgentStatus = (agent: AgentUser) => {
    const updated = { ...agent, actif: !agent.actif };
    onUpdateAgent(updated);
    showToast(`Compte de ${agent.nom} ${updated.actif ? 'activé' : 'désactivé'}.`);
  };

  // Filtered agents
  const filteredAgents = agents.filter((ag) => {
    const matchesSearch =
      ag.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.etablissement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || ag.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const etablissementsUniques = Array.from(new Set(agents.map((a) => a.etablissement)));

  return (
    <div className="min-h-screen bg-[#f3f7f5] dark:bg-black text-[#103d34] dark:text-[#e7f5f1] flex transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-[#134e43] dark:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN SIDEBAR */}
      <aside className="w-64 xl:w-72 bg-[#09221d] dark:bg-[#060606] text-white flex-shrink-0 hidden md:flex flex-col justify-between p-5 border-r border-[#153f36]/40 dark:border-white/10">
        <div className="space-y-6">
          {/* Logo & Admin Badge */}
          <div className="px-2 pt-2 space-y-2">
            <Logo variant="white" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Console Super Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'agents'
                  ? 'bg-[#144d41] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Gestion des Agents</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10">
                {agents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('etablissements')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'etablissements'
                  ? 'bg-[#144d41] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Hospital className="w-4 h-4 text-emerald-400" />
                <span>Établissements de Santé</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10">
                {etablissementsUniques.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('statistiques')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'statistiques'
                  ? 'bg-[#144d41] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Statistiques Nationales (SNIS)</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-100/75 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-emerald-400" />
            <span>Déconnexion Console</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 px-4 sm:px-8 py-4 bg-white/90 dark:bg-[#080808]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
              Administration & Gestion des Comptes Agents
            </h1>
            <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
              Contrôle d’accès des professionnels de maternité et des officiers d'état civil.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Créer un nouvel agent</span>
              <span className="sm:hidden">Créer agent</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-200/70">Total Agents Actifs</span>
              <div className="text-2xl font-black text-[#103d34] dark:text-emerald-200">
                {agents.filter((a) => a.actif !== false).length}
                <span className="text-xs font-normal text-slate-400 ml-1.5">/ {agents.length} inscrits</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-200/70">Dossiers Nouveau-nés</span>
              <div className="text-2xl font-black text-[#134e43] dark:text-emerald-400">
                {childrenList.length}
                <span className="text-xs font-normal text-slate-400 ml-1.5">enregistrés</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-200/70">Établissements Raccordés</span>
              <div className="text-2xl font-black text-[#1b7e5c] dark:text-emerald-300">
                {etablissementsUniques.length}
                <span className="text-xs font-normal text-slate-400 ml-1.5">centres</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-200/70">Conformité Sécurité</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span>100 %</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-mono">
                  Loi 29-2019
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: GESTION DES AGENTS */}
          {activeTab === 'agents' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-5">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom, matricule ou maternité..."
                    className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#121c19] text-[#103d34] dark:text-emerald-100 focus:outline-hidden focus:ring-2 focus:ring-[#134e43] dark:focus:ring-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#121c19] text-[#103d34] dark:text-emerald-100 focus:outline-hidden"
                  >
                    <option value="all">Tous les rôles ({agents.length})</option>
                    <option value="Sage-femme">Sage-femme</option>
                    <option value="Officier État Civil">Officier État Civil</option>
                    <option value="Médecin Chef">Médecin Chef</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Table of Agents */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Agent / Professionnel</th>
                      <th className="py-3 px-3">Rôle & Service</th>
                      <th className="py-3 px-3">Établissement</th>
                      <th className="py-3 px-3">Matricule</th>
                      <th className="py-3 px-3">Statut</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredAgents.map((ag) => (
                      <tr key={ag.matricule} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3">
                          <strong className="text-[#103d34] dark:text-emerald-100 block">{ag.nom}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">{ag.email || 'email non renseigné'}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300">
                            {ag.role}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">{ag.service || 'Maternité'}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                          <span className="font-medium">{ag.etablissement}</span>
                          <span className="block text-[11px] text-slate-400">{ag.ville}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                          {ag.matricule}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleAgentStatus(ag)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
                              ag.actif !== false
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                            }`}
                          >
                            {ag.actif !== false ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Actif</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                <span>Désactivé</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(ag)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                              title="Modifier les informations"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Confirmez-vous la suppression du compte de ${ag.nom} ?`)) {
                                  onDeleteAgent(ag.id || ag.matricule);
                                  showToast(`Agent ${ag.nom} retiré de la plateforme.`);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Supprimer l'accès"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ÉTABLISSEMENTS */}
          {activeTab === 'etablissements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {etablissementsUniques.map((etab) => {
                const agentsCount = agents.filter((a) => a.etablissement === etab).length;
                return (
                  <div key={etab} className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center">
                      <Hospital className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100">{etab}</h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-200/70">Brazzaville, République du Congo</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Agents habilités :</span>
                      <strong className="text-[#134e43] dark:text-emerald-300 font-mono font-bold">
                        {agentsCount} agent{agentsCount > 1 ? 's' : ''}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: STATISTIQUES GLOBALES */}
          {activeTab === 'statistiques' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                  Vue consolidée nationale du réseau d’enregistrement
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                  Données centralisées des maternités et officiers d’état civil du projet Enroll Baby.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 block mb-1">Délai moyen d'enregistrement</span>
                  <div className="text-2xl font-bold text-[#134e43] dark:text-emerald-300 font-mono">1.8 jour</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Conforme à la loi 30j</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 block mb-1">Taux de délivrance d'actes</span>
                  <div className="text-2xl font-bold text-[#134e43] dark:text-emerald-300 font-mono">94.2 %</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">+6.4% ce trimestre</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200 dark:border-white/10">
                  <span className="text-xs text-slate-500 block mb-1">Couverture vaccinale PEV</span>
                  <div className="text-2xl font-bold text-[#134e43] dark:text-emerald-300 font-mono">91.8 %</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Objectif OMS 90% atteint</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT AGENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#103d34] dark:text-emerald-100">
                  {editingAgent ? 'Modifier l’agent habilité' : 'Créer un nouveau compte agent'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                  L’agent aura les droits pour enregistrer les nouveau-nés et certifier les actes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitAgentForm} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nom complet de l'agent *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    placeholder="Ex: Dr. Sophie Mampouya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#134e43]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Rôle & Habilitation *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as RoleAgent)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm focus:outline-hidden"
                  >
                    <option value="Sage-femme">Sage-femme (Maternité)</option>
                    <option value="Officier État Civil">Officier État Civil (Mairie)</option>
                    <option value="Médecin Chef">Médecin Chef (Hôpital/CHU)</option>
                    <option value="Administrateur">Administrateur Local</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Matricule professionnel *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMatricule}
                    onChange={(e) => setFormMatricule(e.target.value.toUpperCase())}
                    placeholder="Ex: SF-BZV-2026-89"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Établissement de santé *
                  </label>
                  <input
                    type="text"
                    required
                    value={formEtablissement}
                    onChange={(e) => setFormEtablissement(e.target.value)}
                    placeholder="Ex: Maternité Blanche Gomez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Adresse e-mail professionnelle
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nom.prenom@sante.cg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Téléphone de service
                  </label>
                  <input
                    type="tel"
                    value={formTelephone}
                    onChange={(e) => setFormTelephone(e.target.value)}
                    placeholder="+242 06 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-xs sm:text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 justify-end border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingAgent ? 'Enregistrer les modifications' : 'Créer l’agent'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
