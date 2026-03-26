import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import WeekCalendar from '../components/suivi/WeekCalendar'
import SessionLogDetail from '../components/suivi/SessionLogDetail'
import PRHistory from '../components/suivi/PRHistory'
import useAppStore from '../store/useAppStore'
import { useExport } from '../hooks/useExport'

export default function Suivi() {
  const logs = useAppStore((s) => s.logs)
  const programme = useAppStore((s) => s.programme)
  const { exportJSON } = useExport()
  const [selectedDate, setSelectedDate] = useState(null)
  const [activeSection, setActiveSection] = useState('semaine')

  const selectedLog = selectedDate ? logs.find((l) => l.date === selectedDate) : null

  return (
    <PageWrapper title="Suivi">
      <div className="px-4 py-4 space-y-4">

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {['semaine', 'prs'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={activeSection === s
                ? { background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: 'white', boxShadow: '0 2px 12px rgba(59,130,246,0.3)' }
                : { color: '#64748B' }
              }
            >
              {s === 'semaine' ? 'Calendrier' : 'Records (PR)'}
            </button>
          ))}
        </div>

        {activeSection === 'semaine' && (
          <>
            <WeekCalendar
              logs={logs}
              programme={programme}
              onSelectDate={setSelectedDate}
            />

            {/* Résumé des logs récents */}
            {logs.length > 0 && (
              <div className="space-y-2">
                <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider">Dernières séances</p>
                {[...logs].reverse().slice(0, 5).map((log) => {
                  const session = programme.find((s) => s.id === log.sessionId)
                  const feelings = ['😴', '😐', '💪', '🔥']
                  return (
                    <button
                      key={log.id}
                      onClick={() => setSelectedDate(log.date)}
                      className="w-full flex items-center gap-3 card-glass px-4 py-3 text-left active:scale-[0.98] transition-transform"
                      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                    >
                      <span className="text-xl">{feelings[log.feeling ?? 2]}</span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{session?.titre || 'Séance'}</p>
                        <p className="text-[#64748B] text-xs">{log.date}</p>
                      </div>
                      {log.prsHit?.length > 0 && (
                        <span className="text-[#F59E0B] text-xs font-semibold">🏆 ×{log.prsHit.length}</span>
                      )}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}

            {logs.length === 0 && (
              <div className="card-glass p-6 text-center" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-white font-semibold">Aucune séance enregistrée</p>
                <p className="text-[#64748B] text-sm mt-1">Commence ta première séance !</p>
              </div>
            )}
          </>
        )}

        {activeSection === 'prs' && <PRHistory />}

        {/* Export */}
        <button
          onClick={exportJSON}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter pour Claude
        </button>

      </div>

      {/* Log detail slide-up */}
      {selectedLog && (
        <SessionLogDetail log={selectedLog} onClose={() => setSelectedDate(null)} />
      )}
    </PageWrapper>
  )
}
