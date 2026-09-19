export type Language = 'en' | 'ta';

export const translations = {
  en: {
    appTitle: 'EcoSentinel AI',
    tagline: 'Detect Local Problems. Alert the Community. Dispatch the Right Team. Verify the Solution.',
    subTagline: 'Environmental Alerts & Response Operations',
    navHome: 'Home',
    navLiveMap: 'Live Map',
    navAlerts: 'Alerts',
    navReport: 'Report Problem',
    navDevices: 'IoT Devices',
    navSimulation: 'Simulation Mode',
    navAiMonitoring: 'AI Monitoring',
    navResponseTeam: 'Field Operations',
    navAdmin: 'Command Center',
    navAnalytics: 'Analytics',
    navMyReports: 'My Reports',
    
    // Roles
    roleCitizen: 'Citizen',
    roleResponseTeam: 'Response Team',
    roleAdmin: 'Municipal Officer',
    
    // Hero
    heroTitle: "Know What's Happening Around You.",
    heroSubtitle: "EcoSentinel AI monitors environmental conditions, detects local problems, and helps communities respond faster.",
    viewLiveMap: 'View Live Map',
    reportAProblem: 'Report a Problem',
    
    // City Environmental Health
    cityHealthTitle: 'CITY ENVIRONMENTAL HEALTH',
    cityStatusSummary: 'Conditions are generally safe, but some areas need attention.',
    airQuality: 'Air Quality',
    waterQuality: 'Water Quality',
    heatRisk: 'Heat Risk',
    activeAlerts: 'Active Alerts',
    
    // Status Labels
    statusSafe: 'Safe',
    statusWarning: 'Warning',
    statusHigh: 'High',
    statusCritical: 'Critical',
    statusInfo: 'Information',
    statusOffline: 'Offline',
    statusResolved: 'Resolved',
    
    // Common
    viewDetails: 'View Details',
    viewHistory: 'View History',
    acceptTask: 'Accept Task',
    startWork: 'Start Work',
    markResolved: 'Mark as Resolved',
    submitReport: 'Submit Report',
    applyReading: 'Apply Reading',
    triggerWarning: 'Trigger Warning',
    triggerCritical: 'Trigger Critical Alert',
    reset: 'Reset',
    
    // Workflow
    workflowTitle: 'How EcoSentinel AI Works',
    workflowStep1: 'Sense',
    workflowStep2: 'Predict',
    workflowStep3: 'Localize',
    workflowStep4: 'Alert',
    workflowStep5: 'Report',
    workflowStep6: 'Assign',
    workflowStep7: 'Respond',
    workflowStep8: 'Prove',
    workflowStep9: 'Resolve',
  },
  ta: {
    appTitle: 'ஈகோசென்டினல் ஏஐ (EcoSentinel AI)',
    tagline: 'சிக்கலைக் கண்டறிவோம். சமூகத்தை எச்சரிப்போம். களக்குழுவை அனுப்புவோம். தீர்வை உறுதிசெய்வோம்.',
    subTagline: 'சுற்றுச்சூழல் எச்சரிக்கை & கள நடவடிக்கை தளம்',
    navHome: 'முகப்பு',
    navLiveMap: 'நேரலை வரைபடம்',
    navAlerts: 'எச்சரிக்கைகள்',
    navReport: 'புகார் அளிக்கவும்',
    navDevices: 'ஐஓடி கருவிகள்',
    navSimulation: 'மாதிரி இயக்கம் (Simulation)',
    navAiMonitoring: 'ஏஐ கண்காணிப்பு',
    navResponseTeam: 'களப்பணி மையம்',
    navAdmin: 'நிர்வாக மையம்',
    navAnalytics: 'புள்ளிவிவரங்கள்',
    navMyReports: 'எனது புகார்கள்',
    
    // Roles
    roleCitizen: 'பொதுமக்கள் (Citizen)',
    roleResponseTeam: 'களக்குழு (Response Team)',
    roleAdmin: 'நகராட்சி அதிகாரி (Admin)',
    
    // Hero
    heroTitle: 'உங்கள் பகுதியைச் சுற்றியுள்ள சூழலை உடனுக்குடன் அறிந்திடுங்கள்.',
    heroSubtitle: 'EcoSentinel AI சுற்றுச்சூழல் நிலைகளைக் கண்காணித்து, சிக்கல்களைக் கண்டறிந்து, துரித தீர்வு வழங்க உதவுகிறது.',
    viewLiveMap: 'வரைபடத்தைக் காண்க',
    reportAProblem: 'பிரச்சினையைப் புகாரளிக்கவும்',
    
    // City Environmental Health
    cityHealthTitle: 'நகர சுற்றுச்சூழல் நலம்',
    cityStatusSummary: 'பொதுவான சுற்றுச்சூழல் பாதுகாப்பாக உள்ளது, சில பகுதிகளில் கவனம் தேவைப்படுகிறது.',
    airQuality: 'காற்றுத் தரம்',
    waterQuality: 'நீர் தூய்மை',
    heatRisk: 'வெப்ப அபாயம்',
    activeAlerts: 'நடப்பு எச்சரிக்கைகள்',
    
    // Status Labels
    statusSafe: 'பாதுகாப்பானது',
    statusWarning: 'எச்சரிக்கை',
    statusHigh: 'அதிக அபாயம்',
    statusCritical: 'அவசர நிலை',
    statusInfo: 'தகவல்',
    statusOffline: 'செயலிழந்துள்ளது',
    statusResolved: 'தீர்க்கப்பட்டது',
    
    // Common
    viewDetails: 'விவரங்களை காண்க',
    viewHistory: 'வரலாற்றைக் காண்க',
    acceptTask: 'பணியை ஏற்கவும்',
    startWork: 'பணியைத் தொடங்கவும்',
    markResolved: 'தீர்க்கப்பட்டதாகப் பதிவுசெய்',
    submitReport: 'புகாரை அனுப்பவும்',
    applyReading: 'அளவீட்டைப் பயன்படுத்து',
    triggerWarning: 'எச்சரிக்கை ஏற்படுத்துக',
    triggerCritical: 'அவசர எச்சரிக்கை ஏற்படுத்துக',
    reset: 'மீட்டமைக்க',
    
    // Workflow
    workflowTitle: 'EcoSentinel AI செயல்படும் விதம்',
    workflowStep1: 'கண்காணிப்பு (Sense)',
    workflowStep2: 'கணிப்பு (Predict)',
    workflowStep3: 'இடமறிதல் (Localize)',
    workflowStep4: 'எச்சரிக்கை (Alert)',
    workflowStep5: 'புகார் (Report)',
    workflowStep6: 'ஒதுக்கீடு (Assign)',
    workflowStep7: 'களப்பணி (Respond)',
    workflowStep8: 'சான்று (Prove)',
    workflowStep9: 'தீர்வு (Resolve)',
  }
};
