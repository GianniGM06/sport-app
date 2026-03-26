import { useMemo } from 'react'
import { getTodayName, getToday } from '../utils/dateUtils'
import useAppStore from '../store/useAppStore'

export function useCurrentSession() {
  const programme = useAppStore((s) => s.programme)
  const seanceActive = useAppStore((s) => s.seanceActive)

  return useMemo(() => {
    const today = getTodayName()
    const todayDate = getToday()

    // If there's already an active session started today, keep it
    if (seanceActive.sessionId && seanceActive.date === todayDate) {
      const session = programme.find((s) => s.id === seanceActive.sessionId)
      return { session, isActive: true }
    }

    const session = programme.find((s) => s.jour === today) || null
    return { session, isActive: false }
  }, [programme, seanceActive])
}
