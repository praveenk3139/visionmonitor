import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  PieChart as PieIcon, 
  Cpu, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { devices, citizenReports, alerts, theme } = useApp();

  // Color palette for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  // 1. Incidents Over Time
  const trendData = [
    { day: 'Mon', sensorAnomalies: 2, citizenReports: 4, resolved: 5 },
    { day: 'Tue', sensorAnomalies: 3, citizenReports: 6, resolved: 6 },
    { day: 'Wed', sensorAnomalies: 5, citizenReports: 8, resolved: 7 },
    { day: 'Thu', sensorAnomalies: 4, citizenReports: 5, resolved: 6 },
    { day: 'Fri', sensorAnomalies: 7, citizenReports: 9, resolved: 8 },
    { day: 'Sat', sensorAnomalies: 6, citizenReports: 12, resolved: 11 },
    { day: 'Sun', sensorAnomalies: 3, citizenReports: 7, resolved: 8 },
  ];

  // 2. Problems By Category
  const categoryData = [
    { name: 'Garbage & Waste', value: 34, color: '#10b981' },
    { name: 'Drainage / Flooding', value: 28, color: '#3b82f6' },
    { name: 'Air Pollution', value: 18, color: '#f59e0b' },
    { name: 'Streetlights', value: 12, color: '#8b5cf6' },
    { name: 'Water Purity', value: 8, color: '#06b6d4' },
  ];

  // 3. Average Response Time by Department (Minutes)
  const responseTimeData = [
    { department: 'Drainage Team', avgMinutes: 28, target: 45 },
    { department: 'Sanitation Team', avgMinutes: 35, target: 60 },
    { department: 'Environmental Team', avgMinutes: 22, target: 30 },
    { department: 'Electrical Team', avgMinutes: 40, target: 60 },
    { department: 'Emergency Unit', avgMinutes: 14, target: 20 },
  ];

  // 4. Incidents By Zone
  const zoneData = [
    { zone: 'Zone 1 (Central)', total: 14, resolved: 12 },
    { zone: 'Zone 2 (Wetland)', total: 8, resolved: 7 },
    { zone: 'Zone 3 (Canal Spillway)', total: 19, resolved: 16 },
    { zone: 'Zone 4 (Industrial)', total: 11, resolved: 10 },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Municipal Environmental Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time public performance indicators, response velocity, and anomaly distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            📊 Live Reporting Cycle (30 Days)
          </span>
        </div>
      </div>

      {/* Top 4 Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">Average Response Time</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">24.6 Mins</p>
          <p className="text-[11px] text-emerald-600 font-bold">↓ 18% faster than benchmark</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">Total Resolution Rate</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92.4%</p>
          <p className="text-[11px] text-emerald-600 font-bold">100% with photo verification</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">AI Validation Accuracy</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">96.8%</p>
          <p className="text-[11px] text-purple-500 font-bold">Image & telemetry correlation</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">Sensor Network Uptime</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">99.2%</p>
          <p className="text-[11px] text-blue-500 font-bold">4G/LTE active telemetry</p>
        </div>
      </div>

      {/* 2-Col Grid of Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Incidents Over Time (Area Chart) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Weekly Environmental Incidents & Fixes
              </h3>
              <p className="text-xs text-slate-400">Telemetry anomalies vs Citizen reports vs Resolved</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="citizenReports" name="Citizen Reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved Fixes" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Problems by Category (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Incidents Breakdown by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution across environmental categories</p>
            </div>
            <PieIcon className="w-5 h-5 text-purple-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(((percent as number) || 0) * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Response Velocity by Department (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Average Response Time by Department
              </h3>
              <p className="text-xs text-slate-400">Time taken in minutes from report to site arrival</p>
            </div>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgMinutes" name="Actual Avg Time (Mins)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="SLA Target (Mins)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Incidents by Municipal Zone */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Incidents & Resolutions by Zone
              </h3>
              <p className="text-xs text-slate-400">Geographic hotspot workload</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="zone" stroke="#94a3b8" fontSize={10} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#0f172a', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total Reported" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Verified Resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
