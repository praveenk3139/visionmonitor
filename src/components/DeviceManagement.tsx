import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IoTDevice, DeviceType, SensorType, StatusLevel } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Plus, 
  Cpu, 
  Trash2, 
  Edit3, 
  Sliders, 
  MapPin, 
  Battery, 
  Radio, 
  Check, 
  X, 
  Search, 
  Filter, 
  Eye, 
  Wrench,
  Wind,
  Droplets,
  Volume2,
  Calendar,
  AlertOctagon
} from 'lucide-react';

export const DeviceManagement: React.FC = () => {
  const { 
    devices, 
    addDevice, 
    updateDevice, 
    deleteDevice, 
    setCurrentTab, 
    setMapFocusLocation,
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);

  // Form State for Adding / Editing Device
  const [formData, setFormData] = useState({
    deviceCode: 'ENV-024',
    name: 'Perumattunallur Air Quality Monitor',
    type: 'air_quality' as DeviceType,
    sensorTypes: ['pm25', 'pm10', 'temperature', 'humidity', 'gas'] as SensorType[],
    lat: 12.8345,
    lng: 80.0543,
    address: 'Perumattunallur Main Road, Sector 3',
    zone: 'Zone 1 - Central',
    landmark: 'Near Govt High School',
    installDate: new Date().toISOString().split('T')[0],
    status: 'safe' as StatusLevel,
    affectedRadiusKm: 2.4,
  });

  const allSensorOptions: { id: SensorType; label: string }[] = [
    { id: 'pm25', label: 'PM2.5' },
    { id: 'pm10', label: 'PM10' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'gas', label: 'Gas / CO2' },
    { id: 'water_level', label: 'Water Level' },
    { id: 'turbidity', label: 'Turbidity' },
    { id: 'noise', label: 'Noise (dB)' },
  ];

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.deviceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleToggleSensor = (sensor: SensorType) => {
    setFormData(prev => {
      const exists = prev.sensorTypes.includes(sensor);
      return {
        ...prev,
        sensorTypes: exists 
          ? prev.sensorTypes.filter(s => s !== sensor)
          : [...prev.sensorTypes, sensor]
      };
    });
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDevice) {
      updateDevice(editingDevice.id, {
        deviceCode: formData.deviceCode,
        name: formData.name,
        type: formData.type,
        sensorTypes: formData.sensorTypes,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
          address: formData.address,
          zone: formData.zone,
          landmark: formData.landmark,
          affectedRadiusKm: Number(formData.affectedRadiusKm),
        },
        status: formData.status,
      });
      setEditingDevice(null);
    } else {
      addDevice({
        deviceCode: formData.deviceCode,
        name: formData.name,
        type: formData.type,
        sensorTypes: formData.sensorTypes,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
          address: formData.address,
          zone: formData.zone,
          landmark: formData.landmark,
          affectedRadiusKm: Number(formData.affectedRadiusKm),
        },
        status: formData.status,
        installDate: formData.installDate,
        maintenanceMode: false,
        batteryLevel: 98,
        signalStrength: 95,
        currentReadings: {
          aqi: 54,
          pm25: 18,
          temperature: 30.5,
          humidity: 60,
          gasLevel: 15,
        },
        aiRiskLevel: 'LOW',
      });
      setIsAddModalOpen(false);
    }
  };

  const openEditModal = (dev: IoTDevice) => {
    setEditingDevice(dev);
    setFormData({
      deviceCode: dev.deviceCode,
      name: dev.name,
      type: dev.type,
      sensorTypes: dev.sensorTypes,
      lat: dev.location.lat,
      lng: dev.location.lng,
      address: dev.location.address,
      zone: dev.location.zone,
      landmark: dev.location.landmark || '',
      installDate: dev.installDate,
      status: dev.status,
      affectedRadiusKm: dev.location.affectedRadiusKm || 2.0,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Admin → IoT Environmental Devices
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage physical telemetry monitors, sensor types, maintenance modes, and GPS placements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('simulation')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Simulation Sandbox</span>
          </button>

          <button
            onClick={() => {
              setEditingDevice(null);
              setFormData({
                deviceCode: `ENV-0${devices.length + 20}`,
                name: 'New Environmental Station',
                type: 'air_quality',
                sensorTypes: ['pm25', 'pm10', 'temperature', 'humidity'],
                lat: 12.8350,
                lng: 80.0550,
                address: 'Perumattunallur Main Road, Zone 1',
                zone: 'Zone 1 - Central',
                landmark: 'Near Town Hall',
                installDate: new Date().toISOString().split('T')[0],
                status: 'safe',
                affectedRadiusKm: 2.4,
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Device</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, name, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Devices' },
            { id: 'air_quality', label: 'Air Quality' },
            { id: 'water_quality', label: 'Water Quality' },
            { id: 'flood_drainage', label: 'Flood / Canal' },
            { id: 'noise_monitor', label: 'Acoustic / Noise' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === type.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((dev) => (
          <div
            key={dev.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {dev.deviceCode}
                </span>
                <StatusBadge status={dev.maintenanceMode ? 'offline' : dev.status} size="sm" />
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-base">
                {dev.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{dev.location.address}</span>
              </p>
            </div>

            {/* Live Telemetry Display */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="font-medium">Sensor Array:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                  {dev.sensorTypes.join(', ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                {dev.currentReadings.aqi !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400">Current AQI:</span>
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                      {dev.currentReadings.aqi}
                    </p>
                  </div>
                )}
                {dev.currentReadings.waterLevel !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400">Water Depth:</span>
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                      {dev.currentReadings.waterLevel} m
                    </p>
                  </div>
                )}
                {dev.currentReadings.noise !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400">Noise Level:</span>
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                      {dev.currentReadings.noise} dB
                    </p>
                  </div>
                )}
                {dev.currentReadings.temperature !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400">Temperature:</span>
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                      {dev.currentReadings.temperature}°C
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Health & Battery Strip */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                <span>{dev.batteryLevel}% Battery</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-sky-500" />
                <span>{dev.signalStrength}% 4G/LTE</span>
              </div>
              <div>
                <span>{dev.lastUpdated}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  updateDevice(dev.id, { maintenanceMode: !dev.maintenanceMode });
                }}
                className={`py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                  dev.maintenanceMode
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title="Toggle Maintenance Mode"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{dev.maintenanceMode ? 'In Service' : 'Maint.'}</span>
              </button>

              <button
                onClick={() => openEditModal(dev)}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => deleteDevice(dev.id)}
                className="py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                title="Delete Device"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Device Modal */}
      {(isAddModalOpen || editingDevice) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-6 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {editingDevice ? `Edit Device ${editingDevice.deviceCode}` : 'Register New IoT Environmental Sensor'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDevice(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-4">
              
              {/* Device Code & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Device Identifier (Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deviceCode}
                    onChange={(e) => setFormData({ ...formData, deviceCode: e.target.value })}
                    placeholder="e.g. ENV-024"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Perumattunallur Air Monitor"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Device Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Device Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DeviceType })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="air_quality">Air Quality Sentinel</option>
                    <option value="water_quality">Water Quality Basin Sensor</option>
                    <option value="flood_drainage">Flood & Spillway Gauge</option>
                    <option value="noise_monitor">Acoustic & Noise Sentinel</option>
                    <option value="multi_sensor">Integrated Multi-Sensor Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusLevel })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="safe">🟢 SAFE / Normal</option>
                    <option value="warning">🟡 WARNING</option>
                    <option value="high">🟠 HIGH</option>
                    <option value="critical">🔴 CRITICAL</option>
                  </select>
                </div>
              </div>

              {/* Sensor Types Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Installed Sensor Types
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {allSensorOptions.map((opt) => {
                    const isChecked = formData.sensorTypes.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleToggleSensor(opt.id)}
                        className={`p-2 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location & GPS Coordinates */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Location Placement & GIS Coordinates
                </label>
                
                <div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address or junction..."
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Slight random jitter around Perumattunallur
                      const offsetLat = 12.8345 + (Math.random() - 0.5) * 0.015;
                      const offsetLng = 80.0543 + (Math.random() - 0.5) * 0.015;
                      setFormData({
                        ...formData,
                        lat: Number(offsetLat.toFixed(5)),
                        lng: Number(offsetLng.toFixed(5)),
                        address: `Perumattunallur Sector ${Math.floor(Math.random() * 5) + 1}`,
                      });
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Auto-Place Pin in Perumattunallur Zone
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDevice(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  {editingDevice ? 'Save Device Changes' : 'Deploy Device to Live Map'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
