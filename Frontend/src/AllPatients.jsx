import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, 
  Filter, 
  SortAsc, 
  ChevronDown, 
  UserPlus,
  Users,
  User,
  Phone,
  Cake,
  Mars,
  Venus,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

// Helper function for authenticated fetch
const authFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  if (Object.keys(headers).length === 0) {
    return null; // No token, will redirect in getAuthHeaders
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized
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

const AllPatients = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 8;
  const filterDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const [patients, setPatients] = useState([]);

  // Fetch patients with authentication
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/clinic-patients/`);
      if (!response) return; // authFetch handles redirection
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setErrorMessage("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPatients();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Start editing a patient
  const handleEditClick = (patient) => {
    setEditingPatientId(patient.patient_id);
    setEditForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone || "",
      medical_history: patient.medical_history || "",
      allergies: patient.allergies || "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPatientId(null);
    setEditForm({});
    setErrorMessage("");
  };

  // Update patient via PATCH
  const handleUpdatePatient = async (patientId) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Only send allowed fields
      const updateData = {
        name: editForm.name,
        age: editForm.age,
        gender: editForm.gender,
        phone: editForm.phone,
      };

      const response = await authFetch(`${API_BASE_URL}/clinic-patient/${patientId}/`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      });

      if (!response) return; // authFetch handles redirection

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update patient");
      }

      const updatedPatient = await response.json();
      
      // Update local state
      setPatients(patients.map(p => 
        p.patient_id === patientId ? { ...p, ...updatedPatient } : p
      ));
      
      setSuccessMessage("Patient updated successfully!");
      setEditingPatientId(null);
      setEditForm({});

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Error updating patient:", err);
      setErrorMessage(err.message || "Failed to update patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete patient
  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/clinic-patient/${patientId}/`, {
        method: "DELETE",
      });

      if (!response) return;

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      // Remove from local state
      setPatients(patients.filter(p => p.patient_id !== patientId));
      setSuccessMessage("Patient deleted successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("Error deleting patient:", err);
      setErrorMessage("Failed to delete patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    let data = [...patients];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.patient_id.toLowerCase().includes(term)
      );
    }

    if (filterOption) {
      data = data.filter((p) => p.gender === filterOption);
    }

    if (sortOption === "name") data.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === "age") data.sort((a, b) => a.age - b.age);

    return data;
  }, [patients, searchTerm, sortOption, filterOption]);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success/Error Messages */}
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
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Patients
              </h1>
              <p className="text-blue-600 mt-1">
                Manage and view all patient records
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {patients.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              </div>

            <button
              onClick={() => navigate("/patients/add")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              <UserPlus size={20} /> Add New Patient
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Search className="inline mr-2" size={16} />
                Search Patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type patient name or ID..."
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 pl-10 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-blue-400" size={16} />
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm" ref={filterDropdownRef}>
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Filter className="inline mr-2" size={16} />
                Filter by Gender
              </label>
              <div className="relative">
                <button
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                  onClick={() => {
                    setShowFilterMenu(!showFilterMenu);
                    setShowSortMenu(false);
                  }}
                >
                  <span className="text-gray-700">
                    {filterOption || "All Patients"}
                  </span>
                  <ChevronDown className={`text-blue-500 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} size={16} />
                </button>

                {showFilterMenu && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm"
                      onClick={() => {
                        setFilterOption("");
                        setShowFilterMenu(false);
                      }}
                    >
                      <span className="font-medium text-blue-600">All Patients</span>
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm flex items-center gap-2"
                      onClick={() => {
                        setFilterOption("Male");
                        setShowFilterMenu(false);
                      }}
                    >
                      <Mars className="w-3.5 h-3.5 text-blue-500" /> Male
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm flex items-center gap-2"
                      onClick={() => {
                        setFilterOption("Female");
                        setShowFilterMenu(false);
                      }}
                    >
                      <Venus className="w-3.5 h-3.5 text-pink-500" /> Female
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm" ref={sortDropdownRef}>
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <SortAsc className="inline mr-2" size={16} />
                Sort Patients
              </label>
              <div className="relative">
                <button
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                  onClick={() => {
                    setShowSortMenu(!showSortMenu);
                    setShowFilterMenu(false);
                  }}
                >
                  <span className="text-gray-700">
                    {sortOption ? `Sort by ${sortOption}` : "Default"}
                  </span>
                  <ChevronDown className={`text-blue-500 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} size={16} />
                </button>

                {showSortMenu && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm"
                      onClick={() => {
                        setSortOption("");
                        setShowSortMenu(false);
                      }}
                    >
                      <span className="font-medium text-blue-600">Default</span>
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm"
                      onClick={() => {
                        setSortOption("name");
                        setShowSortMenu(false);
                      }}
                    >
                      Name (A-Z)
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 transition-all text-sm"
                      onClick={() => {
                        setSortOption("age");
                        setShowSortMenu(false);
                      }}
                    >
                      Age (Youngest to Oldest)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="rounded-2xl overflow-hidden border border-blue-100 mb-6">
            {loading && !editingPatientId ? (
              <div className="p-12 text-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600">Loading patients...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-blue-800">
                    <div className="col-span-2">Patient ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-1">Age</div>
                    <div className="col-span-2">Gender</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-blue-50">
                  {paginatedPatients.length > 0 ? (
                    paginatedPatients.map((p) => (
                      <div
                        key={p.patient_id}
                        className="grid grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-all duration-200 items-center text-sm"
                      >
                        {/* Patient ID - Read Only */}
                        <div className="col-span-2">
                          <div className="font-bold text-gray-800">{p.patient_id}</div>
                        </div>
                        
                        {/* Name - Editable */}
                        <div className="col-span-3">
                          {editingPatientId === p.patient_id ? (
                            <input
                              type="text"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-100 rounded-lg">
                                <User className="text-blue-600" size={14} />
                              </div>
                              <span className="font-medium text-gray-800">{p.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Age - Editable */}
                        <div className="col-span-1">
                          {editingPatientId === p.patient_id ? (
                            <input
                              type="number"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                              value={editForm.age}
                              onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                              min="0"
                              max="150"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <Cake className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-medium text-gray-800">{p.age}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Gender - Editable */}
                        <div className="col-span-2">
                          {editingPatientId === p.patient_id ? (
                            <select
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                              value={editForm.gender}
                              onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              p.gender === "Male" 
                                ? "bg-blue-100 text-blue-700" 
                                : p.gender === "Female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {p.gender}
                            </span>
                          )}
                        </div>
                        
                        {/* Phone - Editable */}
                        <div className="col-span-2">
                          {editingPatientId === p.patient_id ? (
                            <input
                              type="tel"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm"
                              value={editForm.phone || ""}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              placeholder="Phone number"
                            />
                          ) : (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-gray-700">{p.phone || "Not provided"}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-2 text-right">
                          {editingPatientId === p.patient_id ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleUpdatePatient(p.patient_id)}
                                disabled={loading}
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm disabled:opacity-50"
                              >
                                <Save size={12} /> {loading ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all"
                              >
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                              >
                                <Edit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => navigate(`/patients/${p.patient_id}`)}
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                              >
                                <User size={12} /> View
                              </button>
                              <button
                                onClick={() => handleDeletePatient(p.patient_id)}
                                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                              >
                                <X size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
                        <Users className="text-blue-500" size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Patients Found</h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || filterOption 
                          ? "Try changing your search or filter criteria"
                          : "No patients in the system yet"}
                      </p>
                      {!searchTerm && !filterOption && (
                        <button
                          onClick={() => navigate("/patients/add")}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <UserPlus size={20} /> Add First Patient
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <PaginatedTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredPatients.length}
            />
          )}

          {/* Summary Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between text-sm text-blue-800">
              <div>
                <span className="font-semibold">{filteredPatients.length}</span> patients found
                {filterOption && ` (${filterOption} only)`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Male: {patients.filter(p => p.gender === "Male").length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span>Female: {patients.filter(p => p.gender === "Female").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPatients;