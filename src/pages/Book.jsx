import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Book(){
  const { doctors, setSelectedDoctor } = useApp()
  const navigate = useNavigate()

  function selectDoctor(doc){
    setSelectedDoctor(doc)
    navigate('/choose')
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Choose a Doctor</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {doctors.map(d=>(
          <div key={d.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{d.name}</div>
            <div className="text-sm text-gray-500">{d.specialty} • {d.years} yrs</div>
            <div className="mt-3">
              <button onClick={()=>selectDoctor(d)} className="px-4 py-2 bg-blue-600 text-white rounded">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}