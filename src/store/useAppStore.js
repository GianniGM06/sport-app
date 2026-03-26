import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultProfil } from './data/defaultProfil'
import { defaultProgramme } from './data/defaultProgramme'

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── PROFIL ────────────────────────────────────────────────────────
      profil: { ...defaultProfil },

      setProfil: (updates) =>
        set((s) => ({ profil: { ...s.profil, ...updates } })),

      updatePoids: (valeur) => {
        const date = new Date().toISOString().split('T')[0]
        set((s) => ({
          profil: {
            ...s.profil,
            poids: valeur,
            historiquePoids: [
              ...s.profil.historiquePoids,
              { date, valeur },
            ],
          },
        }))
      },

      // ── PROGRAMME (statique) ──────────────────────────────────────────
      programme: defaultProgramme,

      // ── SÉANCE ACTIVE ─────────────────────────────────────────────────
      seanceActive: {
        sessionId: null,
        date: null,
        exercicesDone: [],
        seriesLoggees: {},
      },

      startSeance: (sessionId) => {
        const date = new Date().toISOString().split('T')[0]
        set({
          seanceActive: {
            sessionId,
            date,
            exercicesDone: [],
            seriesLoggees: {},
          },
        })
      },

      logSerie: (exerciceId, { poids, reps }) => {
        const timestamp = Date.now()
        set((s) => {
          const existing = s.seanceActive.seriesLoggees[exerciceId] || []
          return {
            seanceActive: {
              ...s.seanceActive,
              seriesLoggees: {
                ...s.seanceActive.seriesLoggees,
                [exerciceId]: [...existing, { poids, reps, timestamp }],
              },
            },
          }
        })
        // Check PR
        if (poids > 0) {
          const currentPR = get().prs[exerciceId]
          if (!currentPR || poids > currentPR.poids) {
            const date = new Date().toISOString().split('T')[0]
            get().updatePR(exerciceId, { poids, reps, date })
            return true // new PR
          }
        }
        return false
      },

      markExerciceDone: (exerciceId) =>
        set((s) => ({
          seanceActive: {
            ...s.seanceActive,
            exercicesDone: s.seanceActive.exercicesDone.includes(exerciceId)
              ? s.seanceActive.exercicesDone
              : [...s.seanceActive.exercicesDone, exerciceId],
          },
        })),

      unmarkExerciceDone: (exerciceId) =>
        set((s) => ({
          seanceActive: {
            ...s.seanceActive,
            exercicesDone: s.seanceActive.exercicesDone.filter((id) => id !== exerciceId),
          },
        })),

      saveLog: (extra) => {
        const { seanceActive, programme } = get()
        const session = programme.find((s) => s.id === seanceActive.sessionId)
        if (!session) return

        // Determine PRs hit this session
        const prsHit = []
        Object.entries(seanceActive.seriesLoggees).forEach(([exId, series]) => {
          const maxPoids = Math.max(...series.map((s) => s.poids || 0))
          const pr = get().prs[exId]
          if (pr && pr.date === new Date().toISOString().split('T')[0]) {
            prsHit.push(exId)
          }
        })

        const logEntry = {
          id: `log_${seanceActive.date}_${seanceActive.sessionId}`,
          sessionId: seanceActive.sessionId,
          date: seanceActive.date,
          seriesLoggees: { ...seanceActive.seriesLoggees },
          prsHit,
          note: extra?.note || '',
          feeling: extra?.feeling ?? 2,
        }

        set((s) => ({
          logs: [...s.logs, logEntry],
          seanceActive: {
            sessionId: null,
            date: null,
            exercicesDone: [],
            seriesLoggees: {},
          },
        }))
      },

      resetSeanceActive: () =>
        set({
          seanceActive: {
            sessionId: null,
            date: null,
            exercicesDone: [],
            seriesLoggees: {},
          },
        }),

      // ── LOGS ──────────────────────────────────────────────────────────
      logs: [],

      updateLog: (logId, updates) =>
        set((s) => ({
          logs: s.logs.map((l) => (l.id === logId ? { ...l, ...updates } : l)),
        })),

      // ── PRs ───────────────────────────────────────────────────────────
      prs: {},

      updatePR: (exerciceId, { poids, reps, date }) =>
        set((s) => ({
          prs: {
            ...s.prs,
            [exerciceId]: { poids, reps, date },
          },
        })),
    }),
    {
      name: 'sport-app-storage',
      partialize: (state) => ({
        profil: state.profil,
        logs: state.logs,
        prs: state.prs,
        seanceActive: state.seanceActive,
      }),
    }
  )
)

export default useAppStore
