import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Home() {
  const { doctors } = useApp()

  return (
    <div className="space-y-12">

      {/* Hero Section with Full Logo Background */}
      <section
        className="relative flex flex-col items-center justify-end text-center text-white py-20 rounded-xl mb-8 overflow-hidden"
        style={{
          backgroundImage: 'url("/Logo1.png")', // ✅ full background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '60vh',
        }}
      >
        {/* Optional overlay for contrast */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>

        {/* Book Button only */}
        <div className="relative z-10 pb-10">
          <Link
            to="/book"
            className="px-8 py-3 bg-white text-blue-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition text-lg"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Featured Doctors — view only */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Doctors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div
              key={d.id}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <img
                src="/user.png"
                alt={d.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-500"
              />
              <div className="font-semibold text-lg">{d.name}</div>
              <div className="text-sm text-gray-500">
                {d.specialty} • {d.years} yrs
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {d.location}
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
