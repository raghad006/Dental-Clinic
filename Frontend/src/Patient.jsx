import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Cake,
  Phone,
  Mars,
  Venus,
  Save,
  X,
  ChevronDown,
  User,
  CalendarClock,
  Star,
  RotateCcw,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  Stethoscope,
  Award,
  TrendingUp,
  Activity,
  HeartPulse,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expandedUpcoming, setExpandedUpcoming] = useState(null);
  const [expandedPrevious, setExpandedPrevious] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder for data not present in API mock
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);

  const genderDropdownRef = useRef(null);
  const [showGenderMenu, setShowGenderMenu] = useState(false);

  const userRole = localStorage.getItem("user_role");
  const token = localStorage.getItem("access_token");

  /* ---------------- click outside (gender) ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(e.target)
      ) {
        setShowGenderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const authHeaders = {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        };

        // Fetch patient data
        const patientRes = await fetch(`http://127.0.0.1:8000/api/clinic-patient/${id}/`, {
          headers: authHeaders,
        });
        
        if (!patientRes.ok) throw new Error("Failed to fetch patient data");
        const patientData = await patientRes.json();
        setPatient(patientData);
        setEditedPatient(patientData);

        // Fetch all appointments for this patient
        const appointmentsRes = await fetch(
          `http://127.0.0.1:8000/api/appointments/?patient_id=${id}`,
          { headers: authHeaders }
        );
        
        let allAppointments = [];
        if (appointmentsRes.ok) {
          allAppointments = await appointmentsRes.json();
        }

        // Separate upcoming and previous appointments
        const now = new Date();
        const upcoming = [];
        const previous = [];

        allAppointments.forEach(appt => {
          const appointmentDate = new Date(appt.date);
          // Check if appointment is today or in the future
          const isUpcoming = appointmentDate >= now || 
                            (appointmentDate.toDateString() === now.toDateString() && 
                             appt.status !== "Completed");
          
          if (isUpcoming && appt.status !== "Cancelled") {
            upcoming.push(appt);
          } else {
            previous.push(appt);
          }
        });

        // Sort upcoming by date (ascending)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Sort previous by date (descending)
        previous.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingAppointments(upcoming);
        setPreviousAppointments(previous);

      } catch (err) {
        console.error(err);
        alert("Error fetching patient data or appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  /* ---------------- Memoized derived values ---------------- */
  const lastVisit = useMemo(() => {
    if (!previousAppointments.length) return null;
    // Find the most recent completed appointment
    const completedAppointments = previousAppointments.filter(
      appt => appt.status === "Completed"
    );
    
    if (completedAppointments.length > 0) {
      return completedAppointments[0]; // Already sorted by date descending
    }
    
    // If no completed appointments, return the most recent one
    return previousAppointments[0];
  }, [previousAppointments]);

  const totalVisits = useMemo(() => {
    return previousAppointments.filter(appt => 
      appt.status === "Completed" || appt.status === "Checked In"
    ).length;
  }, [previousAppointments]);

  const upcomingCount = useMemo(() => {
    return upcomingAppointments.filter(appt => 
      appt.status !== "Cancelled"
    ).length;
  }, [upcomingAppointments]);

  /* ---------------- helpers ---------------- */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "checked in":
        return "bg-green-100 text-green-700 border border-green-200";
      case "awaiting":
      case "pending":
      case "in progress":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "awaiting":
        return "Awaiting";
      case "checked in":
        return "Checked In";
      case "cancelled":
        return "Cancelled";
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "in progress":
        return "In Progress";
      default:
        return status || "Scheduled";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    // Remove seconds if present
    const time = timeString.split(':').slice(0, 2).join(':');
    return time;
  };

  const formatDateTime = (dateString, timeString) => {
    const formattedDate = formatDate(dateString);
    const formattedTime = formatTime(timeString);
    return `${formattedDate} at ${formattedTime}`;
  };

  const hasChanges = () => {
    if (!patient || !editedPatient) return false;
    return (
      patient.name !== editedPatient.name ||
      patient.age !== editedPatient.age ||
      patient.gender !== editedPatient.gender ||
      patient.phone !== editedPatient.phone
    );
  };

  /* ---------------- actions ---------------- */
  const handleSave = async () => {
    const updatePayload = {
      name: editedPatient.name,
      age: editedPatient.age,
      gender: editedPatient.gender,
      phone: editedPatient.phone,
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/clinic-patient/${patient.patient_id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Update Error:", errorData);
        throw new Error("Update failed with status: " + res.status);
      }

      const updated = await res.json();
      setPatient(updated);
      setEditedPatient(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update patient data. Check console for details.");
    }
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const openModal = (img) => setModalImage(img);
  const closeModal = () => setModalImage(null);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading patient data...</p>
        </div>
      </div>
    );
    
  if (!patient)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
            <User className="text-blue-500" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Not Found</h3>
          <p className="text-gray-600 mb-6">The patient you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/patients")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft size={20} /> Back to Patients
          </button>
        </div>
      </div>
    );

  const current = isEditing ? editedPatient : patient;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to All Patients</span>
          </button>
        </div>

        {/* -------------------- Header -------------------- */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-blue-100">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPatient.name}
                      onChange={(e) =>
                        setEditedPatient({ ...editedPatient, name: e.target.value })
                      }
                      className="text-3xl font-bold text-gray-800 border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-gray-800">
                      {patient.name}
                    </h2>
                  )}
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Patient ID: {patient.patient_id}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  {/* Age */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Cake className="w-4 h-4 text-blue-600" />
                    </div>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedPatient.age}
                        onChange={(e) =>
                          setEditedPatient({
                            ...editedPatient,
                            age: e.target.value,
                          })
                        }
                        className="border-b border-blue-200 focus:border-blue-500 outline-none w-20 text-gray-700 font-medium"
                      />
                    ) : (
                      <span className="font-medium text-gray-700">{patient.age} years old</span>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="flex items-center gap-2" ref={genderDropdownRef}>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {current.gender === "Female" ? (
                        <Venus className="w-4 h-4 text-pink-600" />
                      ) : (
                        <Mars className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    {isEditing ? (
                      <>
                        <div
                          className="flex items-center bg-white rounded-xl px-3 py-1.5 border border-blue-200 shadow-sm cursor-pointer hover:bg-gray-50 transition"
                          onClick={() => setShowGenderMenu(!showGenderMenu)}
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {editedPatient.gender || "Select Gender"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>

                        {showGenderMenu && (
                          <div className="absolute top-full mt-1 left-0 w-32 bg-white rounded-xl shadow-xl border border-blue-200 z-10">
                            {["Male", "Female"].map((g) => (
                              <button
                                key={g}
                                onClick={() => {
                                  setEditedPatient({ ...editedPatient, gender: g });
                                  setShowGenderMenu(false);
                                }}
                                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 transition flex items-center gap-2"
                              >
                                {g === "Female" ? (
                                  <Venus className="w-4 h-4 text-pink-600" />
                                ) : (
                                  <Mars className="w-4 h-4 text-blue-600" />
                                )}
                                {g}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="font-medium text-gray-700">{current.gender}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedPatient.phone}
                        onChange={(e) =>
                          setEditedPatient({
                            ...editedPatient,
                            phone: e.target.value,
                          })
                        }
                        className="border-b border-blue-200 focus:border-blue-500 outline-none text-gray-700 font-medium"
                      />
                    ) : (
                      <span className="font-medium text-gray-700">{patient.phone}</span>
                    )}
                  </div>

                  {/* Last Visit */}
                  {lastVisit && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Activity className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        Last Visit: {formatDate(lastVisit.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap justify-center md:justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      hasChanges()
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold transition-all"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="w-4 h-4" /> Edit Profile
                  </button>
                  {userRole === "doctor" && (
                    <button
                      onClick={() => navigate(`/patients/${id}/medical-record`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FileText className="w-4 h-4" /> Medical Record
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* -------------------- MAIN CONTENT GRID -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Upcoming Appointments - Takes 2/3 width */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Upcoming Appointments</h3>
              {upcomingCount > 0 && (
                <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {upcomingCount} upcoming
                </span>
              )}
            </div>

            <div className="space-y-4">
              {upcomingCount > 0 ? (
                upcomingAppointments.filter(appt => appt.status !== "Cancelled").map((appt) => (
                  <div
                    key={appt.id || `upcoming-${appt.date}-${appt.time}`}
                    className={`bg-white border border-blue-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer ${
                      expandedUpcoming === appt.id ? 'ring-2 ring-blue-200' : ''
                    }`}
                    onClick={() =>
                      setExpandedUpcoming(
                        expandedUpcoming === appt.id ? null : appt.id
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Date Block */}
                        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg w-16 h-16 shadow-lg">
                          <p className="text-xs font-bold">
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              month: "short",
                            }).toUpperCase()}
                          </p>
                          <p className="text-xl font-bold">
                            {new Date(appt.date).getDate()}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-800">
                              {appt.procedure_type || "General Checkup"}
                            </p>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(appt.status)}`}>
                              {getStatusText(appt.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                            with {appt.doctor_name || appt.doctor?.full_display_name || "Doctor"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {formatTime(appt.time)}
                          </p>
                        </div>
                      </div>

                      {/* Details Toggle */}
                      <ChevronDown className={`w-5 h-5 text-blue-500 transition-transform ${
                        expandedUpcoming === appt.id ? 'rotate-180' : ''
                      }`} />
                    </div>

                    {expandedUpcoming === appt.id && (
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Doctor</p>
                            <p className="font-medium text-gray-800">{appt.doctor_name || appt.doctor?.full_display_name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Date & Time</p>
                            <p className="font-medium text-gray-800">{formatDateTime(appt.date, appt.time)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Procedure Type</p>
                            <p className="font-medium text-gray-800">{appt.procedure_type || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Notes</p>
                            <p className="font-medium text-gray-800">{appt.notes || "No notes"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-200">
                  <CalendarClock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-2">No upcoming appointments</p>
                  <p className="text-gray-500 text-sm">No scheduled appointments at the moment</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Sidebar - Takes 1/3 width */}
          <div className="space-y-6">
            {/* Last Visit Card */}
            <div className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-700 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Last Visit</h3>
              </div>
              
              <div className="text-center mb-4">
                {lastVisit ? (
                  <>
                    <p className="text-4xl font-bold mb-2">
                      {new Date(lastVisit.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-blue-300 text-sm">
                      {lastVisit.procedure_type || "General Checkup"}
                    </p>
                    <p className="text-blue-300 text-xs mt-1">
                      with {lastVisit.doctor_name || lastVisit.doctor?.full_display_name || "Doctor"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold mb-2">N/A</p>
                    <p className="text-blue-300 text-sm">No previous visits</p>
                  </>
                )}
              </div>
              
              {lastVisit && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Time</span>
                    <span className="font-semibold">{formatTime(lastVisit.time)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Status</span>
                    <span className="font-semibold">{getStatusText(lastVisit.status)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Stats Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Patient Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Total Visits</span>
                  </div>
                  <span className="font-bold text-blue-600">{totalVisits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Upcoming</span>
                  </div>
                  <span className="font-bold text-green-600">{upcomingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-emerald-500" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    {previousAppointments.filter(appt => appt.status === "Completed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-600">Cancelled</span>
                  </div>
                  <span className="font-bold text-amber-600">
                    {previousAppointments.filter(appt => appt.status === "Cancelled").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Loyalty Points Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Loyalty Points</h3>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-4xl font-bold mb-2 text-amber-600">
                  {loyaltyPoints.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">Total Points</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">This Month</span>
                  <span className="font-semibold text-green-600">+125</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level</span>
                  <span className="font-semibold text-amber-600">Gold Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- Previous Appointments -------------------- */}
        {previousAppointments.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Previous Appointments</h3>
              <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {previousAppointments.length} total
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-blue-800">
                  <div className="col-span-3">Date & Time</div>
                  <div className="col-span-2">Doctor</div>
                  <div className="col-span-3">Treatment</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-blue-50">
                {previousAppointments.map((appt) => (
                  <div
                    key={appt.id || `prev-${appt.date}-${appt.time}`}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-all duration-200 items-center ${
                      expandedPrevious === appt.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() =>
                      setExpandedPrevious(expandedPrevious === appt.id ? null : appt.id)
                    }
                  >
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-800">{formatDate(appt.date)}</span>
                      </div>
                      <div className="text-sm text-blue-600 mt-1">{formatTime(appt.time)}</div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded-lg">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{appt.doctor_name || appt.doctor?.full_display_name || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="font-medium text-gray-800">{appt.procedure_type || "N/A"}</p>
                      <p className="text-sm text-gray-500 truncate">{appt.notes || "No notes"}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status)}`}>
                        {getStatusText(appt.status)}
                      </span>
                    </div>
                    
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (appt.image) {
                              openModal(appt.image);
                            } else {
                              alert("No prescription image available for this appointment.");
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/appointments/${appt.id}`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-all"
                          title="Open Appointment"
                        >
                          <FileText className="w-3.5 h-3.5" /> Open
                        </button>
                      </div>
                    </div>

                    {expandedPrevious === appt.id && (
                      <div className="col-span-12 mt-4 pt-4 border-t border-blue-200">
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <h4 className="font-semibold text-gray-800 mb-3">Appointment Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Doctor</p>
                              <p className="font-medium text-gray-800">{appt.doctor_name || appt.doctor?.full_display_name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Date & Time</p>
                              <p className="font-medium text-gray-800">{formatDateTime(appt.date, appt.time)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Procedure Type</p>
                              <p className="font-medium text-gray-800">{appt.procedure_type || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Status</p>
                              <p className="font-medium text-gray-800">{getStatusText(appt.status)}</p>
                            </div>
                            <div className="col-span-2 md:col-span-4">
                              <p className="text-gray-500 mb-1">Notes</p>
                              <p className="font-medium text-gray-800 bg-blue-50 p-3 rounded-lg">
                                {appt.notes || "No notes available."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing prescription/image */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="font-bold text-gray-800">Prescription / Record</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = modalImage;
                      link.download = `prescription-${new Date().toISOString().split('T')[0]}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-auto">
                <img
                  src={modalImage}
                  alt="Prescription"
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patient;