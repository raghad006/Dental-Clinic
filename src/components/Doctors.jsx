import React, { useState } from "react";

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
    <div className="m-4 p-6 border-2 border-gray-300 rounded-lg bg-white shadow-md">
      {!selectedDoctor ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Dentists</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div key={doc.name} className="bg-gray-50 p-5 rounded-xl shadow-sm border text-center">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-lg font-semibold">{doc.name}</h3>
                <p className="text-blue-600 mb-2">{doc.specialty}</p>
                <p className="text-sm text-gray-500 mb-4">{doc.phone}</p>
                <button
                  onClick={() => openShifts(doc)} 
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg"
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

          <h2 className="text-2xl font-bold mb-6 text-gray-800">{selectedDoctor.name}’s Shifts</h2>

          {/* Current Shift */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Current Shift</h3>
            {selectedDoctor.shifts.current.length > 0 ? (
              selectedDoctor.shifts.current.map((shift, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 mb-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-700 font-bold text-center rounded-lg w-14 py-2">
                      <div className="text-sm">{shift.day}</div>
                      <div className="text-lg">{shift.date}</div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{shift.time}</p>
                      <p className="text-gray-500 text-sm">{shift.location}</p>
                    </div>
                  </div>
                  <span className="text-green-700 font-semibold">On Duty</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Not on duty today</p>
            )}
          </div>

          {/* Upcoming Shifts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Shifts</h3>
            {selectedDoctor.shifts.upcoming.map((shift, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-700 font-bold text-center rounded-lg w-14 py-2">
                    <div className="text-sm">{shift.day}</div>
                    <div className="text-lg">{shift.date}</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{shift.time}</p>
                    <p className="text-gray-500 text-sm">{shift.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Past Shifts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Past Shifts</h3>
            {selectedDoctor.shifts.past.map((shift, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 mb-3 bg-gray-100 rounded-lg border opacity-60">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 text-gray-600 font-bold text-center rounded-lg w-14 py-2">
                    <div className="text-sm">{shift.day}</div>
                    <div className="text-lg">{shift.date}</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{shift.time}</p>
                    <p className="text-gray-500 text-sm">{shift.location}</p>
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

export default Doctors;
