import React, { useState } from "react";
import { X, CalendarPlus } from "lucide-react";
import CalendarDropdown from "./CalendarDropdown";

const AddAppointmentModal = ({ isOpen, onClose, onSave, doctorOptions }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  ];

  if (!isOpen) return null;

  const handleSave = () => {
    if (!date || !time || !doctor || !patient) {
      alert("Please fill all fields before saving.");
      return;
    }

    const newAppointment = {
      date,
      time,
      doctor,
      patient,
      status: "Awaiting",
    };

    onSave(newAppointment);
    setDate("");
    setTime("");
    setDoctor("");
    setPatient("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarPlus className="text-blue-600" /> New Appointment
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <CalendarDropdown
  selectedDate={date}
  onDateChange={(selectedDate) => setDate(selectedDate)}
/>
          </div>

          <div>
            <label className="block text-sm font-medium">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Time</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Doctor</label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Doctor</option>
              {doctorOptions.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Patient</label>
            <input
              type="text"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Enter patient name"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
