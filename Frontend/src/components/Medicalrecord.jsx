import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, Clipboard, Image, FileText, Tablet, TrendingUp,
  ArrowLeft, Heart, AlertCircle, Stethoscope, Calendar, File,
  Phone, Mail, MapPin, Shield, Pill, Droplets, Activity, 
  Brain, Bone, Wind, Coffee, Cigarette, Baby, Smile
} from "lucide-react";

// Tabs
import Examinations from "./ExaminationsTab";
import Xrays from "./XRaysTab";
import Prescription from "./Prescription";
import Treatment from "./TreatmentTab";
import ProgressTracker from "./ProgressTracker";

export default function MedicalRecord() {
  const navigate = useNavigate();
  const { patient_id } = useParams();

  const [activeTab, setActiveTab] = useState("general");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedHistory, setParsedHistory] = useState({
    dentalConditions: [],
    medicalConditions: [],
    habitsLifestyle: [],
    previousTreatments: [],
    allergies: [],
    medications: [],
    notes: []
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient_id) return;
      setLoading(true);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/clinic-patient/${patient_id}/medical-record/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch patient data");

        const data = await response.json();

        let medicalHistory = {};
        if (data.medical_history) {
          if (typeof data.medical_history === "string") {
            try {
              medicalHistory = JSON.parse(data.medical_history);
            } catch {
              medicalHistory = {};
            }
          } else {
            medicalHistory = data.medical_history;
          }
        }

        // Parse the medical history into structured sections
        const parsedData = parseMedicalHistory(medicalHistory);
        setParsedHistory(parsedData);

        setPatient({
          ...data,
          allergies: data.allergies || "No known allergies",
          dentalHistory: medicalHistory.dental || "",
          lastVisit: data.last_visit || new Date().toISOString().split("T")[0],
          examinations: data.examinations || [],
          xRays: data.xRays || [],
          treatmentPlans: data.treatmentPlans || [],
          prescriptions: data.prescriptions || [],
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient_id, navigate]);

  const parseMedicalHistory = (history) => {
    const result = {
      dentalConditions: [],
      medicalConditions: [],
      habitsLifestyle: [],
      previousTreatments: [],
      allergies: [],
      medications: [],
      notes: []
    };

    if (!history || typeof history !== 'object') return result;

    // Dental Conditions
    const dentalConditions = [
      { key: 'cavities', label: 'Cavities/Tooth Decay', icon: <Activity className="w-4 h-4" /> },
      { key: 'gum_disease', label: 'Gum Disease (Gingivitis/Periodontitis)', icon: <Droplets className="w-4 h-4" /> },
      { key: 'tooth_sensitivity', label: 'Tooth Sensitivity', icon: <Brain className="w-4 h-4" /> },
      { key: 'bruxism', label: 'Teeth Grinding (Bruxism)', icon: <Bone className="w-4 h-4" /> },
      { key: 'dry_mouth', label: 'Dry Mouth (Xerostomia)', icon: <Wind className="w-4 h-4" /> },
      { key: 'bad_breath', label: 'Chronic Bad Breath (Halitosis)', icon: <Wind className="w-4 h-4" /> }
    ];

    dentalConditions.forEach(item => {
      if (history[item.key]) {
        result.dentalConditions.push({ ...item, value: history[item.key] });
      }
    });

    // Medical Conditions
    const medicalConditions = [
      { key: 'diabetes', label: 'Diabetes', icon: <Activity className="w-4 h-4" /> },
      { key: 'high_blood_pressure', label: 'High Blood Pressure', icon: <Activity className="w-4 h-4" /> },
      { key: 'heart_disease', label: 'Heart Disease', icon: <Heart className="w-4 h-4" /> },
      { key: 'asthma', label: 'Asthma', icon: <Wind className="w-4 h-4" /> },
      { key: 'allergies', label: 'Allergies', icon: <AlertCircle className="w-4 h-4" /> },
      { key: 'bleeding_disorders', label: 'Bleeding Disorders', icon: <Droplets className="w-4 h-4" /> }
    ];

    medicalConditions.forEach(item => {
      if (history[item.key]) {
        result.medicalConditions.push({ ...item, value: history[item.key] });
      }
    });

    // Habits & Lifestyle
    const habitsLifestyle = [
      { key: 'smoking', label: 'Smoking/Tobacco Use', icon: <Cigarette className="w-4 h-4" /> },
      { key: 'alcohol', label: 'Alcohol Consumption', icon: <Coffee className="w-4 h-4" /> },
      { key: 'medications', label: 'Regular Medications', icon: <Pill className="w-4 h-4" /> },
      { key: 'pregnancy', label: 'Pregnancy', icon: <Baby className="w-4 h-4" /> }
    ];

    habitsLifestyle.forEach(item => {
      if (history[item.key]) {
        result.habitsLifestyle.push({ ...item, value: history[item.key] });
      }
    });

    // Previous Dental Treatments
    const previousTreatments = [
      { key: 'extractions', label: 'Tooth Extractions', icon: <Bone className="w-4 h-4" /> },
      { key: 'root_canal', label: 'Root Canal Treatment', icon: <Activity className="w-4 h-4" /> },
      { key: 'crowns', label: 'Crowns/Caps', icon: <Smile className="w-4 h-4" /> },
      { key: 'dentures', label: 'Dentures', icon: <Smile className="w-4 h-4" /> },
      { key: 'braces', label: 'Braces/Orthodontics', icon: <Smile className="w-4 h-4" /> },
      { key: 'implants', label: 'Dental Implants', icon: <Bone className="w-4 h-4" /> }
    ];

    previousTreatments.forEach(item => {
      if (history[item.key]) {
        result.previousTreatments.push({ ...item, value: history[item.key] });
      }
    });

    // Specific Allergies
    if (history.allergies_details) {
      const allergiesArray = Array.isArray(history.allergies_details) 
        ? history.allergies_details 
        : String(history.allergies_details).split(',').map(item => item.trim());
      result.allergies = allergiesArray;
    }

    // Current Medications
    if (history.current_medications) {
      const medsArray = Array.isArray(history.current_medications)
        ? history.current_medications
        : String(history.current_medications).split(',').map(item => item.trim());
      result.medications = medsArray;
    }

    // Additional Notes
    if (history.additional_notes) {
      result.notes = Array.isArray(history.additional_notes)
        ? history.additional_notes
        : [String(history.additional_notes)];
    }

    return result;
  };

  const renderConditionList = (items, title, icon, color) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${color} rounded-lg`}>
            {icon}
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded">
                  {item.icon}
                </div>
                <span className="text-gray-700">{item.label}</span>
              </div>
              <span className="text-gray-900 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListSection = (items, title, icon, color, emptyMessage) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${color} rounded-lg`}>
            {icon}
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = patient ? [
    {
      name: "general",
      label: "Overview",
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {patient.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                  <User className="w-4 h-4" /> {patient.age} years
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg">
                  <Heart className="w-4 h-4" /> {patient.gender}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Calendar className="w-4 h-4" /> Last Visit: {patient.lastVisit}
                </span>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg">
              Patient ID: {patient.patient_id}
            </div>
          </div>

          {/* Dental & Medical History Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <File className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Dental & Medical History</h2>
            </div>

            {/* Dental Conditions */}
            {renderConditionList(
              parsedHistory.dentalConditions,
              "Dental Conditions",
              <Activity className="w-5 h-5 text-blue-600" />,
              "bg-blue-100"
            )}

            {/* Medical Conditions */}
            {renderConditionList(
              parsedHistory.medicalConditions,
              "Medical Conditions",
              <Heart className="w-5 h-5 text-red-600" />,
              "bg-red-100"
            )}

            {/* Habits & Lifestyle */}
            {renderConditionList(
              parsedHistory.habitsLifestyle,
              "Habits & Lifestyle",
              <Cigarette className="w-5 h-5 text-amber-600" />,
              "bg-amber-100"
            )}

            {/* Previous Dental Treatments */}
            {renderConditionList(
              parsedHistory.previousTreatments,
              "Previous Dental Treatments",
              <Smile className="w-5 h-5 text-emerald-600" />,
              "bg-emerald-100"
            )}

            {/* Allergies Details */}
            {renderListSection(
              parsedHistory.allergies,
              "Allergies Details",
              <AlertCircle className="w-5 h-5 text-red-600" />,
              "bg-red-100",
              "No specific allergies listed"
            )}

            {/* Current Medications */}
            {renderListSection(
              parsedHistory.medications,
              "Current Medications",
              <Pill className="w-5 h-5 text-purple-600" />,
              "bg-purple-100",
              "No current medications listed"
            )}

            {/* Additional Notes */}
            {parsedHistory.notes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Additional Notes</h3>
                </div>
                <div className="space-y-3">
                  {parsedHistory.notes.map((note, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show message if no history data exists */}
            {Object.values(parsedHistory).every(arr => arr.length === 0) && (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-100 rounded-xl inline-block mb-4">
                  <File className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Medical History Available</h3>
                <p className="text-gray-500">Complete medical history has not been recorded yet.</p>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          {patient.emergency_contact && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-white p-6 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl flex-shrink-0">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Emergency Contact</h3>
                    <p className="text-gray-700 leading-relaxed">{patient.emergency_contact}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {/* Phone Number */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-indigo-100 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-800">{patient.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* Email Address */}
                {patient.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-indigo-100 rounded-lg flex-shrink-0">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 mb-1">Email Address</p>
                      <p className="font-medium text-gray-800">{patient.email}</p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {patient.address && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-indigo-100 rounded-lg flex-shrink-0">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 mb-1">Address</p>
                      <p className="font-medium text-gray-800">{patient.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    { name: "progress", label: "Progress Photos", icon: <TrendingUp className="w-5 h-5"/>, content: <ProgressTracker patient={patient} setPatient={setPatient}/> },
{
  name: "examinations",
  label: "Examinations",
  icon: <Clipboard className="w-5 h-5"/>,
  content: (
    <Examinations
      patient={patient}
      patientId={patient_id}
      setPatient={setPatient}
    />
  )
},
    { name: "xrays", label: "X-Rays", icon: <Image className="w-5 h-5"/>, content: <Xrays patient={patient} setPatient={setPatient}/> },
    { name: "prescriptions", label: "Prescriptions", icon: <Tablet className="w-5 h-5"/>, content: <Prescription patient={patient} setPatient={setPatient}/> },
    { name: "treatmentPlans", label: "Treatment", icon: <FileText className="w-5 h-5"/>, content: <Treatment patient={patient} setPatient={setPatient}/> }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
            <User className="text-blue-500" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Not Found</h3>
          <p className="text-gray-600 mb-6">The patient medical record you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/patients")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft size={20} /> Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const activeContent = tabs.find(tab => tab.name === activeTab)?.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/patients/${patient_id}`)}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Patient Profile</span>
          </button>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <File className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Medical Record</h1>
              <p className="text-blue-600 mt-1">Complete dental and medical history for {patient.name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-2 mb-6 border border-blue-100">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-3 mx-1 rounded-xl transition-all duration-200 min-w-max ${
                  activeTab === tab.name
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="mb-8">{activeContent}</main>

        {/* Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between text-sm text-blue-800">
            <div>
              <span className="font-semibold">Medical Record ID:</span> MR-{patient.patient_id}
            </div>
            <div className="text-xs text-blue-600">
              Last Updated: {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}