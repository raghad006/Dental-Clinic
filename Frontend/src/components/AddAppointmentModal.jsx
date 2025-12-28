import React, { useState, useEffect } from "react";
import { CalendarPlus, ArrowLeft, User, Clock, Stethoscope, FileText, Phone, Check, X } from "lucide-react";
import CalendarDropdown from "./CalendarDropdown";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation

const API_BASE_URL = "http://127.0.0.1:8000/api";

const AddAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added to get query parameters
  
  // Get patient_id from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get('patient_id');

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState(patientIdFromUrl || "");
  const [procedureType, setProcedureType] = useState("");
  const [notes, setNotes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [fetchingTimeSlots, setFetchingTimeSlots] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null); // Added to store patient info
  const today = new Date();

  const procedureOptions = [
    "Teeth Cleaning", "Filling", "Implant", "Consultation", 
    "Root Canal Treatment", "Checkup", "Veneers", "Ortho Consult", 
    "Braces Adj.", "Surgery"
  ];

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/`);
        const data = await res.json();
        setDoctorOptions(data);
        if (data.length > 0) setDoctorId(data[0].id);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/clinic-patients/`);
        const data = await res.json();
        setPatientOptions(data);
        setFilteredPatients(data);
        
        // If patient_id is provided in URL, auto-select that patient
        if (patientIdFromUrl) {
          const patient = data.find(p => p.patient_id === patientIdFromUrl);
          if (patient) {
            selectPatient(patient);
          }
        }
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, [patientIdFromUrl]); // Added dependency
  const isTodaySelected = () => {
  if (!date) return false;
  const today = new Date();
  const selected = new Date(date);
  return (
    today.getFullYear() === selected.getFullYear() &&
    today.getMonth() === selected.getMonth() &&
    today.getDate() === selected.getDate()
  );
};

  /* ================= FALLBACK: FETCH FROM APPOINTMENTS ENDPOINT ================= */
  const fetchTimeSlotsFromAlternativeEndpoint = async (doctorId, date) => {
    try {
      console.log("🔄 Trying alternative endpoint: /appointments/available_time_slots/");
      const res = await fetch(
        `${API_BASE_URL}/appointments/available_time_slots/?doctor_id=${doctorId}&date=${date}`
      );
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Alternative endpoint returned:", data);
        setAvailableTimeSlots(data.available_time_slots || []);
      } else {
        console.error("❌ Both endpoints failed");
        setAvailableTimeSlots([]);
      }
    } catch (err) {
      console.error("❌ Alternative endpoint also failed:", err);
      setAvailableTimeSlots([]);
    }
  };

  /* ================= FETCH AVAILABLE TIME SLOTS FROM BACKEND ================= */
  const fetchAvailableTimeSlots = async (doctorId, date) => {
    if (!doctorId || !date) {
      setAvailableTimeSlots([]);
      return;
    }
    
    setFetchingTimeSlots(true);
    try {
      // Try the primary endpoint first
      const res = await fetch(
        `${API_BASE_URL}/time-slots/available/?doctor_id=${doctorId}&date=${date}`
      );
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Backend returned available slots:", data);
        setAvailableTimeSlots(data.available_time_slots || []);
      } else if (res.status === 404) {
        // Endpoint not found - fallback to appointments endpoint
        console.warn("⚠️ /time-slots/available endpoint not found, trying alternative...");
        await fetchTimeSlotsFromAlternativeEndpoint(doctorId, date);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Failed to fetch available time slots:", errorData);
        setAvailableTimeSlots([]);
      }
    } catch (err) {
      console.error("❌ Error fetching time slots:", err);
      // Try alternative endpoint
      await fetchTimeSlotsFromAlternativeEndpoint(doctorId, date);
    } finally {
      setFetchingTimeSlots(false);
    }
  };

  /* ================= FETCH TIME SLOTS WHEN DOCTOR OR DATE CHANGES ================= */
  useEffect(() => {
    if (doctorId && date) {
      fetchAvailableTimeSlots(doctorId, date);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [doctorId, date]);

  /* ================= FALLBACK TIME SLOT CHECK ================= */
  const checkTimeSlotFallback = async (doctorId, date, time) => {
    try {
      // First check if time is in available slots
      const available = availableTimeSlots.includes(time);
      if (!available) return false;
      
      // Additional check using appointments endpoint
      const res = await fetch(`${API_BASE_URL}/appointments/check_time_slot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          date: date,
          time: time
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        return data.is_available;
      }
      return available; // Return basic check result
    } catch (err) {
      console.error("Fallback check failed:", err);
      return false;
    }
  };


  /* ================= CHECK SPECIFIC TIME SLOT AVAILABILITY ================= */
  const checkTimeSlotAvailability = async (doctorId, date, time) => {
    if (!doctorId || !date || !time) {
      return false;
    }

    // First try the /time-slots/check/ endpoint
    try {
      const res = await fetch(`${API_BASE_URL}/time-slots/check/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          date: date,
          time: time
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("🔍 Time slot check result:", data);
        return data.is_available;
      } else if (res.status === 404) {
        // Fallback: Use the appointments endpoint
        console.warn("⚠️ /time-slots/check endpoint not found, using fallback check");
        return await checkTimeSlotFallback(doctorId, date, time);
      }
      return false;
    } catch (err) {
      console.error("Error checking time slot, trying fallback:", err);
      return await checkTimeSlotFallback(doctorId, date, time);
    }
  };

  /* ================= PATIENT SEARCH ================= */
  useEffect(() => {
    if (!patientSearch) {
      setFilteredPatients(patientOptions);
    } else {
      setFilteredPatients(
        patientOptions.filter(p =>
          typeof p.name === "string" &&
          p.name.toLowerCase().includes(patientSearch.toLowerCase())
        )
      );
    }
  }, [patientSearch, patientOptions]);

  const selectPatient = (patient) => {
    setPatientId(patient.patient_id);
    setPatientSearch(patient.name);
    setPhoneNumber(patient.phone || "");
    setSelectedPatientInfo(patient); // Store patient info
    setShowPatientDropdown(false);
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = async () => {
    if (!date || !time || !doctorId || !patientId || !procedureType) {
      alert("Please fill all required fields");
      return false;
    }

    // Check if time is available using backend API
    const isAvailable = await checkTimeSlotAvailability(doctorId, date, time);
    if (!isAvailable) {
      alert("This time slot is no longer available. Please choose another time.");
      return false;
    }

    return true;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!date || !time || !doctorId || !patientId || !procedureType) {
      alert("Please fill all required fields");
      return;
    }

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    const formattedTime = time + ":00";
    const appointmentData = {
      patient_identifier: patientId,
      doctor_id: parseInt(doctorId),
      date: date,
      time: formattedTime,
      procedure_type: procedureType,
      notes: notes || "",
      status: "Awaiting",
      phone_number: phoneNumber || "",
    };

    console.log("📤 Sending appointment data:", appointmentData);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const responseText = await res.text();
      console.log("📥 Response status:", res.status);
      console.log("📥 Response body:", responseText);
      
      if (!res.ok) {
        let errorMessage = `Server error: ${res.status}`;
        try {
          const errorData = JSON.parse(responseText);
          console.error("❌ Backend validation errors:", errorData);
          
          if (errorData.errors) {
            errorMessage = Object.entries(errorData.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join('\n');
          }
        } catch (e) {
          console.error("❌ Failed to parse error response:", e);
          errorMessage = responseText || "No error details from server";
        }
        
        alert(`Failed to save appointment:\n${errorMessage}`);
        setLoading(false);
        return;
      }

      // Success
      try {
        const responseData = JSON.parse(responseText);
        console.log("✅ Appointment created:", responseData);
        alert("Appointment scheduled successfully!");
        navigate("/appointments");
      } catch (e) {
        console.error("⚠️ Could not parse success response:", e);
        alert("Appointment scheduled successfully!");
        navigate("/appointments");
      }
      
    } catch (err) {
      console.error("🌐 Network error:", err);
      alert("Failed to connect to server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctorOptions.find(d => d.id === parseInt(doctorId));
  const now = new Date();

  const displayedTimeSlots = availableTimeSlots.filter(t => {
  if (!isTodaySelected()) return true; // show all for future dates

  const [hours, minutes] = t.split(":").map(Number);
  const slotTime = new Date(date);
  slotTime.setHours(hours, minutes, 0, 0);

  return slotTime > now; // only future times
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Appointments</span>
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <CalendarPlus className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Schedule New Appointment
              </h1>
              <p className="text-blue-600 mt-1">
                {selectedPatientInfo 
                  ? `Creating appointment for ${selectedPatientInfo.name}`
                  : "Create a new dental appointment for your patient"}
              </p>
              {patientIdFromUrl && !selectedPatientInfo && (
                <p className="text-amber-600 text-sm mt-1">
                  Loading patient information...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* PATIENT SECTION */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Patient Information</h2>
                  {patientIdFromUrl && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      Pre-filled from Patients
                    </span>
                  )}
                </div>
                
                {selectedPatientInfo ? (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-emerald-800 text-lg">{selectedPatientInfo.name}</div>
                        <div className="text-sm text-emerald-600 flex items-center gap-4 mt-1">
                          <span>ID: {selectedPatientInfo.patient_id}</span>
                          <span>Age: {selectedPatientInfo.age}</span>
                          <span>Gender: {selectedPatientInfo.gender}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPatientId("");
                          setPatientSearch("");
                          setSelectedPatientInfo(null);
                          setPhoneNumber("");
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                      >
                        Change Patient
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Search Patient
                    </label>
                    <div className="relative">
                      <input
                        value={patientSearch}
                        onChange={(e) => {
                          setPatientSearch(e.target.value);
                          setShowPatientDropdown(true);
                        }}
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm transition-all"
                        placeholder="Type patient name or select from records..."
                      />
                      <User className="absolute right-4 top-3.5 text-blue-400" size={20} />
                    </div>
                    
                    {showPatientDropdown && filteredPatients.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl border border-blue-200 max-h-64 overflow-y-auto">
                        {filteredPatients.map(p => (
                          <button
                            key={p.patient_id}
                            className="block w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-blue-100 last:border-b-0 transition-all group"
                            onClick={() => selectPatient(p)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-800 group-hover:text-blue-700">{p.name}</div>
                                <div className="text-sm text-blue-600">ID: {p.patient_id} • Age: {p.age} • {p.gender}</div>
                              </div>
                              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Select
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedPatientInfo && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300 flex items-center gap-3">
                    <Check className="text-blue-600" size={20} />
                    <div>
                      <div className="font-semibold text-blue-800">Patient Selected</div>
                      <div className="text-blue-700">{selectedPatientInfo.name} (ID: {selectedPatientInfo.patient_id})</div>
                    </div>
                  </div>
                )}
              </div>

              {/* APPOINTMENT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DOCTOR SELECTION */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Stethoscope className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Select Doctor</h3>
                  </div>
                  <select
                    value={doctorId}
                    onChange={(e) => {
                      setDoctorId(e.target.value);
                      setTime(""); // Reset time when doctor changes
                    }}
                    className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                  >
                    <option value="" className="text-gray-400">Choose a doctor...</option>
                    {doctorOptions.map(d => (
                      <option key={d.id} value={d.id} className="py-2">
                        {d.full_display_name}
                      </option>
                    ))}
                  </select>
                  {selectedDoctor && (
                    <div className="mt-3 text-sm text-blue-600">
                      {selectedDoctor.role === 'doctor' ? 'Doctor' : 'Nurse'} - Available for appointments
                    </div>
                  )}
                </div>

                {/* DATE SELECTION */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarPlus className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Appointment Date</h3>
                  </div>


<CalendarDropdown
  selectedDate={date}
  onDateChange={setDate}
  minDate={today} // prevents past dates
/>
                  <div className="text-sm text-blue-600 mt-2">
                    {date ? `Selected: ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : "Choose a date"}
                  </div>
                </div>

                {/* TIME SLOTS */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Available Time Slots</h3>
                  </div>
                  {doctorId && date ? (
                    <>
                      {fetchingTimeSlots ? (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2 text-blue-600">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading available time slots...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-4 gap-3">
                            {displayedTimeSlots.map(t => (
  <button
    key={t}
    onClick={() => setTime(t)}
    className={`py-3 rounded-lg border-2 transition-all ${time === t 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-md' 
      : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
    }`}
  >
    {t}
  </button>
))}

                          </div>
{displayedTimeSlots.length === 0 && (
  <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-2 text-red-700">
      <X size={20} />
      <p className="text-sm">
        No available future time slots for {selectedDoctor?.full_display_name} on this date.
      </p>
    </div>
  </div>
)}

                          {availableTimeSlots.length > 0 && (
                            <div className="mt-3 text-sm text-blue-600">
                              {availableTimeSlots.length} slots available for {selectedDoctor?.full_display_name}
                            </div>
                          )}
                        </>
                      )}
                    </>
                    ) : (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-600 text-center">
                        Please select a doctor and date to see available time slots
                      </p>
                    </div>
                  )}
                </div>

                {/* PROCEDURE TYPE */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Procedure Type</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {procedureOptions.map(proc => (
                      <button
                        key={proc}
                        type="button"
                        onClick={() => setProcedureType(proc)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${procedureType === proc 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-sm font-semibold' 
                          : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <span className="text-sm">{proc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* NOTES & PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    <FileText className="inline mr-2" size={18} />
                    Notes & Comments
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white min-h-[120px] transition-all"
                    placeholder="Special instructions, paperwork requirements, or patient notes..."
                  />
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    <Phone className="inline mr-2" size={18} />
                    Contact Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                    placeholder="+1 (555) 789-0123"
                  />
                  {selectedPatientInfo && selectedPatientInfo.phone && (
                    <p className="text-sm text-blue-600 mt-2">
                      Patient's registered phone: {selectedPatientInfo.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* APPOINTMENT SUMMARY */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Check size={24} />
                  Appointment Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-700 pb-3">
                    <span className="text-blue-300">Date</span>
                    <span className="font-semibold">{date || "Not set"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-blue-700 pb-3">
                    <span className="text-blue-300">Time</span>
                    <span className="font-semibold bg-blue-700 px-3 py-1 rounded-full">
                      {time || "Not set"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-blue-700 pb-3">
                    <span className="text-blue-300">Doctor</span>
                    <span className="font-semibold text-right">
                      {selectedDoctor?.full_display_name || "Not selected"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-blue-700 pb-3">
                    <span className="text-blue-300">Patient</span>
                    <span className="font-semibold">{selectedPatientInfo?.name || "Not selected"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-blue-700 pb-3">
                    <span className="text-blue-300">Procedure</span>
                    <span className="font-semibold bg-blue-600 px-3 py-1 rounded-full">
                      {procedureType || "Not selected"}
                    </span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-blue-300 text-sm mb-1">Estimated Duration</div>
                    <div className="font-bold text-lg">
                      {procedureType ? "45-60 minutes" : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* AVAILABILITY STATUS */}
              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3">Availability Status</h4>
                <div className="space-y-3">
                  {doctorId && date ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Selected Doctor</span>
                        <span className="font-semibold text-blue-700">{selectedDoctor?.full_display_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Available Slots</span>
                        <span className={`font-bold ${availableTimeSlots.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {fetchingTimeSlots ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              Loading...
                            </span>
                          ) : (
                            availableTimeSlots.length
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Selected Time</span>
                        <span className={`font-semibold ${time ? 'text-blue-700' : 'text-gray-400'}`}>
                          {time || "Not selected"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Booked time slots are automatically removed from the list
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Select a doctor and date to see availability
                    </p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading || !date || !time || !doctorId || !patientId || !procedureType || fetchingTimeSlots}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CalendarPlus size={20} />
                        Schedule Appointment
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full border-2 border-blue-200 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>All fields are required to schedule an appointment</p>
                  {patientIdFromUrl && (
                    <p className="text-emerald-600 mt-1">
                      ✓ Patient pre-selected from patient list
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentPage;