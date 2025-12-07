// ProgressTracker.jsx
import React, { useState, useRef } from "react";
import { Plus, X, Camera, Image, Trash2, Calendar, Edit2, ZoomIn, TrendingUp, History, Clock } from "lucide-react"; // Added History and Clock icons

// Helper function to get current precise date and time
const getPreciseDateTime = () => new Date().toLocaleString();

// Initial data structure for the Progress Tracker
const initialProgressData = [
  {
    id: 1,
    date: "2025-10-15",
    notes: "Initial placement of upper and lower archwires (NiTi 0.014). Minor discomfort reported.",
    photos: [
      { id: 'a', url: "https://via.placeholder.com/300x200?text=Initial+Upper", caption: "Upper Arch - Initial" },
      { id: 'b', url: "https://via.placeholder.com/300x200?text=Initial+Lower", caption: "Lower Arch - Initial" }
    ],
    // Ensure history is initialized, even if empty
    history: [] 
  },
  {
    id: 2,
    date: "2025-11-15",
    notes: "First follow-up. Switched to NiTi 0.016. Lower incisor crowding showing good correction.",
    photos: [
      { id: 'c', url: "https://via.placeholder.com/300x200?text=Month+1+Upper", caption: "Upper Arch - Month 1" }
    ],
    history: []
  }
];

// --- Sub-Components ---

// Modal to view images in detail
const ImageViewerModal = ({ photo, closeModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-4 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
            </button>
            <div className="text-center">
                <h3 className="text-xl font-bold mb-3">{photo.caption}</h3>
                <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="max-h-[80vh] w-full object-contain mx-auto rounded-lg shadow-xl"
                />
            </div>
        </div>
    </div>
);

// Modal to view entry edit history
const HistoryModal = ({ item, closeModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold flex items-center"><History className="w-6 h-6 mr-2 text-blue-600"/> Entry Edit History</h2>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-lg font-semibold flex items-center"><Calendar className="w-5 h-5 mr-2 text-green-500"/>Current Version (Date: {new Date(item.date).toLocaleDateString()})</h3>
        <div className="border p-3 rounded-lg bg-green-50 text-sm">
          <p className="font-medium">{item.notes}</p>
          <p className="mt-1">Photos: {item.photos.length} image(s) attached.</p>
        </div>

        <h3 className="text-lg font-semibold mt-4">Previous Versions ({item.history.length})</h3>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {item.history.length > 0 ? (
            item.history.map((h, index) => (
              <div key={index} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded-r-lg">
                <p className="text-sm text-gray-500 font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-1"/>
                  Edited On: <span className="text-blue-700 ml-1">{h.editDate}</span>
                </p>
                <p className="mt-1">
                    <span className="font-medium text-gray-800">Date of Visit:</span> {new Date(h.date).toLocaleDateString()}
                </p>
                <p className="text-sm italic line-clamp-2">Notes: {h.notes}</p>
                <p className="text-xs mt-1">Photos: {h.photos.length} image(s)</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No previous edits for this entry.</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
);


// Form for adding/editing a Progress Entry
const ProgressForm = ({ entryData, setEntryData, onSubmit, onCancel, isEditing }) => {
    const fileInputRef = useRef(null);
    const [previewModal, setPreviewModal] = useState(null);

    const handlePhotoUpload = (e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                setEntryData(prev => ({
                    ...prev,
                    photos: [...prev.photos, {
                        id: Date.now() + Math.random(),
                        url: URL.createObjectURL(file),
                        caption: file.name,
                        file: file // Keep file reference if needed for backend upload
                    }]
                }));
            });
        }
    };

    const removePhoto = (id) => {
        setEntryData(prev => ({
            ...prev,
            photos: prev.photos.filter(p => p.id !== id)
        }));
    };

    const isFormValid = entryData.date && entryData.notes && entryData.photos.length > 0;
    
    return (
        <div className="p-4 border rounded-xl bg-gray-50 space-y-4">
            <h3 className="text-lg font-bold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600"/>
                {isEditing ? "Edit Progress Entry" : "New Progress Entry"}
            </h3>
            
            {/* Date and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label className="block text-sm font-medium">Date of Visit</label>
                    <input
                        type="date"
                        className="w-full border rounded-lg p-3"
                        value={entryData.date || ""}
                        onChange={e => setEntryData({ ...entryData, date: e.target.value })}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium">Progress Notes</label>
                    <textarea
                        className="w-full border rounded-lg p-3"
                        rows={3}
                        placeholder="e.g., Switched to Niti 0.016. Lower incisor crowding improving."
                        value={entryData.notes || ""}
                        onChange={e => setEntryData({ ...entryData, notes: e.target.value })}
                    />
                </div>
            </div>

            {/* Photos Upload Area */}
            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 flex items-center"><Camera className="w-4 h-4 mr-1"/> Progress Photos ({entryData.photos.length})</h4>
                
                <div className="flex flex-wrap gap-3">
                    {/* Display existing photos */}
                    {entryData.photos.map(photo => (
                        <div key={photo.id} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm group">
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover"/>
                            
                            {/* Action overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                                <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 text-white p-1 hover:text-red-400">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                                <button onClick={() => setPreviewModal(photo)} className="text-white opacity-0 group-hover:opacity-100 transition p-1">
                                    <ZoomIn className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Photo Button */}
                    <button onClick={() => fileInputRef.current.click()} className="w-24 h-24 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50 transition">
                        <Plus className="w-6 h-6"/>
                        <span className="text-xs mt-1">Add Photo</span>
                    </button>
                    <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <button onClick={onCancel} className="px-4 py-2 border rounded-xl hover:bg-gray-100">Cancel</button>
                <button 
                    onClick={onSubmit} 
                    className={`text-white px-4 py-2 rounded-xl flex items-center ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                    disabled={!isFormValid}
                >
                    {isEditing ? "Update Entry" : "Save Entry"}
                </button>
            </div>
            
            {previewModal && <ImageViewerModal photo={previewModal} closeModal={() => setPreviewModal(null)} />}
        </div>
    );
};


// --- Main Component ---
export default function ProgressTracker() {
  const [progressEntries, setProgressEntries] = useState(initialProgressData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ date: "", notes: "", photos: [] });
  const [editIndex, setEditIndex] = useState(null); // Index of the entry being edited
  const [imageModal, setImageModal] = useState(null); // For viewing single photo fullscreen
  const [historyModal, setHistoryModal] = useState(null); // For viewing history

  const handleOpenForm = (index = null) => {
    if (index !== null) {
      // Setup for editing
      const entryToEdit = progressEntries[index];
      setFormData(entryToEdit);
      setEditIndex(index);
    } else {
      // Setup for new entry
      setFormData({ date: new Date().toISOString().split('T')[0], notes: "", photos: [] });
      setEditIndex(null);
    }
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditIndex(null);
    setFormData({ date: "", notes: "", photos: [] });
  };
  
  // *** HIGHLIGHT: History saving logic is here ***
  const handleSubmit = () => {
    // 1. Get the current entry state if we are editing
    const currentEntryState = editIndex !== null ? progressEntries[editIndex] : null;

    const newEntry = {
        ...formData,
        id: editIndex !== null ? formData.id : Date.now(),
        // 2. Determine the history array
        history: currentEntryState
            ? [
                ...(currentEntryState.history || []), // Keep existing history
                { 
                  // Save the previous version's data
                  date: currentEntryState.date, 
                  notes: currentEntryState.notes, 
                  photos: currentEntryState.photos, 
                  // Add timestamp of when this previous version was superseded
                  editDate: getPreciseDateTime() 
                } 
              ]
            : [] // Empty history for a brand new entry
    };

    if (editIndex !== null) {
      // Update existing entry
      setProgressEntries(progressEntries.map((entry, idx) => idx === editIndex ? newEntry : entry));
    } else {
      // Add new entry
      setProgressEntries([newEntry, ...progressEntries]);
    }
    
    handleCloseForm();
  };
  // *** END HIGHLIGHT ***

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-bold flex items-center text-gray-800"><TrendingUp className="mr-2 w-6 h-6"/>Treatment Progress Timeline</h2>
            <button 
                onClick={() => handleOpenForm()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center hover:bg-blue-700"
            >
                <Plus className="w-4 h-4 mr-1"/> Add New Progress Entry
            </button>
        </div>

        {/* Inline Form */}
        {(showAddForm || editIndex !== null) && (
            <ProgressForm 
                entryData={formData} 
                setEntryData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
                isEditing={editIndex !== null}
            />
        )}
        
        {/* Timeline View */}
        <div className="relative border-l-4 border-blue-200 ml-4 pl-4 space-y-8">
            {progressEntries
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                .map((entry, index) => (
                <div key={entry.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-6 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-blue-800 flex items-center">
                                <Calendar className="w-5 h-5 mr-2"/>
                                {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <div className="flex space-x-2">
                                {/* Button to open edit form */}
                                <button onClick={() => setHistoryModal(entry)} className="text-gray-500 hover:text-red-500 p-1" title="View History">
                                    <History className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleOpenForm(index)} className="text-gray-500 hover:text-blue-500 p-1" title="Edit Entry">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{entry.notes}</p>
                        
                        {/* Photos Gallery */}
                        <div className="border-t pt-3 mt-3">
                            <h4 className="font-semibold text-md mb-2">Documentation ({entry.photos.length} Images)</h4>
                            <div className="flex flex-wrap gap-3">
                                {entry.photos.map(photo => (
                                    <div key={photo.id} className="relative w-28 h-20 rounded-lg overflow-hidden shadow-md cursor-pointer group">
                                        <img 
                                            src={photo.url} 
                                            alt={photo.caption} 
                                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <div 
                                            onClick={() => setImageModal(photo)} 
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center text-white text-xs p-1"
                                            title={photo.caption}
                                        >
                                            <ZoomIn className="w-4 h-4 opacity-0 group-hover:opacity-100"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {progressEntries.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No progress entries yet. Click "Add New Progress Entry" to start the timeline.
                </div>
            )}
        </div>
        
        {/* Fullscreen Image Viewer Modal */}
        {imageModal && <ImageViewerModal photo={imageModal} closeModal={() => setImageModal(null)} />}
        
        {/* History Modal */}
        {historyModal && <HistoryModal item={historyModal} closeModal={() => setHistoryModal(null)} />}

        

[Image of dental braces progression timeline with sequential before and after photos]

    </div>
  );
}