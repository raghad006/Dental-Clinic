import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  Search,
  CalendarClock,
  Plus,
  FileText,
  Save,
  X,
} from "lucide-react";
import CalendarDropdown from "./components/CalendarDropdown";
import PaginatedTable from "./components/PaginatedTable";

const initialAppointments = [
  { date: "2025-10-30", time: "08:30 AM", patient: "Youssef Hassan", doctor: "Dr. Ava Chen", status: "Awaiting" },
  { date: "2025-10-30", time: "09:00 AM", patient: "Olivia Smith", doctor: "Dr. Marcus Lee", status: "Checked In" },
  { date: "2025-10-30", time: "10:00 AM", patient: "Mohamed Mohamed", doctor: "Dr. Sarah Bell", status: "Awaiting" },
  { date: "2025-10-30", time: "11:00 AM", patient: "Omar Ali", doctor: "Dr. Marcus Lee", status: "Awaiting" },
  { date: "2025-10-30", time: "09:30 AM", patient: "Fatma Youssef", doctor: "Dr. Ava Chen", status: "Awaiting" },
  { date: "2025-10-30", time: "10:00 AM", patient: "Yousef Ahmed", doctor: "Dr. Marcus Lee", status: "Checked In" },
  { date: "2025-10-30", time: "11:00 AM", patient: "Mohamed Ahmed", doctor: "Dr. Sarah Bell", status: "Awaiting" },
  { date: "2025-10-30", time: "11:00 AM", patient: "Omar Ali", doctor: "Dr. Marcus Lee", status: "Awaiting" },
  { date: "2025-10-30", time: "12:15 AM", patient: "Noah Williams", doctor: "Dr. Sarah Bell", status: "Awaiting" },
  { date: "2025-10-31", time: "12:30 PM", patient: "Sarah Mohamed", doctor: "Dr. Marcus Lee", status: "Checked In" },
  { date: "2025-10-31", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Checked In" },
  { date: "2025-11-03", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Checked In" },
  { date: "2025-11-01", time: "02:30 PM", patient: "Sara Ahmed", doctor: "Dr. Marcus Lee", status: "Awaiting" },
  { date: "2025-11-01", time: "03:00 PM", patient: "Layla Ahmed", doctor: "Dr. Sarah Bell", status: "Cancelled" },
  { date: "2025-11-01", time: "04:00 PM", patient: "Mariam Ahmed", doctor: "Dr. Sarah Bell", status: "Cancelled" },
  { date: "2025-12-31", time: "01:45 PM", patient: "Emma Brown", doctor: "Dr. Ava Chen", status: "Checked In" },
];

const statusOptions = ["Awaiting", "Checked In", "Cancelled"];
const doctorOptions = ["Dr. Ava Chen", "Dr. Marcus Lee", "Dr. Sarah Bell"];

const statusColors = {
  Awaiting: "bg-blue-100 text-blue-700",
  "Checked In": "bg-green-500 text-white",
  Cancelled: "bg-red-500 text-white",
};

const getStatusIcon = (status) => {
  const iconClass = "w-[18px] h-[18px] flex-shrink-0";
  switch (status) {
    case "Checked In":
      return <CheckCircle className={iconClass} />;
    case "Cancelled":
      return <XCircle className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const Appointments = () => {
  // Persistent states from localStorage
  const [currentPage, setCurrentPage] = useState(() => Number(localStorage.getItem("appointmentsPage")) || 1);
  const [selectedDate, setSelectedDate] = useState(() => localStorage.getItem("appointmentsDate") || new Date().toISOString().split("T")[0]);

  const [appointments, setAppointments] = useState(initialAppointments);
  const [openStatusDropdownIndex, setOpenStatusDropdownIndex] = useState(null);
  const [openDoctorDropdown, setOpenDoctorDropdown] = useState(false);
  const [openHeaderStatusDropdown, setOpenHeaderStatusDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [noteText, setNoteText] = useState("");
  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  // Save page and date to localStorage
  useEffect(() => localStorage.setItem("appointmentsPage", currentPage), [currentPage]);
  useEffect(() => localStorage.setItem("appointmentsDate", selectedDate), [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenStatusDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStatus = (globalIndex, newStatus) => {
    const updated = [...appointments];
    updated[globalIndex] = { ...updated[globalIndex], status: newStatus };
    setAppointments(updated);
    setOpenStatusDropdownIndex(null);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = appt.date?.split("T")[0];
    const selected = selectedDate?.split("T")[0];
    return (
      apptDate === selected &&
      (!filterStatus || appt.status === filterStatus) &&
      (!filterDoctor || appt.doctor === filterDoctor) &&
      appt.patient.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewAppointment = () => alert("🆕 New Appointment form will appear here!");
  const handleSaveNote = (index) => {
    const updated = [...appointments];
    updated[index].notes = noteText;
    setAppointments(updated);
    setEditingNoteIndex(null);
    setNoteText("");
  };

  return (
    <div className="p-10 w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8 overflow-visible relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Appointments</h1>
          <div className="flex items-center gap-3 relative">
            <CalendarDropdown
              selectedDate={selectedDate}
              onDateChange={(date) => setSelectedDate(date)}
            />
            <button
              onClick={handleNewAppointment}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium shadow-md transition-all duration-300"
            >
              <Plus size={18} /> New Appointment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient..."
              className="w-80 pl-10 pr-4 py-2 bg-gray-50 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Doctor Filter */}
          <div className="relative w-56">
            <button
              className="w-full py-2 px-3 bg-white rounded-2xl shadow-sm flex justify-between items-center text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
              onClick={() => {
                setOpenDoctorDropdown(!openDoctorDropdown);
                setOpenHeaderStatusDropdown(false);
              }}
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                {filterDoctor || "Filter by Doctor"}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {openDoctorDropdown && (
              <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl z-50">
                {doctorOptions.map((doc) => (
                  <button
                    key={doc}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 transition-all"
                    onClick={() => {
                      setFilterDoctor(doc);
                      setOpenDoctorDropdown(false);
                    }}
                  >
                    {doc}
                  </button>
                ))}
                {filterDoctor && (
                  <button
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                    onClick={() => setFilterDoctor(null)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative w-56">
            <button
              className="w-full py-2 px-3 bg-white rounded-2xl shadow-sm flex justify-between items-center text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
              onClick={() => {
                setOpenHeaderStatusDropdown(!openHeaderStatusDropdown);
                setOpenDoctorDropdown(false);
              }}
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                {filterStatus || "Filter by Status"}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {openHeaderStatusDropdown && (
              <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl z-50">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-600 transition-all"
                    onClick={() => {
                      setFilterStatus(s);
                      setOpenHeaderStatusDropdown(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
                {filterStatus && (
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => setFilterStatus(null)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <PaginatedTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAppointments.length}
        >
          <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-100">
            <table className="w-full text-sm">
              <thead className="text-gray-600 bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-900" ref={dropdownRef}>
                {paginatedAppointments.map((appt, index) => {
                  const globalIndex = appointments.findIndex(
                    (a) =>
                      a.date === appt.date &&
                      a.time === appt.time &&
                      a.patient === appt.patient
                  );
                  return (
                    <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <td className="p-3 font-medium">{appt.time}</td>
                      <td className="p-3">{appt.patient}</td>
                      <td className="p-3">{appt.doctor}</td>
                      <td className="p-3 relative">
                        <button
                          onClick={() =>
                            setOpenStatusDropdownIndex(openStatusDropdownIndex === index ? null : index)
                          }
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm focus:outline-none ${statusColors[appt.status]}`}
                        >
                          {getStatusIcon(appt.status)} {appt.status}
                        </button>

                        {openStatusDropdownIndex === index && (
                          <div
                            className={`absolute ${
                              index >= paginatedAppointments.length - 2
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            } left-0 bg-white rounded-2xl shadow-lg border border-gray-100 z-[1000] w-40`}
                          >
                            {statusOptions.map((s) => (
                              <button
                                key={s}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => updateStatus(globalIndex, s)}
                              >
                                {s}
                              </button>
                            ))}
                            <button
                              className="w-full text-left px-4 py-2 text-gray-500 text-sm hover:bg-gray-100"
                              onClick={() => setOpenStatusDropdownIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {appt.status === "Checked In" ? (
                          editingNoteIndex === index ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400"
                                placeholder="Add notes about this appointment..."
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveNote(globalIndex)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                                >
                                  <Save size={14} /> Save
                                </button>
                                <button
                                  onClick={() => setEditingNoteIndex(null)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-400"
                                >
                                  <X size={14} /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingNoteIndex(index);
                                setNoteText(appt.notes || "");
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-medium transition-all"
                            >
                              <FileText size={14} /> Add Notes
                            </button>
                          )
                        ) : (
                          <button
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-all"
                            onClick={() => alert(`Reschedule appointment for ${appt.patient}`)}
                          >
                            <CalendarClock size={14} /> Reschedule
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {paginatedAppointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No appointments found for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PaginatedTable>
      </div>
    </div>
  );
};

export default Appointments;
