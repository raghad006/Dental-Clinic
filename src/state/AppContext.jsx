import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

const sampleDoctors = [
  { id: 'd1', name: 'Dr. Amina Salah', specialty: 'Dentist', years: 8, location: 'Downtown' },
  { id: 'd2', name: 'Dr. Karim Hassan', specialty: 'Orthodontist', years: 12, location: 'Uptown' },
  { id: 'd3', name: 'Dr. Leila Nasser', specialty: 'Pediatric Dentist', years: 6, location: 'City Clinic' },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // {name, email}
  const [doctors] = useState(sampleDoctors)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [draftAppointment, setDraftAppointment] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loyalty, setLoyalty] = useState(120) // sample points

  function bookAppointment(appointment) {
    const appt = { id: 'a' + (appointments.length + 1), ...appointment }
    setAppointments(prev => [...prev, appt])
    setDraftAppointment(null)
    return appt
  }

  function completePayment(appointmentId, amount=0) {
    // increment loyalty as simple simulation
    setLoyalty(prev => prev + Math.round(amount/10) + 10)
    setAppointments(prev => prev.map(a => a.id===appointmentId ? {...a, paid:true} : a))
  }

  return (
    <AppContext.Provider value={{
      user, setUser, doctors, selectedDoctor, setSelectedDoctor,
      draftAppointment, setDraftAppointment, appointments, bookAppointment,
      loyalty, completePayment, setAppointments
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)