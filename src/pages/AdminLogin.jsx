import React, { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // Dummy admin credentials for testing
  const DUMMY_ADMIN = {
    username: 'admin',
    password: '1234'
  }

  function handleLogin(e) {
    e.preventDefault()
    if(username === DUMMY_ADMIN.username && password === DUMMY_ADMIN.password){
      onLogin(username, password)
    } else {
      alert('Invalid credential.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-20">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm">Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
      <div className="mt-4 text-sm text-gray-500">
        <strong>Test credentials:</strong> admin / 1234
      </div>
    </div>
  )
}

