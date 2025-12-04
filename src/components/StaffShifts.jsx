import React, { useState } from "react";

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

  return (
    <div className="m-4 p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md">
      {!selectedStaff ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Staff</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((staff) => (
              <div
                key={staff.name}
                className="bg-gray-50 p-5 rounded-xl shadow-sm border text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-lg font-semibold">{staff.name}</h3>
                <p className="text-blue-600 mb-2">{staff.role}</p>
                <p className="text-sm text-gray-500 mb-4">{staff.phone}</p>
                <button
                  onClick={() => openShifts(staff)}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
                >
                  View Shifts
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={goBack}
            className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedStaff.name}'s Shifts
          </h2>

          {/* Current Shift */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Today's Shift</h3>
            {selectedStaff.shifts.current ? (
              <div className="flex items-center justify-between p-4 mb-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-700 font-bold text-center rounded-lg w-14 py-2">
                    <div className="text-sm">
                      {selectedStaff.shifts.current.day}
                    </div>
                    <div className="text-lg">
                      {selectedStaff.shifts.current.date}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedStaff.shifts.current.time}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 italic">Off today</p>
            )}
          </div>

          {/* Upcoming Shifts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Shifts</h3>
            {selectedStaff.shifts.upcoming.map((shift, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-700 font-bold text-center rounded-lg w-14 py-2">
                    <div className="text-sm">{shift.day}</div>
                    <div className="text-lg">{shift.date}</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{shift.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Past Shifts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Past Shifts</h3>
            {selectedStaff.shifts.past.map((shift, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 mb-3 bg-gray-100 rounded-lg border opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 text-gray-600 font-bold text-center rounded-lg w-14 py-2">
                    <div className="text-sm">{shift.day}</div>
                    <div className="text-lg">{shift.date}</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{shift.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffShifts;
