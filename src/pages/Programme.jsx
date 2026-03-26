import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import useAppStore from '../store/useAppStore'
import { getTodayName } from '../utils/dateUtils'

const JOUR_COLORS = {
  lundi: '#3B82F6',
  mardi: '#8B5CF6',
  mercredi: '#22C55E',
  jeudi: '#F59E0B',
}

export default function Programme() {
  const programme = useAppStore((s) => s.programme)
  const [selected, setSelected] = useState(null)
  const today = getTodayName()

  return (
    <PageWrapper title="Programme">
      <div className="px-4 py-4 space-y-3">
        {programme.map((session) => (
          <button
            key={session.id}
            onClick={() => setSelected(session)}
            className="w-full text-left bg-[#1E293B] rounded-2xl p-4 border border-[#334155] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${JOUR_COLORS[session.jour] || '#3B82F6'}20`,
                      color: JOUR_COLORS[session.jour] || '#3B82F6',
                    }}
                  >
                    {session.jour}
                  </span>
                  {session.jour === today && (
                    <span className="text-xs text-[#22C55E] font-semibold">● Aujourd'hui</span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-base leading-tight">{session.titre}</h3>
                <p className="text-[#64748B] text-sm mt-1">{session.exercices.length} exercices</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#334155] flex-shrink-0 mt-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <p className="text-[#64748B] text-xs mt-2 line-clamp-2">{session.objectif}</p>
          </button>
        ))}
      </div>

      {/* Session detail slide-up */}
      {selected && (
        <SessionDetail session={selected} onClose={() => setSelected(null)} />
      )}
    </PageWrapper>
  )
}

function SessionDetail({ session, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0F172A] rounded-t-3xl max-h-[90vh] flex flex-col border-t border-[#334155]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#334155]" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#1E293B]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#3B82F6] text-xs font-bold uppercase">{session.jour}</p>
              <h2 className="text-white font-bold text-lg leading-tight">{session.titre}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E293B] text-[#64748B]"
            >✕</button>
          </div>
          <p className="text-[#64748B] text-sm mt-2">{session.objectif}</p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 pb-8">
          {/* Échauffement */}
          <div className="bg-[#1E293B] rounded-xl p-3">
            <p className="text-[#F59E0B] text-xs font-bold uppercase mb-1">Échauffement</p>
            <p className="text-[#94A3B8] text-sm">{session.echauffement}</p>
          </div>

          {/* Exercices */}
          {session.exercices.map((ex, i) => (
            <div key={ex.id} className="bg-[#1E293B] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{ex.nom}</p>
                  <p className="text-[#3B82F6] text-sm font-medium mt-0.5">
                    {ex.series} × {ex.reps}
                    {ex.type === 'temps' ? '' : ' reps'}
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
          <div className="bg-[#1E293B] rounded-xl p-3">
            <p className="text-[#22C55E] text-xs font-bold uppercase mb-1">Récupération</p>
            <p className="text-[#94A3B8] text-sm">{session.recup}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
