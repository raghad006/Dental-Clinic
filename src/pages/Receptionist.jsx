import React from 'react'
import { useApp } from '../state/AppContext'

export default function Receptionist(){
  const { appointments, setAppointments } = useApp()

  function toggleArrived(id){
    setAppointments(prev => prev.map(a=> a.id===id ? {...a, arrived: !a.arrived} : a))
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Receptionist — Today's Appointments</h3>
      <div className="space-y-3">
        {appointments.length? appointments.map(a=>(
          <div key={a.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{a.doctorName}</div>
              <div className="text-sm text-gray-600">{a.date} {a.time}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>toggleArrived(a.id)} className={a.arrived? 'px-3 py-1 bg-green-600 text-white rounded':'px-3 py-1 border rounded'}>{a.arrived? 'Arrived':'Mark Arrived'}</button>
            </div>
          </div>
        )) : <div className="text-gray-600">No appointments scheduled.</div>}
      </div>
    </div>
  )
}