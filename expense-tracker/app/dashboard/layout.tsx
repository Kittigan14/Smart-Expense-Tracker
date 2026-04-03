'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile topbar */}
          <header
            className="lg:hidden flex items-center gap-3 px-4 h-14 shrink-0"
            style={{
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'var(--accent)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Expense Tracker
              </span>
            </div>
          </header>

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}