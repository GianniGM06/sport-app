import { useState } from 'react'

export default function SeriesLogger({ exercice, seriesLoggees = [], onLog }) {
  const [poids, setPoids] = useState('')
  const [reps, setReps] = useState(
    typeof exercice.reps === 'number' ? String(exercice.reps) : ''
  )

  const handleAdd = () => {
    const p = parseFloat(poids) || 0
    const r = parseInt(reps) || 0
    if (r === 0 && exercice.type === 'reps') return
    onLog({ poids: p, reps: r })
    // Reset only poids, keep reps
    setPoids('')
  }

  return (
    <div className="space-y-3">
      {/* Logged series */}
      {seriesLoggees.length > 0 && (
        <div className="space-y-1.5">
          {seriesLoggees.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#0F172A] rounded-lg px-3 py-2">
              <span className="text-[#64748B] text-xs w-6">S{i + 1}</span>
              <span className="text-[#22C55E] font-semibold text-sm flex-1">
                {s.poids > 0 ? `${s.poids} kg` : 'Poids corps'} × {s.reps} reps
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[#64748B] text-xs mb-1 block">Poids (kg)</label>
          <input
            type="number"
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
            placeholder="0"
            className="w-full text-center text-white font-semibold"
            step="2.5"
            min="0"
          />
        </div>
        <div className="flex-1">
          <label className="text-[#64748B] text-xs mb-1 block">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder={exercice.type === 'temps' ? 'sec' : String(exercice.reps || '')}
            className="w-full text-center text-white font-semibold"
            min="1"
          />
        </div>
        <div className="flex flex-col justify-end">
          <label className="text-transparent text-xs mb-1 block select-none">log</label>
          <button
            onClick={handleAdd}
            className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-semibold min-h-[44px] min-w-[64px]"
          >
            + Log
          </button>
        </div>
      </div>
    </div>
  )
}
