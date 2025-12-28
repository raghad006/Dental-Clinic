import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  Search,
  CalendarClock,
  Plus,
  FileText,
  Save,
  X,
  CalendarDays,
  Stethoscope,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import CalendarDropdown from "./components/CalendarDropdown";
import PaginatedTable from "./components/PaginatedTable";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.warn("No access token found, redirecting to login");
    window.location.href = "/login";
    return {};
  }
  
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const authFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  if (Object.keys(headers).length === 0) {
    return null;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    console.warn("Token expired or invalid, redirecting to login");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_first_name");
    localStorage.removeItem("user_last_name");
    window.location.href = "/login";
    return null;
  }

  return response;
};

const statusOptions = ["Awaiting", "Checked In", "Cancelled"];
const statusColors = {
  Awaiting: "bg-blue-100 text-blue-700 border border-blue-200",
  "Checked In": "bg-gradient-to-r from-green-500 to-green-600 text-white",
  Cancelled: "bg-gradient-to-r from-red-500 to-red-600 text-white",
};

const getStatusIcon = (status) => {
  const iconClass = "w-[18px] h-[18px] flex-shrink-0";
  switch (status) {
    case "Checked In":
      return <CheckCircle className={iconClass} />;
    case "Cancelled":
      return <XCircle className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    () => Number(localStorage.getItem("appointmentsPage")) || 1
  );
  const [selectedDate, setSelectedDate] = useState(
    () => localStorage.getItem("appointmentsDate") || new Date().toISOString().split("T")[0]
  );
  const [openStatusDropdownIndex, setOpenStatusDropdownIndex] = useState(null);
  const [openDoctorDropdown, setOpenDoctorDropdown] = useState(false);
  const [openHeaderStatusDropdown, setOpenHeaderStatusDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const dropdownRef = useRef(null);
  const itemsPerPage = 8;
  const userRole = localStorage.getItem("user_role");

  useEffect(() => localStorage.setItem("appointmentsPage", currentPage), [currentPage]);
  useEffect(() => localStorage.setItem("appointmentsDate", selectedDate), [selectedDate]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const fetchDoctors = async () => {
        try {
          const res = await authFetch(`${API_BASE_URL}/staff/`);
          if (!res) return;
          const data = await res.json();
          setDoctorOptions(data);
        } catch (err) {
          console.error("Failed to fetch doctors:", err);
        }
      };

      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const res = await authFetch(`${API_BASE_URL}/appointments/`);
          if (!res) return;
          if (!res.ok) throw new Error("Failed to fetch appointments");
          const data = await res.json();
          setAppointments(data);
        } catch (err) {
          console.error(err);
          setErrorMessage("Failed to load appointments. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      await fetchDoctors();
      await fetchAppointments();
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenStatusDropdownIndex(null);
        setOpenDoctorDropdown(false);
        setOpenHeaderStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedDoctorOptions = useMemo(() => {
    return [...doctorOptions].sort((a, b) => 
      a.full_display_name.localeCompare(b.full_display_name)
    );
  }, [doctorOptions]);

  const updateStatus = async (globalIndex, newStatus) => {
    const appt = appointments[globalIndex];
    try {
      const res = await authFetch(`${API_BASE_URL}/appointments/${appt.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res) return;
      if (!res.ok) throw new Error("Failed to update status");
      const updatedAppt = await res.json();

      const updated = [...appointments];
      updated[globalIndex] = {
        ...updated[globalIndex],
        status: updatedAppt.status,
      };
      setAppointments(updated);
      setOpenStatusDropdownIndex(null);
      setSuccessMessage(`Appointment status updated to ${newStatus} successfully!`);
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update status on server");
    }
  };
  const formatDate = (date) => {
  if (!date) return null;
  return typeof date === "string" ? date.split("T")[0] : date.toISOString().split("T")[0];
};


  const appointmentsForSelectedDate = useMemo(() => {
  if (!appointments.length) return [];
  const selected = formatDate(selectedDate);
  return appointments.filter(appt => formatDate(appt.date) === selected);
}, [appointments, selectedDate]);


  const filteredAppointments = useMemo(() => {
  if (!appointments.length) return [];

  const selected = new Date(selectedDate).toISOString().split("T")[0]; // normalize selected date

  return appointments.filter((appt) => {
    // normalize appt date
    const apptDate = new Date(appt.date).toISOString().split("T")[0];
    if (apptDate !== selected) return false;

    // search filter
    if (search && appt.patient_display && !appt.patient_display.toLowerCase().includes(search.toLowerCase())) return false;

    // doctor filter (convert both to number)
    if (filterDoctor && Number(appt.doctor) !== Number(filterDoctor)) return false;

    // status filter
    if (filterStatus && appt.status?.trim() !== filterStatus) return false;

    return true;
  });
}, [appointments, selectedDate, filterStatus, filterDoctor, search]);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveNote = async (index) => {
    const appt = appointments[index];
    try {
      const res = await authFetch(`${API_BASE_URL}/appointments/${appt.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ notes: noteText }),
      });
      if (!res) return;
      if (!res.ok) throw new Error("Failed to save note");
      const updatedAppt = await res.json();

      const updated = [...appointments];
      updated[index] = {
        ...updated[index],
        notes: updatedAppt.notes,
      };
      setAppointments(updated);
      setEditingNoteIndex(null);
      setNoteText("");
      setSuccessMessage("Note saved successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to save note on server");
    }
  };

  const handleReschedule = (appointment) => {
    navigate("/appointments/add", { 
      state: { 
        isReschedule: true, 
        appointmentData: appointment 
      } 
    });
  };

  const handleStartExamination = (appointment) => {
    navigate(`/examination/${appointment.id}`, {
      state: {
        patientId: appointment.patient,
        appointmentId: appointment.id,
        patientName: appointment.patient_display,
        doctorName: appointment.doctor_display
      }
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/appointments/`);
      if (!res) return;
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
      setSuccessMessage("Appointments refreshed successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to refresh appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterStatus(null);
    setFilterDoctor(null);
    setSearch("");
    setCurrentPage(1);
    setSuccessMessage("All filters cleared!");
    
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const renderActions = (appt, index, globalIndex) => {
    if (userRole === "nurse" && appt.status === "Checked In") {
      return <span className="text-xs text-gray-400">No actions</span>;
    }

    if (userRole === "doctor" && appt.status === "Checked In") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleStartExamination(appt)}
            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-xs font-medium transition-all"
          >
            <Stethoscope size={14} /> Start Exam
          </button>
          
          {editingNoteIndex === index ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-2 border border-blue-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                placeholder="Add notes..."
                rows="2"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => handleSaveNote(globalIndex)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <Save size={12} /> Save
                </button>
                <button
                  onClick={() => setEditingNoteIndex(null)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-all"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingNoteIndex(index);
                setNoteText(appt.notes || "");
              }}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all"
            >
              <FileText size={14} /> Notes
            </button>
          )}
        </div>
      );
    }

    if (appt.status === "Checked In") {
      return editingNoteIndex === index ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-2 border border-blue-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
            placeholder="Add notes..."
            rows="2"
          />
          <div className="flex gap-1">
            <button
              onClick={() => handleSaveNote(globalIndex)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all"
            >
              <Save size={12} /> Save
            </button>
            <button
              onClick={() => setEditingNoteIndex(null)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-all"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setEditingNoteIndex(index);
            setNoteText(appt.notes || "");
          }}
          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-medium transition-all"
        >
          <FileText size={14} /> Add Notes
        </button>
      );
    }

    return (
      <button
        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all"
        onClick={() => handleReschedule(appt)}
      >
        <CalendarClock size={14} /> Reschedule
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <CalendarDays className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Appointments
                </h1>
                <p className="text-blue-600 mt-1">
                  Manage and track all patient appointments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/appointments/add")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={20} /> New Appointment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Today</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {appointmentsForSelectedDate.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CalendarDays className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Awaiting</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {appointmentsForSelectedDate.filter(a => a.status === "Awaiting").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Checked In</p>
                  <p className="text-2xl font-bold text-green-600">
                    {appointmentsForSelectedDate.filter(a => a.status === "Checked In").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">
                    {appointmentsForSelectedDate.filter(a => a.status === "Cancelled").length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
            </div>
            <CalendarDropdown
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1); 
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Search className="inline mr-2" size={16} />
                Search Patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type patient name..."
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 pl-10 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Search className="absolute left-3 top-2.5 text-blue-400" size={16} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Stethoscope className="inline mr-2" size={16} />
                Filter by Doctor
              </label>
              <div className="relative">
                <button
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                  onClick={() => {
                    setOpenDoctorDropdown(!openDoctorDropdown);
                    setOpenHeaderStatusDropdown(false);
                  }}
                >
                  <span className="text-gray-700 truncate">
                    {filterDoctor 
                      ? sortedDoctorOptions.find(d => d.id.toString() === filterDoctor)?.full_display_name || "Selected Doctor"
                      : "All Doctors"
                    }
                  </span>
                  <ChevronDown className="text-blue-500 flex-shrink-0" size={16} />
                </button>

                {openDoctorDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-48 overflow-y-auto">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm"
                      onClick={() => {
                        setFilterDoctor(null);
                        setOpenDoctorDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="font-medium text-blue-600">All Doctors</span>
                    </button>
                    {sortedDoctorOptions.map((doc) => (
                      <button
                        key={doc.id}
                        className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm"
                        onClick={() => {
                          setFilterDoctor(doc.id.toString());
                          setOpenDoctorDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        {doc.full_display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Filter className="inline mr-2" size={16} />
                Filter by Status
              </label>
              <div className="relative">
                <button
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                  onClick={() => {
                    setOpenHeaderStatusDropdown(!openHeaderStatusDropdown);
                    setOpenDoctorDropdown(false);
                  }}
                >
                  <span className="text-gray-700 truncate">
                    {filterStatus || "All Status"}
                  </span>
                  <ChevronDown className="text-blue-500 flex-shrink-0" size={16} />
                </button>

                {openHeaderStatusDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm"
                      onClick={() => {
                        setFilterStatus(null);
                        setOpenHeaderStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="font-medium text-blue-600">All Status</span>
                    </button>
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        className={`block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm flex items-center gap-2 ${
                          s === filterStatus ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          setFilterStatus(s);
                          setOpenHeaderStatusDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${s === "Awaiting" ? "bg-blue-500" : s === "Checked In" ? "bg-green-500" : "bg-red-500"}`}></div>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                Quick Actions
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1"
                >
                  <X size={14} /> Clear All
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-blue-100">
            {loading && !filteredAppointments.length ? (
              <div className="p-12 text-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600">Loading appointments...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-blue-800">
                    <div className="col-span-2">Time</div>
                    <div className="col-span-3">Patient</div>
                    <div className="col-span-3">Doctor</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-blue-50" ref={dropdownRef}>
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map((appt, index) => {
                      const globalIndex = appointments.findIndex(
                        (a) => a.id === appt.id
                      );
                      const isLastFewItems = index >= paginatedAppointments.length - 2;
                      
                      return (
                        <div
                          key={appt.id}
                          className="grid grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-all duration-200 items-center text-sm"
                        >
                          <div className="col-span-2">
                            <div className="font-bold text-gray-800">{appt.time}</div>
                            <div className="text-xs text-blue-600">
                              {appt.date ? (typeof appt.date === 'string' ? appt.date.split('T')[0] : appt.date) : ''}
                            </div>
                          </div>
                          
                          <div className="col-span-3">
                            <div className="font-medium text-gray-800">{appt.patient_display}</div>
                            {appt.phone_number && (
                              <div className="text-xs text-blue-600">{appt.phone_number}</div>
                            )}
                          </div>
                          
                          <div className="col-span-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-100 rounded-lg">
                                <Stethoscope className="text-blue-600" size={14} />
                              </div>
                              <span className="font-medium text-gray-800">{appt.doctor_display}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-2 relative">
                            <button
                              onClick={() =>
                                setOpenStatusDropdownIndex(
                                  openStatusDropdownIndex === index ? null : index
                                )
                              }
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${statusColors[appt.status]}`}
                            >
                              {getStatusIcon(appt.status)} 
                              {appt.status}
                              <ChevronDown size={14} />
                            </button>

                            {openStatusDropdownIndex === index && (
                              <div 
                                className={`absolute z-30 bg-white rounded-lg shadow-xl border border-blue-200 w-40 ${
                                  isLastFewItems 
                                    ? "bottom-full mb-1"
                                    : "top-full mt-1"
                                }`}
                              >
                                <div className="p-1">
                                  <div className="text-xs text-gray-500 px-2 py-1.5">Change Status</div>
                                  {statusOptions
                                    .filter(s => s !== appt.status)
                                    .map((s) => (
                                      <button
                                        key={s}
                                        className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-xs flex items-center gap-2 transition-all"
                                        onClick={() => updateStatus(globalIndex, s)}
                                      >
                                        <div className={`w-2 h-2 rounded-full ${s === "Awaiting" ? "bg-blue-500" : s === "Checked In" ? "bg-green-500" : "bg-red-500"}`}></div>
                                        {s}
                                      </button>
                                    ))}
                                  <div className="border-t border-blue-100 mt-1 pt-1">
                                    <button
                                      className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-xs text-gray-500"
                                      onClick={() => setOpenStatusDropdownIndex(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-span-2">
                            {renderActions(appt, index, globalIndex)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl inline-block mb-4">
                        <AlertCircle className="text-blue-500" size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
                      <p className="text-gray-600 mb-6">
                        {filterStatus || filterDoctor || search 
                          ? "Try changing your filters or search term"
                          : "No appointments scheduled for this date"}
                      </p>
                      {!filterStatus && !filterDoctor && !search && (
                        <button
                          onClick={() => navigate("/appointments/add")}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus size={20} /> Schedule First Appointment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {filteredAppointments.length > 0 && (
            <PaginatedTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAppointments.length}
            />
          )}

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between text-xs text-blue-800">
              <div>
                <span className="font-semibold">{filteredAppointments.length}</span> appointments found
                {filterDoctor && ` for Dr. ${sortedDoctorOptions.find(d => d.id.toString() === filterDoctor)?.full_display_name}`}
                {filterStatus && ` with status: ${filterStatus}`}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Awaiting</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Checked In</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;