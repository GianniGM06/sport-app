import { useState } from 'react'
import ExerciseTimer from './ExerciseTimer'
import PRBadge from './PRBadge'
import useAppStore from '../../store/useAppStore'

/** Arrondi au multiple de 2.5 le plus proche (incrément haltères) */
function roundTo2_5(kg) {
  return Math.round(kg / 2.5) * 2.5
}

/** Calcule le poids cible à partir d'un PR et d'un % */
function computeDefaultPoids(prPoids, pourcentagePR) {
  if (!prPoids || !pourcentagePR) return ''
  return String(roundTo2_5(prPoids * pourcentagePR / 100))
}

export default function ExerciseCard({ exercice, index, isDone, onDone, onUndone, onStartRest }) {
  const [expanded, setExpanded] = useState(false)
  const [newPR, setNewPR] = useState(false)

  const logSerie  = useAppStore((s) => s.logSerie)
  const seriesLoggeesRaw = useAppStore((s) => s.seanceActive.seriesLoggees[exercice.id])
  const seriesLoggees = seriesLoggeesRaw ?? []
  const pr = useAppStore((s) => s.prs[exercice.id])

  const defaultRepsStr = typeof exercice.reps === 'number' ? String(exercice.reps) : ''
  const initialPoids   = computeDefaultPoids(pr?.poids, exercice.pourcentagePR)

  const [poids, setPoids] = useState(initialPoids)
  const [reps,  setReps]  = useState(defaultRepsStr)

  const currentSerieNum = seriesLoggees.length + 1
  const allSeriesDone   = seriesLoggees.length >= exercice.series

  const handleLogAndRest = () => {
    const p = parseFloat(poids) || 0
    const r = parseInt(reps)   || 0
    const isPR = logSerie(exercice.id, { poids: p, reps: r })
    if (isPR) setNewPR((prev) => !prev)

    // Reset inputs — utilise le PR fraîchement mis à jour depuis le store
    const freshPR = useAppStore.getState().prs[exercice.id]
    setPoids(computeDefaultPoids(freshPR?.poids, exercice.pourcentagePR))
    setReps(defaultRepsStr)

    if (exercice.repos > 0) onStartRest(exercice.repos)
  }

  // Hint visuel : poids cible (recalculé live si le PR change dans la session)
  const targetPoids = pr?.poids
    ? `${computeDefaultPoids(pr.poids, exercice.pourcentagePR)} kg`
    : null

  return (
    <div className={`relative rounded-2xl border transition-all ${
      isDone
        ? 'bg-[#0F172A] border-[#22C55E]/30 opacity-70'
        : 'bg-[#1E293B] border-[#334155]'
    }`}>
      <PRBadge show={newPR} />

      {/* Header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
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

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#0F172A] pt-3">

          {/* Notes */}
          {exercice.notes && (
            <p className="text-[#94A3B8] text-sm italic">{exercice.notes}</p>
          )}

          {/* PR + cible */}
          {pr && (
            <div className="flex items-center gap-2 bg-[#F59E0B]/10 rounded-lg px-3 py-2">
              <span className="text-[#F59E0B] text-sm">🏆</span>
              <div className="flex-1">
                <span className="text-[#F59E0B] text-sm font-semibold">
                  PR : {pr.poids > 0 ? `${pr.poids} kg` : 'Poids corps'} × {pr.reps}
                </span>
                {exercice.pourcentagePR && targetPoids && (
                  <span className="text-[#64748B] text-xs ml-2">
                    → cible {exercice.pourcentagePR}% = {targetPoids}
                  </span>
                )}
              </div>
              <span className="text-[#64748B] text-xs">{pr.date}</span>
            </div>
          )}

          {/* Hint si pas encore de PR */}
          {!pr && exercice.pourcentagePR && (
            <div className="bg-[#334155]/40 rounded-lg px-3 py-2">
              <p className="text-[#64748B] text-xs">
                Cible semaine 1 : {exercice.pourcentagePR}% du PR — enregistre une série pour établir ton PR.
              </p>
            </div>
          )}

          {/* Exercise timer */}
          {exercice.type === 'temps' && exercice.duree && (
            <ExerciseTimer seconds={exercice.duree} onDone={() => {}} />
          )}

          {/* Séries loguées */}
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

          {/* Inputs + bouton série */}
          {!isDone && !allSeriesDone && (
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[#64748B] text-xs mb-1 block">
                    Poids (kg)
                    {exercice.pourcentagePR && pr && (
                      <span className="text-[#3B82F6] ml-1">· {exercice.pourcentagePR}% PR</span>
                    )}
                  </label>
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
                    placeholder={defaultRepsStr}
                    className="w-full text-center font-semibold"
                    min="1"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <button
                onClick={handleLogAndRest}
                className="w-full py-3.5 rounded-xl bg-[#3B82F6] text-white font-bold text-sm active:scale-[0.98] transition-transform"
              >
                Série {currentSerieNum} — terminée →
              </button>
            </div>
          )}

          {/* Exercice terminé */}
          {!isDone && allSeriesDone && (
            <button
              onClick={() => onDone(exercice.id)}
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
