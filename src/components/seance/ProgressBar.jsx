export default function ProgressBar({ done, total }) {
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="px-4 py-3 bg-[#0F172A] border-b border-[#1E293B]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#64748B] text-xs font-medium">Progression</span>
        <span className="text-white text-xs font-bold">{done}/{total}</span>
      </div>
      <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
