import React, { useState, useRef, useEffect } from "react";
import {
  Cake,
  Phone,
  Mars,
  Venus,
  CalendarClock,
  Star,
  RotateCcw,
  Save,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedUpcoming, setExpandedUpcoming] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [patient, setPatient] = useState({
    name: "Mohamed Mohamed",
    id: id || "PAT73281",
    age: 25,
    gender: "Male",
    contact: "(+20) 0102 1234567",
    loyaltyPoints: 1250,
  });

  const [editedPatient, setEditedPatient] = useState({ ...patient });

  const genderDropdownRef = useRef(null);
  const [showGenderMenu, setShowGenderMenu] = useState(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
        setShowGenderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingAppointments = [
    {
      month: "OCT",
      day: "28",
      time: "Tuesday, 02:30 PM",
      type: "Routine Check-up & Cleaning",
      doctor: "Dr. Eleanor Vance",
      paymentType: "Cash",
      paymentStatus: "Pending",
      status: "In Progress",
      location: "Zayed Branch",
    },
    {
      month: "NOV",
      day: "15",
      time: "Friday, 10:00 AM",
      type: "Wisdom Tooth Consultation",
      doctor: "Dr. Benjamin Carter",
      paymentType: "Instapay",
      paymentStatus: "Completed",
      status: "Confirmed",
      location: "Zayed Branch",
    },
    {
      month: "DEC",
      day: "05",
      time: "Thursday, 04:00 PM",
      type: "Root Canal Follow-up",
      doctor: "Dr. Olivia Chen",
      paymentType: "Credit Card",
      paymentStatus: "Cancelled",
      status: "Cancelled",
      location: "Downtown Branch",
    },
  ];

  const previousAppointments = [
    {
      date: "2025-05-10",
      doctor: "Dr. Eleanor Vance",
      treatment: "Annual Check-up",
      notes: "Patient in good health. Recommended next check-up in 6 months.",
    },
    {
      date: "2024-12-22",
      doctor: "Dr. Olivia Chen",
      treatment: "Toothache (Filling)",
      notes:
        "Cavity filled successfully. Advised to avoid sugary food for a week.",
    },
    {
      date: "2024-02-05",
      doctor: "Dr. Benjamin Carter",
      treatment: "Initial Consultation",
      notes: "Initial assessment complete. Follow-up scheduled after 3 months.",
    },
  ];

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

  const handleSave = () => {
    setPatient({ ...editedPatient });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient({ ...patient });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/patients")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-1.5 rounded-md"
        >
          ← Back to All Patients
        </button>

        {/* -------------------- Header -------------------- */}
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
                  onChange={(e) =>
                    setEditedPatient({ ...editedPatient, name: e.target.value })
                  }
                  className="text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-gray-800">
                  {patient.name}
                </h2>
              )}

              <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Cake className="w-4 h-4 text-blue-500" />{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPatient.age}
                      onChange={(e) =>
                        setEditedPatient({ ...editedPatient, age: e.target.value })
                      }
                      className="border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                    />
                  ) : (
                    `${patient.age} years old`
                  )}
                </span>

                {/* Gender Dropdown */}
                <span className="flex items-center gap-1 relative" ref={genderDropdownRef}>
                  {editedPatient.gender === "Female" ? (
                    <Venus className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Mars className="w-4 h-4 text-blue-500" />
                  )}

                  {isEditing ? (
                    <>
                      <div
                        className="flex items-center bg-white rounded-2xl px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-gray-50 transition ml-1"
                        onClick={() => setShowGenderMenu(!showGenderMenu)}
                      >
                        <span className="text-sm text-gray-700">
                          {editedPatient.gender || "Select Gender"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>

                      {showGenderMenu && (
                        <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
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
                      value={editedPatient.contact}
                      onChange={(e) =>
                        setEditedPatient({
                          ...editedPatient,
                          contact: e.target.value,
                        })
                      }
                      className="border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    patient.contact
                  )}
                </span>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* -------------------- Upcoming + Loyalty Points -------------------- */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">
                Upcoming Appointments
              </h3>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((appt, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-100 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() =>
                    setExpandedUpcoming(
                      expandedUpcoming === index ? null : index
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center border border-blue-500 bg-white text-center rounded-md w-16 h-16 shadow-sm">
                        <p className="text-xs font-bold text-blue-600">
                          {appt.month}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {appt.day}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {appt.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          with {appt.doctor}
                        </p>
                        <p className="text-sm text-gray-500">{appt.time}</p>
                      </div>
                    </div>

                    <p className="text-blue-600 text-sm font-medium hover:underline">
                      {expandedUpcoming === index
                        ? "Hide Details"
                        : "View Details"}
                    </p>
                  </div>

                  {expandedUpcoming === index && (
                    <div className="mt-4 bg-white border border-blue-100 rounded-lg p-4 text-sm text-gray-700">
                      <p>
                        <strong>Doctor:</strong> {appt.doctor}
                      </p>
                      <p>
                        <strong>Location:</strong> {appt.location}
                      </p>
                      <p>
                        <strong>Payment Type:</strong> {appt.paymentType}
                      </p>
                      <p>
                        <strong>Payment Status:</strong>{" "}
                        <span className={getStatusColor(appt.paymentStatus)}>
                          {appt.paymentStatus}
                        </span>
                      </p>
                      <p>
                        <strong>Appointment Status:</strong>{" "}
                        <span className={getStatusColor(appt.status)}>
                          {appt.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-800">Loyalty Points</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center border border-blue-100">
              <p className="text-blue-600 text-4xl font-bold">
                {patient.loyaltyPoints.toLocaleString()}
              </p>
              <p className="text-gray-500 mt-1 text-sm">Loyalty Points</p>
            </div>
          </div>
        </div>

        {/* -------------------- Previous Appointments -------------------- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">
              Previous Appointments
            </h3>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600 font-medium">DATE</th>
                <th className="py-2 text-gray-600 font-medium">DOCTOR</th>
                <th className="py-2 text-gray-600 font-medium">TREATMENT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {previousAppointments.map((appt, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="border-b last:border-none hover:bg-gray-50 transition"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    <td className="py-3 text-gray-700">{appt.date}</td>
                    <td className="py-3 text-gray-700">{appt.doctor}</td>
                    <td className="py-3 text-gray-700">{appt.treatment}</td>
                    <td className="py-3 text-blue-600 font-medium hover:underline cursor-pointer">
                      {expandedIndex === index ? "Hide Notes" : "View Notes"}
                    </td>
                  </tr>

                  {expandedIndex === index && (
                    <tr className="bg-blue-50 transition-all">
                      <td colSpan="4" className="p-4 text-gray-700">
                        <p className="text-sm mb-1">
                          <strong>Doctor:</strong> {appt.doctor}
                        </p>
                        <p className="text-sm whitespace-pre-line">
                          <strong>Notes:</strong> {appt.notes}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patient;
