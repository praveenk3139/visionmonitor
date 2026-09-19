import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CitizenReport, TaskStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { SAMPLE_IMAGES } from '../data/mockData';
import { 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Navigation, 
  ArrowRight, 
  UploadCloud, 
  X, 
  AlertTriangle, 
  Play, 
  Truck, 
  Wrench, 
  FileCheck2,
  Check,
  ChevronRight
} from 'lucide-react';

export const ResponseTeamDashboard: React.FC = () => {
  const { 
    citizenReports, 
    updateTaskStatus, 
    currentUser, 
    setCurrentTab,
    language 
  } = useApp();

  // Active task currently working on
  const [selectedTask, setSelectedTask] = useState<CitizenReport | null>(null);
  
  // Resolution Proof Modal State
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [taskToResolve, setTaskToResolve] = useState<CitizenReport | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(SAMPLE_IMAGES.drainageAfter);
  const [resolutionNotes, setResolutionNotes] = useState<string>('Drain line cleared, blockage removed, and normal stormwater flow restored.');

  // Filter tasks
  const assignedTasks = citizenReports.filter(r => r.status !== 'resolved' && r.status !== 'closed');
  const completedTasks = citizenReports.filter(r => r.status === 'resolved' || r.status === 'closed');
  const urgentCount = assignedTasks.filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length;
  const inProgressCount = assignedTasks.filter(r => r.status === 'working' || r.status === 'on_the_way').length;

  const handleOpenResolutionModal = (task: CitizenReport) => {
    setTaskToResolve(task);
    if (task.category === 'garbage') {
      setAfterPhotoUrl(SAMPLE_IMAGES.garbageAfter);
      setResolutionNotes('Solid waste piles fully cleared, area disinfected, and bins emptied.');
    } else if (task.category === 'flooding_drainage') {
      setAfterPhotoUrl(SAMPLE_IMAGES.drainageAfter);
      setResolutionNotes('Drain line cleared, underground silt block removed, and water flow restored.');
    } else if (task.category === 'streetlight') {
      setAfterPhotoUrl(SAMPLE_IMAGES.cleanStreet);
      setResolutionNotes('Replaced burned fixture with 60W LED unit. All 3 luminaires operational.');
    } else {
      setAfterPhotoUrl(SAMPLE_IMAGES.cleanStreet);
      setResolutionNotes('Hazard cleared and site verified safe by field team.');
    }
    setIsResolutionModalOpen(true);
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToResolve) return;

    updateTaskStatus(
      taskToResolve.id,
      'resolved',
      resolutionNotes,
      {
        afterImages: [afterPhotoUrl],
        resolutionNotes,
        resolvedAt: 'Just now',
        verifiedByAdmin: true,
        verifiedAt: 'Just now',
      }
    );

    setIsResolutionModalOpen(false);
    setTaskToResolve(null);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Response Crew Header Banner (Requirement #20) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>FIELD OPERATIONS ACTIVE • GPS DISPATCH ON</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Good Morning, Arun — Drainage Response Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Zone 3 & 4 Rapid Emergency Remediation Unit. Review active field assignments and upload verified resolution proof.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('live_map')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Field GPS Map</span>
          </button>
        </div>
      </div>

      {/* 4 Task KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs uppercase font-extrabold text-slate-400">Assigned Tasks</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{assignedTasks.length}</p>
          <span className="text-[11px] text-blue-600 font-semibold">Active queue</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs uppercase font-extrabold text-slate-400">Urgent Priority</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{urgentCount}</p>
          <span className="text-[11px] text-rose-500 font-semibold">Immediate response</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs uppercase font-extrabold text-slate-400">In Progress</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{inProgressCount}</p>
          <span className="text-[11px] text-amber-500 font-semibold">Crews on site</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs uppercase font-extrabold text-slate-400">Completed & Verified</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">12</p>
          <span className="text-[11px] text-emerald-500 font-semibold">100% Photo verified</span>
        </div>
      </div>

      {/* Main Task List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
          Active Field Assignments Queue
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: ID, Priority, Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === 'HIGH' || task.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {task.priority} PRIORITY
                    </span>
                  </div>
                  <StatusBadge status={task.status} size="sm" />
                </div>

                {/* Problem Name & Distance */}
                <h4 className="font-black text-lg text-slate-900 dark:text-white mt-3">
                  {task.categoryLabel}
                </h4>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="font-medium">{task.location.address}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" /> Distance: 1.2 km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Reported {task.submittedAt}
                  </span>
                </div>

                {/* Citizen Evidence Photo */}
                {task.images[0] && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Citizen Evidence Photo:</p>
                    <img
                      src={task.images[0]}
                      alt="Citizen Problem"
                      className="w-full h-36 object-cover rounded-2xl border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons (Requirement #20 & #21) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                
                {task.status === 'reported' || task.status === 'assigned' ? (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'accepted')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Task Assignment</span>
                  </button>
                ) : task.status === 'accepted' ? (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'on_the_way')}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Mark On The Way (En Route)</span>
                  </button>
                ) : task.status === 'on_the_way' ? (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'working')}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Arrived on Site → Start Work</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenResolutionModal(task)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Proof & Mark as Resolved</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentTab('live_map')}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Navigate with Map</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Resolution Proof Upload Modal (Requirement #23) */}
      {isResolutionModalOpen && taskToResolve && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Submit Field Resolution Proof
                  </h3>
                  <p className="text-xs text-slate-500">Incident: {taskToResolve.id} ({taskToResolve.categoryLabel})</p>
                </div>
              </div>
              <button
                onClick={() => setIsResolutionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolution} className="space-y-4">
              
              {/* After Photo Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  "AFTER" Remediation Photo Proof
                </label>

                <div className="h-48 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={afterPhotoUrl}
                    alt="Resolved clean site"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                    AFTER REMEDIATION
                  </div>
                </div>

                {/* Quick Photo Switcher */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
                  {[
                    { label: 'Clean Drain', url: SAMPLE_IMAGES.drainageAfter },
                    { label: 'Cleared Garbage', url: SAMPLE_IMAGES.garbageAfter },
                    { label: 'Fixed Street', url: SAMPLE_IMAGES.cleanStreet },
                  ].map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAfterPhotoUrl(img.url)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resolution Work Notes (Public & Admin Verification)
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe actions taken (e.g. Silt cleared, bulb replaced, waste transported to processing depot)..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-medium p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResolutionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved & Complete</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
