import { useEffect, useState } from 'react'

export default function PRBadge({ show }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2500)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className="absolute top-0 right-0 bg-[#F59E0B] text-black text-xs font-bold px-2 py-1 rounded-bl-xl rounded-tr-2xl animate-bounce">
      🏆 Nouveau PR !
    </div>
  )
}
