import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  MapPin, 
  Camera, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  Users, 
  Search,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentTab, 
    cityHealth, 
    alerts, 
    devices, 
    citizenReports, 
    switchUserRole,
    t, 
    language 
  } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const recentReports = citizenReports.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-900/40">
        {/* Background ambient glowing rings */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Environmental Shield & Rapid Response</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentTab('live_map')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              <span>{t('viewLiveMap')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('report')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
            >
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>{t('reportAProblem')}</span>
            </button>
          </div>

          {/* Micro stats strip */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Active IoT Grid</p>
              <p className="text-lg font-extrabold text-emerald-400">{devices.length} Sensors Online</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Avg Verification</p>
              <p className="text-lg font-extrabold text-teal-300">&lt; 3 Seconds (AI)</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Field Teams</p>
              <p className="text-lg font-extrabold text-cyan-300">7 Municipal Crews</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Fix Resolution</p>
              <p className="text-lg font-extrabold text-emerald-400">100% Photo Proof</p>
            </div>
          </div>
        </div>
      </section>

      {/* City Environmental Health Section (Requirement #8) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 dark:text-emerald-400">
                {t('cityHealthTitle')}
              </h2>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Perumattunallur Community Zone
            </h3>
          </div>

          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Overall Score</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{cityHealth.score} / 100</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <StatusBadge status={cityHealth.level.toLowerCase()} size="sm" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[180px] truncate">
                {cityHealth.summary}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Health Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Air Quality */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <StatusBadge status={cityHealth.airQuality.status === 'Safe' ? 'safe' : 'warning'} size="sm" />
            </div>
            <p className="text-xs uppercase font-bold text-slate-400">{t('airQuality')}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {cityHealth.airQuality.status}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              AQI is {cityHealth.airQuality.aqi}. Clean air for general outdoor activities.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>View Sensor Grid</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Water Quality */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <StatusBadge status="safe" size="sm" />
            </div>
            <p className="text-xs uppercase font-bold text-slate-400">{t('waterQuality')}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {cityHealth.waterQuality.status}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              {cityHealth.waterQuality.label}. Turbidity within normal potable index.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Water Basin Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Heat Risk */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <StatusBadge status="warning" size="sm" />
            </div>
            <p className="text-xs uppercase font-bold text-slate-400">{t('heatRisk')}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {cityHealth.heatRisk.status}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              {cityHealth.heatRisk.label}. Stay hydrated in afternoon hours.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Thermal Sensor Map</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Active Alerts */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer" onClick={() => setCurrentTab('alerts')}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <StatusBadge status={activeAlerts.length > 0 ? 'high' : 'safe'} size="sm" />
            </div>
            <p className="text-xs uppercase font-bold text-slate-400">{t('activeAlerts')}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {activeAlerts.length} Localized
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              Assigned teams actively investigating flagged zones.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 9-Step Closed-Loop Flowchart (Requirements #31 & #40) */}
      <section className="bg-slate-50 dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            End-to-End Resolution Pipeline
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('workflowTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            "Something Happens → We Detect It → We Find Where → We Alert People → We Send The Right Team → We Prove It Was Fixed."
          </p>
        </div>

        {/* 9 Steps Visual Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {[
            { step: '1', title: 'SENSE', icon: '📡', desc: 'IoT Telemetry' },
            { step: '2', title: 'PREDICT', icon: '🤖', desc: 'AI Anomaly' },
            { step: '3', title: 'LOCALIZE', icon: '📍', desc: 'GIS Zone' },
            { step: '4', title: 'ALERT', icon: '🚨', desc: 'Public Notice' },
            { step: '5', title: 'REPORT', icon: '📸', desc: 'Citizen Proof' },
            { step: '6', title: 'ASSIGN', icon: '👷', desc: 'Auto Dispatch' },
            { step: '7', title: 'RESPOND', icon: '⚡', desc: 'Field Action' },
            { step: '8', title: 'PROVE', icon: '🔍', desc: 'After Photo' },
            { step: '9', title: 'RESOLVE', icon: '✅', desc: 'Closed & Safe' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-between space-y-1 shadow-sm relative group hover:border-emerald-500 transition-colors"
            >
              <span className="text-[10px] font-bold text-slate-400 absolute top-1.5 left-2">
                0{item.step}
              </span>
              <span className="text-2xl mt-2">{item.icon}</span>
              <div>
                <p className="text-[11px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Alerts Preview & Quick Report CTA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Alerts List (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Live Environmental Alerts
              </h3>
            </div>
            <button
              onClick={() => setCurrentTab('alerts')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All ({alerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alert.severity} size="sm" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Detected {alert.detectedAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{alert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {alert.location.address}
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                    {alert.simpleMessage}
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('alerts')}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Citizen Action Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-md">
              📸
            </div>
            <h3 className="text-xl font-black">See a Problem? Report in 30 Seconds.</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Spot waste dumping, water leaks, or broken streetlights? Snap a photo and let our AI route it to the exact response crew.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('report')}
            className="w-full py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Launch Citizen Reporter</span>
          </button>
        </div>

      </section>

      {/* 3 User Roles Access Hub */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Dedicated Workflows
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Built for Citizens, Field Teams & Municipal Officers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Role 1: Citizen */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl font-bold">
                👤
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Citizen Portal</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Receive localized alerts, report environmental hazards with photo evidence, and track verified resolution proof.
              </p>
            </div>
            <button
              onClick={() => switchUserRole('citizen')}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center"
            >
              Enter as Citizen
            </button>
          </div>

          {/* Role 2: Response Crew */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl font-bold">
                👷
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Response Team (Arun)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                View assigned field tasks, navigate directly to GPS incident coordinates, and upload verified "After" proof photos.
              </p>
            </div>
            <button
              onClick={() => switchUserRole('response_team')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all text-center"
            >
              Enter as Response Crew
            </button>
          </div>

          {/* Role 3: Municipal Officer / Admin */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl font-bold">
                🏛️
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Command Center (Admin)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Deploy & manage IoT devices on the map, monitor AI risk predictions, verify citizen reports, and dispatch teams.
              </p>
            </div>
            <button
              onClick={() => switchUserRole('admin')}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all text-center"
            >
              Enter as Admin Officer
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
