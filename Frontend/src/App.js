import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

// Pages
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
import MedicalRecord from "./components/Medicalrecord";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Admin Dashboard Components
import Dashboard from "./Dashboard";
import AllPatients from "./AllPatients";
import Patient from "./Patient";
import Appointments from "./Appointments";
import Doctors from "./components/Doctors";
import Billing from "./components/Billing";
import CreateInvoice from "./components/CreateInvoice";
import StaffShifts from "./components/StaffShifts";

export default function App() {
  const { user, setUser, logout } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // Restore user from localStorage
  useEffect(() => {
    const firstName = localStorage.getItem("user_first_name");
    const lastName = localStorage.getItem("user_last_name");
    const role = localStorage.getItem("user_role");

    if (firstName && role) {
      setUser({ firstName, lastName, role });
    }
    setLoadingUser(false);
  }, [setUser]);

  const handleAdminLogout = () => {
    logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_first_name");
    localStorage.removeItem("user_last_name");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ---------- ADMIN / STAFF LAYOUT ----------
  if (user?.role === "admin" || user?.role === "doctor" || user?.role === "nurse") {
    return (
      <div>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <Header isCollapsed={isCollapsed} onLogout={handleAdminLogout} />
          <main className="p-6 mt-20 bg-gray-100 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<AllPatients />} />
              <Route path="/patients/:id" element={<Patient />} />

              {/* Medical records — ONLY doctor */}
              <Route
                path="/patients/:id/medical-record"
                element={
                  user?.role === "doctor" ? <MedicalRecord /> : <Navigate to="/" replace />
                }
              />

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

  // ---------- PATIENT / PUBLIC LAYOUT ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register isStaff={false} />} />
          <Route path="/register-staff" element={<Register isStaff={true} />} />
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
