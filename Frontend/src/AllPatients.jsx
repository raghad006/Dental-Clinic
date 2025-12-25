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
                View all patient records
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
            {loading ? (
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
                        {/* Patient ID */}
                        <div className="col-span-2">
                          <div className="font-bold text-gray-800">{p.patient_id}</div>
                        </div>
                        
                        {/* Name */}
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 rounded-lg">
                              <User className="text-blue-600" size={14} />
                            </div>
                            <span className="font-medium text-gray-800">{p.name}</span>
                          </div>
                        </div>
                        
                        {/* Age */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-1">
                            <Cake className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-medium text-gray-800">{p.age}</span>
                          </div>
                        </div>
                        
                        {/* Gender */}
                        <div className="col-span-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            p.gender === "Male" 
                              ? "bg-blue-100 text-blue-700" 
                              : p.gender === "Female"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {p.gender}
                          </span>
                        </div>
                        
                        {/* Phone */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-gray-700">{p.phone || "Not provided"}</span>
                          </div>
                        </div>
                        
                        {/* Actions - Only View Button */}
                        <div className="col-span-2 text-right">
                          <button
                            onClick={() => navigate(`/patients/${p.patient_id}`)}
                            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
                          >
                            <User size={12} /> View Profile
                          </button>
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