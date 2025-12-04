import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

// 🧭 Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import Choose from "./pages/Choose";
import Confirm from "./pages/Confirm";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Loyalty from "./pages/Loyalty";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";

// 🧩 Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// 🏥 Admin Dashboard Components
import Dashboard from "./Dashboard";
import AllPatients from "./AllPatients";
import Patient from "./Patient";
import Appointments from "./Appointments";
import Doctors from "./components/Doctors";
import Billing from "./components/Billing";
import CreateInvoice from "./components/CreateInvoice";
import StaffShifts from "./components/StaffShifts";

export default function App() {
  const { user, logout } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {}, [user]);

  // ✅ Admin logout handler
  const handleAdminLogout = () => {
    logout(); // clear admin session
    navigate("/"); // return to public homepage
  };

  // ---------- ADMIN LAYOUT ----------
  if (user?.role === "admin") {
    return (
      <div>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <Header isCollapsed={isCollapsed} onLogout={handleAdminLogout} />
          <main className="p-6 mt-20 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<AllPatients />} />
              <Route path="/patients/:id" element={<Patient />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/billing/create" element={<CreateInvoice />} />
              <Route path="/staffshifts" element={<StaffShifts />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  // ---------- PATIENT LAYOUT ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<Book />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
