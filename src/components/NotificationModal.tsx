import React from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import { Bell, Check, CheckCheck, X, AlertTriangle, ShieldCheck, Sparkles, Cpu, Clock, ExternalLink } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentTab } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.linkTab) {
      setCurrentTab(notif.linkTab);
    }
    onClose();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'assignment': return <span className="text-sm">👷</span>;
      case 'resolution': return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      case 'device': return <Cpu className="w-4 h-4 text-emerald-500" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-end p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-right-4 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Notification Center
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {notifications.filter(n => !n.read).length} Unread
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              title="Mark All Read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  !n.read
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getNotifIcon(n.type)}
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[240px]">
                      {n.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                  {n.message}
                </p>

                {n.linkTab && (
                  <div className="pt-1 pl-6 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-0.5">
                      Tap to open <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
