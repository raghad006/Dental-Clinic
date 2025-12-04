import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";

export default function Success() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { bookedAppointments } = useApp();
  const appointmentId = loc.state?.appointmentId;

  // ✅ Find appointment from global bookedAppointments (not temporary appointments)
  const appt = bookedAppointments.find((a) => a.id === appointmentId);

  if (!appt)
    return (
      <div className="p-6 bg-white rounded shadow text-center">
        <h3 className="text-xl font-semibold mb-2 text-red-500">Appointment not found.</h3>
        <button
          onClick={() => navigate("/my-bookings")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to My Bookings
        </button>
      </div>
    );

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow text-center mt-20">
      <h3 className="text-2xl font-semibold text-green-600 mb-4">
        Booking Successful 🎉
      </h3>

      <div className="text-gray-700 space-y-2 mb-6">
        <p>
          <strong>Doctor:</strong> {appt.doctorName}
        </p>
        <p>
          <strong>Date:</strong> {appt.date}
        </p>
        <p>
          <strong>Time:</strong> {appt.time}
        </p>
        <p>
          <strong>Branch:</strong> {appt.branch}
        </p>
      </div>

      <button
        onClick={() => navigate("/my-bookings")} // ✅ Go to MyBookings
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to My Bookings
      </button>
    </div>
  );
}
