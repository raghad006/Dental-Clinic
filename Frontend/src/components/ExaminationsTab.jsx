import React, { useState } from "react";
import { Plus, Edit2, History, Clock } from "lucide-react";

const getPreciseDateTime = () => new Date().toLocaleString();

export default function ExaminationsTab({ patient, setPatient }) {
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [modal, setModal] = useState(null);

    const handleAddEdit = () => {
        const newItem = {
            ...formData,
            id: editItem ? patient.examinations[editItem.index].id : Date.now(),
            date: getPreciseDateTime(),
            history: editItem
                ? [...(patient.examinations[editItem.index].history || []), { ...patient.examinations[editItem.index], editDate: getPreciseDateTime() }]
                : []
        };

        const updatedExams = editItem
            ? patient.examinations.map((item, idx) => idx === editItem.index ? newItem : item)
            : [...patient.examinations, newItem];

        setPatient({ ...patient, examinations: updatedExams });
        setFormData({});
        setEditItem(null);
        setShowAdd(false);
    };

    const handleEditSetup = (index) => {
        setEditItem({ index });
        setFormData(patient.examinations[index]);
        setShowAdd(true);
    };

    const HistoryModal = ({ item }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-2xl font-bold">Examination History</h2>
                    <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-full">X</button>
                </div>
                <div>
                    <h3 className="text-lg font-semibold flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500"/>Current Version ({item.date})</h3>
                    <p className="border p-3 rounded-lg bg-blue-50">{item.text}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mt-4">Previous Versions ({item.history.length})</h3>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {item.history.length > 0 ? item.history.map((h, i) => (
                            <div key={i} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded-r-lg">
                                <p className="text-sm text-gray-500 font-medium flex items-center">
                                    <Clock className="w-3 h-3 mr-1"/>Recorded: {h.date} (Edited: {h.editDate})
                                </p>
                                <p>{h.text}</p>
                            </div>
                        )) : <p className="text-gray-500">No previous edits.</p>}
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={() => setModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <button onClick={() => { setShowAdd(true); setEditItem(null); setFormData({}); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center">
                <Plus className="w-4 h-4 mr-1"/>Add New Examination
            </button>

            {showAdd && (
                <div className="p-4 border rounded-xl bg-gray-50">
                    <textarea
                        className="w-full border rounded-xl p-4"
                        placeholder="New examination notes..."
                        value={formData.text || ""}
                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={() => { setShowAdd(false); setEditItem(null); setFormData({}); }} className="px-4 py-2 border rounded-xl hover:bg-gray-100">Cancel</button>
                        <button onClick={handleAddEdit} className={`text-white px-4 py-2 rounded-xl flex items-center ${formData.text ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`} disabled={!formData.text}>
                            {editItem ? "Update Examination" : "Save Examination"}
                        </button>
                    </div>
                </div>
            )}

            {patient.examinations.map((exam, idx) => (
                <div key={exam.id} className="border-l-4 border-blue-500 p-4 bg-white rounded-r-xl shadow-sm flex justify-between items-start">
                    <div className="flex-1 mr-4">
                        <span className="text-sm text-gray-500 flex items-center mb-1"><Clock className="w-3 h-3 mr-1"/>{exam.date}</span>
                        <span className="font-medium">{exam.text}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setModal(exam)}>
                            <History className="w-4 h-4 text-gray-500 hover:text-blue-500"/>
                        </button>
                        <button onClick={() => handleEditSetup(idx)}>
                            <Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-500"/>
                        </button>
                    </div>
                </div>
            ))}

            {modal && <HistoryModal item={modal} />}
        </div>
    );
}
