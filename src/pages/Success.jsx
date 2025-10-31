import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Success(){
  const loc = useLocation()
  const { appointments } = useApp()
  const appointmentId = loc.state?.appointmentId
  const appt = appointments.find(a=>a.id===appointmentId)

  if(!appt) return <div className="p-6 bg-white rounded shadow">Appointment not found.</div>

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Payment Successful</h3>
      <div className="space-y-2">
        <div><strong>Doctor:</strong> {appt.doctorName}</div>
        <div><strong>Date:</strong> {appt.date}</div>
        <div><strong>Time:</strong> {appt.time}</div>
      </div>
      <div className="mt-4">
        <Link to="/profile" className="px-4 py-2 bg-blue-600 text-white rounded">Go to Profile</Link>
      </div>
    </div>
  )
}