import React, { useState } from 'react';
import {
  BarChart3,
  Baby,
  Activity,
  Download,
  ShieldCheck,
  Heart,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface AgentStatisticsProps {
  onShowToast: (msg: string) => void;
}

export const AgentStatistics: React.FC<AgentStatisticsProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'consolidee' | 'natalite' | 'mortalite'>('consolidee');
  const [selectedPeriod, setSelectedPeriod] = useState<'mois' | 'trimestre' | 'annee'>('mois');

  const statsConsolidees = {
    totalNaissances: selectedPeriod === 'mois' ? 142 : selectedPeriod === 'trimestre' ? 418 : 1680,
    naissancesVivantes: selectedPeriod === 'mois' ? 141 : selectedPeriod === 'trimestre' ? 415 : 1668,
    tauxSurvie: '99.3%',
    tauxDeclaration30j: '98.4%',
    tauxCesariennes: '18.2%',
    vaccinsAdministres: selectedPeriod === 'mois' ? 284 : selectedPeriod === 'trimestre' ? 836 : 3360,
    decesNeonatals: selectedPeriod === 'mois' ? 1 : selectedPeriod === 'trimestre' ? 3 : 12,
    decesMaternels: 0,
  };

  const handleExportReport = () => {
    onShowToast(`Rapport sanitaire officiel (${selectedPeriod.toUpperCase()}) généré et prêt au téléchargement.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header section matching user story */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Statistiques Épidémiologiques & Sanitaires de l’Établissement
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Maternité Blanche Gomez · Vue consolidée pour le responsable de santé et la Direction Médicale.
          </p>
        </div>

        {/* Period Selector & Export */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-white/10 rounded-2xl">
            {(['mois', 'trimestre', 'annee'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {p === 'mois' ? 'Ce mois' : p === 'trimestre' ? 'Trimestre' : 'Année'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter le rapport</span>
          </button>
        </div>
      </div>

      {/* Sub-view switcher: Vue Consolidée | Natalité | Mortalité */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'consolidee', label: 'Vue Consolidée Établissement', icon: BarChart3 },
          { key: 'natalite', label: 'Statistiques de Natalité', icon: Baby },
          { key: 'mortalite', label: 'Statistiques de Mortalité', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'consolidee' | 'natalite' | 'mortalite')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b5e52] text-white shadow-xs dark:bg-emerald-500 dark:text-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. VUE CONSOLIDÉE */}
      {activeTab === 'consolidee' && (
        <div className="space-y-6">
          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Naissances</span>
                <Baby className="w-4 h-4 text-emerald-500" />
              </span>
              <div className="text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                {statsConsolidees.totalNaissances}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {statsConsolidees.naissancesVivantes} naissances vivantes ({statsConsolidees.tauxSurvie})
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center justify-between">
                <span>Délai Déclaration &lt; 30j</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </span>
              <div className="text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                {statsConsolidees.tauxDeclaration30j}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Conforme aux objectifs du Ministère
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center justify-between">
                <span>Doses PEV Administrées</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </span>
              <div className="text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                {statsConsolidees.vaccinsAdministres}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                100% traçabilité numérique des lots
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1.5">
              <span className="text-xs text-slate-400 flex items-center justify-between">
                <span>Mortalité Maternelle</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </span>
              <div className="text-3xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
                0
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                0 décès maternel sur la période
              </p>
            </div>
          </div>

          {/* Consolidated Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Indicators Breakdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Indicateurs de Performance Maternelle & Néonatale
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Transmission État Civil sous 48h</span>
                    <span className="text-emerald-600">96.8%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Couverture Vaccinale BCG & Polio 0</span>
                    <span className="text-emerald-600">99.1%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Taux d'Accouchement par Césarienne</span>
                    <span className="text-amber-600">18.2% (Norme OMS 15-20%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '18.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Mortalité Néonatale Précoce (&lt; 7 jours)</span>
                    <span className="text-rose-600">0.7% ({statsConsolidees.decesNeonatals} cas)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '0.7%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ministry Transmission Log */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                  Transmission des Registres Sanitaires
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  En ligne
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-800 dark:text-white">Registre Mensuel de Natalité</strong>
                    <span className="text-slate-400 text-[11px]">Transmis à la Direction de l'Épidémiologie</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">Validé</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-800 dark:text-white">Notification des Décès & Événements Périnatals</strong>
                    <span className="text-slate-400 text-[11px]">Système National de Surveillance (DHIS2)</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">Synchronisé</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-800 dark:text-white">Rapport PEV Traçabilité des Doses</strong>
                    <span className="text-slate-400 text-[11px]">Coordination Centrale de Vaccination</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">À jour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATISTIQUES DE NATALITÉ */}
      {activeTab === 'natalite' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Répartition par Sexe</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                51.4% Garçons · 48.6% Filles
              </div>
              <p className="text-[11px] text-slate-500">73 garçons / 69 filles enregistrés</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Poids Moyen de Naissance</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                3,340 kg
              </div>
              <p className="text-[11px] text-slate-500">Normal (89.4% entre 2.5 et 4.0 kg)</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Âge Gestationnel Moyen</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                39.2 SA
              </div>
              <p className="text-[11px] text-slate-500">4.2% de naissances prématurées (&lt; 37 SA)</p>
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Modes d'Accouchement
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Voie basse spontanée</span>
                  <span className="font-bold text-emerald-600">78.2% (111 cas)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Césarienne programmée / urgente</span>
                  <span className="font-bold text-amber-600">18.2% (26 cas)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Accouchement assisté (Instrumental)</span>
                  <span className="font-bold text-slate-600">3.6% (5 cas)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Distribution du Poids Néonatal
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Poids normal (2 500 g – 4 000 g)</span>
                  <span className="font-bold text-emerald-600">89.4% (127 bébés)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Faible poids de naissance (&lt; 2 500 g)</span>
                  <span className="font-bold text-amber-600">7.8% (11 bébés)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                  <span className="font-semibold">Macrosomie (&gt; 4 000 g)</span>
                  <span className="font-bold text-slate-600">2.8% (4 bébés)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STATISTIQUES DE MORTALITÉ */}
      {activeTab === 'mortalite' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 text-xs text-[#134e43] dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Zéro décès maternel</strong> enregistré dans notre établissement sur l'ensemble de la période déclarée.
              </span>
            </div>
            <span className="font-bold font-mono text-[11px] px-2.5 py-1 rounded bg-white dark:bg-black border">
              Objectif ODD 3.1 Validé
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Mortalité Néonatale Précoce</span>
              <div className="text-2xl font-bold font-serif text-slate-800 dark:text-white">
                0.7% (1 décès)
              </div>
              <p className="text-[11px] text-slate-500">Taux inférieur à la moyenne nationale</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Mortinaissances (Mort-nés)</span>
              <div className="text-2xl font-bold font-serif text-slate-800 dark:text-white">
                0.7% (1 cas)
              </div>
              <p className="text-[11px] text-slate-500">Prise en charge obstétrique d'urgence</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Transmission Légale</span>
              <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <p className="text-[11px] text-slate-500">Tous les constats notifiés au Ministère</p>
            </div>
          </div>

          {/* Causes répertoriées & Audit des décès */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Audit Médical et Causes Répertoriées des Décès Périnatals
              </h3>
              <span className="text-xs text-slate-400 font-mono">Revue Mensuelle de Morbidité</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="block text-slate-800 dark:text-white">
                    Cas #DECES-2025-01 · Prématurité extrême (27 SA) avec détresse respiratoire sévère
                  </strong>
                  <p className="text-slate-500 text-[11px]">
                    Transfert en réanimation néonatale CHU. Enregistré et transmis le 04/10/2026.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold self-start sm:self-auto">
                  Déclaré & Classé
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[11px] text-slate-600 dark:text-slate-300">
              * Conformément aux directives de l'OMS et du Ministère de la Santé de la République du Congo, chaque événement périnatal donne lieu à un certificat de constatation médical et à une notification immédiate dans le système national d'information sanitaire (SNIS).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
