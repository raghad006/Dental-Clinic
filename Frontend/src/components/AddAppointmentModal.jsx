import React, { useState, useEffect } from "react";
import { X, CalendarPlus } from "lucide-react";
import CalendarDropdown from "./CalendarDropdown";

const AddAppointmentModal = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  ];

  // Fetch doctors and patients from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/staff/");
        const data = await res.json();
        const doctors = data.map(d => d.name); // adjust if your API field is different
        setDoctorOptions(doctors);
        if (doctors.length > 0) setDoctor(doctors[0]);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/clinic-patients/");
        const data = await res.json();
        const patients = data.map(p => p.name); // adjust if your API field is different
        setPatientOptions(patients);
        if (patients.length > 0) setPatient(patients[0]);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!date || !time || !doctor || !patient) {
      alert("Please fill all fields before saving.");
      return;
    }

    const newAppointment = { date, time, doctor, patient, status: "Awaiting" };
    onSave(newAppointment);

    setDate("");
    setTime("");
    setDoctor(doctorOptions.length > 0 ? doctorOptions[0] : "");
    setPatient(patientOptions.length > 0 ? patientOptions[0] : "");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarPlus className="text-blue-600" /> New Appointment
        </h2>

        <div className="space-y-3">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <CalendarDropdown selectedDate={date} onDateChange={(d) => setDate(d)} />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium">Time</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Time</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium">Doctor</label>
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              {doctorOptions.length > 0 ? doctorOptions.map(d => <option key={d} value={d}>{d}</option>) : <option value="">No doctors available</option>}
            </select>
          </div>

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium">Patient</label>
            <select value={patient} onChange={(e) => setPatient(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              {patientOptions.length > 0 ? patientOptions.map(p => <option key={p} value={p}>{p}</option>) : <option value="">No patients available</option>}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-5 gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
