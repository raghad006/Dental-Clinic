import React, { useState } from "react";
import { useApp } from "../state/AppContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MyBookings() {
  const {
    appointments,
    cancelAppointment,
    rescheduleAppointment,
    doctors,
  } = useApp();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState("");

  const times = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

  const handleReschedule = (b) => {
    setSelectedBooking(b);
  };

  const confirmReschedule = () => {
    if (!newTime) return alert("Please choose a time");
    rescheduleAppointment(
      selectedBooking.id,
      newDate.toISOString().slice(0, 10),
      newTime
    );
    setSelectedBooking(null);
    alert("Appointment rescheduled successfully!");
  };

  if (!appointments.length)
    return (
      <div className="p-6 bg-white rounded shadow text-center">
        No bookings yet.
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        My Appointments
      </h2>

      {appointments.map((a) => {
        const doc = doctors.find((d) => d.id === a.doctorId);
        return (
          <div
            key={a.id}
            className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{doc?.name}</h3>
              <p className="text-gray-600 text-sm">
                {a.date} at {a.time}
              </p>
            </div>

            <div className="flex gap-3 mt-3 md:mt-0">
              <button
                onClick={() => handleReschedule(a)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reschedule
              </button>
              <button
                onClick={() => cancelAppointment(a.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })}

      {/* Reschedule Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>

            <Calendar
              onChange={setNewDate}
              value={newDate}
              minDate={new Date()}
              className="rounded-lg w-full mb-4"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setNewTime(t)}
                  className={`px-3 py-1 rounded ${
                    newTime === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
