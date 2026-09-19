import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { LiveMap } from './LiveMap';
import { CitizenReport } from '../types';
import { 
  Layers, 
  Cpu, 
  AlertTriangle, 
  ClipboardList, 
  Users, 
  CheckCircle2, 
  Plus, 
  MapPin, 
  Sparkles, 
  Sliders, 
  BarChart3, 
  Send, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  X,
  Eye,
  UserCheck
} from 'lucide-react';

export const AdminCommandCenter: React.FC = () => {
  const { 
    devices, 
    alerts, 
    citizenReports, 
    responseTeams, 
    aiPredictions, 
    verifyReportByAdmin, 
    setCurrentTab,
    language 
  } = useApp();

  // Selected report for verification modal
  const [reportToVerify, setReportToVerify] = useState<CitizenReport | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-env');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  const pendingReports = citizenReports.filter(r => r.status === 'reported');
  const activeOperations = citizenReports.filter(r => r.status === 'assigned' || r.status === 'accepted' || r.status === 'on_the_way' || r.status === 'working');
  const resolvedCount = citizenReports.filter(r => r.status === 'resolved' || r.status === 'closed').length;

  const handleOpenVerifyModal = (rep: CitizenReport) => {
    setReportToVerify(rep);
    setSelectedPriority(rep.aiAnalysis.suggestedPriority || 'MEDIUM');
    
    // Auto-select recommended team
    const matchingTeam = responseTeams.find(t => t.name.toLowerCase().includes(rep.aiAnalysis.suggestedTeam.toLowerCase())) || responseTeams[0];
    setSelectedTeamId(matchingTeam.id);
    setSelectedMemberId(matchingTeam.members[0]?.id || '');
  };

  const handleConfirmVerifyAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportToVerify) return;

    verifyReportByAdmin(reportToVerify.id, selectedPriority, selectedTeamId, selectedMemberId);
    setReportToVerify(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Quick Actions Header (Requirement #25) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Environmental Command Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Central municipal operations: IoT Telemetry, AI Risk Validation, Dispatch Authorization & Verified Resolution Proof.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('devices')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Device
          </button>

          <button
            onClick={() => setCurrentTab('ai_monitoring')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Monitoring
          </button>

          <button
            onClick={() => setCurrentTab('simulation')}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" /> Simulation
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
        </div>
      </div>

      {/* 6 KPI Cards (Requirement #25) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Devices</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{devices.length}</p>
          <span className="text-[10px] text-slate-500">Physical Nodes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Online Devices</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {devices.filter(d => !d.maintenanceMode).length}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Telemetry</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Active Alerts</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {alerts.filter(a => a.status === 'active').length}
          </p>
          <span className="text-[10px] text-rose-500 font-bold">Community Alerts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Citizen Reports</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {citizenReports.length}
          </p>
          <span className="text-[10px] text-amber-600 font-bold">{pendingReports.length} Pending Auth</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Active Teams</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {responseTeams.length}
          </p>
          <span className="text-[10px] text-blue-500">7 Municipal Crews</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold text-slate-400">Issues Resolved</p>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {resolvedCount}
          </p>
          <span className="text-[10px] text-teal-500 font-bold">Photo Verified</span>
        </div>

      </div>

      {/* Main Interactive Live Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Central GIS Operations & Asset Map
          </h3>
          <span className="text-xs text-slate-400">Click any marker to inspect telemetry or dispatch</span>
        </div>
        <LiveMap height="460px" />
      </div>

      {/* 2-Col Operational Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Citizen Reports Queue & AI Recommendations (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Pending Verification Queue
              </h4>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {pendingReports.length} Awaiting Verification
            </span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-1">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All citizen reports verified!</p>
              <p>New reports will appear here automatically with AI team recommendations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          {rep.id}
                        </span>
                        <StatusBadge status="warning" size="sm" />
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {rep.categoryLabel}
                      </h5>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {rep.location.address}
                      </p>
                    </div>

                    {rep.images[0] && (
                      <img
                        src={rep.images[0]}
                        alt="Evidence"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                    )}
                  </div>

                  {/* AI Recommendation pill */}
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> AI Recommendation:
                      </span>
                      <span>{rep.aiAnalysis.confidence}% Match</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-medium text-[11px]">
                      Assign to: <strong className="text-purple-700 dark:text-purple-300">{rep.aiAnalysis.suggestedTeam}</strong> (Priority: {rep.aiAnalysis.suggestedPriority})
                    </p>
                  </div>

                  {/* Verification CTA */}
                  <button
                    onClick={() => handleOpenVerifyModal(rep)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Dispatch Team</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Field Operations (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Active Field Operations ({activeOperations.length})
              </h4>
            </div>
            <button
              onClick={() => setCurrentTab('response_team')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Field App View
            </button>
          </div>

          <div className="space-y-3">
            {activeOperations.map((op) => (
              <div
                key={op.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{op.id}</span>
                    <StatusBadge status={op.status} size="sm" />
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{op.categoryLabel}</h5>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Assigned: <strong className="text-blue-600 dark:text-blue-400">{op.assignedTeamName} ({op.assignedMemberName || 'Team'})</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Phase</span>
                  <p className="font-extrabold text-slate-800 dark:text-white capitalize">
                    {op.status.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Verify & Dispatch Modal */}
      {reportToVerify && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Verify Report & Dispatch Response Team
                  </h3>
                  <p className="text-xs text-slate-500">Report {reportToVerify.id} • {reportToVerify.categoryLabel}</p>
                </div>
              </div>
              <button
                onClick={() => setReportToVerify(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVerifyAndDispatch} className="space-y-4">
              
              {/* Evidence & AI details */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex gap-3">
                {reportToVerify.images[0] && (
                  <img
                    src={reportToVerify.images[0]}
                    alt="Evidence"
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">{reportToVerify.description}</p>
                  <p className="text-slate-500">{reportToVerify.location.address}</p>
                  <p className="text-purple-600 font-bold">
                    AI Suggestion: {reportToVerify.aiAnalysis.suggestedTeam} ({reportToVerify.aiAnalysis.confidence}% Conf.)
                  </p>
                </div>
              </div>

              {/* Priority override */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Operational Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="LOW">LOW PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="CRITICAL">CRITICAL / EMERGENCY</option>
                </select>
              </div>

              {/* Team selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Response Team (Rule Recommendation: {reportToVerify.aiAnalysis.suggestedTeam})
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    const team = responseTeams.find(t => t.id === e.target.value);
                    setSelectedMemberId(team?.members[0]?.id || '');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {responseTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} — Leader: {team.leaderName} ({team.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Member Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Lead Field Responder
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {responseTeams.find(t => t.id === selectedTeamId)?.members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role}) — Status: {m.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportToVerify(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Authorize & Dispatch Team</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
