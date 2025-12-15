import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  Cake,
  Mars,
  Venus,
  FileText,
  Heart,
  Droplets,
  Pill,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  ChevronDown,
} from "lucide-react";

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const genderDropdownRef = useRef(null);

  // Basic Information
  const [basicInfo, setBasicInfo] = useState({
    patient_id: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    bloodType: "",
  });

  // Dental/Medical History - Checkboxes
  const [medicalHistory, setMedicalHistory] = useState({
    // Dental Conditions
    cavities: false,
    gumDisease: false,
    toothSensitivity: false,
    bruxism: false,
    dryMouth: false,
    badBreath: false,
    
    // Medical Conditions
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    asthma: false,
    allergies: false,
    bleedingDisorders: false,
    
    // Habits
    smoking: false,
    alcohol: false,
    medications: false,
    pregnancy: false,
    
    // Dental Treatments
    previousExtractions: false,
    rootCanal: false,
    crowns: false,
    dentures: false,
    braces: false,
    implants: false,
    
    // Other notes
    notes: "",
    allergiesDetails: "",
    medicationsDetails: "",
  });

  // Generate random patient ID
  const generatePatientID = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `PAT${randomNumber}`;
  };

  useEffect(() => {
    // Auto-generate patient ID on component mount
    setBasicInfo(prev => ({
      ...prev,
      patient_id: generatePatientID()
    }));
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
        setShowGenderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle basic info changes
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle text area changes
  const handleTextAreaChange = (field, value) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!basicInfo.name || !basicInfo.age || !basicInfo.gender) {
      alert("Please fill all required fields (Name, Age, Gender)");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Combine all data
      const patientData = {
        basic_info: basicInfo,
        medical_history: medicalHistory,
        created_at: new Date().toISOString()
      };

      // Save to backend (adjust endpoint as needed)
      const res = await fetch("http://127.0.0.1:8000/api/clinic-patient/add/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          patient_id: basicInfo.patient_id,
          name: basicInfo.name,
          age: Number(basicInfo.age),
          gender: basicInfo.gender,
          phone: basicInfo.phone || "",
          email: basicInfo.email || "",
          address: basicInfo.address || "",
          emergency_contact: basicInfo.emergencyContact || "",
          blood_type: basicInfo.bloodType || "",
          medical_history: JSON.stringify(medicalHistory),
          allergies: medicalHistory.allergiesDetails || "",
        }),
      });

      if (!res.ok) throw new Error("Failed to add patient");

      const data = await res.json();
      alert("Patient added successfully!");
      navigate("/patients");
    } catch (err) {
      console.error(err);
      alert("Error adding patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Checkbox groups for organization
  const checkboxGroups = [
    {
      title: "Dental Conditions",
      icon: <FileText className="w-4 h-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      fields: [
        { id: "cavities", label: "Cavities/Tooth Decay" },
        { id: "gumDisease", label: "Gum Disease (Gingivitis/Periodontitis)" },
        { id: "toothSensitivity", label: "Tooth Sensitivity" },
        { id: "bruxism", label: "Teeth Grinding (Bruxism)" },
        { id: "dryMouth", label: "Dry Mouth (Xerostomia)" },
        { id: "badBreath", label: "Chronic Bad Breath (Halitosis)" },
      ]
    },
    {
      title: "Medical Conditions",
      icon: <Heart className="w-4 h-4" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      fields: [
        { id: "diabetes", label: "Diabetes" },
        { id: "hypertension", label: "High Blood Pressure" },
        { id: "heartDisease", label: "Heart Disease" },
        { id: "asthma", label: "Asthma" },
        { id: "allergies", label: "Allergies" },
        { id: "bleedingDisorders", label: "Bleeding Disorders" },
      ]
    },
    {
      title: "Habits & Lifestyle",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      fields: [
        { id: "smoking", label: "Smoking/Tobacco Use" },
        { id: "alcohol", label: "Alcohol Consumption" },
        { id: "medications", label: "Regular Medications" },
        { id: "pregnancy", label: "Pregnancy (if applicable)" },
      ]
    },
    {
      title: "Previous Dental Treatments",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      fields: [
        { id: "previousExtractions", label: "Tooth Extractions" },
        { id: "rootCanal", label: "Root Canal Treatment" },
        { id: "crowns", label: "Crowns/Caps" },
        { id: "dentures", label: "Dentures" },
        { id: "braces", label: "Braces/Orthodontics" },
        { id: "implants", label: "Dental Implants" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4 group transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Patients</span>
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <UserPlus className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Add New Patient
              </h1>
              <p className="text-blue-600 mt-1">Create a new patient record with complete medical history</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-8">
              {/* Patient ID Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Patient Information</h2>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">Patient ID</p>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-blue-300 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{basicInfo.patient_id}</p>
                    </div>
                    <button
                      onClick={() => handleBasicInfoChange("patient_id", generatePatientID())}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Regenerate ID
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Auto-generated unique identifier</p>
                </div>
              </div>

              {/* Basic Information Form */}
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="text-blue-600" size={20} />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.name}
                      onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                      placeholder="Enter patient's full name"
                    />
                  </div>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        value={basicInfo.age}
                        onChange={(e) => handleBasicInfoChange("age", e.target.value)}
                        className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                        placeholder="Age"
                      />
                    </div>

                    <div ref={genderDropdownRef}>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Gender *
                      </label>
                      <div className="relative">
                        <button
                          className="w-full border border-blue-200 rounded-lg px-4 py-3 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white"
                          onClick={() => setShowGenderMenu(!showGenderMenu)}
                        >
                          <span className="flex items-center gap-2">
                            {basicInfo.gender === "Male" ? (
                              <Mars className="text-blue-500" size={18} />
                            ) : basicInfo.gender === "Female" ? (
                              <Venus className="text-pink-500" size={18} />
                            ) : (
                              <User className="text-gray-400" size={18} />
                            )}
                            {basicInfo.gender || "Select Gender"}
                          </span>
                          <ChevronDown className="text-blue-500" size={18} />
                        </button>

                        {showGenderMenu && (
                          <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200">
                            <button
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-all flex items-center gap-2"
                              onClick={() => {
                                handleBasicInfoChange("gender", "Male");
                                setShowGenderMenu(false);
                              }}
                            >
                              <Mars className="text-blue-500" size={18} /> Male
                            </button>
                            <button
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-all flex items-center gap-2"
                              onClick={() => {
                                handleBasicInfoChange("gender", "Female");
                                setShowGenderMenu(false);
                              }}
                            >
                              <Venus className="text-pink-500" size={18} /> Female
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-blue-400" size={18} />
                        <input
                          type="text"
                          value={basicInfo.phone}
                          onChange={(e) => handleBasicInfoChange("phone", e.target.value)}
                          className="w-full border border-blue-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => handleBasicInfoChange("email", e.target.value)}
                        className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                        placeholder="patient@example.com"
                      />
                    </div>
                  </div>

                  {/* Blood Type & Emergency Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Blood Type
                      </label>
                      <select
                        value={basicInfo.bloodType}
                        onChange={(e) => handleBasicInfoChange("bloodType", e.target.value)}
                        className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        value={basicInfo.emergencyContact}
                        onChange={(e) => handleBasicInfoChange("emergencyContact", e.target.value)}
                        className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                        placeholder="Name & Phone"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Address
                    </label>
                    <textarea
                      value={basicInfo.address}
                      onChange={(e) => handleBasicInfoChange("address", e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all min-h-[80px] resize-none"
                      placeholder="Full address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Medical/Dental History */}
            <div className="space-y-8">
              {/* Medical/Dental History */}
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  Dental & Medical History
                </h3>
                
                <div className="space-y-8">
                  {checkboxGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 ${group.bgColor} rounded-lg`}>
                          <div className={group.color}>{group.icon}</div>
                        </div>
                        <h4 className="font-bold text-gray-800">{group.title}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.fields.map((field) => (
                          <label
                            key={field.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              medicalHistory[field.id]
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            } cursor-pointer transition-all`}
                          >
                            <input
                              type="checkbox"
                              checked={medicalHistory[field.id]}
                              onChange={() => handleCheckboxChange(field.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{field.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Allergies Details */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="text-red-600" size={20} />
                      Allergies Details
                    </h4>
                    <textarea
                      value={medicalHistory.allergiesDetails}
                      onChange={(e) => handleTextAreaChange("allergiesDetails", e.target.value)}
                      className="w-full border border-red-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white transition-all min-h-[100px] resize-none"
                      placeholder="List specific allergies (e.g., penicillin, latex, local anesthesia, etc.)"
                    />
                  </div>

                  {/* Medications Details */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Pill className="text-purple-600" size={20} />
                      Current Medications
                    </h4>
                    <textarea
                      value={medicalHistory.medicationsDetails}
                      onChange={(e) => handleTextAreaChange("medicationsDetails", e.target.value)}
                      className="w-full border border-purple-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white transition-all min-h-[100px] resize-none"
                      placeholder="List current medications with dosages"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="text-green-600" size={20} />
                      Additional Notes
                    </h4>
                    <textarea
                      value={medicalHistory.notes}
                      onChange={(e) => handleTextAreaChange("notes", e.target.value)}
                      className="w-full border border-green-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white transition-all min-h-[120px] resize-none"
                      placeholder="Any other medical information, concerns, or special instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-blue-800">
                <p className="font-medium">Review all information before submitting</p>
                <p className="text-xs text-blue-600 mt-1">Required fields are marked with *</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/patients")}
                  className="px-6 py-3 border-2 border-blue-200 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !basicInfo.name || !basicInfo.age || !basicInfo.gender}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    loading || !basicInfo.name || !basicInfo.age || !basicInfo.gender
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Patient Record
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {(!basicInfo.name || !basicInfo.age || !basicInfo.gender) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  <p className="text-sm font-medium">Please fill all required fields: Name, Age, and Gender</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientPage;