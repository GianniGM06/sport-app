import { useState } from 'react'
import ProgressBar from '../components/seance/ProgressBar'
import ExerciseCard from '../components/seance/ExerciseCard'
import RestTimer from '../components/seance/RestTimer'
import useAppStore from '../store/useAppStore'
import { getTodayName, getToday, getWeekDates } from '../utils/dateUtils'

const FEELINGS = [
  { emoji: '😴', label: 'Épuisé' },
  { emoji: '😐', label: 'Moyen' },
  { emoji: '💪', label: 'Bien' },
  { emoji: '🔥', label: 'Top' },
]

const SESSION_COLORS = {
  lundi:    { bg: 'rgba(59,130,246,0.15)',  text: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  mardi:    { bg: 'rgba(139,92,246,0.15)',  text: '#8B5CF6', border: 'rgba(139,92,246,0.3)' },
  mercredi: { bg: 'rgba(34,197,94,0.15)',   text: '#22C55E', border: 'rgba(34,197,94,0.3)'  },
  jeudi:    { bg: 'rgba(245,158,11,0.15)',  text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
}

export default function SeanceDuJour() {
  const programme        = useAppStore((s) => s.programme)
  const seanceActive     = useAppStore((s) => s.seanceActive)
  const logs             = useAppStore((s) => s.logs)
  const startSeance      = useAppStore((s) => s.startSeance)
  const markExerciceDone = useAppStore((s) => s.markExerciceDone)
  const unmarkExerciceDone = useAppStore((s) => s.unmarkExerciceDone)
  const saveLog          = useAppStore((s) => s.saveLog)

  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [restSeconds, setRestSeconds]   = useState(null)
  const [showFinish, setShowFinish]     = useState(false)
  const [note, setNote]                 = useState('')
  const [feeling, setFeeling]           = useState(2)

  const todayDate = getToday()
  const todayName = getTodayName()

  // Sessions déjà faites cette semaine
  const weekStart = getWeekDates()[0]
  const doneThisWeek = new Set(
    logs.filter((l) => l.date >= weekStart).map((l) => l.sessionId)
  )

  // Si une séance est déjà active aujourd'hui, on l'affiche directement
  const isActiveTodaySession = !!(seanceActive.sessionId && seanceActive.date === todayDate)
  const currentSessionId = isActiveTodaySession ? seanceActive.sessionId : selectedSessionId
  const session = currentSessionId ? programme.find((s) => s.id === currentSessionId) : null
  const hasStarted = isActiveTodaySession && seanceActive.sessionId === currentSessionId

  const exercicesDone = seanceActive.exercicesDone || []
  const allDone = hasStarted && session && exercicesDone.length === session.exercices.length

  // ── PICKER ────────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="h-full overflow-y-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="px-4 pt-14 pb-4 flex flex-col gap-4">
          <div>
            <h1 className="text-white font-bold text-2xl">Choisir une séance</h1>
            <p className="text-[#64748B] text-sm mt-1">Sélectionne la séance que tu veux faire</p>
          </div>

          {programme.map((s) => {
            const color = SESSION_COLORS[s.jour] || SESSION_COLORS.lundi
            const isToday = s.jour === todayName
            const isDoneThisWeek = doneThisWeek.has(s.id)

            return (
              <button
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                className="card-glass p-4 text-left w-full transition-all active:scale-[0.98]"
                style={isDoneThisWeek ? { opacity: 0.45 } : {}}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {s.jour}
                      </span>
                      {isToday && !isDoneThisWeek && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' }}
                        >
                          ✦ Suggérée aujourd'hui
                        </span>
                      )}
                      {isDoneThisWeek && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}
                        >
                          ✓ Faite cette semaine
                        </span>
                      )}
                    </div>
                    <p className="text-white font-semibold text-sm leading-tight">{s.titre}</p>
                    <p className="text-[#64748B] text-xs mt-1">{s.exercices.length} exercices</p>
                  </div>
                  <svg
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    className="w-4 h-4 flex-shrink-0 mt-1"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const sessionColor = SESSION_COLORS[session.jour] || SESSION_COLORS.lundi

  // ── PRÉ-SÉANCE ────────────────────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="h-full overflow-y-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="px-4 pt-14 pb-4 flex flex-col gap-5">
          {/* Retour */}
          <button
            onClick={() => setSelectedSessionId(null)}
            className="flex items-center gap-1.5 text-[#64748B] text-sm w-fit active:opacity-70"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Toutes les séances
          </button>

          {/* Hero */}
          <div className="card-glass p-5" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                style={{ background: sessionColor.bg, color: sessionColor.text }}
              >
                {session.jour}
              </span>
              {session.jour === todayName && (
                <span className="text-xs text-[#64748B]">· Séance suggérée</span>
              )}
            </div>
            <h1 className="text-white font-bold text-2xl leading-tight mb-2">{session.titre}</h1>
            <p className="text-[#94A3B8] text-sm leading-relaxed">{session.objectif}</p>
          </div>

          {/* Échauffement */}
          <div className="card-glass p-4" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-2">Échauffement</p>
            <p className="text-[#94A3B8] text-sm">{session.echauffement}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-glass p-4 text-center" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <p className="text-3xl font-bold text-white">{session.exercices.length}</p>
              <p className="text-[#64748B] text-xs mt-1">exercices</p>
            </div>
            <div className="card-glass p-4 text-center" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <p className="text-3xl font-bold text-white">~60</p>
              <p className="text-[#64748B] text-xs mt-1">minutes</p>
            </div>
          </div>

          <button
            onClick={() => startSeance(session.id)}
            className="btn-blue shadow-blue-glow w-full py-4 text-lg rounded-2xl active:scale-[0.98] transition-transform"
          >
            Commencer la séance ▶
          </button>
        </div>
      </div>
    )
  }

  // ── MODAL TERMINER ────────────────────────────────────────────────────────
  if (showFinish) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end"
        style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        <div
          className="card-glass flex flex-col px-5 pt-3 pb-8"
          style={{
            borderRadius: '1.5rem 1.5rem 0 0',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(15,23,42,0.95)',
            paddingBottom: 'max(2rem, calc(1.5rem + env(safe-area-inset-bottom)))',
          }}
        >
          <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.2)' }} />

          <h2 className="text-white font-bold text-2xl mb-1">Terminer la séance</h2>
          <p className="text-[#64748B] text-sm mb-6">{session.titre}</p>

          <div className="space-y-5 flex-1">
            <div>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-3">Comment tu te sens ?</p>
              <div className="flex gap-2">
                {FEELINGS.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setFeeling(i)}
                    className="flex-1 flex flex-col items-center py-3 rounded-xl transition-all"
                    style={feeling === i
                      ? { border: '1px solid rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.15)' }
                      : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }
                    }
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span className="text-[10px] mt-1" style={{ color: feeling === i ? '#3B82F6' : '#64748B' }}>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Note libre</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Comment s'est passée la séance ?"
                rows={3}
                className="w-full text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowFinish(false)}
              className="flex-1 py-3 rounded-xl text-[#64748B] font-medium"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Annuler
            </button>
            <button
              onClick={() => {
                saveLog({ note, feeling })
                setShowFinish(false)
                setSelectedSessionId(null)
              }}
              className="btn-green shadow-green-glow flex-2 px-6 py-3 active:scale-[0.97] transition-transform"
            >
              Enregistrer ✓
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── SÉANCE ACTIVE ─────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-12 pb-3 px-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
            style={{ background: sessionColor.bg, color: sessionColor.text }}
          >
            {session.jour}
          </span>
        </div>
        <h1 className="text-white font-bold text-lg leading-tight mt-1">{session.titre}</h1>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        <ProgressBar done={exercicesDone.length} total={session.exercices.length} />

        <div className="px-4 py-4 space-y-3">
          {session.exercices.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              exercice={ex}
              index={i}
              isDone={exercicesDone.includes(ex.id)}
              onDone={markExerciceDone}
              onUndone={unmarkExerciceDone}
              onStartRest={setRestSeconds}
            />
          ))}
        </div>

        {allDone && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowFinish(true)}
              className="btn-green shadow-green-glow w-full py-4 text-lg rounded-2xl active:scale-[0.98] transition-transform"
            >
              Terminer la séance 🏁
            </button>
          </div>
        )}
      </div>

      {restSeconds !== null && (
        <RestTimer seconds={restSeconds} onDone={() => setRestSeconds(null)} />
      )}
    </div>
  )
}
