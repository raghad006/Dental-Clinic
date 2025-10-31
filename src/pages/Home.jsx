import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Home() {
  const { doctors } = useApp()
  return (
    <div className="space-y-12">

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 rounded-xl mb-8">
        <h1 className="text-4xl font-bold">Dental Clinic Management</h1>
        <p className="mt-3 max-w-xl">
          Book appointments, manage patients, and track rewards — all in one place.
        </p>
        <Link
          to="/book"
          className="mt-6 px-6 py-3 bg-white text-blue-700 rounded-full font-semibold shadow hover:shadow-lg transition"
        >
          Book Appointment
        </Link>
      </section>

      {/* Featured Doctors */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Featured Doctors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map(d => (
            <div key={d.id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center">
              <img
                src="/user.png"
                alt={d.name}
                className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-blue-500"
              />
              <div className="font-semibold text-lg">{d.name}</div>
              <div className="text-sm text-gray-500">
                {d.specialty} • {d.years} yrs
              </div>
              <div className="mt-4">
                <Link
                  to="/book"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Book with {d.name.split(' ')[1]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Locations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow flex flex-col items-center">
            <iframe
              title="Maddi Clinic"
              src="https://www.google.com/maps?q=Maddi+Clinic,+Cairo,+Egypt&output=embed"
              width="100%"
              height="200"
              className="rounded"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <p className="mt-2 font-medium">Maddi Clinic — 123 Main St.</p>
          </div>

          <div className="p-4 bg-white rounded shadow flex flex-col items-center">
            <iframe
              title="Zayed Clinic"
              src="https://www.google.com/maps?q=Zayed+Clinic,+Cairo,+Egypt&output=embed"
              width="100%"
              height="200"
              className="rounded"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <p className="mt-2 font-medium">Zayed Clinic — 456 Oak Ave.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
