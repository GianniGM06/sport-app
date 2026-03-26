import { useState } from 'react'
import ExerciseTimer from './ExerciseTimer'
import PRBadge from './PRBadge'
import useAppStore from '../../store/useAppStore'

export default function ExerciseCard({ exercice, index, isDone, onDone, onUndone, onStartRest }) {
  const [expanded, setExpanded] = useState(false)
  const [newPR, setNewPR] = useState(false)
  const [poids, setPoids] = useState('')
  const [reps, setReps] = useState(typeof exercice.reps === 'number' ? String(exercice.reps) : '')

  const logSerie = useAppStore((s) => s.logSerie)
  const seriesLoggeesRaw = useAppStore((s) => s.seanceActive.seriesLoggees[exercice.id])
  const seriesLoggees = seriesLoggeesRaw ?? []
  const pr = useAppStore((s) => s.prs[exercice.id])

  const currentSerieNum = seriesLoggees.length + 1
  const allSeriesDone = seriesLoggees.length >= exercice.series

  const handleLogAndRest = () => {
    const p = parseFloat(poids) || 0
    const r = parseInt(reps) || 0
    const isPR = logSerie(exercice.id, { poids: p, reps: r })
    if (isPR) setNewPR((prev) => !prev)
    setPoids('')
    if (exercice.repos > 0) onStartRest(exercice.repos)
  }

  const handleDone = () => {
    onDone(exercice.id)
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
        {/* Status circle */}
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            isDone ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#334155]'
          }`}
          onClick={(e) => { e.stopPropagation(); if (isDone) onUndone(exercice.id) }}
        >
          {isDone
            ? <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
            : <span className="text-[#64748B] text-xs font-bold">{index + 1}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${isDone ? 'text-[#64748B] line-through' : 'text-white'}`}>
            {exercice.nom}
          </p>
          <p className="text-[#3B82F6] text-sm mt-0.5">
            {exercice.series} × {exercice.reps}
            <span className="text-[#64748B] ml-2">· {exercice.repos}s repos</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {seriesLoggees.length > 0 && (
            <span className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded-full font-medium">
              {seriesLoggees.length}/{exercice.series}
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
        <div className="px-4 pb-4 space-y-3 border-t border-[#0F172A] pt-3">

          {/* Notes */}
          {exercice.notes && (
            <p className="text-[#94A3B8] text-sm italic">{exercice.notes}</p>
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

          {/* Logged series */}
          {seriesLoggees.length > 0 && (
            <div className="space-y-1.5">
              {seriesLoggees.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#0F172A] rounded-lg px-3 py-2">
                  <span className="text-[#64748B] text-xs w-12 flex-shrink-0">Série {i + 1}</span>
                  <span className="text-[#22C55E] font-semibold text-sm">
                    {s.poids > 0 ? `${s.poids} kg` : 'Poids corps'} × {s.reps}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Current serie input + button */}
          {!isDone && !allSeriesDone && (
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[#64748B] text-xs mb-1 block">Poids (kg)</label>
                  <input
                    type="number"
                    value={poids}
                    onChange={(e) => setPoids(e.target.value)}
                    placeholder="0"
                    className="w-full text-center font-semibold"
                    step="2.5"
                    min="0"
                    inputMode="decimal"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[#64748B] text-xs mb-1 block">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder={String(exercice.reps ?? '')}
                    className="w-full text-center font-semibold"
                    min="1"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <button
                onClick={handleLogAndRest}
                className="w-full py-3.5 rounded-xl bg-[#3B82F6] text-white font-bold text-sm"
              >
                Série {currentSerieNum} — terminée →
              </button>
            </div>
          )}

          {/* Exercice terminé — only after all series logged */}
          {!isDone && allSeriesDone && (
            <button
              onClick={handleDone}
              className="w-full py-3.5 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-bold text-sm"
            >
              Exercice terminé ✓
            </button>
          )}
        </div>
      )}
    </div>
  )
}
