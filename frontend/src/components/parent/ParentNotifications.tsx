import React from 'react';
import { Bell, CheckCheck, Syringe, FileText } from 'lucide-react';
import type { NotificationItem } from '../../types/dashboard';

interface ParentNotificationsProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const ParentNotifications: React.FC<ParentNotificationsProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Notifications & Rappels
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Historique de vos alertes vaccinales, messages de la maternité et état civil.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-500/30 text-xs font-semibold text-[#1b5e52] dark:text-emerald-300 hover:bg-white dark:hover:bg-[#121c19] transition-colors cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Tout marquer comme lu</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
              !n.lu
                ? 'bg-white dark:bg-[#0a0a0a] border-[#134e43]/20 dark:border-emerald-500/35 shadow-xs'
                : 'bg-[#fafcfb] dark:bg-[#080808] border-slate-200/70 dark:border-white/5 opacity-85'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                n.type === 'vaccin'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : n.type === 'etat_civil'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300'
              }`}
            >
              {n.type === 'vaccin' ? (
                <Syringe className="w-5 h-5" />
              ) : n.type === 'etat_civil' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                    {n.titre}
                  </h4>
                  {n.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      {n.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">{n.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#49685f] dark:text-emerald-200/80 leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
