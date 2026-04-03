export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin-slow"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>กำลังโหลด...</p>
    </div>
  )
}