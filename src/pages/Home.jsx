import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Home() {
  const { doctors } = useApp()
  return (
    <div>
      <section className="flex flex-col items-center text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 rounded-xl mb-8">
        <h1 className="text-4xl font-bold">Dental Clinic Management</h1>
        <p className="mt-3">
          Book appointments, manage patients, and track rewards — all in one place.
        </p>
        <Link
          to="/book"
          className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-full font-semibold"
        >
          Book Appointment
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Doctors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map(d => (
            <div key={d.id} className="p-4 bg-white rounded shadow">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-500">
                {d.specialty} • {d.years} yrs
              </div>
              <div className="mt-3">
                <Link to="/book" className="text-blue-600">
                  Book with {d.name.split(' ')[1]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Locations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">Downtown Clinic — 123 Main St.</div>
          <div className="p-4 bg-white rounded shadow">Uptown Branch — 456 Oak Ave.</div>
        </div>
      </section>
    </div>
  )
}
