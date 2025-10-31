import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

function generateSlots(){
  const slots = []
  const today = new Date()
  for(let i=0;i<7;i++){
    const d = new Date()
    d.setDate(today.getDate()+i)
    slots.push({
      date: d.toISOString().slice(0,10),
      times: ['09:00','10:30','13:00','15:30']
    })
  }
  return slots
}

export default function Choose(){
  const { selectedDoctor, setDraftAppointment } = useApp()
  const [slots] = useState(generateSlots())
  const navigate = useNavigate()
  const [selected, setSelected] = useState({date:'',time:''})

  if(!selectedDoctor) return <div className="p-6 bg-white rounded shadow">Please select a doctor first. <button onClick={()=>navigate('/book')} className="text-blue-600">Go to Book</button></div>

  function pickSlot(date,time){
    setSelected({date,time})
    setDraftAppointment({ doctorId: selectedDoctor.id, doctorName: selectedDoctor.name, date, time })
  }

  function proceed(){
    if(!selected.date) return alert('Choose a slot')
    navigate('/confirm')
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Available slots — {selectedDoctor.name}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {slots.map(s=>(
          <div key={s.date} className="p-4 bg-white rounded shadow">
            <div className="font-medium">{s.date}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.times.map(t=>(
                <button key={t} onClick={()=>pickSlot(s.date,t)} className={selected.date===s.date && selected.time===t ? 'px-3 py-1 bg-blue-600 text-white rounded' : 'px-3 py-1 border rounded'}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button onClick={proceed} className="px-5 py-2 bg-blue-600 text-white rounded">Continue to Confirm</button>
      </div>
    </div>
  )
}