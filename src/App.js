import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Pages
import AllPatients from "./AllPatients";
import Patient from "./Patient";
import Appointments from "./Appointments";
import Dashboard from "./Dashboard";

import Doctors from "./components/Doctors";
import Billing from "./components/Billing";
import CreateInvoice from "./components/CreateInvoice";
import StaffShifts from "./components/StaffShifts";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true); // start collapsed on refresh

  return (
    <div>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header isCollapsed={isCollapsed} />

        <main className="p-6 mt-16 bg-gray-100 min-h-screen">
          <Routes>

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Patients */}
            <Route path="/patients" element={<AllPatients />} />
            <Route path="/patients/:id" element={<Patient />} />

            {/* Appointments */}
            <Route path="/appointments" element={<Appointments />} />

            {/* Doctors */}
            <Route path="/doctors" element={<Doctors />} />

            {/* Billing */}
            <Route path="/billing" element={<Billing />} />

            {/* Create Invoice */}
            <Route path="/billing/create" element={<CreateInvoice />} />

            {/* Staff Shifts */}
            <Route path="/StaffShifts" element={<StaffShifts />} />

            {/* Example Coming Soon pages */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
