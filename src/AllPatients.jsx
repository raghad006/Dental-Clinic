import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaginatedTable from "./components/PaginatedTable";

const AllPatients = ({ isOpen }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ id: "", name: "", age: "", gender: "" });
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const genderDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target)
      ) {
        setShowGenderMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [patients, setPatients] = useState([
    { id: "PAT7328", name: "Mohamed Mohamed", age: 25, gender: "Male" },
    { id: "PAT8215", name: "Sara Ahmed", age: 30, gender: "Female" },
    { id: "PAT6211", name: "Omar Ali", age: 28, gender: "Male" },
    { id: "PAT4212", name: "Fatma Youssef", age: 35, gender: "Female" },
    { id: "PAT1110", name: "Yousef Hassan", age: 22, gender: "Male" },
    { id: "PAT1119", name: "Yousef Ahmed", age: 32, gender: "Male" },
  ]);

  const generatePatientID = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `PAT${randomNumber}`;
  };

  const filteredPatients = useMemo(() => {
    let data = [...patients];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toLowerCase().includes(term)
      );
    }

    if (filterOption) {
      data = data.filter((p) => p.gender === filterOption);
    }

    if (sortOption === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "age") {
      data.sort((a, b) => a.age - b.age);
    }

    return data;
  }, [patients, searchTerm, sortOption, filterOption]);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`transition-all duration-300 relative ${isOpen ? "ml-2" : "ml-0"}`}>
      <div className="max-w-6xl mx-auto bg-white p-7 rounded-2xl shadow-md mt-8 relative">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800">All Patients</h1>
          <button
            onClick={() => {
              setNewPatient({ id: generatePatientID(), name: "", age: "", gender: "" });
              setShowAddPatientModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Patient</span>
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 relative">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full md:w-1/3 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-700"
            />
          </div>

          {/* Filter dropdown */}
          <div
            className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowSortMenu(false);
            }}
          >
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700">
              {filterOption || "Filter by gender"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
            {showFilterMenu && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg border w-40 z-10">
                <button
                  onClick={() => setFilterOption("Male")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Male
                </button>
                <button
                  onClick={() => setFilterOption("Female")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Female
                </button>
                <button
                  onClick={() => setFilterOption("")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-500"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div
            className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilterMenu(false);
            }}
          >
            <SortAsc className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700">
              {sortOption ? `Sort by ${sortOption}` : "Sort by"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
            {showSortMenu && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg border w-44 z-10">
                <button
                  onClick={() => setSortOption("name")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Name
                </button>
                <button
                  onClick={() => setSortOption("age")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Age
                </button>
                <button
                  onClick={() => setSortOption("")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-500"
                >
                  Clear Sort
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <PaginatedTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredPatients.length}
        >
          <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-3">Patient ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Age</th>
                  <th className="py-3 px-3">Gender</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-3">{p.id}</td>
                      <td className="py-3 px-3 font-medium text-gray-800">{p.name}</td>
                      <td className="py-3 px-3">{p.age}</td>
                      <td className="py-3 px-3">{p.gender}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate(`/patients/${p.id}`)}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PaginatedTable>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Add New Patient</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Patient ID"
                value={newPatient.id}
                disabled
                className="p-2 rounded-2xl shadow-sm bg-gray-50 outline-none text-gray-700"
              />
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                className="p-2 rounded-2xl shadow-sm border border-gray-200 outline-none text-gray-700"
              />
              <input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
                className="p-2 rounded-2xl shadow-sm border border-gray-200 outline-none text-gray-700"
              />

              {/* Gender Dropdown (now opens upward) */}
              <div className="relative" ref={genderDropdownRef}>
                <div
                  className="flex items-center bg-white rounded-2xl px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setShowGenderMenu(!showGenderMenu)}
                >
                  <span className="text-sm text-gray-700">
                    {newPatient.gender || "Select Gender"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                </div>

                {showGenderMenu && (
                  <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
                    <button
                      onClick={() => {
                        setNewPatient({ ...newPatient, gender: "Male" });
                        setShowGenderMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-2xl transition"
                    >
                      Male
                    </button>
                    <button
                      onClick={() => {
                        setNewPatient({ ...newPatient, gender: "Female" });
                        setShowGenderMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-2xl transition"
                    >
                      Female
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newPatient.name || !newPatient.age || !newPatient.gender) {
                    alert("Please fill all fields!");
                    return;
                  }
                  setPatients([newPatient, ...patients]);
                  setShowAddPatientModal(false);
                }}
                className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPatients;
