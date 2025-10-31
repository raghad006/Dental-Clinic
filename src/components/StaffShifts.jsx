import React, { useState } from "react";

const staffMembers = [
  {
    name: "Alice Johnson",
    role: "Receptionist",
    phone: "+1 (555) 101-2345",
    shifts: [
      { date: "2024-07-01", day: "Monday", time: "8:00 AM - 4:00 PM" },
      { date: "2024-07-03", day: "Wednesday", time: "8:00 AM - 4:00 PM" },
    ],
  },
  {
    name: "Bob Smith",
    role: "Nurse",
    phone: "+1 (555) 202-3456",
    shifts: [
      { date: "2024-07-02", day: "Tuesday", time: "7:00 AM - 3:00 PM" },
      { date: "2024-07-04", day: "Thursday", time: "7:00 AM - 3:00 PM" },
    ],
  },
  {
    name: "Evelyn Green",
    role: "Administrator",
    phone: "+1 (555) 505-6789",
    shifts: [
      { date: "2024-07-01", day: "Monday", time: "9:00 AM - 5:00 PM" },
      { date: "2024-07-03", day: "Wednesday", time: "9:00 AM - 5:00 PM" },
    ],
  },
  {
    name: "Frank Taylor",
    role: "Cleaner",
    phone: "+1 (555) 606-7890",
    shifts: [
      { date: "2024-07-05", day: "Friday", time: "6:00 AM - 2:00 PM" },
      { date: "2024-07-06", day: "Saturday", time: "6:00 AM - 2:00 PM" },
    ],
  },
];

const StaffShifts = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);

  const openShifts = (staff) => setSelectedStaff(staff);
  const goBack = () => setSelectedStaff(null);

  return (
    <div className="flex-1 p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Staff</h1>

      {!selectedStaff ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((staff) => (
            <div
              key={staff.name}
              className="bg-white p-5 rounded-2xl shadow-sm border text-center"
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
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <button
            onClick={goBack}
            className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Staff
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Shifts for {selectedStaff.name}
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            {selectedStaff.shifts.map((shift, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold">
                  {shift.day}, {shift.date}:
                </span>{" "}
                {shift.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffShifts;
