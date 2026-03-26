export default function ProgressBar({ done, total }) {
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div
      className="sticky top-0 z-10 px-4 py-3"
      style={{
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#64748B] text-xs font-medium">Progression</span>
        <span className="text-white text-xs font-bold tabular-nums">
          {done}/{total}
          {done === total && total > 0 && <span className="text-[#22C55E] ml-1">✓</span>}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, #22C55E, #16A34A)'
              : 'linear-gradient(90deg, #3B82F6, #2563EB)',
            boxShadow: pct > 0 ? `0 0 8px ${pct === 100 ? 'rgba(34,197,94,0.5)' : 'rgba(59,130,246,0.5)'}` : 'none',
          }}
        />
      </div>
    </div>
  )
}
