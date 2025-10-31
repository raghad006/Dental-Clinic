import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Navbar(){
  const { user } = useApp()
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-2xl font-bold text-blue-700">Dental Clinic</Link>
          <div className="text-sm text-gray-500">Your smile, our care</div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/book" className="text-gray-700 hover:text-blue-600">Book</Link>
          <Link to="/loyalty" className="text-gray-700 hover:text-blue-600">Loyalty</Link>
          <Link to="/receptionist" className="text-gray-700 hover:text-blue-600">Receptionist</Link>
          <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
          {user ? (
            <Link to="/profile" className="px-3 py-1 bg-blue-600 text-white rounded">{user.name}</Link>
          ) : (
            <Link to="/login" className="px-3 py-1 border border-blue-600 text-blue-600 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}