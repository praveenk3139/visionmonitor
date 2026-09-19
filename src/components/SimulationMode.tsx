import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  AlertOctagon, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Activity, 
  MapPin, 
  Bell, 
  ShieldAlert, 
  Wind, 
  Droplets, 
  Thermometer, 
  Volume2, 
  Flame 
} from 'lucide-react';

export const SimulationMode: React.FC = () => {
  const { 
    devices, 
    simulateDeviceReading, 
    setCurrentTab, 
    alerts, 
    aiPredictions,
    language 
  } = useApp();

  // Selected device for simulation
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-1');
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Simulated slider states initialized to current readings
  const [aqi, setAqi] = useState<number>(selectedDevice?.currentReadings.aqi || 54);
  const [pm25, setPm25] = useState<number>(selectedDevice?.currentReadings.pm25 || 18);
  const [pm10, setPm10] = useState<number>(selectedDevice?.currentReadings.pm10 || 42);
  const [temp, setTemp] = useState<number>(selectedDevice?.currentReadings.temperature || 31.2);
  const [humidity, setHumidity] = useState<number>(selectedDevice?.currentReadings.humidity || 62);
  const [waterLevel, setWaterLevel] = useState<number>(selectedDevice?.currentReadings.waterLevel || 2.4);
  const [turbidity, setTurbidity] = useState<number>(selectedDevice?.currentReadings.turbidity || 4.2);
  const [noise, setNoise] = useState<number>(selectedDevice?.currentReadings.noise || 68);
  const [gas, setGas] = useState<number>(selectedDevice?.currentReadings.gasLevel || 14);

  // Trigger history / reaction log state
  const [reactionLog, setReactionLog] = useState<{
    stage: string;
    detail: string;
    icon: string;
    color: string;
    timestamp: string;
  }[]>([]);

  // Update slider states when selected device changes
  const handleSelectDevice = (devId: string) => {
    setSelectedDeviceId(devId);
    const dev = devices.find(d => d.id === devId);
    if (dev) {
      setAqi(dev.currentReadings.aqi || 50);
      setPm25(dev.currentReadings.pm25 || 15);
      setPm10(dev.currentReadings.pm10 || 35);
      setTemp(dev.currentReadings.temperature || 30);
      setHumidity(dev.currentReadings.humidity || 60);
      setWaterLevel(dev.currentReadings.waterLevel || 2.0);
      setTurbidity(dev.currentReadings.turbidity || 3.0);
      setNoise(dev.currentReadings.noise || 55);
      setGas(dev.currentReadings.gasLevel || 10);
    }
  };

  const executeSimulation = (newReadings: {
    aqi?: number;
    pm25?: number;
    pm10?: number;
    temperature?: number;
    humidity?: number;
    waterLevel?: number;
    turbidity?: number;
    noise?: number;
    gasLevel?: number;
  }) => {
    if (!selectedDevice) return;

    // Apply to central state engine
    simulateDeviceReading(selectedDevice.id, newReadings);

    // Build visual reaction trace
    const logs = [];
    const now = new Date().toLocaleTimeString();

    logs.push({
      stage: '1. Telemetry Ingested',
      detail: `Sensor values updated on ${selectedDevice.deviceCode} (${selectedDevice.location.address})`,
      icon: '📡',
      color: 'text-emerald-500',
      timestamp: now,
    });

    if ((newReadings.aqi && newReadings.aqi > 100) || (newReadings.waterLevel && newReadings.waterLevel > 4.5) || (newReadings.noise && newReadings.noise > 85)) {
      logs.push({
        stage: '2. AI Anomaly Flagged',
        detail: `Spatiotemporal boundary threshold exceeded (AQI: ${newReadings.aqi || aqi})`,
        icon: '🤖',
        color: 'text-amber-500',
        timestamp: now,
      });

      logs.push({
        stage: '3. Health-Risk Prediction',
        detail: 'Generated respiratory & demographic risk model (Confidence: 94%)',
        icon: '📊',
        color: 'text-orange-500',
        timestamp: now,
      });

      logs.push({
        stage: '4. GIS Localization & Alert',
        detail: `Broadcast localized alert across 2.4 km zone around ${selectedDevice.location.address}`,
        icon: '🚨',
        color: 'text-rose-500',
        timestamp: now,
      });

      logs.push({
        stage: '5. Response Team Recommendation',
        detail: 'Auto-recommended Environmental Team for immediate field dispatch',
        icon: '👷',
        color: 'text-blue-500',
        timestamp: now,
      });
    } else {
      logs.push({
        stage: '2. Normal Operation',
        detail: 'Sensor readings within baseline municipal safety guidelines.',
        icon: '✅',
        color: 'text-emerald-500',
        timestamp: now,
      });
    }

    setReactionLog(logs);
  };

  const handleApplySliders = () => {
    executeSimulation({
      aqi,
      pm25,
      pm10,
      temperature: temp,
      humidity,
      waterLevel,
      turbidity,
      noise,
      gasLevel: gas,
    });
  };

  const handleTriggerWarning = () => {
    setAqi(135);
    setPm25(68);
    setTemp(36.5);
    executeSimulation({
      aqi: 135,
      pm25: 68,
      temperature: 36.5,
    });
  };

  const handleTriggerCritical = () => {
    setAqi(275);
    setPm25(165);
    setGas(65);
    executeSimulation({
      aqi: 275,
      pm25: 165,
      gasLevel: 65,
    });
  };

  const handleReset = () => {
    setAqi(45);
    setPm25(15);
    setPm10(38);
    setTemp(29.5);
    setHumidity(58);
    setWaterLevel(2.1);
    setTurbidity(3.8);
    setNoise(54);
    setGas(10);
    executeSimulation({
      aqi: 45,
      pm25: 15,
      pm10: 38,
      temperature: 29.5,
      humidity: 58,
      waterLevel: 2.1,
      turbidity: 3.8,
      noise: 54,
      gasLevel: 10,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/40 p-6 rounded-3xl border border-amber-300 dark:border-amber-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Device Simulation Mode (Hardware-Free Demo)
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Simulate real-world environmental anomalies (AQI surges, flood gauge spikes, acoustic noise). 
            Watch how the AI detects anomalies, localizes zones, generates public alerts, and dispatches field teams automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Safe</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Device Selector & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Device Selector Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs uppercase font-extrabold text-slate-400">
              Select IoT Device to Simulate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {devices.map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => handleSelectDevice(dev.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedDeviceId === dev.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {dev.deviceCode}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{dev.name}</p>
                  <div className="mt-1">
                    <StatusBadge status={dev.status} size="sm" showIcon={false} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                Live Sensor Telemetry Sliders ({selectedDevice?.deviceCode})
              </h3>
              <span className="text-xs font-semibold text-slate-400">Adjust & Click Apply</span>
            </div>

            <div className="space-y-5">
              
              {/* Slider 1: Air Quality Index (AQI) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-500" /> Air Quality Index (AQI)
                  </span>
                  <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                    aqi > 200 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    aqi > 100 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {aqi} AQI ({aqi > 200 ? 'Critical' : aqi > 100 ? 'High' : 'Safe'})
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="450"
                  value={aqi}
                  onChange={(e) => setAqi(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>0 (Clean)</span>
                  <span>100 (Threshold)</span>
                  <span>200 (Hazardous)</span>
                  <span>450 (Severe)</span>
                </div>
              </div>

              {/* Slider 2: PM2.5 Fine Dust */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-indigo-500" /> PM2.5 Fine Particulates (µg/m³)
                  </span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-white">
                    {pm25} µg/m³
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  value={pm25}
                  onChange={(e) => setPm25(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Slider 3: Water Level (Canal / Basin) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" /> Water Depth / Flood Level (Meters)
                  </span>
                  <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                    waterLevel >= 5.0 ? 'bg-rose-100 text-rose-800' :
                    waterLevel >= 4.5 ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white'
                  }`}>
                    {waterLevel} m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider 4: Acoustic Noise Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-purple-500" /> Acoustic Decibels (dB)
                  </span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-white">
                    {noise} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={noise}
                  onChange={(e) => setNoise(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Slider 5: Ambient Temperature */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-500" /> Temperature (°C)
                  </span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-white">
                    {temp}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="48"
                  step="0.5"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>

            {/* Simulation Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleApplySliders}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Slider Values</span>
              </button>

              <button
                onClick={handleTriggerWarning}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Trigger Warning ⚠️</span>
              </button>

              <button
                onClick={handleTriggerCritical}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Trigger Critical 🚨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Closed-Loop Reaction Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Real-time Simulation Trace
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Live React
              </span>
            </div>

            {reactionLog.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
                <Sliders className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 animate-pulse" />
                <p className="text-xs font-semibold">Adjust any sensor slider and tap an action button to see the automatic trigger chain.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reactionLog.map((log, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1 animate-in slide-in-from-right-2 duration-150"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <span>{log.icon}</span>
                        <span>{log.stage}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed pl-5">
                      {log.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Navigation Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => setCurrentTab('live_map')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Check Sensor Status on Live Map
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentTab('alerts')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-rose-500" /> View Generated Localized Alerts
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentTab('ai_monitoring')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Review AI Health-Risk Predictions
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
