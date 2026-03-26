import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { getTodayName } from '../utils/dateUtils'

const JOUR_COLORS = {
  lundi:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)'  },
  mardi:    { color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)'  },
  mercredi: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)'   },
  jeudi:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)'  },
}

export default function Programme() {
  const programme = useAppStore((s) => s.programme)
  const [selected, setSelected] = useState(null)
  const today = getTodayName()

  return (
    <PageWrapper title="Programme" subtitle="4 jours · Volley + Escalade">
      <div className="px-4 py-4 space-y-3">
        {programme.map((session) => {
          const theme = JOUR_COLORS[session.jour] || JOUR_COLORS.lundi
          const isToday = session.jour === today
          return (
            <button
              key={session.id}
              onClick={() => setSelected(session)}
              className="w-full text-left card-glass active:scale-[0.98] transition-transform overflow-hidden"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderLeft: `3px solid ${theme.color}`,
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full"
                        style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}
                      >
                        {session.jour}
                      </span>
                      {isToday && (
                        <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block" />
                          Aujourd'hui
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-base leading-tight">{session.titre}</h3>
                    <p className="text-[#64748B] text-xs mt-1">{session.exercices.length} exercices</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <p className="text-[#64748B] text-xs mt-2 line-clamp-2">{session.objectif}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Session detail slide-up */}
      {selected && (
        <SessionDetail session={selected} onClose={() => setSelected(null)} />
      )}
    </PageWrapper>
  )
}

function SessionDetail({ session, onClose }) {
  const theme = JOUR_COLORS[session.jour] || JOUR_COLORS.lundi

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />
      <div
        className="relative flex flex-col"
        style={{
          maxHeight: '90vh',
          borderRadius: '1.5rem 1.5rem 0 0',
          background: 'rgba(15,23,42,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between">
            <div>
              <span
                className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full"
                style={{ background: theme.bg, color: theme.color }}
              >
                {session.jour}
              </span>
              <h2 className="text-white font-bold text-lg leading-tight mt-1">{session.titre}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B]"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >✕</button>
          </div>
          <p className="text-[#64748B] text-sm mt-2">{session.objectif}</p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3" style={{ paddingBottom: '2rem' }}>
          {/* Échauffement */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-1">Échauffement</p>
            <p className="text-[#94A3B8] text-sm">{session.echauffement}</p>
          </div>

          {/* Exercices */}
          {session.exercices.map((ex, i) => (
            <div key={ex.id} className="card-glass p-4" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
              <div className="flex items-start gap-3">
                <span
                  className="w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: `${theme.color}20`, color: theme.color }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{ex.nom}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: theme.color }}>
                    {ex.series} × {ex.reps}
                    {ex.type !== 'temps' ? ' reps' : ''}
                  </p>
                  <p className="text-[#64748B] text-xs mt-0.5">Repos : {ex.repos}s</p>
                  {ex.notes && (
                    <p className="text-[#94A3B8] text-xs mt-1 italic">{ex.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Récup */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-1">Récupération</p>
            <p className="text-[#94A3B8] text-sm">{session.recup}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
