import React, { useState, useEffect } from "react";
import { Plus, Edit2, History, X, Pill, Trash2, Save, ClipboardList, CheckCircle2, Loader2, Calendar } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function PrescriptionTab({ patient, setPatient }) {
  const availableMedicines = ["Paracetamol", "Ibuprofen", "Amoxicillin", "Cefalexin", "Metronidazole", "Azithromycin", "Omeprazole", "Cetirizine", "Cough Syrup", "Vitamin D", "Insulin"];
  const dosages = ["50mg", "100mg", "250mg", "500mg", "1g", "1 Tablet", "5ml"];
  const frequencies = ["Once a day (QD)", "Twice a day (BID)", "Three times a day (TID)", "Every 6 hours", "As needed (PRN)"];

  const [showAdd, setShowAdd] = useState(false);
  const [formMedicines, setFormMedicines] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState(""); 
  const [currentMedicine, setCurrentMedicine] = useState({ medicine: "", dosage: "", frequency: "", notes: "" });
  const [editItem, setEditItem] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // SAFE UTILITY: Prevents "map of undefined" errors by checking keys and providing defaults
  const formatHistory = (historyArray) => {
    if (!historyArray || !Array.isArray(historyArray)) return [];
    return historyArray.map(h => ({
      editDate: h.changed_at ? new Date(h.changed_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : "Recently",
      previousGeneralNotes: h.notes || h.previous_notes || "",
      medicines: h.previous_data || h.previous_medicines || []
    }));
  };

  // Fetch Medical Record
  useEffect(() => {
    if (!patient?.patient_id) return;
    setLoading(true);
    fetch(`${API_BASE}/clinic-patient/${patient.patient_id}/medical-record/`)
      .then(res => res.json())
      .then(data => {
        const prescriptions = (data.prescriptions || []).map(p => ({
          id: p.id,
          date: p.created_at ? new Date(p.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "N/A",
          notes: p.notes || "", 
          medicines: (p.items || []).map((i, idx) => ({ ...i, id: i.id || idx })),
          history: formatHistory(p.history || p.audit_history)
        }));
        setPatient(prev => ({ ...prev, prescriptions }));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [patient?.patient_id]);

  const handleAddEdit = async () => {
    if (formMedicines.length === 0 || !patient?.patient_id) {
        alert("Please add at least one medicine.");
        return;
    }

    setIsSaving(true);
    const payload = {
      patient: patient.id || patient.patient_id, 
      notes: prescriptionNotes,
      items: formMedicines.map(({ medicine, dosage, frequency, notes }) => ({
        medicine, dosage, frequency, notes
      }))
    };

    const url = editItem 
      ? `${API_BASE}/clinic-patient/${patient.patient_id}/prescriptions/${editItem.id}/`
      : `${API_BASE}/clinic-patient/${patient.patient_id}/prescriptions/`;
    
    const method = editItem ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      const updatedItem = {
        id: data.id,
        notes: data.notes || "",
        medicines: data.items || [],
        date: new Date(data.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        history: formatHistory(data.history || data.audit_history)
      };

      const updatedPrescriptions = editItem
        ? (patient.prescriptions || []).map(p => (p.id === editItem.id ? updatedItem : p))
        : [updatedItem, ...(patient.prescriptions || [])];

      setPatient({ ...patient, prescriptions: updatedPrescriptions });
      
      // Reset Form States
      setFormMedicines([]);
      setPrescriptionNotes("");
      setEditItem(null);
      setShowAdd(false);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save. Ensure your database is migrated.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 antialiased text-slate-900 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Prescriptions</h2>
          <p className="text-slate-500 font-medium">Record for Patient <span className="text-indigo-600 font-bold">#{patient.patient_id}</span></p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => { setShowAdd(true); setEditItem(null); setFormMedicines([]); setPrescriptionNotes(""); }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            <Plus size={22} /> New Prescription
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR FORM (Only visible when adding/editing) */}
        {showAdd && (
          <div className="lg:col-span-5 space-y-4 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden sticky top-4">
              <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  <ClipboardList size={18} className="text-indigo-400" />
                  {editItem ? 'Update Order' : 'New Order'}
                </div>
                <button onClick={() => setShowAdd(false)} className="hover:bg-slate-800 p-1 rounded-full"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-6">
                {/* GENERAL NOTES */}
                <div className="group">
                  <label className="text-[10px] font-black text-indigo-600 uppercase mb-1 ml-1 block">General Instructions (Prescription Notes)</label>
                  <textarea 
                      value={prescriptionNotes} 
                      onChange={e => setPrescriptionNotes(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 outline-none transition-all font-semibold text-sm min-h-[80px]" 
                      placeholder="e.g. Take 1 hour before breakfast..."
                  />
                </div>

                <hr className="border-slate-100" />

                {/* ADD MEDICINE INPUTS */}
                <div className="space-y-4">
                  <input list="meds" value={currentMedicine.medicine} onChange={e => setCurrentMedicine({...currentMedicine, medicine: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none font-semibold" placeholder="Medication Name"/>
                  <div className="grid grid-cols-2 gap-4">
                    <input list="doses" value={currentMedicine.dosage} onChange={e => setCurrentMedicine({...currentMedicine, dosage: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none font-semibold" placeholder="Dosage"/>
                    <input list="freqs" value={currentMedicine.frequency} onChange={e => setCurrentMedicine({...currentMedicine, frequency: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none font-semibold" placeholder="Frequency"/>
                  </div>
                  <button onClick={() => { if(currentMedicine.medicine) { setFormMedicines([...formMedicines, {...currentMedicine, id: Date.now()}]); setCurrentMedicine({medicine:"", dosage:"", frequency:"", notes:""}); }}} className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm border-2 border-dashed border-indigo-200">+ Add to List</button>
                </div>

                {/* CURRENT LIST OF MEDICINES IN FORM */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formMedicines.map(m => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="font-bold text-xs">{m.medicine} - <span className="text-slate-400">{m.dosage}</span></span>
                      <button onClick={() => setFormMedicines(formMedicines.filter(x => x.id !== m.id))}><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                    </div>
                  ))}
                </div>

                <button onClick={handleAddEdit} disabled={isSaving || formMedicines.length === 0} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-2 transition-all">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20}/>}
                  {editItem ? "Confirm Updates" : "Authorize Prescription"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN HISTORY LIST */}
        <div className={`${showAdd ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Loading clinical records...</p>
             </div>
          ) : (patient.prescriptions || []).length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
              <Pill className="mx-auto text-slate-100 mb-4" size={64} />
              <p className="text-slate-400 font-bold">No clinical history found.</p>
            </div>
          ) : (
            (patient.prescriptions || []).map((presc) => (
              <div key={presc.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Calendar size={20}/></div>
                    <p className="font-black text-slate-800 text-lg">{presc.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModal(presc)} className="p-3 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl"><History size={20} /></button>
                    <button onClick={() => { setEditItem({id: presc.id}); setFormMedicines(presc.medicines || []); setPrescriptionNotes(presc.notes || ""); setShowAdd(true); }} className="p-3 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded-2xl"><Edit2 size={20} /></button>
                  </div>
                </div>

                {/* DISPLAY CURRENT NOTES */}
                {presc.notes && (
                  <div className="mb-6 p-4 bg-slate-50 border-l-4 border-indigo-400 rounded-r-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pharmacist/Patient Notes</p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">"{presc.notes}"</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(presc.medicines || []).map((m, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl">
                      <p className="font-black text-slate-800 text-md">{m.medicine}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">{m.dosage}</span>
                        <span className="text-[10px] font-bold bg-indigo-600 px-2 py-1 rounded text-white uppercase">{m.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AUDIT LOG MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black flex items-center gap-2"><History className="text-indigo-600"/> Audit Trail</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={24}/></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              {(modal.history || []).length > 0 ? (
                modal.history.map((h, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-indigo-100 pb-4">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-3">{h.editDate}</p>
                    
                    <div className="bg-slate-50 p-5 rounded-3xl space-y-4">
                      {h.previousGeneralNotes && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Previous Clinical Notes</p>
                          <p className="text-xs text-slate-600 italic">"{h.previousGeneralNotes}"</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Medications in this version</p>
                        {(h.medicines || []).map((m, idx) => (
                          <div key={idx} className="text-xs font-bold text-slate-700 bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                            <span>{m.medicine}</span>
                            <span className="opacity-50">{m.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                   <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-2"/>
                   <p className="text-slate-400 font-bold italic">This record has not been modified since creation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN DATALISTS */}
      <datalist id="meds">{availableMedicines.map((m,i) => <option key={i} value={m} />)}</datalist>
      <datalist id="doses">{dosages.map((d,i) => <option key={i} value={d} />)}</datalist>
      <datalist id="freqs">{frequencies.map((f,i) => <option key={i} value={f} />)}</datalist>
    </div>
  );
}