import { useState } from 'react'
import { getWeekDates, formatDate } from '../../utils/dateUtils'

const DAY_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function WeekCalendar({ logs, programme, onSelectDate }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const dates = getWeekDates(weekOffset)
  const today = new Date().toISOString().split('T')[0]

  const getStatus = (date) => {
    const d = new Date(date + 'T00:00:00')
    const dayName = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][d.getDay()]
    const isTrainingDay = programme.some((s) => s.jour === dayName)
    const hasLog = logs.some((l) => l.date === date)
    const isPast = date < today
    const isToday = date === today

    if (hasLog) return 'done'
    if (isTrainingDay && isPast && !isToday) return 'missed'
    if (isTrainingDay) return 'planned'
    return 'rest'
  }

  // Week label with absolute dates
  const weekLabel = weekOffset === 0
    ? 'Cette semaine'
    : weekOffset === -1
      ? 'Semaine passée'
      : `${formatDate(dates[0])} – ${formatDate(dates[6])}`

  return (
    <div className="card-glass p-4" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] text-lg"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >‹</button>
        <span className="text-white text-sm font-semibold">{weekLabel}</span>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] text-lg"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >›</button>
      </div>

      {/* Days row */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, i) => {
          const status = getStatus(date)
          const isToday = date === today
          const log = logs.find((l) => l.date === date)

          return (
            <button
              key={date}
              onClick={() => log && onSelectDate(date)}
              className="flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all active:scale-95"
              style={{ opacity: status === 'rest' && !isToday ? 0.35 : 1 }}
            >
              <span className="text-[10px] font-semibold" style={{ color: isToday ? '#3B82F6' : '#64748B' }}>
                {DAY_SHORT[i]}
              </span>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  border: isToday ? '2px solid #3B82F6' : '2px solid transparent',
                  background:
                    status === 'done'    ? 'linear-gradient(135deg,#22C55E,#16A34A)' :
                    status === 'missed'  ? 'rgba(239,68,68,0.2)' :
                    status === 'planned' ? 'rgba(59,130,246,0.15)' :
                    'rgba(255,255,255,0.04)',
                  color:
                    status === 'done'    ? 'white' :
                    status === 'missed'  ? '#EF4444' :
                    status === 'planned' ? '#3B82F6' :
                    '#64748B',
                  boxShadow: status === 'done' ? '0 2px 10px rgba(34,197,94,0.3)' : 'none',
                }}
              >
                {new Date(date + 'T00:00:00').getDate()}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
