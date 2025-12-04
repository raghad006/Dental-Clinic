import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // return to home after logout
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Clinic name */}
        <div>
          <Link to="/" className="text-2xl font-bold text-blue-700">
            Smile Care 
          </Link>
          <div className="text-sm text-gray-500">Your smile, our care</div>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/book" className="text-gray-700 hover:text-blue-600">
            Book
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              className="text-gray-700 hover:text-blue-600"
            >
              My Bookings
            </Link>
          )}

          <Link to="/loyalty" className="text-gray-700 hover:text-blue-600">
            Loyalty
          </Link>

          {/* User actions */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-blue-700 font-medium">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
