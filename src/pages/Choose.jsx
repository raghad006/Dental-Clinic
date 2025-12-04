import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../index.css";

export default function Choose() {
  const { selectedDoctor, setDraftAppointment, appointments } = useApp();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // 🕒 When a doctor is selected, load their branches and available times
  useEffect(() => {
    if (!selectedDoctor) return;

    // reset branch & times
    setSelectedBranch("");
    setAvailableTimes([]);
    setSelectedTime("");
  }, [selectedDoctor]);

  // 🧮 Filter available times for selected branch & date
  useEffect(() => {
    if (!selectedDoctor || !selectedBranch) return;

    const doctorTimes = selectedDoctor.branchSchedules[selectedBranch] || [];

    const selectedDateStr = date.toLocaleDateString("en-CA"); // ✅ LOCAL DATE
    const today = new Date();

    const bookedTimes = appointments
      .filter(
        (a) =>
          a.doctorId === selectedDoctor.id &&
          a.date === selectedDateStr &&
          a.branch === selectedBranch
      )
      .map((a) => a.time);

    const filtered = doctorTimes.filter((t) => {
      const [hours, minutes] = t.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);

      // hide past times if today
      if (
        date.toDateString() === today.toDateString() &&
        slotTime < today
      ) {
        return false;
      }

      // hide booked times
      return !bookedTimes.includes(t);
    });

    setAvailableTimes(filtered);
  }, [date, appointments, selectedDoctor, selectedBranch]);

  if (!selectedDoctor)
    return (
      <div className="p-6 bg-white rounded shadow">
        Please select a doctor first.{" "}
        <button
          onClick={() => navigate("/book")}
          className="text-blue-600 underline"
        >
          Go to Book
        </button>
      </div>
    );

  // ✅ Continue to confirm
  const handleContinue = () => {
    if (!selectedBranch) return alert("Please select a branch");
    if (!selectedTime) return alert("Please select a time slot");

    setDraftAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: date.toLocaleDateString("en-CA"), // ✅ fixed: store local date
      time: selectedTime,
      branch: selectedBranch,
    });

    navigate("/confirm");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Choose Your Appointment Time
      </h2>

      {/* Doctor Info */}
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-blue-700">
          {selectedDoctor.name}
        </h3>
        <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
        <p className="text-xs text-gray-500 mt-1">
          Available at: {selectedDoctor.branches.join(" • ")}
        </p>
      </div>

      {/* Branch Selector */}
      <div className="text-center">
        <h4 className="font-semibold mb-2 text-gray-800">Select Branch</h4>
        <div className="flex justify-center gap-4">
          {selectedDoctor.branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedBranch === branch
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 border border-gray-300 hover:bg-blue-50"
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Calendar */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <Calendar
            onChange={setDate}
            value={date}
            minDate={new Date()}
            className="rounded-lg w-full"
          />
        </div>

        {/* Time Slots */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-3">Available Times</h4>
          {!selectedBranch ? (
            <p className="text-gray-500 text-sm">
              Please select a branch first.
            </p>
          ) : availableTimes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedTime === time
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No available slots for this date.
            </p>
          )}
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm text-center">
        <h4 className="font-semibold mb-2">Appointment Confirmation</h4>
        <p>
          <strong>Doctor:</strong> {selectedDoctor.name}
        </p>
        <p>
          <strong>Branch:</strong> {selectedBranch || "—"}
        </p>
        <p>
          <strong>Date:</strong> {date.toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {selectedTime || "—"}
        </p>

        <button
          onClick={handleContinue}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue to Confirm
        </button>
      </div>
    </div>
  );
}
