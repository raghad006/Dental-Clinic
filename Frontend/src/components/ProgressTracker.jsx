import React, { useState, useRef, useMemo } from "react";
import { 
  Plus, X, Camera, Trash2, Calendar, Edit2, ZoomIn, 
  TrendingUp, History, Clock, Layers, Activity, 
  ShieldCheck, Box, CheckCircle2, AlertCircle,
  Upload, Image as ImageIcon, User,
  Grid,GitCompareArrows, AlignLeft, AlignRight, Smile
} from "lucide-react";

// --- Enhanced Dental Configuration ---
const DENTAL_CATEGORIES = [
  { id: "braces", label: "Orthodontics/Braces", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-50" },
  { id: "veneers", label: "Veneers/Laminates", icon: Layers, color: "text-purple-500", bgColor: "bg-purple-50" },
  { id: "implants", label: "Dental Implants", icon: Box, color: "text-orange-500", bgColor: "bg-orange-50" },
  { id: "crowns", label: "Crowns & Bridges", icon: ShieldCheck, color: "text-emerald-500", bgColor: "bg-emerald-50" },
  { id: "whitening", label: "Teeth Whitening", icon: Smile, color: "text-pink-500", bgColor: "bg-pink-50" },
  { id: "root_canal", label: "Root Canal Treatment", icon: Activity, color: "text-red-500", bgColor: "bg-red-50" },
  { id: "gum_treatment", label: "Gum Treatment", icon: Activity, color: "text-green-500", bgColor: "bg-green-50" },
  { id: "extraction", label: "Tooth Extraction", icon: Trash2, color: "text-gray-500", bgColor: "bg-gray-50" },
  { id: "dentures", label: "Dentures", icon: User, color: "text-amber-500", bgColor: "bg-amber-50" },
  { id: "tmj", label: "TMJ Treatment", icon: AlignRight, color: "text-indigo-500", bgColor: "bg-indigo-50" },
  { id: "preventive", label: "Preventive Care", icon: ShieldCheck, color: "text-cyan-500", bgColor: "bg-cyan-50" },
  { id: "cosmetic", label: "Cosmetic Dentistry", icon: Smile, color: "text-rose-500", bgColor: "bg-rose-50" },
];

const TREATMENT_AREA = [
  { id: "full_arc", label: "Full Arch", icon: Grid },
  { id: "upper_arc", label: "Upper Arch", icon: AlignLeft },
  { id: "lower_arc", label: "Lower Arch", icon: AlignRight },
  { id: "anterior", label: "Anterior Teeth", icon: Smile },
  { id: "posterior", label: "Posterior Teeth", icon: Activity },
  { id: "specific", label: "Specific Tooth/Teeth", icon: Activity },
];

const PHOTO_ANGLES = [
  { id: "frontal", label: "Frontal View", description: "Full face smile" },
  { id: "occlusal_upper", label: "Occlusal Upper", description: "Top teeth view" },
  { id: "occlusal_lower", label: "Occlusal Lower", description: "Bottom teeth view" },
  { id: "left_profile", label: "Left Profile", description: "Left side view" },
  { id: "right_profile", label: "Right Profile", description: "Right side view" },
  { id: "intraoral_front", label: "Intraoral Frontal", description: "Inside mouth front" },
  { id: "intraoral_left", label: "Intraoral Left", description: "Inside mouth left" },
  { id: "intraoral_right", label: "Intraoral Right", description: "Inside mouth right" },
  { id: "xray_panoramic", label: "X-Ray Panoramic", description: "Full jaw X-ray" },
  { id: "xray_bitewing", label: "X-Ray Bitewing", description: "Bitewing X-ray" },
  { id: "xray_periapical", label: "X-Ray Periapical", description: "Single tooth X-ray" },
  { id: "closeup", label: "Close-up", description: "Specific area close-up" },
];

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    formatted: now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    dateOnly: now.toISOString().split('T')[0],
    timeOnly: now.toLocaleTimeString()
  };
};

// --- Sub-Components ---

const ImageViewerModal = ({ photo, closeModal }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-4 relative">
      <button onClick={closeModal} className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300">
        <X className="w-8 h-8" />
      </button>
      <div className="text-center">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-left">
            <h3 className="text-xl font-bold">{photo.angleLabel || "Progress Photo"}</h3>
            <p className="text-sm text-gray-500">{photo.angleDescription || "Dental progress photo"}</p>
            <p className="text-xs text-gray-400 mt-1">{photo.note || "No additional notes"}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">{new Date(photo.date).toLocaleDateString()}</span>
            <div className="text-xs text-gray-400">{photo.time}</div>
          </div>
        </div>
        <img src={photo.url} alt="Clinical" className="max-h-[75vh] w-full object-contain mx-auto rounded-lg" />
      </div>
    </div>
  </div>
);

const HistoryModal = ({ item, closeModal }) => {
  // Sort history with latest first
  const sortedHistory = item.history?.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  ) || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 space-y-6 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><History className="text-blue-600"/> Edit History</h2>
            <p className="text-sm text-gray-500 mt-1">Track: {item.sessionTitle}</p>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {sortedHistory.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No edit history available.</p>
          ) : (
            sortedHistory.map((h, i) => (
              <div key={i} className="border-l-4 border-blue-100 p-4 bg-gray-50 rounded-r-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                    <Clock size={12}/> 
                    {new Date(h.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                    {h.type === 'created' ? 'Created' : 'Edited'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-800 mb-3">{h.notes}</p>
                
                {h.changes && (
                  <div className="text-xs text-gray-600 space-y-1">
                    {h.changes.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {h.photosAdded > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <Camera size={12}/>
                      Added {h.photosAdded} photo{h.photosAdded !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ComparisonViewer = ({ entries, closeModal }) => {
  if (!entries || entries.length < 2) return null;
  
  // Group photos by angle for comparison
  const groupedPhotos = {};
  entries.forEach(entry => {
    entry.photos?.forEach(photo => {
      if (!groupedPhotos[photo.angleId]) {
        groupedPhotos[photo.angleId] = [];
      }
      groupedPhotos[photo.angleId].push({
        ...photo,
        entryDate: entry.date,
        entryNotes: entry.notes
      });
    });
  });

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 relative max-h-[90vh] overflow-hidden flex flex-col">
        <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitCompareArrows className="text-blue-600"/>
            Progress Comparison
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Compare {entries.length} entries from {new Date(entries[entries.length-1].date).toLocaleDateString()} to {new Date(entries[0].date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-8">
          {Object.entries(groupedPhotos).map(([angleId, photos]) => {
            const angleInfo = PHOTO_ANGLES.find(a => a.id === angleId) || { label: angleId };
            return (
              <div key={angleId} className="border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">{angleInfo.label}</h3>
                <p className="text-gray-500 text-sm mb-6">{angleInfo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate)).map((photo, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={`${angleInfo.label} - ${idx+1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <div className="text-white text-xs">
                            {new Date(photo.entryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="font-medium">{photo.angleLabel}</div>
                        {photo.note && <div className="truncate">{photo.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PhotoUploader = ({ photos = [], setPhotos }) => {
  const fileInputRef = useRef(null);
  const [selectedAngle, setSelectedAngle] = useState(PHOTO_ANGLES[0].id);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentTime = getCurrentDateTime();
    const angleInfo = PHOTO_ANGLES.find(a => a.id === selectedAngle);
    
    const newPhotos = files.map(file => {
      const url = URL.createObjectURL(file);
      return {
        url,
        angleId: selectedAngle,
        angleLabel: angleInfo.label,
        angleDescription: angleInfo.description,
        note: "",
        date: currentTime.iso,
        time: currentTime.timeOnly,
        filename: file.name,
        type: file.type
      };
    });
    
    setPhotos([...photos, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const updatePhotoNote = (index, note) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], note };
    setPhotos(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-blue-400 uppercase">Clinical Photos</label>
        <span className="text-xs text-gray-400">{photos.length} photo{photos.length !== 1 ? 's' : ''} ready</span>
      </div>
      
      {/* Angle Selection & Upload */}
      <div className="bg-white p-4 rounded-xl border border-blue-100">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo Angle/View</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {PHOTO_ANGLES.map(angle => (
              <button
                key={angle.id}
                type="button"
                onClick={() => setSelectedAngle(angle.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedAngle === angle.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{angle.label}</div>
                <div className="text-xs text-gray-500 mt-1">{angle.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-lg border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={20}/>
            Upload {PHOTO_ANGLES.find(a => a.id === selectedAngle)?.label} Photos
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Upload multiple photos at once</p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  <img src={photo.url} className="w-full h-full object-cover" alt={photo.angleLabel} />
                  <button 
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14}/>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="text-white text-xs font-medium">{photo.angleLabel}</div>
                  </div>
                </div>
                <div className="p-3">
                  <input 
                    type="text"
                    placeholder="Add note (optional)"
                    className="w-full text-xs border-none bg-transparent focus:outline-none"
                    value={photo.note || ""}
                    onChange={(e) => updatePhotoNote(index, e.target.value)}
                  />
                  <div className="text-xs text-gray-400 mt-2">{photo.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function ProgressTracker() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // Form States
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryFormData, setEntryFormData] = useState({ 
    notes: "", 
    photos: [] 
  });
  
  // New Session States
  const [newSessionData, setNewSessionData] = useState({ 
    title: "", 
    type: "braces",
    treatmentArea: "full_arc",
    toothNumbers: "",
    description: "",
    startDate: getCurrentDateTime().dateOnly
  });

  // Modals
  const [viewPhoto, setViewPhoto] = useState(null);
  const [viewHistory, setViewHistory] = useState(null);
  const [comparisonEntries, setComparisonEntries] = useState(null);
  const [editingSession, setEditingSession] = useState(null);

  const activeSession = useMemo(() => 
    sessions.find(s => s.id === activeSessionId), 
    [sessions, activeSessionId]
  );

  // Calculate session progress
  const sessionStats = useMemo(() => {
    if (!activeSession) return null;
    
    const totalEntries = activeSession.entries.length;
    const entriesWithPhotos = activeSession.entries.filter(e => e.photos?.length > 0).length;
    const completionPercentage = activeSession.isCompleted ? 100 : 
      totalEntries > 0 ? Math.min(95, Math.floor((totalEntries / 10) * 100)) : 0;
    
    const firstEntry = activeSession.entries[activeSession.entries.length - 1];
    const lastEntry = activeSession.entries[0];
    
    return {
      totalEntries,
      entriesWithPhotos,
      completionPercentage,
      firstEntryDate: firstEntry ? new Date(firstEntry.date).toLocaleDateString() : null,
      lastEntryDate: lastEntry ? new Date(lastEntry.date).toLocaleDateString() : null,
      totalPhotos: activeSession.entries.reduce((sum, entry) => sum + (entry.photos?.length || 0), 0)
    };
  }, [activeSession]);

  // Get entries for comparison
  const getComparisonEntries = () => {
    if (!activeSession || activeSession.entries.length < 2) return null;
    
    const first = activeSession.entries[activeSession.entries.length - 1];
    const last = activeSession.entries[0];
    
    // If there are 3+ entries, get middle one too
    if (activeSession.entries.length >= 3) {
      const middleIndex = Math.floor(activeSession.entries.length / 2);
      const middle = activeSession.entries[middleIndex];
      return [first, middle, last];
    }
    
    return [first, last];
  };

  // --- Session Actions ---
  const createSession = () => {
    if (!newSessionData.title.trim()) {
      alert("Please enter a title for the treatment track");
      return;
    }

    const currentTime = getCurrentDateTime();
    const session = {
      id: Date.now(),
      ...newSessionData,
      entries: [],
      isCompleted: false,
      createdAt: currentTime.iso,
      history: [{
        type: 'created',
        timestamp: currentTime.iso,
        notes: `Created treatment track: ${newSessionData.title}`,
        changes: [
          `Type: ${DENTAL_CATEGORIES.find(c => c.id === newSessionData.type)?.label || newSessionData.type}`,
          `Area: ${TREATMENT_AREA.find(a => a.id === newSessionData.treatmentArea)?.label || newSessionData.treatmentArea}`,
          newSessionData.description && `Description: ${newSessionData.description}`,
          newSessionData.toothNumbers && `Teeth: ${newSessionData.toothNumbers}`
        ].filter(Boolean)
      }]
    };
    
    setSessions([session, ...sessions]);
    setActiveSessionId(session.id);
    setIsCreatingSession(false);
    setNewSessionData({ 
      title: "", 
      type: "braces",
      treatmentArea: "full_arc",
      toothNumbers: "",
      description: "",
      startDate: getCurrentDateTime().dateOnly
    });
  };

  const updateSession = (sessionId, updates) => {
    const currentTime = getCurrentDateTime();
    const session = sessions.find(s => s.id === sessionId);
    
    const changes = [];
    if (updates.title !== undefined && updates.title !== session.title) {
      changes.push(`Title changed from "${session.title}" to "${updates.title}"`);
    }
    if (updates.description !== undefined && updates.description !== session.description) {
      changes.push("Description updated");
    }
    
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      
      const updatedSession = { ...s, ...updates };
      
      if (changes.length > 0) {
        updatedSession.history = [
          ...(s.history || []),
          {
            type: 'edited',
            timestamp: currentTime.iso,
            notes: `Updated treatment track details`,
            changes
          }
        ];
      }
      
      return updatedSession;
    }));
    
    setEditingSession(null);
  };

  const toggleSessionStatus = () => {
    const currentTime = getCurrentDateTime();
    
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      
      const newStatus = !s.isCompleted;
      const action = newStatus ? 'completed' : 'reopened';
      
      return {
        ...s,
        isCompleted: newStatus,
        history: [
          ...(s.history || []),
          {
            type: 'edited',
            timestamp: currentTime.iso,
            notes: `Marked track as ${action}`,
            changes: [`Status changed to ${newStatus ? 'Completed' : 'Active'}`]
          }
        ]
      };
    }));
  };

  // --- Entry Actions ---
  const handleEntrySubmit = () => {
    if (!entryFormData.notes.trim()) {
      alert("Please add clinical notes for this entry");
      return;
    }

    const currentTime = getCurrentDateTime();
    
    const newEntry = {
      id: Date.now(),
      date: currentTime.iso,
      time: currentTime.timeOnly,
      formattedDate: currentTime.formatted,
      notes: entryFormData.notes,
      photos: entryFormData.photos.map(photo => ({
        ...photo,
        date: currentTime.iso,
        time: currentTime.timeOnly
      })),
      history: [{
        type: 'created',
        timestamp: currentTime.iso,
        notes: `Created new progress entry`,
        photosAdded: entryFormData.photos.length,
        changes: [
          `Notes: ${entryFormData.notes.substring(0, 100)}${entryFormData.notes.length > 100 ? '...' : ''}`,
          entryFormData.photos.length > 0 && `Added ${entryFormData.photos.length} photos`
        ].filter(Boolean)
      }]
    };

    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      
      // Update session history
      const updatedSession = {
        ...s,
        entries: [newEntry, ...s.entries],
        history: [
          ...(s.history || []),
          {
            type: 'entry_added',
            timestamp: currentTime.iso,
            notes: `Added progress entry`,
            changes: [`New entry with ${entryFormData.photos.length} photos`]
          }
        ]
      };
      
      return updatedSession;
    }));
    
    setShowEntryForm(false);
    setEntryFormData({ notes: "", photos: [] });
  };

  const updateEntryNotes = (entryId, newNotes) => {
    if (!newNotes.trim()) return;
    
    const currentTime = getCurrentDateTime();
    const session = sessions.find(s => s.id === activeSessionId);
    const entry = session?.entries.find(e => e.id === entryId);
    
    if (!entry) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      
      const updatedEntries = s.entries.map(e => {
        if (e.id === entryId) {
          return {
            ...e,
            notes: newNotes,
            history: [
              ...(e.history || []),
              {
                type: 'edited',
                timestamp: currentTime.iso,
                notes: `Updated clinical notes`,
                changes: [`Notes updated`]
              }
            ]
          };
        }
        return e;
      });
      
      return { ...s, entries: updatedEntries };
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
      
      {/* --- SIDEBAR: Treatment Tracks --- */}
      <div className="w-full lg:w-80 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-gray-400 uppercase tracking-widest text-xs text-center">Treatment Tracks</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsCreatingSession(true)}
              className="p-2 bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              title="New Track"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Create Session Form */}
        {isCreatingSession && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-blue-100 shadow-sm space-y-3 animate-in fade-in">
            <input 
              placeholder="Treatment Title *" 
              className="w-full text-sm border-none bg-gray-50 rounded-lg p-2 outline-none"
              value={newSessionData.title}
              onChange={e => setNewSessionData({...newSessionData, title: e.target.value})}
            />
            
            <select 
              className="w-full text-sm border-none bg-gray-50 rounded-lg p-2 outline-none"
              value={newSessionData.type}
              onChange={e => setNewSessionData({...newSessionData, type: e.target.value})}
            >
              <option value="">Select Treatment Type</option>
              {DENTAL_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            
            <select 
              className="w-full text-sm border-none bg-gray-50 rounded-lg p-2 outline-none"
              value={newSessionData.treatmentArea}
              onChange={e => setNewSessionData({...newSessionData, treatmentArea: e.target.value})}
            >
              {TREATMENT_AREA.map(area => (
                <option key={area.id} value={area.id}>{area.label}</option>
              ))}
            </select>
            
            {newSessionData.treatmentArea === "specific" && (
              <input 
                placeholder="Tooth numbers (e.g., 14, 15, 16)"
                className="w-full text-sm border-none bg-gray-50 rounded-lg p-2 outline-none"
                value={newSessionData.toothNumbers}
                onChange={e => setNewSessionData({...newSessionData, toothNumbers: e.target.value})}
              />
            )}
            
            <textarea 
              placeholder="Treatment description (optional)"
              className="w-full text-sm border-none bg-gray-50 rounded-lg p-2 outline-none"
              rows="2"
              value={newSessionData.description}
              onChange={e => setNewSessionData({...newSessionData, description: e.target.value})}
            />
            
            <div className="flex gap-2">
              <button onClick={createSession} className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-blue-700">
                Create Track
              </button>
              <button onClick={() => setIsCreatingSession(false)} className="flex-1 bg-gray-100 text-gray-400 text-xs py-2 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3 overflow-y-auto flex-1">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No treatment tracks yet</p>
              <p className="text-xs mt-1">Create your first track to get started</p>
            </div>
          ) : (
            sessions.map(s => {
              const category = DENTAL_CATEGORIES.find(c => c.id === s.type) || DENTAL_CATEGORIES[0];
              const CatIcon = category.icon;
              const area = TREATMENT_AREA.find(a => a.id === s.treatmentArea);
              
              return (
                <div
                  key={s.id}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border relative group ${
                    activeSessionId === s.id 
                    ? 'bg-white border-blue-200 shadow-md' 
                    : 'border-transparent hover:bg-white/50 text-gray-500'
                  }`}
                >
                  <button 
                    onClick={() => setActiveSessionId(s.id)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div className={`p-2 rounded-xl ${activeSessionId === s.id ? 'bg-blue-50 text-blue-600' : category.bgColor + ' ' + category.color}`}>
                      <CatIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{s.title}</p>
                      <p className="text-[10px] uppercase tracking-tighter opacity-60">
                        {s.entries.length} entries • {area?.label || s.treatmentArea}
                      </p>
                    </div>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {s.isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSession(s);
                      }}
                      className="p-1 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit Track"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Session Stats Footer */}
        {activeSession && sessionStats && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Progress</span>
                <span className="text-sm font-bold">{sessionStats.completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${sessionStats.completionPercentage}%` }}
                />
              </div>
            </div>
            
            {getComparisonEntries() && getComparisonEntries().length >= 2 && (
              <button
                onClick={() => setComparisonEntries(getComparisonEntries())}
                className="w-full py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
              >
                <GitCompareArrows size={14}/>
                Compare Progress
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
        {!activeSession ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <TrendingUp size={64} className="opacity-10 mb-4" />
            <p className="font-medium uppercase tracking-widest text-sm">Select a treatment track to view progress</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-end gap-6 border-b border-gray-50 pb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-2xl ${DENTAL_CATEGORIES.find(c => c.id === activeSession.type)?.bgColor}`}>
                    {React.createElement(DENTAL_CATEGORIES.find(c => c.id === activeSession.type)?.icon, { 
                      size: 24, 
                      className: DENTAL_CATEGORIES.find(c => c.id === activeSession.type)?.color 
                    })}
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">{activeSession.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{DENTAL_CATEGORIES.find(c => c.id === activeSession.type)?.label}</span>
                      <span>•</span>
                      <span>{TREATMENT_AREA.find(a => a.id === activeSession.treatmentArea)?.label}</span>
                      {activeSession.toothNumbers && (
                        <>
                          <span>•</span>
                          <span>Teeth: {activeSession.toothNumbers}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {activeSession.isCompleted && (
                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      Completed
                    </span>
                  )}
                </div>
                {activeSession.description && (
                  <p className="text-gray-500 text-sm mt-2 max-w-2xl">{activeSession.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                  <span>Started on {new Date(activeSession.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{activeSession.entries.length} entries</span>
                  <span>•</span>
                  <span>{sessionStats.totalPhotos} photos</span>
                </div>
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                <button 
                  onClick={() => setViewHistory({
                    ...activeSession,
                    sessionTitle: activeSession.title,
                    history: activeSession.history || []
                  })}
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-gray-200"
                >
                  <History size={16}/>
                  Track History
                </button>
                
                {getComparisonEntries() && getComparisonEntries().length >= 2 && (
                  <button 
                    onClick={() => setComparisonEntries(getComparisonEntries())}
                    className="px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-blue-100"
                  >
                    <GitCompareArrows size={16}/>
                    Compare
                  </button>
                )}
                
                <button 
                  onClick={toggleSessionStatus}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeSession.isCompleted 
                    ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100' 
                    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600'
                  }`}
                >
                  {activeSession.isCompleted ? 
                    <><AlertCircle size={16}/> Reopen Track</> : 
                    <><CheckCircle2 size={16}/> Complete Track</>
                  }
                </button>
                
                <button 
                  onClick={() => {
                    setEntryFormData({ notes: "", photos: [] });
                    setShowEntryForm(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Plus size={16}/> New Entry
                </button>
              </div>
            </div>

            {/* Entry Form */}
            {showEntryForm && (
              <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-600">New Progress Entry</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCurrentDateTime().formatted}
                    </p>
                  </div>
                  <button onClick={() => setShowEntryForm(false)} className="p-2 hover:bg-white rounded-full">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-blue-400 uppercase mb-2">Clinical Notes *</label>
                      <textarea 
                        placeholder="Describe the procedure, observations, patient feedback, next steps..."
                        className="w-full bg-white border-none rounded-xl p-4 text-sm shadow-sm"
                        rows="8"
                        value={entryFormData.notes}
                        onChange={e => setEntryFormData({...entryFormData, notes: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <PhotoUploader 
                      photos={entryFormData.photos}
                      setPhotos={(photos) => setEntryFormData({...entryFormData, photos})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-blue-100">
                  <div className="text-xs text-gray-500">
                    Photos will be timestamped automatically
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setShowEntryForm(false);
                        setEntryFormData({ notes: "", photos: [] });
                      }} 
                      className="px-6 py-3 text-gray-400 text-xs font-bold hover:text-gray-600"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleEntrySubmit}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus size={14}/> Save Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Progress Timeline</h3>
                <div className="text-sm text-gray-500">
                  {activeSession.entries.length} entr{activeSession.entries.length === 1 ? 'y' : 'ies'} • Newest first
                </div>
              </div>
              
              {activeSession.entries.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400 font-medium">No progress recorded yet</p>
                  <button 
                    onClick={() => setShowEntryForm(true)}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700"
                  >
                    Create First Entry
                  </button>
                </div>
              ) : (
                <div className="relative border-l-2 border-gray-100 ml-4 pl-8 space-y-12">
                  {activeSession.entries.map((entry) => (
                    <div key={entry.id} className="relative group">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-sm group-hover:scale-125 transition-all z-10"></div>
                      
                      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </h3>
                              <span className="text-sm text-gray-500">{entry.time}</span>
                              {entry.photos?.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                  <Camera size={12}/>
                                  {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            
                            <div className="relative group/notes">
                              <p className="text-gray-500 text-sm mt-1 leading-relaxed whitespace-pre-line">
                                {entry.notes}
                              </p>
                              <button
                                onClick={() => {
                                  const newNotes = prompt("Edit clinical notes:", entry.notes);
                                  if (newNotes !== null) {
                                    updateEntryNotes(entry.id, newNotes);
                                  }
                                }}
                                className="absolute top-0 right-0 p-1 text-gray-300 hover:text-blue-500 opacity-0 group-hover/notes:opacity-100 transition-opacity"
                                title="Edit Notes"
                              >
                                <Edit2 size={14}/>
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setViewHistory({
                                ...entry,
                                sessionTitle: activeSession.title,
                                history: entry.history || []
                              })} 
                              className="p-2 text-gray-300 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                              title="View History"
                            >
                              <History size={16}/>
                            </button>
                          </div>
                        </div>

                        {entry.photos?.length > 0 && (
                          <div className="pt-6 border-t border-gray-50">
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <ImageIcon size={16}/>
                              Clinical Photos
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {entry.photos.map((img, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden group/img">
                                  <div className="relative h-48 bg-gray-100">
                                    <img 
                                      src={img.url} 
                                      alt={img.angleLabel}
                                      className="w-full h-full object-cover"
                                    />
                                    <button 
                                      onClick={() => setViewPhoto(img)}
                                      className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                      <ZoomIn size={24} className="text-white"/>
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                      <div className="text-white text-xs font-medium">{img.angleLabel}</div>
                                      <div className="text-white text-[10px] opacity-80">{img.angleDescription}</div>
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    {img.note && (
                                      <p className="text-xs text-gray-600 mb-2">{img.note}</p>
                                    )}
                                    <div className="text-xs text-gray-400">{img.time}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {viewPhoto && <ImageViewerModal photo={viewPhoto} closeModal={() => setViewPhoto(null)} />}
      {viewHistory && <HistoryModal item={viewHistory} closeModal={() => setViewHistory(null)} />}
      {comparisonEntries && <ComparisonViewer entries={comparisonEntries} closeModal={() => setComparisonEntries(null)} />}
      
      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Edit Track</h3>
              <button onClick={() => setEditingSession(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={editingSession.title}
                  onChange={(e) => setEditingSession({...editingSession, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3"
                  rows="3"
                  value={editingSession.description || ''}
                  onChange={(e) => setEditingSession({...editingSession, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setEditingSession(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateSession(editingSession.id, {
                  title: editingSession.title,
                  description: editingSession.description
                })}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}