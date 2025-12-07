import React, { useState, useRef } from "react";
import { Plus, Edit2, History, Image, Upload, ZoomIn, Clock, Calendar, FileUp, X } from "lucide-react";

const getPreciseDateTime = () => new Date().toLocaleString();

export default function XRaysTab({ patient, setPatient }) {
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [modal, setModal] = useState(null);
    const fileInputRef = useRef(null);

    const handleAddEdit = () => {
        const newItem = {
            ...formData,
            id: editItem ? patient.xRays[editItem.index].id : Date.now(),
            date: getPreciseDateTime(),
            history: editItem
                ? [...(patient.xRays[editItem.index].history || []), { ...patient.xRays[editItem.index], editDate: getPreciseDateTime() }]
                : [],
            timestamps: formData.timestamps || []
        };

        const updatedXrays = editItem
            ? patient.xRays.map((item, idx) => idx === editItem.index ? newItem : item)
            : [...patient.xRays, newItem];

        setPatient({ ...patient, xRays: updatedXrays });
        setFormData({});
        setEditItem(null);
        setShowAdd(false);
    };

    const handleEditSetup = (index) => {
        setEditItem({ index });
        setFormData(patient.xRays[index]);
        setShowAdd(true);
    };

    const handleFileChange = (file) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                file,
                fileName: file.name,
                preview: URL.createObjectURL(file)
            }));
        }
    };

    const XRayViewerModal = ({ xRayItem, index }) => {
        const [timestampText, setTimestampText] = useState("");

        const handleAddTimestamp = () => {
            if (!timestampText.trim()) return;

            const newTimestamp = { event: timestampText.trim(), time: getPreciseDateTime() };

            const updatedXRay = {
                ...xRayItem,
                timestamps: [...xRayItem.timestamps, newTimestamp],
                history: [...(xRayItem.history || []), { ...xRayItem, editDate: getPreciseDateTime(), notes: `Timestamp added: ${newTimestamp.event}`, isTimestamp: true }]
            };

            const updatedXrays = patient.xRays.map((x, idx) => idx === index ? updatedXRay : x);
            setPatient(prev => ({ ...prev, xRays: updatedXrays }));
            setTimestampText("");
            setModal({ type: 'view', data: updatedXRay, index });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center border-b p-4">
                        <h2 className="text-2xl font-bold flex items-center"><Image className="w-6 h-6 mr-2 text-blue-600"/> {xRayItem.name}</h2>
                        <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-700"><X className="w-6 h-6"/></button>
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 p-4 flex items-center justify-center bg-gray-100 overflow-hidden">
                            <img src={xRayItem.preview} alt={xRayItem.name} className="max-h-full max-w-full object-contain rounded-lg shadow-xl"/>
                        </div>
                        <div className="w-96 p-4 border-l overflow-y-auto space-y-4">
                            <p><span className="font-medium">Original Date:</span> {xRayItem.date}</p>
                            <p><span className="font-medium">Notes:</span> {xRayItem.notes}</p>
                            <div className="pt-4 border-t">
                                <h3 className="text-xl font-semibold mb-3 flex items-center"><Calendar className="w-5 h-5 mr-2 text-red-500"/>Add Timestamp Event</h3>
                                <textarea className="w-full border rounded-lg p-2 text-sm" rows={2} placeholder="e.g., Noted microfracture" value={timestampText} onChange={e=>setTimestampText(e.target.value)}/>
                                <button onClick={handleAddTimestamp} className={`w-full px-4 py-2 mt-2 rounded-xl text-white flex items-center justify-center ${timestampText ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!timestampText}><Plus className="w-4 h-4 mr-1"/> Notes</button>
                            </div>
                            <div className="pt-4 border-t">
                                <h3 className="text-xl font-semibold mb-3">Timeline of Events ({xRayItem.timestamps.length})</h3>
                                <div className="space-y-3">
                                    {xRayItem.timestamps.length>0 ? xRayItem.timestamps.map((ts, idx)=>(
                                        <div key={idx} className="border-l-4 border-red-300 p-3 bg-red-50 rounded-r-lg text-sm">
                                            <p className="font-medium text-red-800">{ts.event}</p>
                                            <p className="text-xs text-gray-600 flex items-center"><Clock className="w-3 h-3 mr-1"/> Recorded: {ts.time}</p>
                                        </div>
                                    )) : <p className="text-gray-500 text-sm italic">No timestamps recorded yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const HistoryModal = ({ item }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold">X-Ray History</h2>
                    <button onClick={()=>setModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <h3 className="text-lg font-semibold flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500"/>Current Version ({item.date})</h3>
                <p className="border p-3 rounded-lg bg-blue-50">{item.name} | Notes: {item.notes}</p>
                <h3 className="text-lg font-semibold mt-4">Edit History ({item.history.length})</h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                    {item.history.length>0 ? item.history.map((h, idx)=>(
                        <div key={idx} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded-r-lg">
                            <p className="text-sm text-gray-500 font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/>Recorded: {h.date} (Edited: {h.editDate}) {h.isTimestamp && <span className="ml-2 px-1 text-xs text-red-600 bg-red-100 rounded">TIMESTAMP</span>}</p>
                            <p>{h.name} | Notes: {h.notes}</p>
                        </div>
                    )) : <p className="text-gray-500">No previous edits.</p>}
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={()=>setModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <button onClick={()=>{setShowAdd(true); setEditItem(null); setFormData({});}} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center"><Plus className="w-4 h-4 mr-1"/>Add New X-Ray Entry</button>

            {showAdd && (
                <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
                    <input type="text" placeholder="X-Ray Name" className="w-full border rounded-lg p-3" value={formData.name||""} onChange={e=>setFormData({...formData,name:e.target.value})}/>
                    <textarea placeholder="Notes" className="w-full border rounded-lg p-3" rows={3} value={formData.notes||""} onChange={e=>setFormData({...formData,notes:e.target.value})}/>
                    {!formData.preview && <div className="text-center text-red-600 font-semibold mt-2">**File required**</div>}
                    <div className="flex justify-between items-center border p-3 rounded-lg bg-white">
                        <div className="flex items-center space-x-2"><Image className="w-6 h-6 text-blue-500"/><span className="text-gray-700">{formData.fileName||formData.name||"No File Selected"}</span></div>
                        <button onClick={()=>fileInputRef.current.click()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"><Upload className="w-4 h-4 mr-1"/> {formData.preview?"Change File":"Upload File"}</button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={e=>handleFileChange(e.target.files[0])}/>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button onClick={()=>{setShowAdd(false); setEditItem(null); setFormData({});}} className="px-4 py-2 border rounded-xl hover:bg-gray-100">Cancel</button>
                        <button onClick={handleAddEdit} className={`text-white px-4 py-2 rounded-xl ${formData.name&&formData.preview?"bg-blue-600 hover:bg-blue-700":"bg-gray-300 cursor-not-allowed"}`} disabled={!(formData.name&&formData.preview)}>{editItem?"Update X-Ray":"Save X-Ray"}</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {patient.xRays.map((x, idx)=>(
                    <div key={x.id} className="border rounded-xl overflow-hidden relative shadow-md bg-white hover:shadow-xl transition group">
                        <div className="relative">
                            <img src={x.preview} alt={x.name} className="w-full h-48 object-cover"/>
                            <button onClick={()=>setModal({type:'view', data:x, index:idx})} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition opacity-0 group-hover:opacity-100 text-white" title="Open Viewer"><ZoomIn className="w-8 h-8"/></button>
                        </div>
                        <div className="p-3">
                            <span className="text-sm text-gray-500 flex items-center mb-1"><Clock className="w-3 h-3 mr-1"/>{x.date}</span>
                            <p className="font-semibold">{x.name}</p>
                            <p className="text-xs mt-1 italic line-clamp-2">{x.notes}</p>
                            {x.timestamps?.length>0 && <p className="text-xs mt-2 font-medium text-red-700 flex items-center"><Calendar className="w-3 h-3 mr-1"/> {x.timestamps.length} Timestamps Recorded</p>}
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2 bg-white bg-opacity-80 p-1 rounded-lg">
                            <button onClick={()=>setModal({type:'history', data:x, index:idx})}><History className="w-4 h-4 text-gray-500 hover:text-blue-500"/></button>
                            <button onClick={()=>handleEditSetup(idx)}><Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-500"/></button>
                        </div>
                    </div>
                ))}
            </div>

            {modal?.type==='view' && <XRayViewerModal xRayItem={modal.data} index={modal.index}/>}
            {modal?.type==='history' && <HistoryModal item={modal.data}/>}
        </div>
    );
}
