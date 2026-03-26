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

  return (
    <div className="bg-[#1E293B] rounded-2xl p-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A] text-[#64748B]"
        >‹</button>
        <span className="text-white text-sm font-semibold">
          {weekOffset === 0 ? 'Cette semaine' : weekOffset === -1 ? 'Semaine précédente' : `S${weekOffset > 0 ? '+' : ''}${weekOffset}`}
        </span>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A] text-[#64748B]"
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
              className="flex flex-col items-center gap-1 py-2 rounded-xl transition-colors active:scale-95"
              style={{ opacity: status === 'rest' && !isToday ? 0.4 : 1 }}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-[#3B82F6]' : 'text-[#64748B]'}`}>
                {DAY_SHORT[i]}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                isToday ? 'border-[#3B82F6] text-[#3B82F6]' : 'border-transparent'
              } ${
                status === 'done' ? 'bg-[#22C55E] text-black' :
                status === 'missed' ? 'bg-[#EF4444]/30 text-[#EF4444]' :
                status === 'planned' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' :
                'bg-transparent text-[#64748B]'
              }`}>
                {new Date(date + 'T00:00:00').getDate()}
              </div>
              {status === 'done' && <span className="text-[8px] text-[#22C55E]">✓</span>}
              {status === 'missed' && <span className="text-[8px] text-[#EF4444]">✗</span>}
              {status === 'planned' && <span className="text-[8px] text-[#3B82F6]">·</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
