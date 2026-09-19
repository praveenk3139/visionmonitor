import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EnvironmentalAlert } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Send, 
  Smartphone, 
  Mail, 
  Bell, 
  Search, 
  Filter, 
  Radio, 
  CheckCircle2, 
  HeartPulse, 
  Eye, 
  X,
  Share2
} from 'lucide-react';

export const AlertsFeed: React.FC = () => {
  const { alerts, setCurrentTab, resolveAlert, language } = useApp();
  
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewNotificationAlert, setPreviewNotificationAlert] = useState<EnvironmentalAlert | null>(null);

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.simpleMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-500" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Environmental Alerts Near You
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time public warnings, sensor anomalies, health advisories, and active response teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('live_map')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>View All on Live Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search alerts, areas, or advisories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'critical', label: '🔴 Critical' },
            { id: 'high', label: '🟠 High' },
            { id: 'warning', label: '🟡 Warning' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterSeverity(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterSeverity === item.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-6 rounded-3xl border shadow-sm transition-all space-y-4 ${
              alert.severity === 'critical'
                ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                : alert.severity === 'high'
                ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-300 dark:border-orange-900/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Top Bar: Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold ${
                  alert.severity === 'critical'
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    : alert.severity === 'high'
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  🚨
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>{alert.location.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={alert.severity} size="md" />
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {alert.detectedAt}
                </span>
              </div>
            </div>

            {/* Simple Human-Friendly Language (Important: Requirement #1) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                "{alert.simpleMessage}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Technical Data: {alert.technicalDetails}
              </p>
            </div>

            {/* Health-Risk Advisory & Radius Coverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 space-y-1">
                <p className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" /> Health Advisory
                </p>
                <p className="text-rose-900 dark:text-rose-200 font-medium">
                  {alert.healthRiskAdvice}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" /> Geographic Coverage
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Alert affecting approximately {alert.location.radiusKm} km around this location.
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Assigned Team: {alert.assignedTeamName || 'Municipal Field Team'}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewNotificationAlert(alert)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                  <span>Preview SMS & Push Alert</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('live_map')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                >
                  Locate on Map
                </button>
                <button
                  onClick={() => setCurrentTab('report')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
                >
                  Report Sighting Here
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Multi-Channel Notification Preview Modal */}
      {previewNotificationAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-500" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Multi-Channel Notification Simulation
                </h4>
              </div>
              <button
                onClick={() => setPreviewNotificationAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-App Push Simulation */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-rose-500" /> In-App Push Notification
                </span>
                <span>Now</span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                🚨 {previewNotificationAlert.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {previewNotificationAlert.simpleMessage}
              </p>
            </div>

            {/* SMS Mockup */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Simulated SMS Gateway
                </span>
                <span>+91-ECO-ALERT</span>
              </div>
              <p className="text-xs font-mono text-emerald-950 dark:text-emerald-200">
                "GOV-ALERT: {previewNotificationAlert.simpleMessage} Avoid active area around {previewNotificationAlert.location.address}."
              </p>
            </div>

            {/* Email Mockup */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-sky-700 dark:text-sky-300 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-600" /> Automated Email Dispatch
                </span>
                <span>alerts@ecosentinel.gov</span>
              </div>
              <p className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                Subject: Environmental Advisory for {previewNotificationAlert.location.zone}
              </p>
              <p className="text-[11px] text-sky-800 dark:text-sky-300">
                {previewNotificationAlert.healthRiskAdvice}
              </p>
            </div>

            <button
              onClick={() => setPreviewNotificationAlert(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
