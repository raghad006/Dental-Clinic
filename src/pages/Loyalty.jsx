import React from 'react'
import { useApp } from '../state/AppContext'

export default function Loyalty(){
  const { loyalty } = useApp()
  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Loyalty Points</h3>
      <div className="text-3xl font-bold text-blue-600">{loyalty} pts</div>
      <p className="mt-3 text-sm text-gray-600">You can redeem points for discounts on services.</p>
    </div>
  )
}