import { useTimer } from '../../hooks/useTimer'
import { useVibration } from '../../hooks/useVibration'
import { useEffect } from 'react'

export default function ExerciseTimer({ seconds, onDone }) {
  const { vibrate } = useVibration()
  const { remaining, running, start, pause, resume, reset } = useTimer(() => {
    vibrate([300, 100, 300])
    onDone?.()
  })

  const isStarted = remaining > 0 || running

  const handleToggle = () => {
    if (!isStarted) {
      start(seconds)
    } else if (running) {
      pause()
    } else {
      resume()
    }
  }

  const pct = seconds > 0 ? remaining / seconds : 0

  return (
    <div className="bg-[#0F172A] rounded-xl p-4 border border-[#1E293B]">
      <div className="flex items-center gap-4">
        {/* Mini circular timer */}
        <div className="relative flex-shrink-0">
          <svg width="60" height="60" className="-rotate-90">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#1E293B" strokeWidth="5" />
            <circle
              cx="30" cy="30" r="24"
              fill="none" stroke="#3B82F6" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - pct)}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {isStarted ? remaining : Math.floor(seconds / 60) > 0 ? `${Math.floor(seconds / 60)}'` : `${seconds}"`}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-[#94A3B8] text-xs mb-1">Chrono exercice</p>
          <p className="text-white font-semibold text-sm">
            {!isStarted ? `${seconds}s` : running ? 'En cours…' : 'En pause'}
          </p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] ${
            running
              ? 'bg-[#EF4444]/20 text-[#EF4444]'
              : 'bg-[#3B82F6] text-white'
          }`}
        >
          {!isStarted ? 'Démarrer' : running ? 'Pause' : 'Reprendre'}
        </button>
      </div>
    </div>
  )
}
