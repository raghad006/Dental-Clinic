import React, { useState } from "react";
import { 
  Users, 
  Phone, 
  Calendar, 
  Clock, 
  ChevronLeft,
  User,
  Briefcase,
  TrendingUp,
  History,
  CheckCircle,
  XCircle,
  Coffee
} from "lucide-react";

const staffMembers = [
  {
    name: "Jana Mohamed",
    role: "Receptionist",
    phone: "+20 (111) 234-5678",
    shifts: {
      current: { day: "SAT", date: 1, time: "8:00 AM - 4:00 PM" },
      upcoming: [
        { day: "MON", date: 3, time: "9:00 AM - 5:00 PM" },
        { day: "WED", date: 5, time: "8:00 AM - 4:00 PM" },
      ],
      past: [
        { day: "THU", date: 30, time: "8:00 AM - 4:00 PM" },
        { day: "TUE", date: 28, time: "9:00 AM - 5:00 PM" },
      ],
    },
  },
  {
    name: "Omar Khaled",
    role: "Nurse",
    phone: "+20 (112) 345-6789",
    shifts: {
      current: { day: "SAT", date: 1, time: "7:00 AM - 3:00 PM" },
      upcoming: [
        { day: "TUE", date: 4, time: "7:00 AM - 3:00 PM" },
        { day: "THU", date: 6, time: "7:00 AM - 3:00 PM" },
      ],
      past: [
        { day: "WED", date: 30, time: "7:00 AM - 3:00 PM" },
        { day: "FRI", date: 29, time: "7:00 AM - 3:00 PM" },
      ],
    },
  },
  {
    name: "Miral Youssef",
    role: "Administrator",
    phone: "+20 (113) 456-7890",
    shifts: {
      current: null, // Miral is off today
      upcoming: [
        { day: "SUN", date: 2, time: "9:00 AM - 5:00 PM" },
        { day: "TUE", date: 4, time: "9:00 AM - 5:00 PM" },
      ],
      past: [
        { day: "FRI", date: 31, time: "9:00 AM - 5:00 PM" },
        { day: "THU", date: 30, time: "9:00 AM - 5:00 PM" },
      ],
    },
  },
  {
    name: "Youssef Adel",
    role: "Cleaner",
    phone: "+20 (114) 567-8901",
    shifts: {
      current: { day: "SAT", date: 1, time: "6:00 AM - 2:00 PM" },
      upcoming: [
        { day: "MON", date: 3, time: "6:00 AM - 2:00 PM" },
        { day: "THU", date: 6, time: "6:00 AM - 2:00 PM" },
      ],
      past: [
        { day: "FRI", date: 31, time: "6:00 AM - 2:00 PM" },
        { day: "WED", date: 29, time: "6:00 AM - 2:00 PM" },
      ],
    },
  },
];

const StaffShifts = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);

  const openShifts = (staff) => setSelectedStaff(staff);
  const goBack = () => setSelectedStaff(null);

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'receptionist': return 'bg-pink-100 text-pink-700';
      case 'nurse': return 'bg-blue-100 text-blue-700';
      case 'administrator': return 'bg-purple-100 text-purple-700';
      case 'cleaner': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'receptionist': return <Phone className="text-pink-600" size={20} />;
      case 'nurse': return <User className="text-blue-600" size={20} />;
      case 'administrator': return <Briefcase className="text-purple-600" size={20} />;
      case 'cleaner': return <Coffee className="text-gray-600" size={20} />;
      default: return <User className="text-blue-600" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedStaff ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Staff Management
                  </h1>
                  <p className="text-blue-600 mt-1">
                    View and manage staff schedules and shifts
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Staff</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {staffMembers.length}
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
                        {staffMembers.filter(staff => staff.shifts.current !== null).length}
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
                      <p className="text-gray-600 text-sm">Off Duty Today</p>
                      <p className="text-2xl font-bold text-red-600">
                        {staffMembers.filter(staff => staff.shifts.current === null).length}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <XCircle className="text-red-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Unique Roles</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {[...new Set(staffMembers.map(staff => staff.role))].length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Briefcase className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers.map((staff) => (
                  <div key={staff.name} className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${getRoleColor(staff.role).replace('text-', 'bg-opacity-20 ')}`}>
                        {getRoleIcon(staff.role)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{staff.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Today's Status</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          staff.shifts.current !== null 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {staff.shifts.current !== null ? "On Duty" : "Off Duty"}
                        </span>
                      </div>
                      {staff.shifts.current !== null ? (
                        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span>{staff.shifts.current.time}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg text-center">
                          No shift scheduled for today
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{staff.shifts.upcoming.length} upcoming</span>
                      </div>
                      <button
                        onClick={() => openShifts(staff)} 
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
                Back to Staff
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl shadow-lg ${getRoleColor(selectedStaff.role).replace('text-', 'bg-gradient-to-r from-').replace('blue-700', 'blue-500 to-blue-600').replace('pink-700', 'pink-500 to-pink-600').replace('purple-700', 'purple-500 to-purple-600').replace('gray-700', 'gray-500 to-gray-600')}`}>
                  {getRoleIcon(selectedStaff.role)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedStaff.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-4 py-1.5 rounded-full font-medium ${getRoleColor(selectedStaff.role)}`}>
                      {selectedStaff.role}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone size={16} />
                      <span className="text-sm">{selectedStaff.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Today's Status</p>
                      <p className={`text-2xl font-bold ${selectedStaff.shifts.current ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStaff.shifts.current ? 'On Duty' : 'Off Duty'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${selectedStaff.shifts.current ? 'bg-green-100' : 'bg-red-100'}`}>
                      {selectedStaff.shifts.current ? 
                        <CheckCircle className="text-green-600" size={24} /> : 
                        <XCircle className="text-red-600" size={24} />
                      }
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Upcoming Shifts</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedStaff.shifts.upcoming.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Past Shifts</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {selectedStaff.shifts.past.length}
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
                <div className={`p-2 rounded-lg ${selectedStaff.shifts.current ? 'bg-gradient-to-r from-green-100 to-green-50' : 'bg-gradient-to-r from-red-100 to-red-50'}`}>
                  {selectedStaff.shifts.current ? 
                    <CheckCircle className="text-green-600" size={20} /> : 
                    <XCircle className="text-red-600" size={20} />
                  }
                </div>
                <h2 className="text-xl font-bold text-gray-800">Today's Shift</h2>
              </div>
              
              {selectedStaff.shifts.current ? (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-center rounded-xl w-16 py-3">
                        <div className="text-sm font-semibold">{selectedStaff.shifts.current.day}</div>
                        <div className="text-2xl">{selectedStaff.shifts.current.date}</div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg mb-1">{selectedStaff.shifts.current.time}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} />
                          <span className="text-sm">{selectedStaff.shifts.current.time.split(' - ')[0]} to {selectedStaff.shifts.current.time.split(' - ')[1]}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-semibold">
                      Currently On Duty
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 text-center">
                  <div className="p-3 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Coffee className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Day Off Today</h3>
                  <p className="text-gray-600">No shift scheduled for today</p>
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
              
              {selectedStaff.shifts.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStaff.shifts.upcoming.map((shift, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-bold text-center rounded-lg w-14 py-2">
                          <div className="text-xs font-semibold">{shift.day}</div>
                          <div className="text-xl">{shift.date}</div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 mb-1">{shift.time}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} />
                            <span className="text-sm">{shift.time.split(' - ')[0]} to {shift.time.split(' - ')[1]}</span>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No upcoming shifts scheduled</h3>
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
              
              {selectedStaff.shifts.past.length > 0 ? (
                <div className="space-y-4">
                  {selectedStaff.shifts.past.map((shift, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-600 font-bold text-center rounded-lg w-14 py-2">
                          <div className="text-xs font-semibold">{shift.day}</div>
                          <div className="text-xl">{shift.date}</div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 mb-1">{shift.time}</p>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock size={14} />
                            <span className="text-sm">{shift.time.split(' - ')[0]} to {shift.time.split(' - ')[1]}</span>
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

export default StaffShifts;