import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldAlert, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  User, 
  Cpu, 
  Radio, 
  Sparkles, 
  Sliders, 
  Check, 
  ExternalLink,
  ChevronDown,
  Play,
  Layers,
  BarChart3,
  MapPin,
  ClipboardList
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenDemoTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, onOpenDemoTour }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t, 
    userRole, 
    switchUserRole, 
    currentUser,
    notifications,
    demoStep
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner / Pulse strip */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xs py-1 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
          </span>
          <span className="font-semibold tracking-wide">
            {language === 'ta' ? 'இயக்க நிலை: நேரலை கண்காணிப்பு 24/7' : 'LIVE ECO-SYSTEM: 24/7 SENSOR & AI MONITORING ACTIVE'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-2.5 py-0.5 rounded-full font-medium transition-all shadow-sm active:scale-95"
            title="Start Guided 32-Step Demo Walkthrough"
          >
            <Play className="w-3 h-3 fill-current text-amber-300" />
            <span>{language === 'ta' ? 'முழு மாதிரி விளக்கம் (Demo)' : 'Start Interactive Demo'}</span>
            {demoStep > 0 && <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">Step {demoStep}/10</span>}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  🌿 {t('appTitle')}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Gov AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                {t('subTagline')}
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Role adaptive) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={() => setCurrentTab('live_map')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'live_map'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('navLiveMap')}
            </button>

            <button
              onClick={() => setCurrentTab('alerts')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'alerts'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('navAlerts')}
            </button>

            <button
              onClick={() => setCurrentTab('report')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1`}
            >
              <span className="text-base">📸</span>
              <span>{t('navReport')}</span>
            </button>

            {userRole === 'citizen' && (
              <button
                onClick={() => setCurrentTab('my_reports')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'my_reports'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                {t('navMyReports')}
              </button>
            )}

            {/* Response Team specific tab */}
            {userRole === 'response_team' && (
              <button
                onClick={() => setCurrentTab('response_team')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  currentTab === 'response_team'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                    : 'text-blue-600 hover:bg-blue-50/50 dark:text-blue-400'
                }`}
              >
                <span>👷 {t('navResponseTeam')}</span>
              </button>
            )}

            {/* Admin specific tabs */}
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    currentTab === 'admin'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                      : 'text-purple-600 hover:bg-purple-50/50 dark:text-purple-400'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  {t('navAdmin')}
                </button>

                <button
                  onClick={() => setCurrentTab('devices')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentTab === 'devices'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  {t('navDevices')}
                </button>

                <button
                  onClick={() => setCurrentTab('ai_monitoring')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentTab === 'ai_monitoring'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t('navAiMonitoring')}
                </button>
              </>
            )}

            {/* Simulation Tab available for quick demo */}
            <button
              onClick={() => setCurrentTab('simulation')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'simulation'
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t('navSimulation')}
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'analytics'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {t('navAnalytics')}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-emerald-500 transition-all shadow-sm"
              >
                <div className={`w-2 h-2 rounded-full ${
                  userRole === 'admin' ? 'bg-purple-500' : userRole === 'response_team' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <span className="truncate max-w-[90px] sm:max-w-none">
                  {userRole === 'citizen' ? '👤 Citizen' : userRole === 'response_team' ? '👷 Field Team' : '🏛️ Officer'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Current Profile</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.department || 'Public Citizen'}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleRoleSelect('citizen')}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 ${
                        userRole === 'citizen' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <div>
                          <p className="font-semibold">Citizen Mode</p>
                          <p className="text-[10px] text-slate-400">Public alerts & reporting</p>
                        </div>
                      </div>
                      {userRole === 'citizen' && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('response_team')}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 ${
                        userRole === 'response_team' ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>👷</span>
                        <div>
                          <p className="font-semibold">Response Team (Arun)</p>
                          <p className="text-[10px] text-slate-400">Tasks, proof upload, tracking</p>
                        </div>
                      </div>
                      {userRole === 'response_team' && <Check className="w-4 h-4 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 ${
                        userRole === 'admin' ? 'text-purple-600 font-bold bg-purple-50/50 dark:bg-purple-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>🏛️</span>
                        <div>
                          <p className="font-semibold">Municipal Officer (Admin)</p>
                          <p className="text-[10px] text-slate-400">Full command, dispatch, IoT</p>
                        </div>
                      </div>
                      {userRole === 'admin' && <Check className="w-4 h-4 text-purple-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
