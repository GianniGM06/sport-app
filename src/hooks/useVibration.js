import { useCallback, useRef } from 'react'

export function useVibration() {
  const flashRef = useRef(null)

  const vibrate = useCallback((pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    } else {
      // iOS fallback: flash the body background
      document.body.style.backgroundColor = '#FFFFFF'
      if (flashRef.current) clearTimeout(flashRef.current)
      flashRef.current = setTimeout(() => {
        document.body.style.backgroundColor = ''
      }, 250)
    }
  }, [])

  return { vibrate }
}
