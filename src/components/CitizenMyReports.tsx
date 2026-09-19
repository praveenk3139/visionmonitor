import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CitizenReport, TaskStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Eye, 
  User, 
  Plus, 
  Sparkles,
  Camera
} from 'lucide-react';

export const CitizenMyReports: React.FC = () => {
  const { citizenReports, setCurrentTab, language } = useApp();
  const [selectedReport, setSelectedReport] = useState<CitizenReport>(citizenReports[0]);

  // Timeline steps mapper
  const timelineStages: { key: TaskStatus; label: string }[] = [
    { key: 'reported', label: 'Report Submitted' },
    { key: 'verified', label: 'AI & Admin Verified' },
    { key: 'assigned', label: 'Team Assigned' },
    { key: 'working', label: 'Work In Progress' },
    { key: 'resolved', label: 'Resolved & Verified' },
  ];

  const getStageIndex = (status: TaskStatus) => {
    switch (status) {
      case 'reported': return 0;
      case 'verified': return 1;
      case 'assigned':
      case 'accepted':
      case 'on_the_way': return 2;
      case 'working': return 3;
      case 'resolved':
      case 'closed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              My Submitted Reports & Live Tracking
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track real-time progress from AI check to municipal team dispatch and before/after resolution proof.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('report')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Report Another Issue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Reports List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs uppercase font-extrabold text-slate-400 px-1">Your Incident History</p>
          
          {citizenReports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedReport?.id === rep.id
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                  {rep.id}
                </span>
                <StatusBadge status={rep.status} size="sm" />
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.categoryLabel}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{rep.location.address}</span>
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span>Submitted {rep.submittedAt}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Progress Timeline & Resolution Proof (7 Cols) */}
        {selectedReport && (
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {selectedReport.id}
                  </span>
                  <StatusBadge status={selectedReport.status} size="md" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedReport.categoryLabel}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedReport.location.address}
                </p>
              </div>

              {selectedReport.status === 'resolved' && (
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Verified Result</p>
                  <p className="text-xs font-black text-emerald-800 dark:text-emerald-200">100% Fixed</p>
                </div>
              )}
            </div>

            {/* Visual Step Timeline (Requirement #24) */}
            <div className="space-y-3">
              <p className="text-xs uppercase font-extrabold text-slate-400">Response Lifecycle Progress</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {timelineStages.map((stage, idx) => {
                  const currentIdx = getStageIndex(selectedReport.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div
                      key={stage.key}
                      className={`p-2.5 rounded-xl border text-center space-y-1 transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-400/20'
                          : isDone
                          ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-400 inline-block" />
                        )}
                      </div>
                      <p className={`text-[10px] font-bold leading-tight ${isCurrent ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description & AI Verification Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Citizen Description:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedReport.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Verification
                  </span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{selectedReport.aiAnalysis.confidence}% Conf.</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedReport.aiAnalysis.problemIdentified}
                </p>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">
                  Assigned Team: {selectedReport.assignedTeamName || selectedReport.aiAnalysis.suggestedTeam}
                </p>
              </div>
            </div>

            {/* RESOLUTION PROOF (Side-by-Side Before / After Photos) */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase font-extrabold text-slate-400 flex items-center gap-1">
                  <Camera className="w-4 h-4 text-emerald-600" /> Resolution Proof Comparison
                </p>
                {selectedReport.resolutionProof && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Municipal Officer
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* BEFORE PHOTO */}
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                    BEFORE (Citizen Evidence)
                  </span>
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                    {selectedReport.images[0] ? (
                      <img
                        src={selectedReport.images[0]}
                        alt="Before remediation"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        No photo attached
                      </div>
                    )}
                  </div>
                </div>

                {/* AFTER PHOTO */}
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    AFTER (Field Crew Remediation Proof)
                  </span>
                  <div className="h-44 rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-800 shadow-sm bg-slate-100 dark:bg-slate-800">
                    {selectedReport.resolutionProof?.afterImages[0] ? (
                      <img
                        src={selectedReport.resolutionProof.afterImages[0]}
                        alt="After remediation"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center space-y-1">
                        <Clock className="w-6 h-6 text-slate-400 animate-pulse" />
                        <span className="font-semibold">Work currently in progress</span>
                        <span className="text-[10px] text-slate-500">After-photo will appear upon team completion</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedReport.resolutionProof && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                    Field Team Resolution Notes:
                  </span>
                  <p className="font-semibold text-emerald-950 dark:text-emerald-100">
                    "{selectedReport.resolutionProof.resolutionNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Timeline Events */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs uppercase font-extrabold text-slate-400">Audit Log & Event Log</p>
              <div className="space-y-2">
                {selectedReport.timeline.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 dark:text-white capitalize">
                        {evt.status.replace(/_/g, ' ')}
                      </p>
                      {evt.note && <p className="text-[11px] text-slate-500 dark:text-slate-400">{evt.note}</p>}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
