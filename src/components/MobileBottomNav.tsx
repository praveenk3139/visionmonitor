import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, MapPin, AlertTriangle, Camera, User, ClipboardList, Layers, Sliders } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, userRole, t } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'home'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navHome')}</span>
      </button>

      <button
        onClick={() => setCurrentTab('live_map')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'live_map'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navLiveMap')}</span>
      </button>

      {/* Floating Center Report Button */}
      <button
        onClick={() => setCurrentTab('report')}
        className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full w-13 h-13 p-3 shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
      >
        <Camera className="w-6 h-6" />
        <span className="sr-only">{t('navReport')}</span>
      </button>

      <button
        onClick={() => setCurrentTab('alerts')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'alerts'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navAlerts')}</span>
      </button>

      {userRole === 'citizen' && (
        <button
          onClick={() => setCurrentTab('my_reports')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            currentTab === 'my_reports'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">My Reports</span>
        </button>
      )}

      {userRole === 'response_team' && (
        <button
          onClick={() => setCurrentTab('response_team')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            currentTab === 'response_team'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>
      )}

      {userRole === 'admin' && (
        <button
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            currentTab === 'admin'
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Admin</span>
        </button>
      )}
    </div>
  );
};
