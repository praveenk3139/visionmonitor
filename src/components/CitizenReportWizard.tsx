import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProblemCategory } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Check, 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Image as ImageIcon,
  Loader2,
  Navigation,
  Eye
} from 'lucide-react';

export const CitizenReportWizard: React.FC = () => {
  const { createCitizenReport, setCurrentTab, language } = useApp();

  // Wizard current step: 1 (Category), 2 (Location), 3 (Photo), 4 (AI Analysis), 5 (Submit / Confirmed)
  const [step, setStep] = useState<number>(1);
  
  // Form State
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory>('garbage');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>('Garbage / Waste Accumulation');
  
  const [locationAddress, setLocationAddress] = useState<string>('Perumattunallur Main Road, Zone 1');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.8345,
    lng: 80.0543,
  });
  const [locationZone, setLocationZone] = useState<string>('Zone 1 - Central');

  const [uploadedImage, setUploadedImage] = useState<string>(SAMPLE_IMAGES.garbageBefore);
  const [description, setDescription] = useState<string>('Unattended solid waste piles spilling onto the pedestrian pathway and stormwater intake.');
  
  // AI Scan state
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiScanComplete, setAiScanComplete] = useState<boolean>(false);
  
  // Submission success result
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Category Options (Requirement #16)
  const problemCategories: { id: ProblemCategory; label: string; icon: string; defaultSample: string; desc: string }[] = [
    { id: 'air_pollution', label: 'Air Pollution', icon: '🌫️', defaultSample: SAMPLE_IMAGES.airPollution, desc: 'Smoke, toxic dust, factory emissions' },
    { id: 'water_problem', label: 'Water Problem', icon: '💧', defaultSample: SAMPLE_IMAGES.waterPollution, desc: 'Contaminated supply, dirty tap water' },
    { id: 'flooding_drainage', label: 'Flooding / Drainage', icon: '🌊', defaultSample: SAMPLE_IMAGES.drainageBefore, desc: 'Waterlogging, clogged stormwater drains' },
    { id: 'garbage', label: 'Garbage / Waste', icon: '🗑️', defaultSample: SAMPLE_IMAGES.garbageBefore, desc: 'Dumping piles, overflowing bins' },
    { id: 'streetlight', label: 'Streetlight Failure', icon: '💡', defaultSample: SAMPLE_IMAGES.streetlightBroken, desc: 'Broken street lamps, dark streets' },
    { id: 'traffic_signal', label: 'Traffic Signal', icon: '🚦', defaultSample: SAMPLE_IMAGES.cleanStreet, desc: 'Malfunctioning junction signals' },
    { id: 'road_problem', label: 'Road / Pothole', icon: '🛣️', defaultSample: SAMPLE_IMAGES.potholeRoad, desc: 'Dangerous potholes, road craters' },
    { id: 'excessive_noise', label: 'Excessive Noise', icon: '🔊', defaultSample: SAMPLE_IMAGES.cleanStreet, desc: 'Loud industrial noise, generators' },
    { id: 'environmental_damage', label: 'Environmental Damage', icon: '🌳', defaultSample: SAMPLE_IMAGES.treeDamage, desc: 'Fallen trees, unauthorized tree cutting' },
    { id: 'other', label: 'Other Issue', icon: '❓', defaultSample: SAMPLE_IMAGES.garbageBefore, desc: 'General civic hazard' },
  ];

  // Handle Category selection
  const handleSelectCategory = (cat: typeof problemCategories[0]) => {
    setSelectedCategory(cat.id);
    setSelectedCategoryLabel(cat.label);
    setUploadedImage(cat.defaultSample);
    setStep(2);
  };

  // Handle GPS location
  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          });
          setLocationAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setLocationCoords({ lat: 12.8345, lng: 80.0543 });
          setLocationAddress('Perumattunallur Main Road, Sector 3');
        }
      );
    }
  };

  // Run AI Inspection Simulation (Requirement #17)
  const runAiInspection = () => {
    setIsAiScanning(true);
    setAiScanComplete(false);
    setStep(4);

    setTimeout(() => {
      setIsAiScanning(false);
      setAiScanComplete(true);
    }, 1800);
  };

  // Handle final submission
  const handleSubmitReport = () => {
    const reportId = createCitizenReport({
      category: selectedCategory,
      categoryLabel: selectedCategoryLabel,
      location: {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        address: locationAddress,
        zone: locationZone,
      },
      description,
      images: [uploadedImage],
    });

    setSubmittedReportId(reportId);
    setStep(5);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Camera className="w-3.5 h-3.5" />
          <span>Citizen Incident Portal</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          See a Problem? Report It.
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your report helps the right municipal team respond faster. Real-time AI verifies your photo within seconds.
        </p>
      </div>

      {/* 5-Step Progress Breadcrumb */}
      {step <= 4 && (
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          {[
            { num: 1, label: 'Problem' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Photo' },
            { num: 4, label: 'AI Check' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Step 1 of 4
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              What is the problem you want to report?
            </h3>
            <p className="text-xs text-slate-500 mt-1">Select the category that best describes the issue.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {problemCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-400/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <div>
                  <p className="font-extrabold text-xs text-slate-900 dark:text-white">{cat.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Step 2 of 4
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Where is the problem located?
            </h3>
            <p className="text-xs text-slate-500 mt-1">Help the response team locate the exact problem spot.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleUseGPS}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>📍 Use My Current Location</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocationCoords({ lat: 12.8345, lng: 80.0543 });
                  setLocationAddress('Perumattunallur Main Road, Sector 3 (Zone 1)');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Perumattunallur Town Center</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address / Landmark
                </label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Near Bus Stand, Perumattunallur Main Road"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationCoords.lat}
                    onChange={(e) => setLocationCoords({ ...locationCoords, lat: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationCoords.lng}
                    onChange={(e) => setLocationCoords({ ...locationCoords, lng: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              Next: Photo Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTO EVIDENCE & DESCRIPTION */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Step 3 of 4
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Upload Photo & Problem Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">Photos are instantly verified by our AI recognition engine.</p>
          </div>

          <div className="space-y-4">
            
            {/* Image Preview & Preset Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Photo Evidence
              </label>

              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 text-center">
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="w-full h-52 object-cover rounded-xl shadow-md mx-auto"
                    />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Photo ready for AI verification
                    </p>
                  </div>
                ) : (
                  <div className="py-8 space-y-2 text-slate-400">
                    <UploadCloud className="w-10 h-10 mx-auto text-slate-400" />
                    <p className="text-xs font-semibold">Drag & drop photo or choose a preset below</p>
                  </div>
                )}
              </div>

              {/* Sample Photo Preset Bar */}
              <div className="mt-3">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Quick Demo Photos:</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { label: 'Garbage Dump', url: SAMPLE_IMAGES.garbageBefore },
                    { label: 'Drain Overflow', url: SAMPLE_IMAGES.drainageBefore },
                    { label: 'Air Smoke', url: SAMPLE_IMAGES.airPollution },
                    { label: 'Water Contam', url: SAMPLE_IMAGES.waterPollution },
                    { label: 'Road Pothole', url: SAMPLE_IMAGES.potholeRoad },
                  ].map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setUploadedImage(img.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                        uploadedImage === img.url
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional details for the response crew)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you see, smell, or safety concerns..."
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs font-medium p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={runAiInspection}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI IMAGE ANALYSIS (Requirement #17) */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Automated Verification Engine</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {isAiScanning ? 'AI is Checking Your Report...' : 'AI Visual Scan Completed'}
            </h3>
          </div>

          {/* Scanner Simulation */}
          {isAiScanning ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900 animate-ping opacity-60" />
                <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 animate-pulse">
                Analyzing photo pixels, checking duplicates, and calculating severity...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Checkmarks Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  '✓ Image received',
                  '✓ Problem identified',
                  '✓ Location mapped',
                  '✓ Duplicate check passed',
                ].map((chk, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold text-center"
                  >
                    {chk}
                  </div>
                ))}
              </div>

              {/* AI Detection Card */}
              <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-200/60 dark:border-purple-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      Detected Problem Category
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedCategoryLabel}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      AI Confidence
                    </span>
                    <p className="text-xl font-black text-purple-700 dark:text-purple-300">94% High</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Suggested Priority:</span>
                    <p className="font-extrabold text-amber-600 dark:text-amber-400 text-sm mt-0.5">
                      MEDIUM PRIORITY
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Recommended Dispatch:</span>
                    <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                      {selectedCategory === 'flooding_drainage' ? 'Drainage Team' :
                       selectedCategory === 'garbage' ? 'Sanitation Team' :
                       selectedCategory === 'air_pollution' ? 'Environmental Team' :
                       selectedCategory === 'streetlight' ? 'Electrical Team' : 'Municipal Response Team'}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic text-center">
                  "AI suggestion — pending human municipal verification before dispatch."
                </p>
              </div>

              {/* Submit Final Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Details
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>🚨 Submit Report to Command Center</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* STEP 5: CONFIRMATION & TRACKING ID */}
      {step === 5 && submittedReportId && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
            ✅
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Your Report has been Submitted!
            </h3>
            <p className="text-xs text-slate-500">
              Municipal officers have received your report. The AI recommendations have been queued for human verification.
            </p>
          </div>

          {/* Report Code Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tracking Reference ID</span>
            <p className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {submittedReportId}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Status: Under Verification</span>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentTab('my_reports')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Track Report Timeline in My Reports</span>
            </button>

            <button
              onClick={() => {
                setStep(1);
                setSubmittedReportId(null);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              Report Another Problem
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
