import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

// 🦷 Global list of doctors — includes branches & distinct schedules per branch
const sampleDoctors = [
  {
    id: "d1",
    name: "Dr. Belal Mattar",
    specialty: "Orthodontist",
    years: 8,
    branches: ["Zayed"],
    branchSchedules: {
      Zayed: ["09:00", "10:30", "12:00", "13:30", "15:00"],
    },
    image: "/user.png",
  },
  {
    id: "d2",
    name: "Dr. Ahmed Saeed",
    specialty: "Orthodontist",
    years: 12,
    branches: ["Maadi"],
    branchSchedules: {
      Maadi: ["09:30", "11:00", "12:30", "14:00", "15:30"],
    },
    image: "/user.png",
  },
  {
    id: "d3",
    name: "Dr. Habiba Raslan",
    specialty: "Pediatric Dentist",
    years: 6,
    branches: ["Maadi", "Zayed"],
    branchSchedules: {
      Maadi: ["09:00", "10:30", "12:00", "13:30"],
      Zayed: ["14:30", "16:00", "17:30"], // no overlap
    },
    image: "/user.png",
  },
  {
    id: "d4",
    name: "Dr. Mohamed Hashem",
    specialty: "Cosmetic Dentist",
    years: 8,
    branches: ["Maadi"],
    branchSchedules: {
      Maadi: ["09:00", "10:30", "12:00", "13:30", "15:00"],
    },
    image: "/user.png",
  },
  {
    id: "d5",
    name: "Dr. Mohanad El Akabawy",
    specialty: "Cosmetic & Implant Dentist",
    years: 6,
    branches: ["Maadi", "Zayed"],
    branchSchedules: {
      Maadi: ["09:00", "10:30", "12:00", "13:30"], // morning
      Zayed: ["15:00", "16:30", "18:00"], // evening
    },
    image: "/user.png",
  },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [doctors] = useState(sampleDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [draftAppointment, setDraftAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loyalty, setLoyalty] = useState(120);

  // ✅ Load booked appointments globally from localStorage
  const [bookedAppointments, setBookedAppointments] = useState(() => {
    const saved = localStorage.getItem("bookedAppointments");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save booked appointments persistently
  useEffect(() => {
    localStorage.setItem("bookedAppointments", JSON.stringify(bookedAppointments));
  }, [bookedAppointments]);

  // ✅ Check if a doctor’s slot is already taken (also checks branch)
  const isSlotTaken = (doctorId, date, time, branch) => {
    return bookedAppointments.some(
      (b) =>
        b.doctorId === doctorId &&
        b.date === date &&
        b.time === time &&
        b.branch === branch
    );
  };

  // ✅ Book appointment globally (with branch)
  const bookAppointment = (appointment) => {
    const appt = { id: "a" + (appointments.length + 1), ...appointment };
    setAppointments((prev) => [...prev, appt]);
    setBookedAppointments((prev) => [...prev, appt]);
    setDraftAppointment(null);
    return appt;
  };

  // ✅ Mark appointment as paid + add loyalty points
  const completePayment = (appointmentId, amount = 0) => {
    setLoyalty((prev) => prev + Math.round(amount / 10) + 10);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, paid: true } : a
      )
    );
  };

  // ✅ Cancel an appointment (soft delete)
  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    setBookedAppointments((prev) =>
      prev.filter((a) => a.id !== appointmentId)
    );
    localStorage.setItem(
      "bookedAppointments",
      JSON.stringify(
        bookedAppointments.filter((a) => a.id !== appointmentId)
      )
    );
  };

  // ✅ Reschedule an appointment (update date/time)
  const rescheduleAppointment = (appointmentId, newDate, newTime, branch) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, date: newDate, time: newTime, branch }
          : a
      )
    );
    setBookedAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, date: newDate, time: newTime, branch }
          : a
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        draftAppointment,
        setDraftAppointment,
        appointments,
        setAppointments,
        bookAppointment,
        bookedAppointments,
        isSlotTaken,
        loyalty,
        completePayment,
        cancelAppointment,
        rescheduleAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
