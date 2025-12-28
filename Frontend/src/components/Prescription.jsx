import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, Edit2, History, X, Pill, Trash2, Save, 
  ClipboardList, CheckCircle2, Loader2, Calendar,
  Clock, AlertCircle
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function PrescriptionTab({ patient, setPatient }) {
  const availableMedicines = [
    "Paracetamol","Ibuprofen","Amoxicillin","Cefalexin",
    "Metronidazole","Azithromycin","Omeprazole","Cetirizine",
    "Cough Syrup","Vitamin D","Insulin"
  ];
  const dosages = ["50mg","100mg","250mg","500mg","1g","1 Tablet","5ml"];
  const frequencies = ["Once a day (QD)","Twice a day (BID)","Three times a day (TID)","Every 6 hours","As needed (PRN)"];

  const [showAdd, setShowAdd] = useState(false);
  const [formMedicines, setFormMedicines] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [currentMedicine, setCurrentMedicine] = useState({ medicine: "", dosage: "", frequency: "", notes: "" });
  const [editItem, setEditItem] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if patient has appointments
  const hasAppointments = patient?.appointments?.length > 0;

  // FORMAT AUDIT HISTORY SAFELY
  const formatHistory = (historyArray) => {
    if (!Array.isArray(historyArray)) return [];
    return historyArray.map(h => ({
      editDate: h.changed_at ? new Date(h.changed_at).toLocaleString('en-US', { dateStyle:'short', timeStyle:'short' }) : "Recently",
      previousGeneralNotes: h.notes || h.previous_notes || "",
      medicines: h.previous_data || h.previous_medicines || []
    }));
  };

  // FETCH MEDICAL RECORD
  const fetchMedicalRecord = useCallback(async () => {
    if (!patient?.patient_id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clinic-patient/${patient.patient_id}/medical-record/`);
      const data = await res.json();
      const prescriptions = (data.prescriptions || []).map(p => ({
        id: p.id,
        date: p.created_at ? new Date(p.created_at).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'}) : "N/A",
        notes: p.notes || "",
        medicines: (p.items || []).map((i, idx) => ({ ...i, id: i.id || idx })),
        history: formatHistory(p.history || p.audit_history)
      }));
      setPatient(prev => ({ ...prev, prescriptions, appointments: data.appointments || [] }));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [patient?.patient_id, setPatient]);

  useEffect(() => {
    fetchMedicalRecord();
  }, [fetchMedicalRecord]);

  // HANDLE CREATE OR EDIT
  const handleAddEdit = async () => {
    if (!patient?.patient_id) {
      alert("Patient not found.");
      return;
    }
    if (!hasAppointments) {
      alert("Patient has no appointments. Cannot create prescription.");
      return;
    }
    if (formMedicines.length === 0) {
      alert("Add at least one medicine.");
      return;
    }

    setIsSaving(true);
    const payload = {
      notes: prescriptionNotes,
      items: formMedicines.map(({ medicine, dosage, frequency, notes }) => ({ medicine, dosage, frequency, notes }))
    };

    try {
      const url = editItem 
        ? `${API_BASE}/prescriptions/${editItem.id}/` 
        : `${API_BASE}/clinic-patient/${patient.patient_id}/prescriptions/`;
      const method = editItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());

      await fetchMedicalRecord();

      // RESET FORM
      setFormMedicines([]);
      setPrescriptionNotes("");
      setEditItem(null);
      setShowAdd(false);
      setCurrentMedicine({ medicine:"", dosage:"", frequency:"", notes:"" });
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save prescription. Check console.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add medicine to list
  const handleAddMedicine = () => {
    if (!currentMedicine.medicine.trim()) return;
    setFormMedicines([...formMedicines, { ...currentMedicine, id: Date.now() }]);
    setCurrentMedicine({ medicine: "", dosage: "", frequency: "", notes: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-gray-900 antialiased">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Pill className="text-indigo-600" size={28} />
            Prescriptions Management
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-gray-600 font-medium">
              Patient ID: <span className="text-indigo-600 font-bold">#{patient.patient_id}</span>
            </p>
            {!hasAppointments && (
              <div className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <AlertCircle size={14} />
                <span>No appointments found</span>
              </div>
            )}
          </div>
        </div>
        
        {!showAdd && (
          <button 
            onClick={() => {
              if (!hasAppointments) {
                alert("Patient has no appointments. Add an appointment first.");
                return;
              }
              setShowAdd(true); 
              setEditItem(null); 
              setFormMedicines([]); 
              setPrescriptionNotes("");
            }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200
              ${hasAppointments 
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            disabled={!hasAppointments}
          >
            <Plus size={20} />
            New Prescription
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM SIDEBAR - Improved layout */}
        {showAdd && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden sticky top-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ClipboardList size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {editItem ? "Update Prescription" : "New Prescription"}
                      </h3>
                      <p className="text-indigo-100 text-sm">Add medications and instructions</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAdd(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* General Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Clinical Notes & Instructions
                  </label>
                  <textarea 
                    value={prescriptionNotes} 
                    onChange={e => setPrescriptionNotes(e.target.value)}
                    placeholder="Enter instructions, precautions, or special notes..."
                    className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white font-medium text-sm outline-none transition-all min-h-[100px] resize-none"
                    rows={3}
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Pill size={16} className="text-indigo-600" />
                    Add Medications
                  </h4>

                  {/* Medicine Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Medication Name</label>
                      <input 
                        list="meds"
                        value={currentMedicine.medicine}
                        onChange={e => setCurrentMedicine({...currentMedicine, medicine: e.target.value})}
                        placeholder="Search or type medication..."
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white outline-none font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                        <input 
                          list="doses"
                          value={currentMedicine.dosage}
                          onChange={e => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                          placeholder="Select or enter dosage"
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                        <input 
                          list="freqs"
                          value={currentMedicine.frequency}
                          onChange={e => setCurrentMedicine({...currentMedicine, frequency: e.target.value})}
                          placeholder="Select frequency"
                          className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white outline-none font-medium"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleAddMedicine}
                      disabled={!currentMedicine.medicine.trim()}
                      className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-dashed border-indigo-300 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Add to Medication List
                    </button>
                  </div>

                  {/* Current Medicines List */}
                  {formMedicines.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-semibold text-gray-700">Current Medications</h5>
                        <span className="text-xs font-medium text-gray-500">{formMedicines.length} added</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {formMedicines.map((m, index) => (
                          <div 
                            key={m.id} 
                            className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-800">{m.medicine}</span>
                                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-xs text-gray-500">{m.dosage}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{m.frequency}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormMedicines(formMedicines.filter(x => x.id !== m.id))}
                              className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleAddEdit} 
                  disabled={isSaving || formMedicines.length === 0 || !hasAppointments} 
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editItem ? "Update Prescription" : "Save Prescription"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY LIST - Improved layout */}
        <div className={`${showAdd ? "lg:col-span-7" : "lg:col-span-12"} space-y-6`}>
          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="relative">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Loading prescription records...</p>
              <p className="text-sm text-gray-400">Fetching patient data</p>
            </div>
          ) : (patient.prescriptions || []).length === 0 ? (
            /* Empty State */
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6">
                <Pill className="text-indigo-400" size={36} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Prescriptions Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {hasAppointments 
                  ? "Start by creating a new prescription for this patient."
                  : "Add an appointment first to create prescriptions for this patient."
                }
              </p>
              {hasAppointments && (
                <button 
                  onClick={() => setShowAdd(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Plus size={18} />
                  Create First Prescription
                </button>
              )}
            </div>
          ) : (
            /* Prescriptions List */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  Prescription History
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({patient.prescriptions?.length || 0} records)
                  </span>
                </h3>
              </div>

              {(patient.prescriptions || []).map(presc => (
                <div 
                  key={presc.id} 
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{presc.date}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-gray-400" />
                          <p className="text-sm text-gray-500">Prescription #{presc.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setModal(presc)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <History size={16} />
                        History
                      </button>
                      <button 
                        onClick={() => { 
                          setEditItem(presc); 
                          setFormMedicines(presc.medicines || []); 
                          setPrescriptionNotes(presc.notes || ""); 
                          setShowAdd(true); 
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {presc.notes && (
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Clinical Notes</p>
                      <p className="text-sm text-gray-700 leading-relaxed">"{presc.notes}"</p>
                    </div>
                  )}

                  {/* Medicines Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(presc.medicines || []).map((m, i) => (
                      <div 
                        key={i} 
                        className="p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-800">{m.medicine}</p>
                          <span className="text-xs font-medium text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">
                            #{i + 1}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                              {m.dosage}
                            </span>
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                              {m.frequency}
                            </span>
                          </div>
                          {m.notes && (
                            <p className="text-xs text-gray-500 italic">{m.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AUDIT LOG MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <History size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">Audit Trail</h3>
                    <p className="text-gray-300 text-sm">Prescription #{modal.id} - History of changes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModal(null)}
                  className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {(modal.history || []).length > 0 ? (
                <div className="space-y-6">
                  {modal.history.map((h, i) => (
                    <div key={i} className="relative pl-8 border-l-2 border-gray-200 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {h.editDate}
                        </p>
                        {i === 0 && (
                          <span className="inline-block mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            Latest Version
                          </span>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5 space-y-4">
                        {h.previousGeneralNotes && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Previous Clinical Notes</p>
                            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                              <p className="text-sm text-gray-700 italic">"{h.previousGeneralNotes}"</p>
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Medications</p>
                          <div className="space-y-2">
                            {(h.medicines || []).map((m, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">{m.medicine}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{m.dosage}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">{m.frequency}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">#{idx + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No History State */
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Original Version</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    This prescription hasn't been modified since creation. All changes will be tracked here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN DATALISTS */}
      <datalist id="meds">
        {availableMedicines.map((m, i) => (
          <option key={i} value={m} />
        ))}
      </datalist>
      <datalist id="doses">
        {dosages.map((d, i) => (
          <option key={i} value={d} />
        ))}
      </datalist>
      <datalist id="freqs">
        {frequencies.map((f, i) => (
          <option key={i} value={f} />
        ))}
      </datalist>
    </div>
  );
}