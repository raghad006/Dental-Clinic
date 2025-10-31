import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Login() {
  const { setUser } = useApp()
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()
    if (!name) return alert('Enter a name')
    setUser({ name })
    navigate('/profile')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-20">
      <h2 className="text-xl font-semibold mb-4">Patient Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm">Full name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Enter</button>
      </form>
    </div>
  )
}
