import React, { useState } from "react";
import { User, Clipboard, Image, FileText, Tablet, TrendingUp } from "lucide-react";
import Examinations from "./ExaminationsTab";
import Xrays from "./XRaysTab";
import Prescription from "./Prescription";
import Treatment from "./TreatmentTab";
import ProgressTracker from "./ProgressTracker";

export default function MedicalRecord() {
    const [activeTab, setActiveTab] = useState("general");

    const [patient, setPatient] = useState({
        name: "John Doe",
        age: 32,
        gender: "Male",
        allergies: "None",
        medicalHistory: "Hypertension",
        dentalHistory: "Previous cavity fillings",
        lastVisit: "2025-11-25",
        examinations: [],
        xRays: [],
        treatmentPlans: [],
        prescriptions: []
    });

    const tabs = [
        { name: "general", label: "Overview", icon: <User className="w-5 h-5" />, content: (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-gray-600 mb-4">Age: {patient.age} | Gender: {patient.gender} | Last Visit: {patient.lastVisit}</p>
                <div className="mt-4 grid grid-cols-1 gap-4"> 
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <p className="font-semibold text-red-800">Allergies:</p>
                        <p>{patient.allergies}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p className="font-semibold text-blue-800">Medical History:</p>
                        <p>{patient.medicalHistory}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <p className="font-semibold text-green-800">Dental History:</p>
                        <p>{patient.dentalHistory}</p>
                    </div>
                </div>
            </div>
        )},
        { name: "progress", label: "Progress Photos", icon: <TrendingUp className="w-5 h-5"/>, content: <ProgressTracker patient={patient} setPatient={setPatient}/> },
        { name: "examinations", label: "Examinations", icon: <Clipboard className="w-5 h-5"/>, content: <Examinations patient={patient} setPatient={setPatient}/> },
        { name: "xrays", label: "X-Rays", icon: <Image className="w-5 h-5"/>, content: <Xrays patient={patient} setPatient={setPatient}/> },
        { name: "prescriptions", label: "Prescriptions", icon: <Tablet className="w-5 h-5"/>, content: <Prescription patient={patient} setPatient={setPatient}/> },
        { name: "treatmentPlans", label: "Treatment", icon: <FileText className="w-5 h-5"/>, content: <Treatment patient={patient} setPatient={setPatient}/> }
    ];

    const activeContent = tabs.find(tab => tab.name === activeTab).content;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-sans">
            <header className="sticky top-0 bg-gray-100 pb-4 z-40">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Patient Medical Record</h1>
                </div>
                
                <nav className="bg-white rounded-2xl shadow-lg p-2 flex overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center px-4 py-2 mx-1 rounded-xl transition duration-200 min-w-max ${
                                activeTab === tab.name
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {tab.icon}
                            <span className="ml-2 font-medium">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </header>
            <main className="mt-6">{activeContent}</main>
        </div>
    );
}
