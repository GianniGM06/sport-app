import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import ProgressBar from '../components/seance/ProgressBar'
import ExerciseCard from '../components/seance/ExerciseCard'
import RestTimer from '../components/seance/RestTimer'
import useAppStore from '../store/useAppStore'
import { useCurrentSession } from '../hooks/useCurrentSession'

const FEELINGS = [
  { emoji: '😴', label: 'Épuisé' },
  { emoji: '😐', label: 'Moyen' },
  { emoji: '💪', label: 'Bien' },
  { emoji: '🔥', label: 'Top' },
]

export default function SeanceDuJour() {
  const { session, isActive } = useCurrentSession()
  const seanceActive = useAppStore((s) => s.seanceActive)
  const startSeance = useAppStore((s) => s.startSeance)
  const markExerciceDone = useAppStore((s) => s.markExerciceDone)
  const unmarkExerciceDone = useAppStore((s) => s.unmarkExerciceDone)
  const saveLog = useAppStore((s) => s.saveLog)
  const resetSeanceActive = useAppStore((s) => s.resetSeanceActive)

  const [restSeconds, setRestSeconds] = useState(null)
  const [showFinish, setShowFinish] = useState(false)
  const [note, setNote] = useState('')
  const [feeling, setFeeling] = useState(2)

  if (!session) {
    return (
      <PageWrapper title="Séance du jour">
        <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
          <span className="text-6xl">🛌</span>
          <h2 className="text-white font-bold text-xl">Pas d'entraînement prévu</h2>
          <p className="text-[#64748B]">Récupération active aujourd'hui. Profite-en !</p>
        </div>
      </PageWrapper>
    )
  }

  const hasStarted = isActive && seanceActive.sessionId === session.id
  const exercicesDone = seanceActive.exercicesDone || []
  const allDone = hasStarted && exercicesDone.length === session.exercices.length

  if (!hasStarted) {
    return (
      <div className="h-full overflow-y-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="px-4 pt-14 pb-4 flex flex-col gap-5">
          {/* Hero card */}
          <div className="card-glass p-5" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
              >
                {session.jour}
              </span>
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

  // Finish modal (slide-up sheet)
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
          {/* Handle */}
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
              onClick={() => { saveLog({ note, feeling }); setShowFinish(false) }}
              className="btn-green shadow-green-glow flex-2 px-6 py-3 active:scale-[0.97] transition-transform"
            >
              Enregistrer ✓
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-12 pb-3 px-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
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

        {/* Finish button */}
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

      {/* Rest timer overlay */}
      {restSeconds !== null && (
        <RestTimer seconds={restSeconds} onDone={() => setRestSeconds(null)} />
      )}
    </div>
  )
}
