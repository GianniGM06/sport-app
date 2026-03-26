import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import ProgressBar from '../components/seance/ProgressBar'
import ExerciseCard from '../components/seance/ExerciseCard'
import RestTimer from '../components/seance/RestTimer'
import useAppStore from '../store/useAppStore'
import { useCurrentSession } from '../hooks/useCurrentSession'

const FEELINGS = ['😴', '😐', '💪', '🔥']

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
      <PageWrapper>
        <div className="px-4 pt-12 pb-4 flex flex-col gap-6">
          <div>
            <p className="text-[#3B82F6] text-xs font-bold uppercase mb-1">{session.jour}</p>
            <h1 className="text-white font-bold text-2xl leading-tight">{session.titre}</h1>
            <p className="text-[#64748B] text-sm mt-2">{session.objectif}</p>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-4">
            <p className="text-[#F59E0B] text-xs font-bold uppercase mb-2">Échauffement</p>
            <p className="text-[#94A3B8] text-sm">{session.echauffement}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1E293B] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{session.exercices.length}</p>
              <p className="text-[#64748B] text-xs">exercices</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">~60</p>
              <p className="text-[#64748B] text-xs">minutes</p>
            </div>
          </div>

          <button
            onClick={() => startSeance(session.id)}
            className="w-full py-4 bg-[#3B82F6] text-white font-bold text-lg rounded-2xl active:scale-[0.98] transition-transform"
          >
            Commencer la séance ▶
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Finish modal
  if (showFinish) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col px-5 pt-12 pb-8">
        <h2 className="text-white font-bold text-2xl mb-2">Terminer la séance</h2>
        <p className="text-[#64748B] text-sm mb-6">Séance {session.titre}</p>

        <div className="space-y-4 flex-1">
          <div>
            <p className="text-[#64748B] text-xs font-semibold uppercase mb-2">Comment tu te sens ?</p>
            <div className="flex gap-3">
              {FEELINGS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setFeeling(i)}
                  className={`flex-1 py-3 rounded-xl text-2xl border transition-colors ${
                    feeling === i ? 'border-[#3B82F6] bg-[#3B82F6]/20' : 'border-[#334155] bg-[#1E293B]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#64748B] text-xs font-semibold uppercase mb-2">Note libre</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Comment s'est passée la séance ?"
              rows={4}
              className="w-full text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowFinish(false)}
            className="flex-1 py-3 rounded-xl border border-[#334155] text-[#64748B]"
          >
            Annuler
          </button>
          <button
            onClick={() => { saveLog({ note, feeling }); setShowFinish(false) }}
            className="flex-2 px-6 py-3 rounded-xl bg-[#22C55E] text-white font-bold"
          >
            Enregistrer ✓
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0F172A]">
      {/* Header */}
      <div className="flex-shrink-0 pt-12 pb-3 px-4 border-b border-[#1E293B]">
        <p className="text-[#3B82F6] text-xs font-bold uppercase">{session.jour}</p>
        <h1 className="text-white font-bold text-lg leading-tight">{session.titre}</h1>
      </div>

      <ProgressBar done={exercicesDone.length} total={session.exercices.length} />

      <div className="flex-1 overflow-y-auto pb-24">
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
              className="w-full py-4 bg-[#22C55E] text-white font-bold text-lg rounded-2xl"
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
