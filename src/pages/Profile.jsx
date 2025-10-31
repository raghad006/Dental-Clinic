import React from 'react'
import { useApp } from '../state/AppContext'
import { Link } from 'react-router-dom'

export default function Profile(){
  const { user, appointments } = useApp()
  if(!user) return <div className="p-6 bg-white rounded shadow">Not logged in. <Link to="/login" className="text-blue-600">Login</Link></div>

  const my = appointments.filter(a=>a.patientName===user.name || !a.patientName)

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Patient Profile</h3>
      <div><strong>Name:</strong> {user.name}</div>
      <div className="mt-4">
        <h4 className="font-semibold">Appointments</h4>
        {my.length? my.map(a=>(
          <div key={a.id} className="p-3 border rounded mt-2">
            <div><strong>{a.doctorName}</strong> — {a.date} {a.time}</div>
            <div className="text-sm text-gray-600">{a.paid? 'Paid':'Pending Payment'}</div>
          </div>
        )) : <div className="text-gray-600">No appointments yet.</div>}
      </div>
    </div>
  )
}