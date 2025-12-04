import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";
import { UserContext } from "../context/UserContext";

export default function Confirm() {
  const { draftAppointment, bookAppointment } = useApp();
  const { user, addBooking } = useContext(UserContext);
  const navigate = useNavigate();

  if (!draftAppointment)
    return (
      <div className="p-6 bg-white rounded shadow">
        No appointment selected.{" "}
        <button
          onClick={() => navigate("/book")}
          className="text-blue-600 underline"
        >
          Start Booking
        </button>
      </div>
    );

  function handleConfirm() {
    if (!user) {
      alert("Please log in before confirming your appointment.");
      navigate("/login");
      return;
    }

    // Create and mark appointment as paid (deposit already made)
    const appt = bookAppointment({ ...draftAppointment, paid: true });

    // Also save it to the current user’s bookings
    addBooking({
      id: appt.id,
      doctorName: draftAppointment.doctorName,
      date: draftAppointment.date,
      time: draftAppointment.time,
      paid: true,
    });

    // Go directly to success page instead of payment
    navigate("/success", { state: { appointmentId: appt.id } });
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow mx-auto">
      <h3 className="text-xl font-semibold mb-4">Confirm Appointment</h3>
      <div className="space-y-2">
        <div>
          <strong>Doctor:</strong> {draftAppointment.doctorName}
        </div>
        <div>
          <strong>Date:</strong> {draftAppointment.date}
        </div>
        <div>
          <strong>Time:</strong> {draftAppointment.time}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Appointment
        </button>
        <button
          onClick={() => navigate("/choose")}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
