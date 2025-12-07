// Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Users, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    { date: "2025-10-30", time: "08:30 AM", patient: "Youssef Hassan", doctor: "Dr. Ava Chen", status: "Awaiting" },
    { date: "2025-10-30", time: "09:00 AM", patient: "Olivia Smith", doctor: "Dr. Marcus Lee", status: "Cancelled" },
    { date: "2025-10-30", time: "10:00 AM", patient: "Mohamed Mohamed", doctor: "Dr. Sarah Bell", status: "Awaiting" },
    { date: "2025-10-30", time: "11:00 AM", patient: "Omar Ali", doctor: "Dr. Marcus Lee", status: "Awaiting" },
    { date: "2025-10-30", time: "09:30 AM", patient: "Fatma Youssef", doctor: "Dr. Ava Chen", status: "Awaiting" },
    { date: "2025-10-30", time: "10:00 AM", patient: "Yousef Ahmed", doctor: "Dr. Marcus Lee", status: "Cancelled" },
    { date: "2025-10-30", time: "11:00 AM", patient: "Mohamed Ahmed", doctor: "Dr. Sarah Bell", status: "Awaiting" },
    { date: "2025-10-30", time: "11:00 AM", patient: "Omar Ali", doctor: "Dr. Marcus Lee", status: "Awaiting" },
    { date: "2025-10-30", time: "12:15 AM", patient: "Noah Williams", doctor: "Dr. Sarah Bell", status: "Awaiting" },
    { date: "2025-10-31", time: "12:30 PM", patient: "Sarah Mohamed", doctor: "Dr. Marcus Lee", status: "Confirmed" },
    { date: "2025-10-31", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Confirmed" },
    { date: "2025-11-03", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Confirmed" },
    { date: "2025-10-31", time: "02:30 PM", patient: "Sara Ahmed", doctor: "Dr. Marcus Lee", status: "Awaiting" },
    { date: "2025-11-01", time: "03:00 PM", patient: "Layla Ahmed", doctor: "Dr. Sarah Bell", status: "Cancelled" },
    { date: "2025-11-01", time: "04:00 PM", patient: "Mariam Ahmed", doctor: "Dr. Sarah Bell", status: "Cancelled" },
    { date: "2025-12-31", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Confirmed" },
    { date: "2025-11-30", time: "09:30 AM", patient: "Yousef Hassan", doctor: "Dr. Ava Chen", status: "Awaiting" },
  ];

  const zayedDoctors = [
    { name: "Dr. Amira Reed", specialty: "Dentist", status: "Available" },
    { name: "Dr. Marcus Chen", specialty: "Orthodontist", status: "Available" },
  ];

  const maadiDoctors = [
    { name: "Dr. Sami Ibrahim", specialty: "Surgeon", status: "Available" },
    { name: "Dr. Nora Hassan", specialty: "Pediatric Dentist", status: "Available" },
  ];

  const nurses = [
    { name: "Nurse Layla Hassan", shift: "Morning", status: "On Duty" },
    { name: "Nurse Omar Fathy", shift: "Evening", status: "Off Duty" },
    { name: "Nurse Sara Amin", shift: "Morning", status: "On Duty" },
    { name: "Asst. Hassan Sami", shift: "Evening", status: "On Duty" },
  ];

  const statusColors = {
    Confirmed: "bg-green-100 text-green-700",
    Awaiting: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    "On Duty": "bg-green-100 text-green-700",
    "Off Duty": "bg-gray-200 text-gray-600",
  };

  // Filter appointments for selected date
  const filteredAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === selectedDate.toDateString()
  );

  // Filter appointments for today
  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === todayStr
  );

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const handleDateClick = (day) => setSelectedDate(new Date(year, month, day));

  const renderCalendar = () => {
    const totalDays = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-gray-700">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-400 uppercase mb-1">{d}</div>
        ))}
        {blanks.map((_, i) => <div key={`b-${i}`} />)}
        {days.map((day) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSelected = day === selectedDate.getDate();
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`py-2.5 text-sm font-medium cursor-pointer rounded-2xl transition-all 
                ${isSelected ? "bg-blue-600 text-white shadow-sm scale-105" : "hover:bg-gray-100 text-gray-700"}
                ${isToday && !isSelected ? "border border-blue-400" : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-gray-50 rounded-3xl shadow-lg w-full max-w-7xl p-8 text-gray-800 transition-all duration-300">
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-gray-500 mb-8">Welcome Back!</p>

        {/* Top Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gray-100"><CalendarDays className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Appointments Today</p>
              <p className="text-3xl font-bold mt-1">{todayAppointments.length}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gray-100"><Users className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Patients This Month</p>
              <p className="text-3xl font-bold mt-1">128</p>
              <p className="text-sm text-gray-400 mt-1">+12% from last month</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Calendar + Appointments */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> Select Date</h3>
            {renderCalendar()}
            <p className="text-sm text-gray-600 mt-4">Selected: {selectedDate.toDateString()}</p>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              Appointments for Selected Date
              <button onClick={() => navigate("/appointments")} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                    <div>
                      <p className="font-medium text-gray-800">{appt.patient}</p>
                      <p className="text-xs text-gray-500">{appt.time} • {appt.doctor}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[appt.status]}`}>{appt.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No appointments for this date.</p>
              )}
            </div>
          </div>
        </div>

        {/* Doctors + Nurses */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Doctors */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Doctors Available Today</h3>
              <button onClick={() => navigate("/Doctors")} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-gray-700 mb-3">Zayed Branch</p>
                {zayedDoctors.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 mb-2 transition-all">
                    <div>
                      <p className="font-semibold">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.specialty}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">{doc.status}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-3">Maadi Branch</p>
                {maadiDoctors.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 mb-2 transition-all">
                    <div>
                      <p className="font-semibold">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.specialty}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nurses */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nurses On Shift</h3>
              <button onClick={() => navigate("/StaffShifts")} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {nurses.map((n, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-all">
                  <div>
                    <p className="font-medium text-gray-800">{n.name}</p>
                    <p className="text-xs text-gray-500">Shift: {n.shift}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[n.status]}`}>{n.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
