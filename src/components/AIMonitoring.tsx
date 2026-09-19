import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  MapPin, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Search, 
  Filter,
  HeartPulse,
  Send,
  Zap
} from 'lucide-react';

export const AIMonitoring: React.FC = () => {
  const { aiPredictions, setCurrentTab, language } = useApp();
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPredictions = aiPredictions.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.detectedAnomaly.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = filterActiveOnly ? p.active : true;
    return matchesSearch && matchesActive;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI ENGINE ACTIVE • 24/7 SPATIOTEMPORAL MODEL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            AI Environmental Risk & Anomaly Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time multi-variate anomaly detection, population health-risk forecasting, and automated municipal response matching.
          </p>
        </div>

        {/* AI Health Stat Box */}
        <div className="bg-purple-900/40 backdrop-blur-md p-4 rounded-2xl border border-purple-500/30 text-center min-w-[160px]">
          <p className="text-[10px] uppercase font-bold text-purple-300">Model Accuracy</p>
          <p className="text-2xl font-black text-white">96.4%</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> Continuous Learning
          </span>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Active Anomalies</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {aiPredictions.filter(p => p.active).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Detected across 4 municipal zones</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Avg Confidence</span>
            <Brain className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            94.2%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Validated by historical telemetry</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Health Advisories</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            2 Active
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Respiratory & drainage alerts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Auto Dispatched</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            100%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Routed to matching departments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search AI predictions or anomalies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterActiveOnly(!filterActiveOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filterActiveOnly
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Active Predictions Only</span>
          </button>
        </div>
      </div>

      {/* AI Predictions Feed */}
      <div className="space-y-4">
        {filteredPredictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Top Row: Title, Risk Badge, Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {pred.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" /> {pred.location} ({pred.zone})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                  <p className="text-sm font-black text-purple-600 dark:text-purple-400">{pred.confidence}%</p>
                </div>
                <StatusBadge status={pred.riskLevel.toLowerCase()} size="md" />
              </div>
            </div>

            {/* Grid of AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Detected Anomaly */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Detected Anomaly
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {pred.detectedAnomaly}
                </p>
              </div>

              {/* Health-Risk Prediction (Important: not medical diagnosis) */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Health-Risk Prediction
                </p>
                <p className="font-semibold text-rose-900 dark:text-rose-200">
                  {pred.healthRiskPrediction}
                </p>
                <p className="text-[9px] text-slate-400 italic">
                  *Public health risk advisory, not a clinical diagnosis.
                </p>
              </div>

              {/* Recommended Action & Suggested Team */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Recommended Action
                </p>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                  {pred.recommendedAction}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                  <span>Assigned:</span>
                  <span className="underline">{pred.suggestedTeam}</span>
                </div>
              </div>

            </div>

            {/* Footer timestamp & quick action */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Flagged {pred.timestamp}
              </span>

              <button
                onClick={() => setCurrentTab('live_map')}
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>View Coordinates on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
