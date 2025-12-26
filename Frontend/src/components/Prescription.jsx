import React, { useState, useEffect } from "react";
import { Plus, Edit2, History, Clock, X, Check } from "lucide-react";

const getPreciseDateTime = () => new Date().toLocaleString();

export default function PrescriptionTab({ patient, setPatient }) {
  const API_BASE = "http://127.0.0.1:8000/api"; // adjust your backend URL

  const availableMedicines = [
    "Paracetamol","Ibuprofen","Amoxicillin","Cefalexin","Metronidazole",
    "Azithromycin","Omeprazole","Cetirizine","Cough Syrup","Symptomatic Relief",
    "Vitamin D","Iron Supplement","Insulin","Aspirin","Hydrocortisone","Clarithromycin",
  ];

  const dosages = ["50mg","100mg","150mg","200mg","250mg","300mg","400mg","500mg","750mg","1g","1 Tablet","2 Tablets"];
  const frequencies = ["Once a day","Twice a day","Three times a day","Every 6 hours","Every 8 hours","As needed","Once a week"];

  const [showAdd, setShowAdd] = useState(false);
  const [formMedicines, setFormMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({ medicine: "", dosage: "", frequency: "", notes: "" });
  const [editItem, setEditItem] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= Fetch prescriptions from backend =================
  useEffect(() => {
    if (!patient.id) return;
    setLoading(true);
    fetch(`${API_BASE}/prescriptions/?patient=${patient.id}`)
      .then(res => res.json())
      .then(data => {
        // transform backend data for front-end use
        const prescriptions = data.map(p => ({
          id: p.id,
          date: new Date(p.created_at).toLocaleString(),
          medicines: p.items.map(i => ({ ...i, id: i.id })),
          history: p.history || [], // if backend supports history
        }));
        setPatient({ ...patient, prescriptions });
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [patient.id]);

  // ================= Add medicine to current form =================
  const addMedicineToForm = () => {
    if (!currentMedicine.medicine || !currentMedicine.dosage || !currentMedicine.frequency) return;
    setFormMedicines([...formMedicines, { ...currentMedicine, id: Date.now() }]);
    setCurrentMedicine({ medicine: "", dosage: "", frequency: "", notes: "" });
  };

  const removeMedicineFromForm = (id) => {
    setFormMedicines(formMedicines.filter(m => m.id !== id));
  };

  // ================= Save prescription to backend =================
  const handleAddEdit = () => {
    if (formMedicines.length === 0) return;
    if (!patient.id) return;

    const payload = {
      appointment: null, // or selected appointment ID if you have
      patient: patient.id,
      doctor: null, // you can add selected doctor ID here
      items: formMedicines.map(m => ({
        medicine: m.medicine,
        dosage: m.dosage,
        frequency: m.frequency,
        notes: m.notes,
      }))
    };

    const url = editItem ? `${API_BASE}/prescriptions/${editItem.id}/` : `${API_BASE}/prescriptions/`;
    const method = editItem ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        // update patient prescriptions
        const updatedPrescriptions = editItem
          ? patient.prescriptions.map(p => (p.id === editItem.id ? {
              ...p,
              medicines: data.items,
              date: new Date(data.created_at).toLocaleString()
            } : p))
          : [...(patient.prescriptions || []), {
              id: data.id,
              medicines: data.items,
              date: new Date(data.created_at).toLocaleString(),
              history: []
            }];

        setPatient({ ...patient, prescriptions: updatedPrescriptions });

        setFormMedicines([]);
        setCurrentMedicine({ medicine: "", dosage: "", frequency: "", notes: "" });
        setEditItem(null);
        setShowAdd(false);
      })
      .catch(err => console.error(err));
  };

  const handleEditSetup = (index) => {
    const presc = patient.prescriptions[index];
    setEditItem({ id: presc.id, index });
    setFormMedicines(presc.medicines || []);
    setShowAdd(true);
  };

  const HistoryModal = ({ item }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold">Prescription History</h2>
          <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500"/>Current Version ({item.date})
          </h3>
          <div className="space-y-1">
            {(item.medicines || []).map((m) => (
              <p key={m.id}>{m.medicine} — {m.dosage} — {m.frequency} {m.notes && `— Notes: ${m.notes}`}</p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mt-4">Previous Versions ({item.history?.length || 0})</h3>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {item.history?.length > 0 ? item.history.map((h, i) => (
              <div key={i} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded-r-lg">
                <p className="text-sm text-gray-500 font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-1"/>Edited: {h.editDate}
                </p>
                {(h.medicines || []).map((m) => (
                  <p key={m.id}>{m.medicine} — {m.dosage} — {m.frequency} {m.notes && `— Notes: ${m.notes}`}</p>
                ))}
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
      <button onClick={() => { setShowAdd(true); setEditItem(null); setFormMedicines([]); setCurrentMedicine({ medicine: "", dosage: "", frequency: "", notes: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center">
        <Plus className="w-4 h-4 mr-1"/>Add New Prescription
      </button>

      {showAdd && (
        <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
          <h3 className="font-semibold">Add Medicines</h3>

          {/* Current medicine inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <input list="medicines-list" placeholder="Medicine"
                value={currentMedicine.medicine}
                onChange={e => setCurrentMedicine({ ...currentMedicine, medicine: e.target.value })}
                className="w-full border p-1 rounded"
              />
              <datalist id="medicines-list">{availableMedicines.map((m,i) => <option key={i} value={m} />)}</datalist>
            </div>
            <div>
              <input list="dosages-list" placeholder="Dosage"
                value={currentMedicine.dosage}
                onChange={e => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
                className="w-full border p-1 rounded"
              />
              <datalist id="dosages-list">{dosages.map((d,i) => <option key={i} value={d} />)}</datalist>
            </div>
            <div>
              <input list="frequencies-list" placeholder="Frequency"
                value={currentMedicine.frequency}
                onChange={e => setCurrentMedicine({ ...currentMedicine, frequency: e.target.value })}
                className="w-full border p-1 rounded"
              />
              <datalist id="frequencies-list">{frequencies.map((f,i) => <option key={i} value={f} />)}</datalist>
            </div>
            <div>
              <input placeholder="Notes" value={currentMedicine.notes}
                onChange={e => setCurrentMedicine({ ...currentMedicine, notes: e.target.value })}
                className="w-full border p-1 rounded"
              />
            </div>
          </div>

          <button onClick={addMedicineToForm} className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1">
            <Plus size={14}/> Add Medicine
          </button>

          {/* List of medicines in current prescription */}
          <div className="space-y-1">
            {(formMedicines || []).map(m => (
              <div key={m.id} className="flex justify-between bg-white p-2 border rounded-lg items-center">
                <span>{m.medicine} — {m.dosage} — {m.frequency} {m.notes && `— Notes: ${m.notes}`}</span>
                <button onClick={() => removeMedicineFromForm(m.id)} className="text-red-500 p-1 hover:bg-red-100 rounded-full"><X size={16}/></button>
              </div>
            ))}
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={() => { setShowAdd(false); setFormMedicines([]); setCurrentMedicine({}); setEditItem(null); }} className="px-4 py-2 border rounded-xl hover:bg-gray-100">Cancel</button>
            <button onClick={handleAddEdit} className={`text-white px-4 py-2 rounded-xl flex items-center ${formMedicines.length > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`} disabled={formMedicines.length === 0}>
              {editItem ? "Update Prescription" : "Save Prescription"}
            </button>
          </div>
        </div>
      )}

      {/* Display saved prescriptions */}
      {loading && <p>Loading...</p>}
      {(patient.prescriptions || []).map((presc, idx) => (
        <div key={presc.id} className="border-l-4 border-blue-500 p-4 bg-white rounded-r-xl shadow-sm flex justify-between items-start">
          <div className="flex-1 mr-4">
            <span className="text-sm text-gray-500 flex items-center mb-1"><Clock className="w-3 h-3 mr-1"/>{presc.date}</span>
            {(presc.medicines || []).map((m) => (
              <p key={m.id} className="font-medium">{m.medicine} — {m.dosage} — {m.frequency} {m.notes && `— Notes: ${m.notes}`}</p>
            ))}
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setModal(presc)}>
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
