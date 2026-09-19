import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, 
  IoTDevice, 
  CitizenReport, 
  EnvironmentalAlert, 
  ResponseTeam, 
  AIPrediction, 
  AppNotification, 
  CityHealthIndex,
  TaskStatus,
  SensorReadings,
  ResolutionProof
} from '../types';
import { 
  INITIAL_DEVICES, 
  INITIAL_CITIZEN_REPORTS, 
  INITIAL_ALERTS, 
  INITIAL_RESPONSE_TEAMS, 
  INITIAL_AI_PREDICTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CITY_HEALTH 
} from '../data/mockData';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

export interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  teamId?: string;
  avatar?: string;
}

interface AppContextType {
  // Navigation & View
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  
  // Theme & Language
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  
  // User & Role Management
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: CurrentUserProfile;
  switchUserRole: (role: UserRole) => void;
  
  // Data entities
  devices: IoTDevice[];
  citizenReports: CitizenReport[];
  alerts: EnvironmentalAlert[];
  responseTeams: ResponseTeam[];
  aiPredictions: AIPrediction[];
  notifications: AppNotification[];
  cityHealth: CityHealthIndex;
  
  // Selected map focus
  mapFocusLocation: { lat: number; lng: number; zoom?: number } | null;
  setMapFocusLocation: (loc: { lat: number; lng: number; zoom?: number } | null) => void;
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;

  // Actions
  addDevice: (device: Omit<IoTDevice, 'id' | 'lastUpdated' | 'readingHistory'>) => void;
  updateDevice: (id: string, updates: Partial<IoTDevice>) => void;
  deleteDevice: (id: string) => void;
  simulateDeviceReading: (deviceId: string, readings: SensorReadings) => void;
  
  createCitizenReport: (reportData: {
    category: any;
    categoryLabel: string;
    location: any;
    description: string;
    images: string[];
    videoUrl?: string;
  }) => string;
  
  verifyReportByAdmin: (reportId: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', teamId: string, memberId?: string) => void;
  updateTaskStatus: (reportId: string, newStatus: TaskStatus, note?: string, proof?: ResolutionProof) => void;
  
  resolveAlert: (alertId: string) => void;
  createAlert: (alertData: Omit<EnvironmentalAlert, 'id' | 'detectedAt'>) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaults: () => void;
  
  // Guided Demo Scenario
  demoStep: number;
  setDemoStep: (step: number) => void;
  advanceDemoStep: () => void;
  resetDemoTour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'ecosentinel_theme',
  LANG: 'ecosentinel_lang',
  ROLE: 'ecosentinel_role',
  DEVICES: 'ecosentinel_devices_v2',
  REPORTS: 'ecosentinel_reports_v2',
  ALERTS: 'ecosentinel_alerts_v2',
  TEAMS: 'ecosentinel_teams_v2',
  PREDICTIONS: 'ecosentinel_predictions_v2',
  NOTIFS: 'ecosentinel_notifs_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved === 'ta' || saved === 'en') ? saved : 'en';
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('home');

  // User Role & Current Profile
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'citizen';
  });

  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(() => {
    return {
      id: 'cit-101',
      name: 'Praveen Kumar',
      email: 'praveen.citizen@ecosentinel.gov',
      role: 'citizen',
    };
  });

  // Guided demo scenario step tracker
  const [demoStep, setDemoStep] = useState<number>(0);

  // Entities state
  const [devices, setDevices] = useState<IoTDevice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICES);
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_CITIZEN_REPORTS;
  });

  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [responseTeams, setResponseTeams] = useState<ResponseTeam[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : INITIAL_RESPONSE_TEAMS;
  });

  const [aiPredictions, setAiPredictions] = useState<AIPrediction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    return saved ? JSON.parse(saved) : INITIAL_AI_PREDICTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cityHealth] = useState<CityHealthIndex>(INITIAL_CITY_HEALTH);

  // Map state
  const [mapFocusLocation, setMapFocusLocation] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Sync theme to root classList
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  // Sync role and update mock current user profile
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
    if (userRole === 'citizen') {
      setCurrentUser({
        id: 'cit-101',
        name: 'Praveen Kumar',
        email: 'praveen.citizen@ecosentinel.gov',
        role: 'citizen',
      });
    } else if (userRole === 'response_team') {
      setCurrentUser({
        id: 'm-5',
        name: 'Arun',
        email: 'arun.drainage@ecosentinel.gov',
        role: 'response_team',
        department: 'Drainage & Environmental Response Team',
        teamId: 'team-drainage',
      });
    } else {
      setCurrentUser({
        id: 'adm-01',
        name: 'Officer R. Natarajan',
        email: 'natarajan.admin@ecosentinel.gov',
        role: 'admin',
        department: 'Municipal Environmental Operations Command',
      });
    }
  }, [userRole]);

  // Persist entities
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(citizenReports));
  }, [citizenReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(responseTeams));
  }, [responseTeams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(aiPredictions));
  }, [aiPredictions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Translation helper
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || String(key);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchUserRole = (role: UserRole) => {
    setUserRole(role);
    // Suggest relevant landing tab based on role
    if (role === 'citizen') {
      if (currentTab === 'admin' || currentTab === 'response_team' || currentTab === 'simulation') {
        setCurrentTab('home');
      }
    } else if (role === 'response_team') {
      setCurrentTab('response_team');
    } else if (role === 'admin') {
      setCurrentTab('admin');
    }
  };

  // Add IoT Device
  const addDevice = (deviceData: Omit<IoTDevice, 'id' | 'lastUpdated' | 'readingHistory'>) => {
    const newId = `dev-${Date.now()}`;
    const newDevice: IoTDevice = {
      ...deviceData,
      id: newId,
      lastUpdated: 'Just now',
      readingHistory: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aqi: deviceData.currentReadings.aqi || 45,
          pm25: deviceData.currentReadings.pm25 || 15,
          temperature: deviceData.currentReadings.temperature || 30,
          waterLevel: deviceData.currentReadings.waterLevel || 2.0,
          noise: deviceData.currentReadings.noise || 55,
        }
      ],
    };

    setDevices(prev => [newDevice, ...prev]);

    // Send notification to admin
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `📡 New Device Added (${newDevice.deviceCode})`,
      message: `${newDevice.name} placed at ${newDevice.location.address}`,
      type: 'device',
      targetRole: 'admin',
      timestamp: 'Just now',
      read: false,
      linkTab: 'devices',
      linkId: newId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Device
  const updateDevice = (id: string, updates: Partial<IoTDevice>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastUpdated: 'Just now' } : d));
  };

  // Delete Device
  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  // SIMULATION ENGINE
  const simulateDeviceReading = (deviceId: string, readings: SensorReadings) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id !== deviceId) return dev;

      const mergedReadings = { ...dev.currentReadings, ...readings };
      let newStatus = dev.status;
      let aiRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
      let anomalyDetected = false;
      let anomalyMessage = '';
      let recommendedTeam = 'Environmental Team';
      let healthAdvice = 'Environmental conditions are safe and normal.';

      // Air Quality thresholds
      if (mergedReadings.aqi !== undefined) {
        if (mergedReadings.aqi > 200 || (mergedReadings.pm25 && mergedReadings.pm25 > 120)) {
          newStatus = 'critical';
          aiRisk = 'CRITICAL';
          anomalyDetected = true;
          anomalyMessage = `Severe hazardous particulate spike detected (AQI: ${mergedReadings.aqi}).`;
          healthAdvice = 'Environmental conditions indicate high respiratory-health risk. Wear N95 masks and limit outdoor exposure.';
          recommendedTeam = 'Environmental Team';
        } else if (mergedReadings.aqi > 100 || (mergedReadings.pm25 && mergedReadings.pm25 > 50)) {
          newStatus = 'high';
          aiRisk = 'HIGH';
          anomalyDetected = true;
          anomalyMessage = `Elevated air pollution (AQI: ${mergedReadings.aqi}) detected.`;
          healthAdvice = 'Environmental conditions indicate increased respiratory-health risk for sensitive demographics.';
          recommendedTeam = 'Environmental Team';
        } else if (mergedReadings.aqi > 60) {
          newStatus = 'warning';
          aiRisk = 'MODERATE';
          anomalyDetected = true;
          anomalyMessage = `Moderate dust particulate rise (AQI: ${mergedReadings.aqi}).`;
          healthAdvice = 'Air quality is acceptable; sensitive individuals should take note.';
          recommendedTeam = 'Environmental Team';
        } else {
          newStatus = 'safe';
          aiRisk = 'LOW';
        }
      }

      // Water Level / Flooding thresholds
      if (mergedReadings.waterLevel !== undefined) {
        if (mergedReadings.waterLevel >= 5.0) {
          newStatus = 'critical';
          aiRisk = 'CRITICAL';
          anomalyDetected = true;
          anomalyMessage = `Spillway overtopping risk (Water level: ${mergedReadings.waterLevel}m).`;
          healthAdvice = 'Flooding danger in lowland pedestrian pathways.';
          recommendedTeam = 'Emergency Response';
        } else if (mergedReadings.waterLevel >= 4.5) {
          newStatus = 'warning';
          aiRisk = 'MODERATE';
          anomalyDetected = true;
          anomalyMessage = `Canal water level rising above safety buffer (${mergedReadings.waterLevel}m).`;
          healthAdvice = 'Stay clear of canal banks.';
          recommendedTeam = 'Drainage Team';
        }
      }

      // Noise thresholds
      if (mergedReadings.noise !== undefined) {
        if (mergedReadings.noise > 85) {
          newStatus = 'warning';
          aiRisk = 'MODERATE';
          anomalyDetected = true;
          anomalyMessage = `Excessive acoustic disturbance (${mergedReadings.noise} dB).`;
          healthAdvice = 'Prolonged exposure may cause acoustic fatigue.';
          recommendedTeam = 'Local Monitoring Team';
        }
      }

      // If anomaly detected and transitioned to Warning/High/Critical, spawn Alert and AI Prediction
      if (anomalyDetected && (newStatus === 'warning' || newStatus === 'high' || newStatus === 'critical')) {
        // Create AI Prediction
        const newPred: AIPrediction = {
          id: `pred-${Date.now()}`,
          title: `${dev.name} Sensor Anomaly`,
          location: dev.location.address,
          zone: dev.location.zone,
          riskLevel: aiRisk,
          confidence: Math.floor(Math.random() * 8) + 91, // 91-98%
          detectedAnomaly: anomalyMessage,
          environmentalRisk: `${aiRisk} environmental risk identified at ${dev.location.zone}`,
          healthRiskPrediction: healthAdvice,
          recommendedAction: `Inspect the area and investigate the source immediately. Dispatch ${recommendedTeam}.`,
          suggestedTeam: recommendedTeam,
          timestamp: 'Just now',
          active: true,
        };
        setAiPredictions(prevPreds => [newPred, ...prevPreds]);

        // Create or update localized alert
        const alertId = `alt-${Date.now()}`;
        const newAlert: EnvironmentalAlert = {
          id: alertId,
          title: newStatus === 'critical' ? `CRITICAL: Severe Anomaly near ${dev.location.address}` : `High Anomaly near ${dev.location.address}`,
          simpleMessage: newStatus === 'critical' 
            ? `Critical condition detected near you. ${anomalyMessage}`
            : `Unusual environmental condition detected near you.`,
          technicalDetails: `Telemetry from ${dev.deviceCode}: ${JSON.stringify(mergedReadings)}`,
          category: dev.type === 'air_quality' ? 'air_pollution' : dev.type === 'flood_drainage' ? 'flooding_drainage' : 'environmental_damage',
          severity: newStatus === 'critical' ? 'critical' : newStatus === 'high' ? 'high' : 'warning',
          location: {
            ...dev.location,
            radiusKm: dev.location.affectedRadiusKm || 2.4,
          },
          detectedAt: 'Just now',
          source: 'iot_sensor',
          deviceId: dev.id,
          assignedTeamName: recommendedTeam,
          status: 'active',
          healthRiskAdvice: healthAdvice,
        };
        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);

        // Push Notifications
        const alertNotif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `🚨 ${newAlert.title}`,
          message: `Alert affecting approx ${newAlert.location.radiusKm || 2.4} km around ${newAlert.location.address}.`,
          type: 'alert',
          targetRole: 'all',
          timestamp: 'Just now',
          read: false,
          linkTab: 'alerts',
          linkId: alertId,
        };
        setNotifications(prevNotifs => [alertNotif, ...prevNotifs]);
      }

      // Add to reading history
      const newHistoryEntry = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: mergedReadings.aqi,
        pm25: mergedReadings.pm25,
        temperature: mergedReadings.temperature,
        waterLevel: mergedReadings.waterLevel,
        noise: mergedReadings.noise,
      };

      return {
        ...dev,
        currentReadings: mergedReadings,
        status: newStatus,
        aiRiskLevel: aiRisk,
        anomalyDetected,
        lastUpdated: 'Just now',
        readingHistory: [...dev.readingHistory.slice(-9), newHistoryEntry],
      };
    }));
  };

  // Citizen report submission with automatic AI Inspection
  const createCitizenReport = (reportData: {
    category: any;
    categoryLabel: string;
    location: any;
    description: string;
    images: string[];
    videoUrl?: string;
  }) => {
    const reportCode = `REP-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let suggestedTeam = 'Environmental Team';
    let suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';

    switch (reportData.category) {
      case 'traffic_signal':
        suggestedTeam = 'Traffic Maintenance';
        suggestedPriority = 'HIGH';
        break;
      case 'streetlight':
        suggestedTeam = 'Electrical Team';
        suggestedPriority = 'LOW';
        break;
      case 'flooding_drainage':
        suggestedTeam = 'Drainage Team';
        suggestedPriority = 'HIGH';
        break;
      case 'water_problem':
        suggestedTeam = 'Water Quality Team';
        suggestedPriority = 'HIGH';
        break;
      case 'garbage':
        suggestedTeam = 'Sanitation Team';
        suggestedPriority = 'MEDIUM';
        break;
      case 'air_pollution':
        suggestedTeam = 'Environmental Team';
        suggestedPriority = 'HIGH';
        break;
      case 'road_problem':
        suggestedTeam = 'Traffic Maintenance';
        suggestedPriority = 'MEDIUM';
        break;
      case 'excessive_noise':
        suggestedTeam = 'Environmental Team';
        suggestedPriority = 'LOW';
        break;
      case 'environmental_damage':
        suggestedTeam = 'Environmental Team';
        suggestedPriority = 'HIGH';
        break;
      default:
        suggestedTeam = 'Emergency Response';
        suggestedPriority = 'MEDIUM';
    }

    const newReport: CitizenReport = {
      id: reportCode,
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenPhone: '+91 98400 11223',
      category: reportData.category,
      categoryLabel: reportData.categoryLabel,
      location: {
        ...reportData.location,
        affectedRadiusKm: 0.5,
      },
      description: reportData.description,
      images: reportData.images,
      videoUrl: reportData.videoUrl,
      submittedAt: 'Just now',
      status: 'reported',
      priority: suggestedPriority,
      aiAnalysis: {
        problemIdentified: `${reportData.categoryLabel} detected via image inspection`,
        confidence: Math.floor(Math.random() * 6) + 93, // 93-98%
        suggestedPriority,
        suggestedTeam,
        duplicateCheck: 'No duplicates found',
        explanation: `AI visual scan identified verified visual markers for ${reportData.categoryLabel} at specified coordinates.`,
      },
      timeline: [
        {
          status: 'reported',
          timestamp: 'Just now',
          note: 'Report submitted by citizen with image evidence',
          performedBy: currentUser.name,
        },
      ],
    };

    setCitizenReports(prev => [newReport, ...prev]);

    // Push notification to Admin
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `📸 New Citizen Report: ${reportCode}`,
      message: `${reportData.categoryLabel} reported at ${reportData.location.address}. AI recommends ${suggestedTeam}.`,
      type: 'ai',
      targetRole: 'admin',
      timestamp: 'Just now',
      read: false,
      linkTab: 'admin',
      linkId: reportCode,
    };
    setNotifications(prev => [adminNotif, ...prev]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    return reportCode;
  };

  // Admin verifies and assigns report
  const verifyReportByAdmin = (reportId: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', teamId: string, memberId?: string) => {
    const selectedTeam = responseTeams.find(t => t.id === teamId);
    const selectedMember = selectedTeam?.members.find(m => m.id === memberId) || selectedTeam?.members[0];

    setCitizenReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;

      const newTimeline = [
        ...rep.timeline,
        {
          status: 'assigned',
          timestamp: 'Just now',
          note: `Verified by Admin. Assigned to ${selectedTeam?.name} (${selectedMember?.name || 'Lead Officer'}).`,
          performedBy: currentUser.name,
        },
      ];

      return {
        ...rep,
        status: 'assigned' as TaskStatus,
        priority,
        assignedTeamId: teamId,
        assignedTeamName: selectedTeam?.name,
        assignedMemberId: selectedMember?.id,
        assignedMemberName: selectedMember?.name,
        timeline: newTimeline,
      };
    }));

    // Update response team state to busy & assign task
    setResponseTeams(prev => prev.map(team => {
      if (team.id !== teamId) return team;
      return {
        ...team,
        status: 'busy',
        activeTaskId: reportId,
        members: team.members.map(m => m.id === selectedMember?.id ? { ...m, status: 'busy' } : m),
      };
    }));

    // Notify response team
    const teamNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `👷 New Task Assigned: ${reportId}`,
      message: `You have been dispatched to ${selectedTeam?.name} for incident ${reportId}.`,
      type: 'assignment',
      targetRole: 'response_team',
      targetUserId: selectedMember?.id,
      timestamp: 'Just now',
      read: false,
      linkTab: 'response_team',
      linkId: reportId,
    };

    // Notify citizen
    const citNotif: AppNotification = {
      id: `notif-${Date.now() + 1}`,
      title: `👷 Response Team Assigned to ${reportId}`,
      message: `${selectedTeam?.name} (${selectedMember?.name}) has been dispatched to resolve your issue.`,
      type: 'assignment',
      targetRole: 'citizen',
      timestamp: 'Just now',
      read: false,
      linkTab: 'my_reports',
      linkId: reportId,
    };

    setNotifications(prev => [teamNotif, citNotif, ...prev]);
  };

  // Response team updates lifecycle status
  const updateTaskStatus = (reportId: string, newStatus: TaskStatus, note?: string, proof?: ResolutionProof) => {
    let resolutionConfetti = false;

    setCitizenReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;

      let statusNote = note || `Status updated to ${newStatus}`;
      if (newStatus === 'accepted') statusNote = 'Task accepted by responder. Preparing equipment.';
      if (newStatus === 'on_the_way') statusNote = 'Response team en route to location.';
      if (newStatus === 'working') statusNote = 'Crew arrived on site and active remediation in progress.';
      if (newStatus === 'resolved') {
        statusNote = proof?.resolutionNotes ? `Resolved: ${proof.resolutionNotes}` : 'Issue resolved and verified.';
        resolutionConfetti = true;
      }

      const newTimeline = [
        ...rep.timeline,
        {
          status: newStatus,
          timestamp: 'Just now',
          note: statusNote,
          performedBy: rep.assignedMemberName || currentUser.name,
        },
      ];

      return {
        ...rep,
        status: newStatus,
        resolutionProof: proof || rep.resolutionProof,
        timeline: newTimeline,
      };
    }));

    if (newStatus === 'resolved') {
      // Free up the team
      setResponseTeams(prev => prev.map(t => {
        if (t.activeTaskId === reportId) {
          return {
            ...t,
            status: 'available',
            activeTaskId: undefined,
            completedTasksCount: t.completedTasksCount + 1,
            members: t.members.map(m => ({ ...m, status: 'available' })),
          };
        }
        return t;
      }));

      // Notify citizen and admin
      const resNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `✅ Your Report ${reportId} has been Resolved!`,
        message: `Field team uploaded verified resolution photo and notes. Tap to view proof.`,
        type: 'resolution',
        targetRole: 'all',
        timestamp: 'Just now',
        read: false,
        linkTab: 'my_reports',
        linkId: reportId,
      };
      setNotifications(prev => [resNotif, ...prev]);

      if (resolutionConfetti) {
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  // Resolve Alert
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
  };

  // Create custom alert
  const createAlert = (alertData: Omit<EnvironmentalAlert, 'id' | 'detectedAt'>) => {
    const newAlert: EnvironmentalAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      detectedAt: 'Just now',
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Mark notification read
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset to initial demo defaults
  const resetToDefaults = () => {
    setDevices(INITIAL_DEVICES);
    setCitizenReports(INITIAL_CITIZEN_REPORTS);
    setAlerts(INITIAL_ALERTS);
    setResponseTeams(INITIAL_RESPONSE_TEAMS);
    setAiPredictions(INITIAL_AI_PREDICTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DEVICES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    setDemoStep(0);
  };

  const advanceDemoStep = () => {
    setDemoStep(prev => prev + 1);
  };

  const resetDemoTour = () => {
    setDemoStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        currentUser,
        switchUserRole,
        devices,
        citizenReports,
        alerts,
        responseTeams,
        aiPredictions,
        notifications,
        cityHealth,
        mapFocusLocation,
        setMapFocusLocation,
        selectedEntityId,
        setSelectedEntityId,
        addDevice,
        updateDevice,
        deleteDevice,
        simulateDeviceReading,
        createCitizenReport,
        verifyReportByAdmin,
        updateTaskStatus,
        resolveAlert,
        createAlert,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults,
        demoStep,
        setDemoStep,
        advanceDemoStep,
        resetDemoTour,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
