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
  const radius = 54
  const circ = 2 * Math.PI * radius
  const dash = circ * (1 - pct)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] rounded-3xl p-8 mx-6 text-center border border-[#334155] w-full max-w-sm">
        <p className="text-[#64748B] text-sm font-medium mb-6">Temps de repos</p>

        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="#1E293B" strokeWidth="8" />
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute text-4xl font-bold text-white tabular-nums">{remaining}</span>
        </div>

        <p className="text-[#94A3B8] text-sm mb-6">secondes</p>

        <button
          onClick={() => { reset(); onDone() }}
          className="w-full py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#64748B] font-medium"
        >
          Passer
        </button>
      </div>
    </div>
  )
}
