import React, { useState, useRef, useEffect } from "react";
import { Cake, Phone, Mars, Venus, Save, X, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expandedUpcoming, setExpandedUpcoming] = useState(null);
  const [expandedPrevious, setExpandedPrevious] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const genderDropdownRef = useRef(null);
  const [showGenderMenu, setShowGenderMenu] = useState(false);

  const userRole = localStorage.getItem("user_role");

  // Close gender dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
        setShowGenderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch patient & appointments
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const [patientRes, upcomingRes, previousRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/clinic-patient/${id}/`),
          fetch(`http://127.0.0.1:8000/api/appointments/?patient_id=${id}&status=upcoming`),
          fetch(`http://127.0.0.1:8000/api/appointments/?patient_id=${id}&status=previous`),
        ]);

        if (!patientRes.ok) throw new Error("Failed to fetch patient data");

        const patientData = await patientRes.json();
        const upcomingData = upcomingRes.ok ? await upcomingRes.json() : [];
        const previousData = previousRes.ok ? await previousRes.json() : [];

        setPatient(patientData);
        setEditedPatient(patientData);
        setUpcomingAppointments(upcomingData);
        setPreviousAppointments(previousData);
      } catch (err) {
        console.error(err);
        alert("Error fetching patient data or appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "text-green-600";
      case "pending":
      case "in progress":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  // Compare edited vs original to disable Save
  const hasChanges = () => {
    if (!patient || !editedPatient) return false;
    return (
      patient.name !== editedPatient.name ||
      patient.age !== editedPatient.age ||
      patient.gender !== editedPatient.gender ||
      patient.phone !== editedPatient.phone ||
      patient.medical_history !== editedPatient.medical_history ||
      patient.allergies !== editedPatient.allergies
    );
  };

  // Save updates to backend
  const handleSave = async () => {
    try {
      const payload = {
        name: editedPatient.name,
        age: editedPatient.age,
        gender: editedPatient.gender,
        phone: editedPatient.phone,
        medical_history: editedPatient.medical_history,
        allergies: editedPatient.allergies,
      };

      const res = await fetch(`http://127.0.0.1:8000/api/clinic-patient/${patient.patient_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        throw new Error("Failed to update patient data.");
      }

      const updated = await res.json();
      setPatient(updated);
      setEditedPatient(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update patient data.");
    }
  };

  const handleCancel = () => {
    setEditedPatient({ ...patient });
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading patient data...
      </div>
    );
  if (!patient)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        No patient found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => navigate("/patients")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-1.5 rounded-md"
        >
          ← Back to All Patients
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/user.png"
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-200 object-cover"
            />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPatient.name}
                  onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                  className="text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-gray-800">{patient.name}</h2>
              )}

              <p className="text-sm text-gray-500">Patient ID: {patient.patient_id}</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Cake className="w-4 h-4 text-blue-500" />
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPatient.age}
                      onChange={(e) => setEditedPatient({ ...editedPatient, age: e.target.value })}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                    />
                  ) : (
                    `${patient.age} years old`
                  )}
                </span>

                <span className="flex items-center gap-1 relative" ref={genderDropdownRef}>
                  {editedPatient.gender === "Female" ? (
                    <Venus className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Mars className="w-4 h-4 text-blue-500" />
                  )}
                  {isEditing ? (
                    <>
                      <div
                        className="flex items-center bg-white rounded-2xl px-3 py-2 shadow cursor-pointer hover:bg-gray-50 transition ml-1"
                        onClick={() => setShowGenderMenu(!showGenderMenu)}
                      >
                        <span className="text-sm text-gray-700">{editedPatient.gender || "Select Gender"}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                      {showGenderMenu && (
                        <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-2xl shadow z-10">
                          <button
                            onClick={() => {
                              setEditedPatient({ ...editedPatient, gender: "Male" });
                              setShowGenderMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-2xl transition"
                          >
                            Male
                          </button>
                          <button
                            onClick={() => {
                              setEditedPatient({ ...editedPatient, gender: "Female" });
                              setShowGenderMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-2xl transition"
                          >
                            Female
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    editedPatient.gender
                  )}
                </span>

                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPatient.phone}
                      onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    patient.phone
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!hasChanges()}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                  hasChanges() ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              {userRole === "doctor" && (
                <button
                  onClick={() => navigate(`/patients/${id}/medical-record`)}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Medical Record
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
              {userRole === "doctor" && (
                <button
                  onClick={() => navigate(`/patients/${id}/medical-record`)}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Medical Record
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
            {upcomingAppointments.map((appt, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-2 cursor-pointer"
                onClick={() => setExpandedUpcoming(expandedUpcoming === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <span>{appt.date} {appt.time}</span>
                  <span className={`${getStatusColor(appt.status)}`}>{appt.status}</span>
                </div>
                {expandedUpcoming === index && <div className="mt-2 text-sm text-gray-600">{appt.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Previous Appointments */}
        {previousAppointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Previous Appointments</h3>
            {previousAppointments.map((appt, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-2 cursor-pointer"
                onClick={() => setExpandedPrevious(expandedPrevious === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <span>{appt.date} {appt.time}</span>
                  <span className={`${getStatusColor(appt.status)}`}>{appt.status}</span>
                </div>
                {expandedPrevious === index && <div className="mt-2 text-sm text-gray-600">{appt.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patient;
