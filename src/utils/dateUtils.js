const DAY_MAP = {
  0: 'dimanche',
  1: 'lundi',
  2: 'mardi',
  3: 'mercredi',
  4: 'jeudi',
  5: 'vendredi',
  6: 'samedi',
}

export const DAY_LABELS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']
export const DAY_FULL = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function getTodayName() {
  return DAY_MAP[new Date().getDay()]
}

export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getWeekDates(offsetWeeks = 0) {
  const now = new Date()
  const day = now.getDay() // 0=Sun
  // Monday of current week
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1) + offsetWeeks * 7)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function getWeekNumber(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const start = new Date(d.getFullYear(), 0, 1)
  const diff = d - start
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  return Math.ceil((diff / oneWeek + start.getDay() / 7))
}
