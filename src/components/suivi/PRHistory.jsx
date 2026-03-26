import { useState } from 'react'
import useAppStore from '../../store/useAppStore'

export default function PRHistory() {
  const prs = useAppStore((s) => s.prs)
  const programme = useAppStore((s) => s.programme)
  const [expanded, setExpanded] = useState(null)

  // Build exercise map
  const exerciceMap = {}
  programme.forEach((session) => {
    session.exercices.forEach((ex) => {
      exerciceMap[ex.id] = ex.nom
    })
  })

  const prEntries = Object.entries(prs).filter(([, pr]) => pr !== null)

  if (prEntries.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-2xl p-6 text-center">
        <p className="text-[#64748B] text-sm">Aucun PR enregistré pour l'instant.</p>
        <p className="text-[#64748B] text-xs mt-1">Loggez vos séries pour suivre vos records !</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {prEntries.map(([exId, pr]) => (
        <div key={exId} className="bg-[#1E293B] rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === exId ? null : exId)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <span className="text-[#F59E0B]">🏆</span>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">{exerciceMap[exId] || exId}</p>
              <p className="text-[#3B82F6] text-sm">
                {pr.poids > 0 ? `${pr.poids} kg` : 'Poids corps'} × {pr.reps}
              </p>
            </div>
            <span className="text-[#64748B] text-xs">{pr.date}</span>
          </button>
        </div>
      ))}
    </div>
  )
}
