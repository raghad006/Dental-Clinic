import React, { useState } from "react";

const doctors = [
  { 
    name: "Dr. Ava Chen", 
    specialty: "Cardiologist", 
    phone: "+1 (555) 123-4567",
    shifts: [
      { date: "2026-07-01", day: "Monday", time: "9:00 AM - 1:00 PM" },
      { date: "2026-07-03", day: "Wednesday", time: "2:00 PM - 6:00 PM" }
    ]
  },
  { 
    name: "Dr. Marcus Lee", 
    specialty: "Pediatrician", 
    phone: "+1 (555) 234-5678",
    shifts: [
      { date: "2026-07-02", day: "Tuesday", time: "8:00 AM - 12:00 PM" },
      { date: "2026-07-04", day: "Thursday", time: "1:00 PM - 5:00 PM" }
    ]
  },
  { 
    name: "Dr. Sarah Bell", 
    specialty: "Neurologist", 
    phone: "+1 (555) 345-6789",
    shifts: [
      { date: "2026-07-01", day: "Monday", time: "10:00 AM - 2:00 PM" },
      { date: "2026-07-05", day: "Friday", time: "3:00 PM - 7:00 PM" }
    ]
  },
  { 
    name: "Dr. James Carter", 
    specialty: "Dermatologist", 
    phone: "+1 (555) 456-7890",
    shifts: [
      { date: "2026-07-02", day: "Tuesday", time: "9:00 AM - 1:00 PM" },
      { date: "2026-07-04", day: "Thursday", time: "2:00 PM - 6:00 PM" }
    ]
  },
  { 
    name: "Dr. Emily White", 
    specialty: "Orthopedist", 
    phone: "+1 (555) 567-8901",
    shifts: [
      { date: "2026-07-01", day: "Monday", time: "8:00 AM - 12:00 PM" },
      { date: "2026-07-03", day: "Wednesday", time: "1:00 PM - 5:00 PM" }
    ]
  },
  { 
    name: "Dr. David Green", 
    specialty: "General Practitioner", 
    phone: "+1 (555) 678-9012",
    shifts: [
      { date: "2026-07-05", day: "Friday", time: "10:00 AM - 2:00 PM" },
      { date: "2026-07-06", day: "Saturday", time: "3:00 PM - 7:00 PM" }
    ]
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
      <h1 className="text-3xl font-bold mb-6">Doctors</h1>

      {!selectedDoctor ? (
        <div className="grid grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.name} className="bg-gray-50 p-5 rounded-xl shadow-sm border text-center">

              {/* ✅ User image */}
              <img 
                src= "/user.png"
                alt="doctor" 
                className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border"
              />

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
      ) : (
        <div>
          <button
            onClick={goBack}
            className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Doctors
          </button>

          <h2 className="text-2xl font-semibold mb-4">Shifts for {selectedDoctor.name}</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            {selectedDoctor.shifts.map((shift, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold">{shift.day}, {shift.date}:</span> {shift.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Doctors;
