import { useState } from 'react'
import SeriesLogger from './SeriesLogger'
import ExerciseTimer from './ExerciseTimer'
import PRBadge from './PRBadge'
import useAppStore from '../../store/useAppStore'

export default function ExerciseCard({ exercice, index, isDone, onDone, onUndone, onStartRest }) {
  const [expanded, setExpanded] = useState(false)
  const [newPR, setNewPR] = useState(false)
  const logSerie = useAppStore((s) => s.logSerie)
  const seriesLoggeesRaw = useAppStore((s) => s.seanceActive.seriesLoggees[exercice.id])
  const seriesLoggees = seriesLoggeesRaw ?? []
  const pr = useAppStore((s) => s.prs[exercice.id])

  const handleLog = (entry) => {
    const isPR = logSerie(exercice.id, entry)
    if (isPR) setNewPR((p) => !p) // toggle to re-trigger badge
  }

  const handleDone = () => {
    onDone(exercice.id)
    if (exercice.repos > 0) onStartRest(exercice.repos)
  }

  return (
    <div className={`relative rounded-2xl border transition-all ${
      isDone
        ? 'bg-[#0F172A] border-[#22C55E]/30 opacity-70'
        : 'bg-[#1E293B] border-[#334155]'
    }`}>
      <PRBadge show={newPR} />

      {/* Header row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Done check */}
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            isDone ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#334155]'
          }`}
          onClick={(e) => { e.stopPropagation(); isDone ? onUndone(exercice.id) : null }}
        >
          {isDone && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>}
          {!isDone && <span className="text-[#64748B] text-xs font-bold">{index + 1}</span>}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${isDone ? 'text-[#64748B] line-through' : 'text-white'}`}>
            {exercice.nom}
          </p>
          <p className="text-[#3B82F6] text-sm mt-0.5">
            {exercice.series} × {exercice.reps}
            {exercice.type === 'temps' ? '' : ''}
            <span className="text-[#64748B] ml-2">· {exercice.repos}s repos</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {seriesLoggees.length > 0 && (
            <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full">
              {seriesLoggees.length}
            </span>
          )}
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className={`w-4 h-4 text-[#334155] transition-transform ${expanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#0F172A]">
          {/* Notes */}
          {exercice.notes && (
            <p className="text-[#94A3B8] text-sm pt-3 italic">{exercice.notes}</p>
          )}

          {/* PR */}
          {pr && (
            <div className="flex items-center gap-2 bg-[#F59E0B]/10 rounded-lg px-3 py-2">
              <span className="text-[#F59E0B] text-sm">🏆</span>
              <span className="text-[#F59E0B] text-sm font-semibold">
                PR : {pr.poids > 0 ? `${pr.poids} kg` : 'Poids corps'} × {pr.reps}
              </span>
              <span className="text-[#64748B] text-xs ml-auto">{pr.date}</span>
            </div>
          )}

          {/* Exercise timer for timed exercises */}
          {exercice.type === 'temps' && exercice.duree && (
            <ExerciseTimer seconds={exercice.duree} onDone={() => {}} />
          )}

          {/* Series logger */}
          <SeriesLogger
            exercice={exercice}
            seriesLoggees={seriesLoggees}
            onLog={handleLog}
          />

          {/* Done button */}
          {!isDone && (
            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-semibold text-sm"
            >
              Exercice terminé ✓
            </button>
          )}
        </div>
      )}
    </div>
  )
}
