import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_IMAGES } from '../data/mockData';
import { 
  Play, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Cpu, 
  Sliders, 
  AlertTriangle, 
  Camera, 
  UserCheck, 
  Truck, 
  Wrench, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveDemoTour: React.FC<InteractiveDemoTourProps> = ({ isOpen, onClose }) => {
  const { 
    demoStep, 
    setDemoStep, 
    setCurrentTab, 
    switchUserRole, 
    addDevice, 
    devices, 
    simulateDeviceReading, 
    createCitizenReport, 
    verifyReportByAdmin, 
    updateTaskStatus,
    resetToDefaults
  } = useApp();

  // 10 Key Milestones grouping all 32 steps
  const demoMilestones = [
    {
      stepNum: 1,
      title: 'Step 1: Admin Log In & Open IoT Devices',
      role: 'admin',
      targetTab: 'devices',
      desc: 'Admin logs in to Municipal Command and opens IoT Environmental Devices manager.',
      actionLabel: 'Switch to Admin & Open Devices',
      action: () => {
        switchUserRole('admin');
        setCurrentTab('devices');
      }
    },
    {
      stepNum: 2,
      title: 'Step 2: Deploy New Sensor ENV-024 to Map',
      role: 'admin',
      targetTab: 'devices',
      desc: 'Deploy a new Air Quality Monitor (ENV-024) at Perumattunallur Main Road on the central GIS map.',
      actionLabel: 'Deploy Device ENV-024',
      action: () => {
        const existing = devices.find(d => d.deviceCode === 'ENV-024');
        if (!existing) {
          addDevice({
            deviceCode: 'ENV-024',
            name: 'Perumattunallur Air Quality Monitor',
            type: 'air_quality',
            sensorTypes: ['pm25', 'pm10', 'temperature', 'humidity', 'gas'],
            location: {
              lat: 12.8345,
              lng: 80.0543,
              address: 'Perumattunallur Main Road',
              zone: 'Zone 1 - Central',
              landmark: 'Near Govt High School',
              affectedRadiusKm: 2.4,
            },
            status: 'safe',
            installDate: new Date().toISOString().split('T')[0],
            maintenanceMode: false,
            batteryLevel: 98,
            signalStrength: 96,
            currentReadings: {
              aqi: 54,
              pm25: 18,
              temperature: 31.2,
              humidity: 62,
              gasLevel: 14,
            },
            aiRiskLevel: 'LOW',
          });
        }
        setCurrentTab('live_map');
      }
    },
    {
      stepNum: 3,
      title: 'Step 3: Simulate AQI Surge in Sandbox',
      role: 'admin',
      targetTab: 'simulation',
      desc: 'Open Simulation Mode and increase AQI past threshold (176 → 245 Critical Spike).',
      actionLabel: 'Trigger AQI Critical Surge',
      action: () => {
        setCurrentTab('simulation');
        const targetDev = devices.find(d => d.deviceCode === 'ENV-024') || devices[0];
        if (targetDev) {
          simulateDeviceReading(targetDev.id, {
            aqi: 245,
            pm25: 140,
            temperature: 35.0,
            gasLevel: 45,
          });
        }
      }
    },
    {
      stepNum: 4,
      title: 'Step 4: AI Detects Anomaly & Creates Alert',
      role: 'admin',
      targetTab: 'alerts',
      desc: 'AI detects abnormal particulate condition, generates High Environmental Risk, and issues a localized public alert across 2.4 km.',
      actionLabel: 'View Generated Public Alert',
      action: () => {
        setCurrentTab('alerts');
      }
    },
    {
      stepNum: 5,
      title: 'Step 5: Citizen Submits Photo Problem Report',
      role: 'citizen',
      targetTab: 'report',
      desc: 'Switch to Citizen role. Citizen snaps photo of waste / smoke hazard and submits report with AI scanner verification.',
      actionLabel: 'Submit Citizen Report with AI Scan',
      action: () => {
        switchUserRole('citizen');
        setCurrentTab('report');
      }
    },
    {
      stepNum: 6,
      title: 'Step 6: Admin Receives & Dispatches Arun (Drainage Team)',
      role: 'admin',
      targetTab: 'admin',
      desc: 'Municipal Officer verifies AI recommendation and assigns field task to Response Team Lead Arun.',
      actionLabel: 'Verify & Dispatch Field Team',
      action: () => {
        switchUserRole('admin');
        setCurrentTab('admin');
      }
    },
    {
      stepNum: 7,
      title: 'Step 7: Response Team Arun Accepts & En Route',
      role: 'response_team',
      targetTab: 'response_team',
      desc: 'Arun logs in via Field App, accepts task, updates status to "ON THE WAY", then arrives on site.',
      actionLabel: 'Accept & Move to Site (Working)',
      action: () => {
        switchUserRole('response_team');
        setCurrentTab('response_team');
        updateTaskStatus('REP-10242', 'working', 'Crew arrived on site with hydro-jet suction unit.');
      }
    },
    {
      stepNum: 8,
      title: 'Step 8: Field Crew Uploads Resolution Proof',
      role: 'response_team',
      targetTab: 'response_team',
      desc: 'Remediation completed. Arun uploads "After" photo and work notes, marking the issue RESOLVED.',
      actionLabel: 'Upload After Photo & Mark Resolved',
      action: () => {
        updateTaskStatus(
          'REP-10242',
          'resolved',
          'Drain cleared, underground blockage removed and flow verified.',
          {
            afterImages: [SAMPLE_IMAGES.drainageAfter],
            resolutionNotes: 'Underground silt block cleared with hydro-jet. Water level normalized.',
            resolvedAt: 'Just now',
            verifiedByAdmin: true,
            verifiedAt: 'Just now',
          }
        );
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    },
    {
      stepNum: 9,
      title: 'Step 9: Citizen Receives Proof & Map Turns Green',
      role: 'citizen',
      targetTab: 'my_reports',
      desc: 'Citizen views Before & After resolution comparison. Live map pin turns from 🔴 to ✅ Green.',
      actionLabel: 'View Verified Before/After Proof',
      action: () => {
        switchUserRole('citizen');
        setCurrentTab('my_reports');
      }
    },
    {
      stepNum: 10,
      title: 'Step 10: Closed Loop Complete & Analytics Updated',
      role: 'admin',
      targetTab: 'analytics',
      desc: 'Full closed-loop cycle complete: Sense → Predict → Localize → Alert → Report → Assign → Respond → Prove → Resolve.',
      actionLabel: 'View Analytics Impact',
      action: () => {
        switchUserRole('admin');
        setCurrentTab('analytics');
      }
    }
  ];

  if (!isOpen) return null;

  const currentMilestone = demoMilestones[demoStep] || demoMilestones[0];

  const handleNext = () => {
    currentMilestone.action();
    if (demoStep < demoMilestones.length - 1) {
      setDemoStep(demoStep + 1);
    }
  };

  const handlePrev = () => {
    if (demoStep > 0) {
      setDemoStep(demoStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/40 space-y-6 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Interactive End-to-End Demo Walkthrough
              </h3>
              <p className="text-xs text-slate-400">Step {demoStep + 1} of {demoMilestones.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefaults}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((demoStep + 1) / demoMilestones.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>Start: Admin & IoT</span>
            <span>Middle: AI & Citizen</span>
            <span>Finish: Verified Resolution</span>
          </div>
        </div>

        {/* Current Milestone Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Active Role: {currentMilestone.role.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-slate-400">Target: {currentMilestone.targetTab}</span>
          </div>

          <h4 className="text-xl font-black text-slate-900 dark:text-white">
            {currentMilestone.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentMilestone.desc}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={demoStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{currentMilestone.actionLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
