import React, { useState } from "react";
import { Plus, Edit2, History, Clock, Activity, AlertCircle, Calendar, Stethoscope, FileText, Thermometer } from "lucide-react";

const getPreciseDateTime = () => new Date().toLocaleString();

export default function DentalExaminationsTab({ patient = {}, setPatient }) {
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        toothNumbers: "",
        condition: "",
        urgency: "routine",
        type: "checkup"
    });
    const [editItem, setEditItem] = useState(null);
    const [modal, setModal] = useState(null);

    // Initialize patient object with dentalExaminations if not present
    const patientWithDefaults = {
        dentalExaminations: [],
        ...patient
    };

    const dentalConditions = [
        "Caries",
        "Gingivitis",
        "Periodontitis",
        "Impacted Tooth",
        "Abscess",
        "Fracture",
        "Wear/Attrition",
        "Discoloration",
        "Sensitivity",
        "Malocclusion",
        "Plaque/Tartar",
        "Mucosal Lesion"
    ];

    const examinationTypes = [
        "Checkup",
        "Emergency",
        "Follow-up",
        "Pre-treatment",
        "Post-treatment",
        "Periodontal",
        "Radiographic",
        "Orthodontic"
    ];

    const handleAddEdit = () => {
        const newItem = {
            ...formData,
            id: editItem ? patientWithDefaults.dentalExaminations[editItem.index].id : Date.now(),
            date: getPreciseDateTime(),
            type: formData.type || "checkup",
            urgency: formData.urgency || "routine",
            condition: formData.condition || "",
            toothNumbers: formData.toothNumbers || "",
            history: editItem
                ? [...((patientWithDefaults.dentalExaminations[editItem.index]?.history) || []), { 
                    ...patientWithDefaults.dentalExaminations[editItem.index], 
                    editDate: getPreciseDateTime(),
                    editedBy: "Dr. Smith" // In real app, this would come from auth
                }]
                : []
        };

        const updatedExams = editItem
            ? patientWithDefaults.dentalExaminations.map((item, idx) => idx === editItem.index ? newItem : item)
            : [...patientWithDefaults.dentalExaminations, newItem];

        setPatient({ ...patientWithDefaults, dentalExaminations: updatedExams });
        setFormData({
            text: "",
            toothNumbers: "",
            condition: "",
            urgency: "routine",
            type: "checkup"
        });
        setEditItem(null);
        setShowAdd(false);
    };

    const handleEditSetup = (index) => {
        const exam = patientWithDefaults.dentalExaminations[index];
        if (exam) {
            setEditItem({ index });
            setFormData(exam);
            setShowAdd(true);
        }
    };

    const formatToothNumbers = (numbers) => {
        if (!numbers) return "None specified";
        return numbers.split(',').map(num => num.trim()).join(', ');
    };

    const getUrgencyColor = (urgency) => {
        switch(urgency) {
            case 'emergency': return 'bg-red-100 border-red-500 text-red-700';
            case 'urgent': return 'bg-orange-100 border-orange-500 text-orange-700';
            case 'routine': return 'bg-blue-100 border-blue-500 text-blue-700';
            case 'monitoring': return 'bg-green-100 border-green-500 text-green-700';
            default: return 'bg-gray-100 border-gray-500 text-gray-700';
        }
    };

    const HistoryModal = ({ item }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold flex items-center">
                        <History className="w-6 h-6 mr-2 text-blue-500"/>
                        Dental Examination History
                    </h2>
                    <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                </div>
                
                {/* Current Version */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-500"/>
                        Current Version ({item.date})
                    </h3>
                    <div className="border-2 border-blue-200 p-4 rounded-xl bg-blue-50 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <Stethoscope className="w-4 h-4 mr-1 text-gray-600"/>
                                <span className="font-medium capitalize">{item.type} Examination</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgency)}`}>
                                {item.urgency.toUpperCase()}
                            </span>
                        </div>
                        
                        {item.toothNumbers && (
                            <div className="flex items-start">
                                <AlertCircle className="w-4 h-4 mr-2 mt-1 text-gray-600 flex-shrink-0"/>
                                <div>
                                    <span className="font-medium">Teeth Involved: </span>
                                    {formatToothNumbers(item.toothNumbers)}
                                </div>
                            </div>
                        )}
                        
                        {item.condition && (
                            <div className="flex items-start">
                                <Thermometer className="w-4 h-4 mr-2 mt-1 text-gray-600 flex-shrink-0"/>
                                <div>
                                    <span className="font-medium">Condition: </span>
                                    {item.condition}
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-2 border-t">
                            <span className="font-medium">Clinical Findings:</span>
                            <p className="mt-1 whitespace-pre-line">{item.text}</p>
                        </div>
                    </div>
                </div>

                {/* Previous Versions */}
                <div>
                    <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
                        <History className="w-5 h-5 mr-2"/>
                        Previous Versions ({item.history?.length || 0})
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-4">
                        {item.history && item.history.length > 0 ? item.history.map((h, i) => (
                            <div key={i} className="border-l-4 border-gray-300 p-4 bg-gray-50 rounded-r-xl space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600 font-medium flex items-center">
                                        <Calendar className="w-3 h-3 mr-1"/>
                                        {h.date}
                                    </p>
                                    <span className="text-xs text-gray-500">Edited by {h.editedBy}</span>
                                </div>
                                <div className="text-sm space-y-1">
                                    {h.toothNumbers && (
                                        <div className="flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1"/>
                                            <span className="font-medium">Teeth: </span>
                                            <span className="ml-1">{formatToothNumbers(h.toothNumbers)}</span>
                                        </div>
                                    )}
                                    {h.condition && (
                                        <div className="flex items-center">
                                            <Thermometer className="w-3 h-3 mr-1"/>
                                            <span className="font-medium">Condition: </span>
                                            <span className="ml-1">{h.condition}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm bg-white p-2 rounded border">{h.text}</p>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No previous edits for this examination.</p>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                    <button onClick={() => setModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors">
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <button 
                    onClick={() => { 
                        setShowAdd(true); 
                        setEditItem(null); 
                        setFormData({
                            text: "",
                            toothNumbers: "",
                            condition: "",
                            urgency: "routine",
                            type: "checkup"
                        }); 
                    }} 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-3 rounded-xl flex items-center shadow-md hover:shadow-lg transition-shadow"
                >
                    <Plus className="w-5 h-5 mr-2"/>
                    New Dental Examination
                </button>
                
                <div className="text-sm text-gray-600 flex items-center">
                    <FileText className="w-4 h-4 mr-1"/>
                    Total Examinations: {patientWithDefaults.dentalExaminations.length}
                </div>
            </div>

            {showAdd && (
                <div className="p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        {editItem ? "Edit Dental Examination" : "Record New Examination"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1"/>
                                Examination Type
                            </label>
                            <select 
                                className="w-full border rounded-xl p-3 bg-white"
                                value={formData.type || "checkup"}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                {examinationTypes.map(type => (
                                    <option key={type} value={type.toLowerCase()}>{type}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <AlertCircle className="w-4 h-4 inline mr-1"/>
                                Priority Level
                            </label>
                            <select 
                                className="w-full border rounded-xl p-3 bg-white"
                                value={formData.urgency || "routine"}
                                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                            >
                                <option value="emergency">🟥 Emergency</option>
                                <option value="urgent">🟧 Urgent</option>
                                <option value="routine">🟦 Routine</option>
                                <option value="monitoring">🟩 Monitoring</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <AlertCircle className="w-4 h-4 inline mr-1"/>
                                Tooth Numbers (comma-separated)
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-xl p-3"
                                placeholder="e.g., 16, 17, 21, 36"
                                value={formData.toothNumbers || ""}
                                onChange={e => setFormData({ ...formData, toothNumbers: e.target.value })}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Thermometer className="w-4 h-4 inline mr-1"/>
                                Dental Condition
                            </label>
                            <select 
                                className="w-full border rounded-xl p-3 bg-white"
                                value={formData.condition || ""}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            >
                                <option value="">Select condition...</option>
                                {dentalConditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText className="w-4 h-4 inline mr-1"/>
                            Clinical Findings & Notes
                        </label>
                        <textarea
                            className="w-full border rounded-xl p-4 min-h-[150px]"
                            placeholder="Enter detailed examination findings, including:\n• Probing depths\n• Mobility\n• Bleeding points\n• Caries extent\n• Restorative status\n• Radiographic findings\n• Treatment recommendations"
                            value={formData.text || ""}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => { 
                                setShowAdd(false); 
                                setEditItem(null); 
                                setFormData({
                                    text: "",
                                    toothNumbers: "",
                                    condition: "",
                                    urgency: "routine",
                                    type: "checkup"
                                }); 
                            }} 
                            className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAddEdit} 
                            className={`px-5 py-2.5 rounded-xl flex items-center transition-colors ${formData.text ? "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} 
                            disabled={!formData.text}
                        >
                            {editItem ? (
                                <>
                                    <Edit2 className="w-4 h-4 mr-2"/>
                                    Update Examination
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Save Examination
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {patientWithDefaults.dentalExaminations.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3"/>
                        <p className="text-gray-600">No dental examinations recorded yet.</p>
                        <p className="text-sm text-gray-500 mt-1">Start by adding the first examination</p>
                    </div>
                ) : (
                    patientWithDefaults.dentalExaminations.map((exam, idx) => (
                        <div key={exam.id || idx} className={`border-l-4 ${getUrgencyColor(exam.urgency).split(' ')[1]} p-5 bg-white rounded-r-xl shadow-md hover:shadow-lg transition-shadow`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1 text-gray-500"/>
                                            <span className="text-sm text-gray-600">{exam.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(exam.urgency)}`}>
                                                {exam.urgency?.toUpperCase() || "ROUTINE"}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                                                {exam.type || "checkup"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {exam.condition && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 border border-red-200">
                                                    <Thermometer className="w-3 h-3 mr-1"/>
                                                    {exam.condition}
                                                </span>
                                            )}
                                            {exam.toothNumbers && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                                    <AlertCircle className="w-3 h-3 mr-1"/>
                                                    Teeth: {formatToothNumbers(exam.toothNumbers)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-line">{exam.text || "No examination notes"}</p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setModal(exam)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View History"
                                    >
                                        <History className="w-5 h-5"/>
                                    </button>
                                    <button 
                                        onClick={() => handleEditSetup(idx)}
                                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit Examination"
                                    >
                                        <Edit2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {modal && <HistoryModal item={modal} />}
        </div>
    );
}