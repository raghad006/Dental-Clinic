import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Confirm(){
  const { draftAppointment, bookAppointment } = useApp()
  const navigate = useNavigate()

  if(!draftAppointment) return <div className="p-6 bg-white rounded shadow">No appointment selected. <button onClick={()=>navigate('/book')} className="text-blue-600">Start Booking</button></div>

  function handleConfirm(){
    const appt = bookAppointment({...draftAppointment, paid:false})
    navigate('/payment', { state: { appointmentId: appt.id } })
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Confirm Appointment</h3>
      <div className="space-y-2">
        <div><strong>Doctor:</strong> {draftAppointment.doctorName}</div>
        <div><strong>Date:</strong> {draftAppointment.date}</div>
        <div><strong>Time:</strong> {draftAppointment.time}</div>
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">Proceed to Payment</button>
        <button onClick={()=>navigate('/choose')} className="px-4 py-2 border rounded">Back</button>
      </div>
    </div>
  )
}