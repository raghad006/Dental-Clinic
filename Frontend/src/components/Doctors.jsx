import React, { useState } from "react";
import { 
  Users, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft,
  Stethoscope,
  TrendingUp,
  History,
  CheckCircle,
  User,
  Building
} from "lucide-react";

const doctors = [
  { 
    name: "Dr. Karim Hassan", 
    specialty: "Orthodontist", 
    phone: "+20 100 123 4567",
    shifts: {
      current: [
        { day: "SAT", date: 1, time: "10:00 AM - 4:00 PM", location: "Maadi Clinic" },
      ],
      upcoming: [
        { day: "MON", date: 3, time: "9:00 AM - 3:00 PM", location: "Zayed Clinic" },
        { day: "WED", date: 5, time: "1:00 PM - 7:00 PM", location: "Maadi Clinic" },
      ],
      past: [
        { day: "THU", date: 30, time: "9:00 AM - 5:00 PM", location: "Zayed Clinic" },
      ],
    }
  },
  { 
    name: "Dr. Amina Salah", 
    specialty: "Pediatric Dentist", 
    phone: "+20 100 234 5678",
    shifts: {
      current: [
        { day: "SAT", date: 1, time: "9:00 AM - 1:00 PM", location: "Zayed Clinic" },
      ],
      upcoming: [
        { day: "TUE", date: 4, time: "10:00 AM - 4:00 PM", location: "Maadi Clinic" },
        { day: "THU", date: 6, time: "9:00 AM - 3:00 PM", location: "Zayed Clinic" },
      ],
      past: [
        { day: "FRI", date: 31, time: "8:00 AM - 2:00 PM", location: "Maadi Clinic" },
      ],
    }
  },
  { 
    name: "Dr. Leila Nasser", 
    specialty: "Endodontist", 
    phone: "+20 100 345 6789",
    shifts: {
      current: [],
      upcoming: [
        { day: "MON", date: 3, time: "12:00 PM - 6:00 PM", location: "Maadi Clinic" },
        { day: "WED", date: 5, time: "9:00 AM - 2:00 PM", location: "Zayed Clinic" },
      ],
      past: [
        { day: "FRI", date: 31, time: "10:00 AM - 4:00 PM", location: "Maadi Clinic" },
      ],
    }
  },
  { 
    name: "Dr. Jailan Yasser", 
    specialty: "Prosthodontist", 
    phone: "+20 100 456 7890",
    shifts: {
      current: [
        { day: "SAT", date: 1, time: "11:00 AM - 5:00 PM", location: "Zayed Clinic" },
      ],
      upcoming: [
        { day: "TUE", date: 4, time: "9:00 AM - 1:00 PM", location: "Maadi Clinic" },
      ],
      past: [
        { day: "FRI", date: 31, time: "2:00 PM - 8:00 PM", location: "Zayed Clinic" },
      ],
    }
  },
  { 
    name: "Dr. Adham Youssry", 
    specialty: "Oral Surgeon", 
    phone: "+20 100 567 8901",
    shifts: {
      current: [],
      upcoming: [
        { day: "MON", date: 3, time: "8:00 AM - 2:00 PM", location: "Zayed Clinic" },
      ],
      past: [
        { day: "FRI", date: 31, time: "10:00 AM - 4:00 PM", location: "Maadi Clinic" },
      ],
    }
  },
  { 
    name: "Dr. Basel Tarek", 
    specialty: "Periodontist", 
    phone: "+20 100 678 9012",
    shifts: {
      current: [
        { day: "SAT", date: 1, time: "9:00 AM - 3:00 PM", location: "Maadi Clinic" },
      ],
      upcoming: [
        { day: "TUE", date: 4, time: "12:00 PM - 6:00 PM", location: "Zayed Clinic" },
      ],
      past: [
        { day: "FRI", date: 31, time: "9:00 AM - 1:00 PM", location: "Maadi Clinic" },
      ],
    }
  },
];

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const openShifts = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const goBack = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedDoctor ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Dentists
                  </h1>
                  <p className="text-blue-600 mt-1">
                    Manage and view all dental specialists
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Dentists</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {doctors.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">On Duty Today</p>
                      <p className="text-2xl font-bold text-green-600">
                        {doctors.filter(doc => doc.shifts.current.length > 0).length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Specialties</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {[...new Set(doctors.map(doc => doc.specialty))].length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Stethoscope className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                  <div key={doc.name} className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl">
                        <User className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{doc.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-2">{doc.specialty}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{doc.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Today's Status</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          doc.shifts.current.length > 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {doc.shifts.current.length > 0 ? "On Duty" : "Off Duty"}
                        </span>
                      </div>
                      {doc.shifts.current.length > 0 && (
                        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span>{doc.shifts.current[0].time}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={12} />
                            <span>{doc.shifts.current[0].location}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{doc.shifts.upcoming.length} upcoming</span>
                      </div>
                      <button
                        onClick={() => openShifts(doc)} 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow"
                      >
                        View Shifts
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
            {/* Back Button & Header */}
            <div className="mb-8">
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all mb-6"
              >
                <ChevronLeft size={18} />
                Back to Dentists
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedDoctor.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone size={16} />
                      <span className="text-sm">{selectedDoctor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Current Shift</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedDoctor.shifts.current.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Upcoming Shifts</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedDoctor.shifts.upcoming.length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Past Shifts</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {selectedDoctor.shifts.past.length}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <History className="text-gray-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Shift */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Current Shift</h2>
              </div>
              
              {selectedDoctor.shifts.current.length > 0 ? (
                <div className="space-y-4">
                  {selectedDoctor.shifts.current.map((shift, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-center rounded-xl w-16 py-3">
                            <div className="text-sm font-semibold">{shift.day}</div>
                            <div className="text-2xl">{shift.date}</div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg mb-1">{shift.time}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} />
                              <span className="text-sm">{shift.location}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-semibold">
                          On Duty
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 text-center">
                  <div className="p-3 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Not on duty today</h3>
                  <p className="text-gray-600">No current shift scheduled for today</p>
                </div>
              )}
            </div>

            {/* Upcoming Shifts */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Upcoming Shifts</h2>
              </div>
              
              {selectedDoctor.shifts.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDoctor.shifts.upcoming.map((shift, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-bold text-center rounded-lg w-14 py-2">
                          <div className="text-xs font-semibold">{shift.day}</div>
                          <div className="text-xl">{shift.date}</div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 mb-1">{shift.time}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building size={14} />
                            <span className="text-sm">{shift.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 font-medium">Upcoming</span>
                        <span className="text-gray-500 text-xs">Scheduled</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 text-center">
                  <div className="p-3 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No upcoming shifts</h3>
                  <p className="text-gray-600">Check back later for scheduled shifts</p>
                </div>
              )}
            </div>

            {/* Past Shifts */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg">
                  <History className="text-gray-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Past Shifts</h2>
              </div>
              
              {selectedDoctor.shifts.past.length > 0 ? (
                <div className="space-y-4">
                  {selectedDoctor.shifts.past.map((shift, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-600 font-bold text-center rounded-lg w-14 py-2">
                          <div className="text-xs font-semibold">{shift.day}</div>
                          <div className="text-xl">{shift.date}</div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 mb-1">{shift.time}</p>
                          <div className="flex items-center gap-2 text-gray-500">
                            <MapPin size={14} />
                            <span className="text-sm">{shift.location}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="p-3 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <History className="text-gray-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No past shifts recorded</h3>
                  <p className="text-gray-600">Past shift history will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;