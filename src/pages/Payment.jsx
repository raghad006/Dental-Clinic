import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function Payment(){
  const loc = useLocation()
  const navigate = useNavigate()
  const { appointments, completePayment } = useApp()
  const appointmentId = loc.state?.appointmentId
  const appt = appointments.find(a=>a.id===appointmentId)
  const [method, setMethod] = useState('visa')
  const [amount, setAmount] = useState(100)

  if(!appt) return <div className="p-6 bg-white rounded shadow">Appointment not found.</div>

  function handlePay(){
    // simulate processing
    completePayment(appointmentId, amount)
    navigate('/success', { state: { appointmentId } })
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Payment</h3>
      <div className="space-y-3">
        <div><strong>Doctor:</strong> {appt.doctorName}</div>
        <div><strong>Date:</strong> {appt.date} {appt.time}</div>
        <div>
          <label className="block text-sm">Amount (EGP)</label>
          <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-2">Payment Method</label>
          <div className="flex gap-3">
            <button onClick={()=>setMethod('visa')} className={method==='visa'?'px-3 py-2 bg-blue-600 text-white rounded':'px-3 py-2 border rounded'}>Visa</button>
            <button onClick={()=>setMethod('instapay')} className={method==='instapay'?'px-3 py-2 bg-blue-600 text-white rounded':'px-3 py-2 border rounded'}>Instapay</button>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handlePay} className="px-4 py-2 bg-green-600 text-white rounded">Pay Now</button>
        </div>
      </div>
    </div>
  )
}