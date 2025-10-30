import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AllPatients from "./AllPatients";
import Patient from "./Patient";
import Appointments from "./Appointments";
import Dashboard from "./Dashboard";


function App() {
  const [isCollapsed, setIsCollapsed] = useState(true); // start collapsed on refresh

  return (
    <div>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}
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

            {/* New placeholder pages */}
              <Route
                path="/Doctor"
                element={
                  <div className="flex items-center justify-center h-full text-gray-500 text-lg bg-white rounded-xl shadow-sm p-10">
                  Doctor Coming Soon...
                  </div>
                }
              />
            <Route path="/staff" element={     
                  <div className="flex items-center justify-center h-full text-gray-500 text-lg bg-white rounded-xl shadow-sm p-10">
                  Staff Coming Soon...
                  </div>
                } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
