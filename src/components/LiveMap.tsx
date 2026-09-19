import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { IoTDevice, CitizenReport, ResponseTeam, EnvironmentalAlert } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Filter, 
  Layers, 
  MapPin, 
  Search, 
  Navigation, 
  Radio, 
  Maximize2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Eye, 
  Sliders, 
  Camera, 
  X,
  Wind,
  Droplets,
  Thermometer,
  Volume2
} from 'lucide-react';
import L from 'leaflet';

interface LiveMapProps {
  height?: string;
  isLocationPicker?: boolean;
  selectedCoordinates?: { lat: number; lng: number } | null;
  onCoordinatesChange?: (coords: { lat: number; lng: number; address?: string }) => void;
  focusedEntityId?: string | null;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  height = 'calc(100vh - 12rem)',
  isLocationPicker = false,
  selectedCoordinates,
  onCoordinatesChange,
  focusedEntityId,
}) => {
  const { 
    devices, 
    citizenReports, 
    alerts, 
    responseTeams, 
    setCurrentTab, 
    simulateDeviceReading, 
    theme,
    language 
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Filter state: 'all' | 'devices' | 'alerts' | 'reports' | 'teams' | 'resolved'
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<ResponseTeam | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<EnvironmentalAlert | null>(null);

  // Center coordinates (Perumattunallur area)
  const defaultCenter: [number, number] = [12.8345, 80.0543];

  // Helper to create HTML icons
  const createCustomIcon = (
    type: 'device' | 'report' | 'team' | 'resolved' | 'alert',
    status: string,
    label: string,
    hasAnomaly: boolean = false
  ) => {
    let bgColor = 'bg-emerald-600';
    let ringColor = 'ring-emerald-400';
    let iconEmoji = '📡';

    if (type === 'device') {
      if (status === 'critical') {
        bgColor = 'bg-rose-600 animate-bounce';
        ringColor = 'ring-rose-400';
        iconEmoji = '🚨';
      } else if (status === 'warning' || status === 'high') {
        bgColor = 'bg-amber-500';
        ringColor = 'ring-amber-300';
        iconEmoji = '⚠️';
      } else if (status === 'offline') {
        bgColor = 'bg-slate-500';
        ringColor = 'ring-slate-300';
        iconEmoji = '⚫';
      } else {
        bgColor = 'bg-emerald-600';
        ringColor = 'ring-emerald-400';
        iconEmoji = '📡';
      }
    } else if (type === 'report') {
      bgColor = 'bg-amber-600';
      ringColor = 'ring-amber-400';
      iconEmoji = '📸';
    } else if (type === 'team') {
      bgColor = 'bg-blue-600';
      ringColor = 'ring-blue-400';
      iconEmoji = '👷';
    } else if (type === 'resolved') {
      bgColor = 'bg-teal-600';
      ringColor = 'ring-teal-400';
      iconEmoji = '✅';
    } else if (type === 'alert') {
      bgColor = 'bg-rose-600';
      ringColor = 'ring-rose-400';
      iconEmoji = '🚨';
    }

    const pulseHtml = hasAnomaly || status === 'critical'
      ? `<div class="absolute -inset-2 rounded-full bg-rose-500 opacity-60 animate-ping"></div>`
      : '';

    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pulseHtml}
          <div class="w-9 h-9 rounded-full ${bgColor} text-white flex items-center justify-center shadow-lg ring-2 ${ringColor} text-sm font-bold transition-transform group-hover:scale-110">
            ${iconEmoji}
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap shadow opacity-90 group-hover:opacity-100">
            ${label}
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | EcoSentinel AI',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const circlesGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerGroupRef.current = markersGroup;
      circlesLayerGroupRef.current = circlesGroup;

      // Location Picker Click Listener
      if (isLocationPicker) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (onCoordinatesChange) {
            onCoordinatesChange({
              lat: Number(lat.toFixed(5)),
              lng: Number(lng.toFixed(5)),
              address: `GPS Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            });
          }
        });
      }
    }

    return () => {
      // Map cleanup on unmount handled by ref
    };
  }, []);

  // Update Location Picker Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isLocationPicker) return;

    if (selectedCoordinates) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([selectedCoordinates.lat, selectedCoordinates.lng]);
      } else {
        const pickerIcon = L.divIcon({
          className: 'custom-leaflet-icon',
          html: `
            <div class="w-10 h-10 -mt-5 -ml-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-rose-300 animate-bounce">
              <span class="text-xl">📍</span>
            </div>
          `,
          iconSize: [40, 40],
        });

        pickerMarkerRef.current = L.marker([selectedCoordinates.lat, selectedCoordinates.lng], {
          icon: pickerIcon,
          draggable: true,
        }).addTo(mapInstanceRef.current);

        pickerMarkerRef.current.on('dragend', (e) => {
          const target = e.target;
          const pos = target.getLatLng();
          if (onCoordinatesChange) {
            onCoordinatesChange({
              lat: Number(pos.lat.toFixed(5)),
              lng: Number(pos.lng.toFixed(5)),
            });
          }
        });
      }
      mapInstanceRef.current.panTo([selectedCoordinates.lat, selectedCoordinates.lng]);
    }
  }, [selectedCoordinates, isLocationPicker]);

  // Render all pins based on active filters and data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current || !circlesLayerGroupRef.current) return;

    markersLayerGroupRef.current.clearLayers();
    circlesLayerGroupRef.current.clearLayers();

    // 1. Render IoT Devices
    if (activeFilter === 'all' || activeFilter === 'devices') {
      devices.forEach(dev => {
        if (searchQuery && !dev.name.toLowerCase().includes(searchQuery.toLowerCase()) && !dev.deviceCode.toLowerCase().includes(searchQuery.toLowerCase())) {
          return;
        }

        const icon = createCustomIcon(
          'device',
          dev.status,
          dev.deviceCode,
          dev.status === 'critical' || dev.status === 'high' || dev.anomalyDetected
        );

        const marker = L.marker([dev.location.lat, dev.location.lng], { icon });
        marker.on('click', () => {
          setSelectedDevice(dev);
          setSelectedReport(null);
          setSelectedTeam(null);
          setSelectedAlert(null);
        });

        markersLayerGroupRef.current?.addLayer(marker);

        // If high or critical, draw radius coverage
        if (dev.status === 'critical' || dev.status === 'high' || dev.status === 'warning') {
          const circleColor = dev.status === 'critical' ? '#ef4444' : dev.status === 'high' ? '#f97316' : '#f59e0b';
          const radiusMeters = (dev.location.affectedRadiusKm || 1.5) * 1000;
          const circle = L.circle([dev.location.lat, dev.location.lng], {
            radius: radiusMeters,
            color: circleColor,
            fillColor: circleColor,
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '4, 8',
          });
          circlesLayerGroupRef.current?.addLayer(circle);
        }
      });
    }

    // 2. Render Citizen Reports
    if (activeFilter === 'all' || activeFilter === 'reports') {
      citizenReports.filter(r => r.status !== 'resolved' && r.status !== 'closed').forEach(rep => {
        if (searchQuery && !rep.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) && !rep.id.toLowerCase().includes(searchQuery.toLowerCase())) {
          return;
        }

        const icon = createCustomIcon('report', rep.priority.toLowerCase(), rep.id);
        const marker = L.marker([rep.location.lat, rep.location.lng], { icon });
        marker.on('click', () => {
          setSelectedReport(rep);
          setSelectedDevice(null);
          setSelectedTeam(null);
          setSelectedAlert(null);
        });
        markersLayerGroupRef.current?.addLayer(marker);
      });
    }

    // 3. Render Response Teams
    if (activeFilter === 'all' || activeFilter === 'teams') {
      responseTeams.forEach(team => {
        if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return;
        }

        const icon = createCustomIcon('team', team.status, team.name.split(' ')[0]);
        const marker = L.marker([team.location.lat, team.location.lng], { icon });
        marker.on('click', () => {
          setSelectedTeam(team);
          setSelectedDevice(null);
          setSelectedReport(null);
          setSelectedAlert(null);
        });
        markersLayerGroupRef.current?.addLayer(marker);
      });
    }

    // 4. Render Resolved Issues
    if (activeFilter === 'all' || activeFilter === 'resolved') {
      citizenReports.filter(r => r.status === 'resolved' || r.status === 'closed').forEach(rep => {
        const icon = createCustomIcon('resolved', 'resolved', 'Fixed: ' + rep.id);
        const marker = L.marker([rep.location.lat, rep.location.lng], { icon });
        marker.on('click', () => {
          setSelectedReport(rep);
          setSelectedDevice(null);
          setSelectedTeam(null);
          setSelectedAlert(null);
        });
        markersLayerGroupRef.current?.addLayer(marker);
      });
    }

    // 5. Render Active Alerts
    if (activeFilter === 'all' || activeFilter === 'alerts') {
      alerts.filter(a => a.status === 'active').forEach(alt => {
        const icon = createCustomIcon('alert', alt.severity, 'Alert');
        const marker = L.marker([alt.location.lat, alt.location.lng], { icon });
        marker.on('click', () => {
          setSelectedAlert(alt);
          setSelectedDevice(null);
          setSelectedReport(null);
          setSelectedTeam(null);
        });
        markersLayerGroupRef.current?.addLayer(marker);
      });
    }
  }, [devices, citizenReports, responseTeams, alerts, activeFilter, searchQuery]);

  // Use GPS location simulation
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapInstanceRef.current?.setView([lat, lng], 15);
          if (onCoordinatesChange) {
            onCoordinatesChange({ lat, lng, address: 'Current Device GPS Location' });
          }
        },
        () => {
          // Fallback to Perumattunallur center
          mapInstanceRef.current?.setView(defaultCenter, 15);
        }
      );
    } else {
      mapInstanceRef.current?.setView(defaultCenter, 15);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
      
      {/* Top Map Filter Controls */}
      <div className="absolute top-3 left-3 right-14 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={language === 'ta' ? 'கருவி / இடம் தேட...' : 'Search sensor, zone or report...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All', icon: '🌐' },
            { id: 'devices', label: 'Devices', icon: '📡' },
            { id: 'alerts', label: 'Alerts', icon: '🚨' },
            { id: 'reports', label: 'Reports', icon: '📸' },
            { id: 'teams', label: 'Response Teams', icon: '👷' },
            { id: 'resolved', label: 'Resolved', icon: '✅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GPS Recenter Button */}
      <div className="absolute top-3 right-3 z-20 pointer-events-auto">
        <button
          onClick={handleUseMyLocation}
          className="p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition-colors"
          title="Recenter to Location"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-[11px] text-slate-700 dark:text-slate-300 hidden sm:block">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" /> Map Legend
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span>
            <span>🟢 Safe Sensor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300"></span>
            <span>🟡 Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300"></span>
            <span>🔴 Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>📸 Citizen Report</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>👷 Response Team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span>✅ Resolved</span>
          </div>
        </div>
      </div>

      {/* Interactive Device Popup Modal (Req #10) */}
      {selectedDevice && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  DEVICE {selectedDevice.deviceCode}
                </span>
                <StatusBadge status={selectedDevice.status} size="sm" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{selectedDevice.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> {selectedDevice.location.address}
              </p>
            </div>
            <button
              onClick={() => setSelectedDevice(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sensors & Telemetry */}
          <div className="mt-3">
            <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5">Live Sensor Readings</p>
            <div className="grid grid-cols-3 gap-2">
              {selectedDevice.currentReadings.aqi !== undefined && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    <Wind className="w-3 h-3 text-sky-500" /> AQI
                  </p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white">
                    {selectedDevice.currentReadings.aqi}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedDevice.currentReadings.aqi > 100 ? 'High' : 'Normal'}
                  </span>
                </div>
              )}

              {selectedDevice.currentReadings.temperature !== undefined && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" /> Temp
                  </p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white">
                    {selectedDevice.currentReadings.temperature}°C
                  </p>
                  <span className="text-[9px] text-slate-400">Ambient</span>
                </div>
              )}

              {selectedDevice.currentReadings.waterLevel !== undefined && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" /> Water Level
                  </p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white">
                    {selectedDevice.currentReadings.waterLevel}m
                  </p>
                  <span className="text-[9px] text-slate-400">Gauge</span>
                </div>
              )}

              {selectedDevice.currentReadings.noise !== undefined && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    <Volume2 className="w-3 h-3 text-purple-500" /> Noise
                  </p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white">
                    {selectedDevice.currentReadings.noise} dB
                  </p>
                  <span className="text-[9px] text-slate-400">Acoustic</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Risk Indicator & Timestamp */}
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">AI Risk Assessment: </span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{selectedDevice.aiRiskLevel}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Updated {selectedDevice.lastUpdated}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentTab('devices');
                setSelectedDevice(null);
              }}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
            <button
              onClick={() => {
                setCurrentTab('simulation');
                setSelectedDevice(null);
              }}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" /> Simulate Readings
            </button>
          </div>
        </div>
      )}

      {/* Citizen Report Popup Modal */}
      {selectedReport && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                  {selectedReport.id}
                </span>
                <StatusBadge status={selectedReport.status} size="sm" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{selectedReport.categoryLabel}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-600" /> {selectedReport.location.address}
              </p>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            {selectedReport.images[0] && (
              <img
                src={selectedReport.images[0]}
                alt="Problem Evidence"
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
            )}
            <div className="flex-1 text-xs">
              <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{selectedReport.description}</p>
              <div className="mt-2 space-y-1">
                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">AI Confidence:</span> {selectedReport.aiAnalysis.confidence}%
                </p>
                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Assigned Team:</span> {selectedReport.assignedTeamName || selectedReport.aiAnalysis.suggestedTeam}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => {
                setCurrentTab('my_reports');
                setSelectedReport(null);
              }}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> View Timeline & Proof
            </button>
          </div>
        </div>
      )}

      {/* Response Team Popup Modal */}
      {selectedTeam && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                  👷 RESPONSE CREW
                </span>
                <StatusBadge status={selectedTeam.status} size="sm" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{selectedTeam.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTeam.department}</p>
            </div>
            <button
              onClick={() => setSelectedTeam(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-xs space-y-1.5">
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Team Lead:</span> {selectedTeam.leaderName}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Current Task:</span>{' '}
              {selectedTeam.activeTaskId ? (
                <span className="text-amber-600 font-bold">{selectedTeam.activeTaskId}</span>
              ) : (
                <span className="text-emerald-600 font-medium">Standby / Available</span>
              )}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Completed Operations:</span> {selectedTeam.completedTasksCount}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentTab('response_team');
                setSelectedTeam(null);
              }}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Dispatch / View Operations
            </button>
          </div>
        </div>
      )}

      {/* Environmental Alert Popup Modal */}
      {selectedAlert && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200">
                  🚨 ACTIVE ALERT
                </span>
                <StatusBadge status={selectedAlert.severity} size="sm" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">{selectedAlert.title}</h4>
            </div>
            <button
              onClick={() => setSelectedAlert(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-xs space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedAlert.simpleMessage}</p>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300">Health-Risk Advisory:</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">{selectedAlert.healthRiskAdvice}</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Affecting approximately {selectedAlert.location.radiusKm} km around {selectedAlert.location.address}.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentTab('alerts');
                setSelectedAlert(null);
              }}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              View Full Alert
            </button>
            <button
              onClick={() => {
                setCurrentTab('report');
                setSelectedAlert(null);
              }}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              Report Problem Here
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
