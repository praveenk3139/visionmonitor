import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingPage } from './components/LandingPage';
import { LiveMap } from './components/LiveMap';
import { AlertsFeed } from './components/AlertsFeed';
import { CitizenReportWizard } from './components/CitizenReportWizard';
import { CitizenMyReports } from './components/CitizenMyReports';
import { DeviceManagement } from './components/DeviceManagement';
import { SimulationMode } from './components/SimulationMode';
import { AIMonitoring } from './components/AIMonitoring';
import { ResponseTeamDashboard } from './components/ResponseTeamDashboard';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationModal } from './components/NotificationModal';
import { InteractiveDemoTour } from './components/InteractiveDemoTour';
import { 
  Radio, 
  PhoneCall, 
  Lock,
  Globe
} from 'lucide-react';

export const MainApp: React.FC = () => {
  const { currentTab, theme } = useApp();

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200`}>
      
      {/* Top Navigation */}
      <Navbar
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'home' && <LandingPage />}
        {currentTab === 'live_map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Interactive Live City Environmental Map
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time Leaflet GIS with IoT telemetry, citizen reports, and emergency crew pins.
                </p>
              </div>
            </div>
            <LiveMap height="72vh" />
          </div>
        )}
        {currentTab === 'alerts' && <AlertsFeed />}
        {currentTab === 'report' && <CitizenReportWizard />}
        {currentTab === 'my_reports' && <CitizenMyReports />}
        {currentTab === 'devices' && <DeviceManagement />}
        {currentTab === 'simulation' && <SimulationMode />}
        {currentTab === 'ai_monitoring' && <AIMonitoring />}
        {currentTab === 'response_team' && <ResponseTeamDashboard />}
        {currentTab === 'admin' && <AdminCommandCenter />}
        {currentTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Modals & Overlays */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />

      <InteractiveDemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Public Service Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 mt-auto mb-14 lg:mb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                🌿
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                EcoSentinel AI — Environmental Response Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              "Detect Local Problems. Alert the Community. Dispatch the Right Team. Verify the Solution."
              An AI-assisted civic platform connecting IoT environmental sensors, public notifications, and municipal field response.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-sky-500" /> Open Telemetry Standard
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-purple-500" /> English & Tamil Ready
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Emergency Helplines
            </p>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" /> Environmental Emergency: 1800-425-9999
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Municipal Water / Drainage: 1913
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Air Quality Hotline: 044-2235-3141
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Civic Operations
            </p>
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-600 dark:text-slate-300">Perumattunallur District Zone</p>
              <p className="text-slate-600 dark:text-slate-300">Pollution Control Division</p>
              <p className="text-slate-600 dark:text-slate-300">Urban Flooding & Stormwater Taskforce</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© {new Date().getFullYear()} EcoSentinel AI. Public Service Environmental Operations Platform.</p>
          <p className="text-slate-400">Designed for intuitive civic response & rapid problem verification.</p>
        </div>
      </footer>

    </div>
  );
};
