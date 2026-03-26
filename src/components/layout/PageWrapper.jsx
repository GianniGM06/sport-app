export default function PageWrapper({ children, title, subtitle }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {title && (
        <header className="flex-shrink-0 px-5 pt-12 pb-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-[#64748B] text-sm mt-0.5">{subtitle}</p>}
        </header>
      )}
      <main className="flex-1 overflow-y-auto overscroll-none" style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
        {children}
      </main>
    </div>
  )
}
