'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('รหัสผ่านไม่ตรงกัน'); return }
    if (password.length < 6) { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'อีเมลนี้ถูกใช้แล้ว',
        'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
        'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      }
      setError(msg[err.code] ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthInfo = [
    { label: '', color: 'var(--border)' },
    { label: 'อ่อน', color: 'var(--danger)' },
    { label: 'ปานกลาง', color: 'var(--warning)' },
    { label: 'แข็งแรง', color: 'var(--success)' },
  ]

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,109,250,0.07), transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-sm">

        <Link href="/"
          className="animate-fade-up inline-flex items-center gap-1.5 text-xs mb-8 transition-opacity hover:opacity-100"
          style={{ color: 'var(--text-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          กลับหน้าหลัก
        </Link>

        <div className="animate-fade-up-1 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
            style={{ background: 'var(--accent)', boxShadow: '0 0 24px var(--accent-glow)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            สร้างบัญชีใหม่
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            เริ่มต้นติดตามค่าใช้จ่ายของคุณวันนี้
          </p>
        </div>

        <div className="animate-fade-up-2 rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>อีเมล</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>รหัสผ่าน</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthInfo[strength].color : 'var(--border)' }}/>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthInfo[strength].color }}>
                    {strengthInfo[strength].label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>ยืนยันรหัสผ่าน</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  ...inputStyle,
                  borderColor: confirm
                    ? confirm === password ? 'var(--success)' : 'var(--danger)'
                    : 'var(--border)',
                }}
                onFocus={e => {
                  if (!confirm) e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = confirm
                    ? confirm === password ? 'var(--success)' : 'var(--danger)'
                    : 'var(--border)'
                }}
              />
              {confirm && (
                <p className="text-xs mt-1.5" style={{ color: confirm === password ? 'var(--success)' : 'var(--danger)' }}>
                  {confirm === password ? '✓ รหัสผ่านตรงกัน' : '✗ รหัสผ่านไม่ตรงกัน'}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'var(--accent)', boxShadow: loading ? 'none' : '0 0 20px var(--accent-glow)' }}>
              {loading ? (
                <>
                  <svg className="animate-spin-slow w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  กำลังสมัครสมาชิก...
                </>
              ) : 'สมัครสมาชิก'}
            </button>

          </form>
        </div>

        <p className="animate-fade-up-3 text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          มีบัญชีแล้ว?{' '}
          <Link href="/login" className="font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent)' }}>
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  )
}