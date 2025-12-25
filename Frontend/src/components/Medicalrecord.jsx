import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, 
  Clipboard, 
  Image, 
  FileText, 
  Tablet, 
  TrendingUp,
  ArrowLeft,
  Heart,
  AlertCircle,
  Stethoscope,
  Calendar,
  File
} from "lucide-react";
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

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient_id) return;
      
      setLoading(true);
      try {
        const authHeaders = {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        };

        const response = await fetch(
          `http://127.0.0.1:8000/api/clinic-patient/${patient_id}/`,
          { headers: authHeaders }
        );
        
        if (!response.ok) throw new Error("Failed to fetch patient data");
        
        const data = await response.json();
        setPatient({
          ...data,
          allergies: data.allergies || "No known allergies",
          medicalHistory: "Hypertension, controlled with medication",
          dentalHistory: "Previous cavity fillings in molars, routine cleanings every 6 months",
          lastVisit: new Date().toISOString().split('T')[0],
          examinations: [],
          xRays: [],
          treatmentPlans: [],
          prescriptions: []
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient_id]);

  const tabs = patient ? [
    {
      name: "general",
      label: "Overview",
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-blue-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {patient.age} years
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" /> {patient.gender}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Last Visit: {patient.lastVisit}
                </span>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold">
              Patient ID: {patient.patient_id}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-800">Allergies</h3>
              </div>
              <p className="text-gray-700">{patient.allergies}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <File className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800">Medical History</h3>
              </div>
              <p className="text-gray-700">{patient.medicalHistory}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800">Dental History</h3>
              </div>
              <p className="text-gray-700">{patient.dentalHistory}</p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Phone Number</p>
                <p className="font-medium text-gray-800">{patient.phone || "Not provided"}</p>
              </div>
              {patient.email && (
                <div>
                  <p className="text-sm text-blue-600">Email Address</p>
                  <p className="font-medium text-gray-800">{patient.email}</p>
                </div>
              )}
              {patient.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-blue-600">Address</p>
                  <p className="font-medium text-gray-800">{patient.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    { 
      name: "progress", 
      label: "Progress Photos", 
      icon: <TrendingUp className="w-5 h-5"/>, 
      content: <ProgressTracker patient={patient} setPatient={setPatient}/> 
    },
    { 
      name: "examinations", 
      label: "Examinations", 
      icon: <Clipboard className="w-5 h-5"/>, 
      content: <Examinations patient={patient} setPatient={setPatient}/> 
    },
    { 
      name: "xrays", 
      label: "X-Rays", 
      icon: <Image className="w-5 h-5"/>, 
      content: <Xrays patient={patient} setPatient={setPatient}/> 
    },
    { 
      name: "prescriptions", 
      label: "Prescriptions", 
      icon: <Tablet className="w-5 h-5"/>, 
      content: <Prescription patient={patient} setPatient={setPatient}/> 
    },
    { 
      name: "treatmentPlans", 
      label: "Treatment", 
      icon: <FileText className="w-5 h-5"/>, 
      content: <Treatment patient={patient} setPatient={setPatient}/> 
    }
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Medical Record
              </h1>
              <p className="text-blue-600 mt-1">
                Complete dental and medical history for {patient.name}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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
        <main className="mb-8">
          {activeContent}
        </main>

        {/* Footer Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between text-sm text-blue-800">
            <div>
              <span className="font-semibold">Medical Record ID:</span> MR-{patient.patient_id}
            </div>
            <div className="text-xs text-blue-600">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}