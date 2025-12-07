import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Book() {
  const { doctors, setSelectedDoctor } = useApp()
  const navigate = useNavigate()

  function selectDoctor(doc) {
    setSelectedDoctor(doc)
    navigate('/choose')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Choose a Doctor</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {doctors.map(d => (
          <div
            key={d.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <img
              src="/user.png"
              alt={d.name}
              className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-blue-500"
            />
            <div className="font-semibold text-lg">{d.name}</div>
            <div className="text-sm text-gray-500">
              {d.specialty} • {d.years} yrs
            </div>
            <button
              onClick={() => selectDoctor(d)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
