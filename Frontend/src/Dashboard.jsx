import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  Users, 
  ChevronRight, 
  Package,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  Clock,
  UserPlus,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("access_token"),
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [stock, setStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

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
    Confirmed: "bg-green-100 text-green-700 border border-green-200",
    Awaiting: "bg-blue-100 text-blue-700 border border-blue-200",
    Cancelled: "bg-red-100 text-red-700 border border-red-200",
    CheckedIn: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "On Duty": "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "Off Duty": "bg-gray-200 text-gray-600",
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const res = await fetch(`${API_BASE}/appointments/`, {
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    const fetchStock = async () => {
      setLoadingStock(true);
      try {
        // Note: You need to create this endpoint or use your existing one
        const res = await fetch(`${API_BASE}/stock-items/`, {
          headers: authHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setStock(data);
        } else {
          const data = await res.json();
          setStock(data);
        }
      } catch (err) {
        console.error("Error fetching stock:", err);
      } finally {
        setLoadingStock(false);
      }
    };

    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const res = await fetch(`${API_BASE}/clinic-patients/`, {
          headers: authHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchAppointments();
    fetchStock();
    fetchPatients();
  }, []);

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === selectedDate.toDateString()
  );

  // Appointments for today
  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === todayStr
  );

  // Get appointment stats
  const appointmentStats = {
    total: appointments.length,
    today: todayAppointments.length,
    awaiting: appointments.filter(a => a.status === "Awaiting").length,
    checkedIn: appointments.filter(a => a.status === "Checked In").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length,
  };

  // Get critical stock items (stock ≤ 5)
const criticalStockItems = stock.filter(item => {
  // Use item.threshold if exists, otherwise fallback to 5
  const threshold = item.threshold ?? 5;
  return item.quantity <= threshold;
});

  // Calculate percentages
  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Clinic Dashboard
              </h1>
              <p className="text-blue-600 mt-1">Overview of your clinic's operations and metrics</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Appointments Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loadingAppointments ? "..." : appointmentStats.today}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${calculatePercentage(appointmentStats.today, appointmentStats.total)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {calculatePercentage(appointmentStats.today, appointmentStats.total)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Patients Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loadingPatients ? "..." : patients.length}
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp size={14} /> +12% from last month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Stock Status Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Stock Items</p>
                <p className="text-3xl font-bold text-gray-800">
                  {loadingStock ? "..." : stock.length}
                </p>
                {criticalStockItems.length > 0 ? (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {criticalStockItems.length} critical item{criticalStockItems.length !== 1 ? 's' : ''}
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={14} /> All stock adequate
                  </p>
                )}
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Appointment Status Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Appointment Status</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Awaiting</p>
                    <p className="font-bold">{appointmentStats.awaiting}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Checked In</p>
                    <p className="font-bold">{appointmentStats.checkedIn}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Cancelled</p>
                    <p className="font-bold">{appointmentStats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Calendar</h3>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="text-sm font-semibold text-blue-600 py-2">{day}</div>
                ))}
                
                {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }, (_, i) => (
                  <div key={`empty-${i}`} className="py-3"></div>
                ))}
                
                {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate() && 
                                 selectedDate.getMonth() === new Date().getMonth() && 
                                 selectedDate.getFullYear() === new Date().getFullYear();
                  const isSelected = day === selectedDate.getDate();
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                      className={`py-3 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : isToday
                          ? 'bg-blue-100 text-blue-600 border border-blue-200'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Today's Appointments</h3>
                  <p className="text-sm text-blue-600">Appointments scheduled for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/appointments")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {loadingAppointments ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-3 text-blue-600">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between bg-white border border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg w-14 h-14 shadow-lg">
                        <p className="text-xs font-bold">
                          {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </p>
                        <p className="text-lg font-bold">
                          {new Date(appt.date).getDate()}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{appt.patient_display || "Patient"}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                          {appt.doctor_display || "Doctor"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{appt.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[appt.status] || statusColors.Awaiting}`}>
                        {appt.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">{appt.procedure_type || "Checkup"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
                    <CalendarClock className="text-blue-500" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments</h3>
                  <p className="text-gray-600">No appointments scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Alerts Section */}
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Stock Alerts</h3>
                  <p className="text-sm text-red-600">Items running low (≤ 5 remaining)</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/stock")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Manage Stock <ArrowRight size={16} />
              </button>
            </div>

            {loadingStock ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-red-600">Loading stock data...</p>
              </div>
            ) : criticalStockItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalStockItems.map((item, i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{item.quantity}</div>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700">
                          LOW STOCK
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>Stock Level</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                          style={{ width: `${(item.quantity / (item.threshold ?? 5)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-2xl inline-block mb-4">
                  <Package className="text-green-600" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">All Stock Levels Adequate</h3>
                <p className="text-gray-600">No items below minimum threshold</p>
              </div>
            )}
          </div>
        </div>

        {/* Staff Availability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Doctors Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Doctors Available</h3>
                  <p className="text-sm text-green-600">Currently available doctors</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/Doctors")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700 mb-3 px-2">Zayed Branch</p>
                <div className="space-y-3">
                  {zayedDoctors.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Dr</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.specialty}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 mb-3 px-2">Maadi Branch</p>
                <div className="space-y-3">
                  {maadiDoctors.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Dr</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.specialty}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nurses Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Nurses On Shift</h3>
                  <p className="text-sm text-purple-600">Current shift schedule</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/StaffShifts")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nurses.map((n, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between rounded-xl p-4 hover:shadow-lg transition-all duration-300 ${
                    n.status === "On Duty" 
                      ? "bg-gradient-to-r from-green-50 to-white border border-green-100" 
                      : "bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      n.status === "On Duty" 
                        ? "bg-gradient-to-r from-green-500 to-green-600" 
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    }`}>
                      <span className="text-white font-bold text-xs">Ns</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{n.name}</p>
                      <p className="text-xs text-gray-600">Shift: {n.shift}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    n.status === "On Duty" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {n.status}
                  </span>
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