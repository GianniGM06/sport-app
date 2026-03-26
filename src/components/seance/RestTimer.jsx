import { useEffect } from 'react'
import { useTimer } from '../../hooks/useTimer'
import { useVibration } from '../../hooks/useVibration'

export default function RestTimer({ seconds, onDone }) {
  const { vibrate } = useVibration()

  const { remaining, running, start, reset } = useTimer(() => {
    vibrate([400, 100, 400])
    onDone()
  })

  useEffect(() => {
    start(seconds)
    return () => reset()
  }, []) // eslint-disable-line

  // Vibrate at 3, 2, 1
  useEffect(() => {
    if ([3, 2, 1].includes(remaining) && running) {
      vibrate(100)
    }
  }, [remaining, running]) // eslint-disable-line

  const pct = seconds > 0 ? (1 - remaining / seconds) : 1
  const radius = 66
  const circ = 2 * Math.PI * radius
  const dash = circ * (1 - pct)

  // Color interpolation: blue → green as time passes
  const strokeColor = pct > 0.7 ? '#22C55E' : pct > 0.35 ? '#F59E0B' : '#3B82F6'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(10, 15, 30, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="card-glass mx-6 text-center w-full max-w-sm"
        style={{ padding: '2rem 1.5rem 1.75rem' }}
      >
        <p className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-6">
          Temps de repos
        </p>

        <div className="relative inline-flex items-center justify-center mb-4">
          <svg width="156" height="156" className="-rotate-90">
            <circle
              cx="78" cy="78" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            <circle
              cx="78" cy="78" r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              className="transition-all duration-500"
              style={{ filter: `drop-shadow(0 0 8px ${strokeColor}88)` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-7xl font-bold text-white tabular-nums leading-none">{remaining}</span>
            <span className="text-[#64748B] text-xs mt-1">sec</span>
          </div>
        </div>

        <button
          onClick={() => { reset(); onDone() }}
          className="btn-blue w-full py-3.5 mt-2 active:scale-[0.97] transition-transform"
        >
          Continuer →
        </button>
      </div>
    </div>
  )
}
