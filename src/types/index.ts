export type UserRole = 'citizen' | 'response_team' | 'admin';

export type StatusLevel = 'safe' | 'warning' | 'high' | 'critical' | 'info' | 'offline' | 'resolved';

export type SensorType = 
  | 'pm25' 
  | 'pm10' 
  | 'temperature' 
  | 'humidity' 
  | 'gas' 
  | 'water_level' 
  | 'turbidity' 
  | 'noise';

export type DeviceType = 
  | 'air_quality' 
  | 'water_quality' 
  | 'flood_drainage' 
  | 'noise_monitor' 
  | 'multi_sensor';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  zone: string;
  landmark?: string;
  affectedRadiusKm?: number;
  radiusKm?: number;
}

export interface SensorReadings {
  aqi?: number;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  gasLevel?: number;
  waterLevel?: number; // cm or m
  turbidity?: number; // NTU
  noise?: number; // dB
}

export interface IoTDevice {
  id: string;
  deviceCode: string; // e.g. "ENV-001", "ENV-024"
  name: string;
  type: DeviceType;
  sensorTypes: SensorType[];
  location: LocationCoordinates;
  status: StatusLevel;
  installDate: string;
  lastUpdated: string;
  maintenanceMode: boolean;
  batteryLevel: number;
  signalStrength: number; // percentage
  currentReadings: SensorReadings;
  readingHistory: Array<{
    timestamp: string;
    aqi?: number;
    pm25?: number;
    temperature?: number;
    waterLevel?: number;
    noise?: number;
  }>;
  aiRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  anomalyDetected?: boolean;
}

export type ProblemCategory = 
  | 'air_pollution'
  | 'water_problem'
  | 'flooding_drainage'
  | 'garbage'
  | 'streetlight'
  | 'traffic_signal'
  | 'road_problem'
  | 'excessive_noise'
  | 'environmental_damage'
  | 'other';

export type TaskStatus = 
  | 'reported'
  | 'verified'
  | 'assigned'
  | 'accepted'
  | 'on_the_way'
  | 'working'
  | 'resolved'
  | 'closed';

export interface TimelineEvent {
  status: TaskStatus | string;
  timestamp: string;
  note?: string;
  performedBy?: string;
}

export interface AIAnalysisResult {
  problemIdentified: string;
  confidence: number; // 0 - 100
  suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedTeam: string;
  duplicateCheck: 'No duplicates found' | 'Potential match';
  explanation?: string;
}

export interface ResolutionProof {
  afterImages: string[];
  resolutionNotes: string;
  resolvedAt: string;
  verifiedByAdmin: boolean;
  verifiedAt?: string;
}

export interface CitizenReport {
  id: string; // e.g. "REP-10245"
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  category: ProblemCategory;
  categoryLabel: string;
  location: LocationCoordinates;
  description: string;
  images: string[];
  videoUrl?: string;
  submittedAt: string;
  status: TaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiAnalysis: AIAnalysisResult;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  timeline: TimelineEvent[];
  resolutionProof?: ResolutionProof;
}

export interface EnvironmentalAlert {
  id: string;
  title: string;
  simpleMessage: string;
  technicalDetails: string;
  category: ProblemCategory | 'sensor_anomaly' | 'weather_hazard';
  severity: 'safe' | 'warning' | 'high' | 'critical';
  location: LocationCoordinates;
  detectedAt: string;
  source: 'iot_sensor' | 'citizen_report' | 'ai_prediction';
  deviceId?: string;
  reportId?: string;
  assignedTeamName?: string;
  status: 'active' | 'investigating' | 'resolved';
  healthRiskAdvice: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  avatar?: string;
}

export interface ResponseTeam {
  id: string;
  name: string;
  department: string;
  leaderName: string;
  status: 'available' | 'busy' | 'emergency' | 'offline';
  location: { lat: number; lng: number; address: string };
  activeTaskId?: string;
  members: TeamMember[];
  completedTasksCount: number;
}

export interface AIPrediction {
  id: string;
  title: string;
  location: string;
  zone: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  detectedAnomaly: string;
  environmentalRisk: string;
  healthRiskPrediction: string;
  recommendedAction: string;
  suggestedTeam: string;
  timestamp: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'assignment' | 'resolution' | 'device' | 'ai';
  targetRole: 'all' | 'citizen' | 'response_team' | 'admin';
  targetUserId?: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  linkId?: string;
}

export interface CityHealthIndex {
  score: number; // 0 - 100
  level: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL';
  summary: string;
  airQuality: { status: string; aqi: number; label: string };
  waterQuality: { status: string; label: string; score: number };
  heatRisk: { status: string; label: string; tempC: number };
  activeAlertsCount: number;
}
