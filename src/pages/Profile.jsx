import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useApp } from "../state/AppContext";

export default function Profile() {
  const { user, logout } = useContext(UserContext);
  const { bookedAppointments } = useApp();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <h2 className="text-2xl font-semibold mb-2">You’re not logged in</h2>
        <a
          href="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // ✅ Filter bookings belonging to this user
  const userBookings = bookedAppointments.filter(
    (b) => b.userEmail === user.email
  );

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Profile</h2>

      <div className="text-gray-700 space-y-2 mb-6">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* ✅ Unified Bookings Section */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Your Appointments
      </h3>

      {userBookings.length > 0 ? (
        <ul className="space-y-3">
          {userBookings.map((b, i) => (
            <li
              key={i}
              className="p-3 bg-gray-100 rounded border border-gray-200"
            >
              <p>
                <strong>Doctor:</strong> {b.doctorName}
              </p>
              <p>
                <strong>Date:</strong> {b.date}
              </p>
              <p>
                <strong>Time:</strong> {b.time}
              </p>
              <p>
                <strong>Branch:</strong> {b.branch}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {b.paid ? (
                  <span className="text-green-600 font-medium">Paid</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Paid</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You haven’t booked any appointments yet.</p>
      )}

      <button
        onClick={logout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
