import React, { useState } from "react";
import { Plus, Edit2, History, Clock, X } from "lucide-react";

const getPreciseDateTime = () => new Date().toLocaleString();

export default function TreatmentTab({ patient, setPatient }) {
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [modal, setModal] = useState(null);

    const handleAddEdit = () => {
        const newItem = {
            ...formData,
            id: editItem ? patient.treatmentPlans[editItem.index].id : Date.now(),
            date: getPreciseDateTime(),
            history: editItem
                ? [...(patient.treatmentPlans[editItem.index].history || []), { ...patient.treatmentPlans[editItem.index], editDate: getPreciseDateTime() }]
                : [],
            status: formData.status || "Scheduled"
        };

        const updatedPlans = editItem
            ? patient.treatmentPlans.map((item, idx) => idx === editItem.index ? newItem : item)
            : [...patient.treatmentPlans, newItem];

        setPatient({ ...patient, treatmentPlans: updatedPlans });
        setFormData({});
        setEditItem(null);
        setShowAdd(false);
    };

    const handleEditSetup = (index) => {
        setEditItem({ index });
        setFormData(patient.treatmentPlans[index]);
        setShowAdd(true);
    };

    const HistoryModal = ({ item }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold">Treatment Plan History</h2>
                    <button onClick={()=>setModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <h3 className="text-lg font-semibold flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500"/>Current Version ({item.date})</h3>
                <p className="border p-3 rounded-lg bg-blue-50">{item.text} | Status: {item.status}</p>
                <h3 className="text-lg font-semibold mt-4">Edit History ({item.history.length})</h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                    {item.history.length>0 ? item.history.map((h, idx)=>(
                        <div key={idx} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded-r-lg">
                            <p className="text-sm text-gray-500 font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/>Recorded: {h.date} (Edited: {h.editDate})</p>
                            <p>{h.text} | Status: {h.status}</p>
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
            <button onClick={()=>{setShowAdd(true); setEditItem(null); setFormData({});}} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center"><Plus className="w-4 h-4 mr-1"/>Add New Treatment Plan</button>

            {showAdd && (
                <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
                    <textarea placeholder="Treatment plan details..." className="w-full border rounded-xl p-4" rows={3} value={formData.text||""} onChange={e=>setFormData({...formData,text:e.target.value})}/>
                    <select className="border rounded-xl p-2 text-sm w-full" value={formData.status||"Scheduled"} onChange={e=>setFormData({...formData,status:e.target.value})}>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button onClick={()=>{setShowAdd(false); setEditItem(null); setFormData({});}} className="px-4 py-2 border rounded-xl hover:bg-gray-100">Cancel</button>
                        <button onClick={handleAddEdit} className={`text-white px-4 py-2 rounded-xl ${formData.text?"bg-blue-600 hover:bg-blue-700":"bg-gray-300 cursor-not-allowed"}`} disabled={!formData.text}>{editItem?"Update Plan":"Save Plan"}</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {patient.treatmentPlans.map((plan, idx)=>(
                    <div key={plan.id} className={`border-l-4 ${plan.status==='Completed'?'border-green-500':plan.status==='In Progress'?'border-yellow-500':'border-blue-500'} p-4 bg-white rounded-r-xl shadow-sm`}>
                        <div className="flex justify-between items-start">
                            <p className="flex-1 mr-4">
                                <span className="text-sm text-gray-500 flex items-center mb-1"><Clock className="w-3 h-3 mr-1"/>{plan.date}</span>
                                <span className="font-semibold">{plan.text}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${plan.status==='Completed'?'bg-green-100 text-green-800':plan.status==='In Progress'?'bg-yellow-100 text-yellow-800':'bg-blue-100 text-blue-800'}`}>{plan.status}</span>
                            </p>
                            <div className="flex space-x-2">
                                <button onClick={()=>setModal({type:'history', data:plan, index:idx})}><History className="w-4 h-4 text-gray-500 hover:text-blue-500"/></button>
                                <button onClick={()=>handleEditSetup(idx)}><Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-500"/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal?.type==='history' && <HistoryModal item={modal.data}/>}
        </div>
    );
}
