import { useState, useRef, useEffect, useCallback } from 'react'

export function useTimer(onComplete) {
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const endTimeRef = useRef(null)
  const intervalRef = useRef(null)

  const tick = useCallback(() => {
    const now = Date.now()
    const left = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))
    setRemaining(left)
    if (left === 0) {
      setRunning(false)
      clearInterval(intervalRef.current)
      intervalRef.current = null
      onComplete?.()
    }
  }, [onComplete])

  // Recalculate on visibility change (iOS background suspension)
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && running) tick()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [running, tick])

  const start = useCallback((seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    endTimeRef.current = Date.now() + seconds * 1000
    setRemaining(seconds)
    setRunning(true)
    intervalRef.current = setInterval(tick, 500)
  }, [tick])

  const pause = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const resume = useCallback(() => {
    if (remaining <= 0) return
    endTimeRef.current = Date.now() + remaining * 1000
    setRunning(true)
    intervalRef.current = setInterval(tick, 500)
  }, [remaining, tick])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setRemaining(0)
    endTimeRef.current = null
  }, [])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return { remaining, running, start, pause, resume, reset }
}
