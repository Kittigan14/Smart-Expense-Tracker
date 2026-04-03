'use client'

import { useAuth } from '@/context/AuthContext'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

const stats = [
  {
    label: 'ค่าใช้จ่ายเดือนนี้',
    value: '฿0',
    sub: 'ยังไม่มีรายการ',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'var(--accent)',
    glow: 'rgba(124,109,250,0.15)',
  },
  {
    label: 'รายการทั้งหมด',
    value: '0',
    sub: 'รายการ',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    color: 'var(--success)',
    glow: 'rgba(52,211,153,0.15)',
  },
  {
    label: 'หมวดสูงสุด',
    value: '-',
    sub: 'ยังไม่มีข้อมูล',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M7 16l4-5 4 3 4-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'var(--warning)',
    glow: 'rgba(251,191,36,0.15)',
  },
  {
    label: 'งบที่เหลือ',
    value: '-',
    sub: 'ยังไม่ตั้งงบ',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'var(--danger)',
    glow: 'rgba(248,113,113,0.15)',
  },
]

const quickActions = [
  { label: 'เพิ่มรายการ', icon: '+', color: 'var(--accent)', glow: 'var(--accent-glow)' },
  { label: 'ดูรายงาน', icon: '↗', color: 'var(--success)', glow: 'rgba(52,211,153,0.2)' },
  { label: 'ตั้งงบ', icon: '฿', color: 'var(--warning)', glow: 'rgba(251,191,36,0.2)' },
  { label: 'AI วิเคราะห์', icon: '✦', color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const now = new Date()
  const monthLabel = format(now, 'MMMM yyyy', { locale: th })
  const greeting = now.getHours() < 12 ? 'อรุณสวัสดิ์' : now.getHours() < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น'

  return (
    <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            {greeting} 👋
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {monthLabel} · {user?.email}
          </p>
        </div>

        {/* Add button */}
        <button
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          เพิ่มรายการ
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="animate-fade-up rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-default group"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              animationDelay: `${i * 0.07}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--bg-card)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: s.glow, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
              {s.value}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="animate-fade-up-1 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickActions.map((a, i) => (
          <button
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-semibold shrink-0"
              style={{ background: a.glow, color: a.color }}>
              {a.icon}
            </div>
            <span style={{ color: 'var(--text)' }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Main content area — 2 col on large */}
      <div className="animate-fade-up-2 grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent transactions placeholder */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              รายการล่าสุด
            </h2>
            <button className="text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}>
              ดูทั้งหมด →
            </button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-sub)' }}>
              ยังไม่มีรายการ
            </p>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              กดปุ่ม "เพิ่มรายการ" เพื่อเริ่มบันทึกค่าใช้จ่าย
            </p>
            <button
              className="mt-1 px-4 py-2 rounded-lg text-xs font-medium text-white transition-all hover:brightness-110"
              style={{ background: 'var(--accent)' }}>
              + เพิ่มรายการแรก
            </button>
          </div>
        </div>

        {/* Spending by category placeholder */}
        <div className="rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text)' }}>
            แยกตาม Category
          </h2>

          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ border: '2px dashed var(--border-hover)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M7 16l4-5 4 3 4-6" stroke="var(--text-muted)" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Chart จะแสดงหลังจากเพิ่มรายการ
            </p>
          </div>

          {/* Category legend placeholders */}
          <div className="space-y-2.5 mt-2">
            {['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'อื่นๆ'].map((cat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: 'var(--border-hover)' }} />
                <div className="flex-1 h-1.5 rounded-full"
                  style={{ background: 'var(--bg-elevated)' }} />
                <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>0%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}