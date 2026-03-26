export default function PageWrapper({ children, title }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {title && (
        <header className="flex-shrink-0 px-4 pt-12 pb-3 bg-[#0F172A] border-b border-[#1E293B]">
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </header>
      )}
      <main className="flex-1 overflow-y-auto overscroll-none" style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
        {children}
      </main>
    </div>
  )
}
