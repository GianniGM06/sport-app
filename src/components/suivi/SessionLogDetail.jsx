import useAppStore from '../../store/useAppStore'

const FEELINGS = ['😴', '😐', '💪', '🔥']

export default function SessionLogDetail({ log, onClose }) {
  const programme = useAppStore((s) => s.programme)
  const updateLog = useAppStore((s) => s.updateLog)
  const prs = useAppStore((s) => s.prs)

  const session = programme.find((s) => s.id === log.sessionId)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0F172A] rounded-t-3xl max-h-[90vh] flex flex-col border-t border-[#334155]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#334155]" />
        </div>

        <div className="px-5 py-3 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <p className="text-[#64748B] text-xs">{log.date}</p>
            <h2 className="text-white font-bold text-base">{session?.titre || 'Séance'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{FEELINGS[log.feeling ?? 2]}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E293B] text-[#64748B]"
            >✕</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 pb-8">
          {/* Feeling */}
          <div>
            <p className="text-[#64748B] text-xs font-semibold uppercase mb-2">Ressenti</p>
            <div className="flex gap-3">
              {FEELINGS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => updateLog(log.id, { feeling: i })}
                  className={`flex-1 py-2 rounded-xl text-xl border ${
                    (log.feeling ?? 2) === i ? 'border-[#3B82F6] bg-[#3B82F6]/20' : 'border-[#334155]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Note libre */}
          <div>
            <p className="text-[#64748B] text-xs font-semibold uppercase mb-2">Note</p>
            <textarea
              value={log.note || ''}
              onChange={(e) => updateLog(log.id, { note: e.target.value })}
              placeholder="Ajouter une note…"
              rows={3}
              className="w-full text-sm resize-none"
            />
          </div>

          {/* Exercices logués */}
          {session?.exercices.map((ex) => {
            const series = log.seriesLoggees?.[ex.id] || []
            if (series.length === 0) return null
            const prHit = log.prsHit?.includes(ex.id)

            return (
              <div key={ex.id} className="bg-[#1E293B] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-white text-sm">{ex.nom}</p>
                  {prHit && <span className="text-[#F59E0B] text-xs font-bold">🏆 PR</span>}
                </div>
                <div className="space-y-1">
                  {series.map((s, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-[#64748B] w-5">S{i + 1}</span>
                      <span className="text-white font-medium">
                        {s.poids > 0 ? `${s.poids} kg` : 'Poids corps'} × {s.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
