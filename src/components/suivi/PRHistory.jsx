import useAppStore from '../../store/useAppStore'

export default function PRHistory() {
  const prs = useAppStore((s) => s.prs)
  const programme = useAppStore((s) => s.programme)

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
      <div className="card-glass p-6 text-center" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <p className="text-4xl mb-3">🏆</p>
        <p className="text-white font-semibold">Aucun PR enregistré</p>
        <p className="text-[#64748B] text-sm mt-1">Loggez vos séries pour suivre vos records !</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {prEntries.map(([exId, pr]) => (
        <div
          key={exId}
          className="card-glass flex items-center gap-3 px-4 py-3"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <span className="text-xl">🏆</span>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{exerciceMap[exId] || exId}</p>
            <p className="text-[#F59E0B] text-sm font-semibold">
              {pr.poids > 0 ? `${pr.poids} kg` : 'Poids corps'} × {pr.reps}
            </p>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            {pr.date}
          </span>
        </div>
      ))}
    </div>
  )
}
