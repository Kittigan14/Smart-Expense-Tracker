'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useExpenseStore } from '@/store/useExpenseStore'
import { addTransaction } from '@/lib/transactions'
import { Category, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '@/types'
import { format } from 'date-fns'

const CATEGORIES: Category[] = ['food', 'transport', 'shopping', 'entertainment', 'health', 'other']

export default function TransactionForm() {
  const { user } = useAuth()
  const { isFormOpen, setFormOpen, addTransaction: addToStore } = useExpenseStore()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const amountRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Focus amount on open
  useEffect(() => {
    if (isFormOpen) {
      setTimeout(() => amountRef.current?.focus(), 150)
      setError('')
      setSuccess(false)
    }
  }, [isFormOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleClose = () => {
    if (loading) return
    setFormOpen(false)
    // reset after animation
    setTimeout(() => {
      setAmount('')
      setCategory('food')
      setNote('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setError('')
      setSuccess(false)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const parsed = parseFloat(amount.replace(/,/g, ''))
    if (!parsed || parsed <= 0) {
      setError('กรุณาระบุจำนวนเงินที่ถูกต้อง')
      return
    }
    if (parsed > 10_000_000) {
      setError('จำนวนเงินสูงสุดคือ 10,000,000 บาท')
      return
    }

    setLoading(true)
    setError('')

    try {
      const month = date.slice(0, 7) // 'yyyy-MM'
      const tx = await addTransaction({
        userId: user.uid,
        amount: parsed,
        category,
        note: note.trim(),
        date,
        month,
        createdAt: Date.now(),
      })

      // Optimistic update
      addToStore(tx)
      setSuccess(true)

      // Auto-close after short delay
      setTimeout(() => handleClose(), 900)
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  // Format amount with commas as user types
  const handleAmountChange = (val: string) => {
    const raw = val.replace(/[^0-9.]/g, '')
    const parts = raw.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    setAmount(raw)
  }

  const displayAmount = amount
    ? Number(amount.replace(/,/g, '')).toLocaleString('th-TH', {
        maximumFractionDigits: 2,
        minimumFractionDigits: amount.includes('.') ? undefined : 0,
      })
    : ''

  if (!isFormOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden animate-fade-up"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              เพิ่มรายการใหม่
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              บันทึกค่าใช้จ่ายของคุณ
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">

          {/* Amount input — big and prominent */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>
              จำนวนเงิน (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold"
                style={{ color: 'var(--text-muted)' }}>฿</span>
              <input
                ref={amountRef}
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-9 pr-4 py-4 rounded-xl text-2xl font-semibold outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  caretColor: 'var(--accent)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              {amount && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: 'var(--text-muted)' }}>
                  {displayAmount} บาท
                </span>
              )}
            </div>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-xs font-medium mb-2.5" style={{ color: 'var(--text-sub)' }}>
              หมวดหมู่
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat
                const col = CATEGORY_COLORS[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-150"
                    style={{
                      background: active ? col.bg : 'var(--bg-elevated)',
                      border: active ? `1.5px solid ${col.text}40` : '1px solid var(--border)',
                      color: active ? col.text : 'var(--text-muted)',
                    }}
                  >
                    <span className="text-lg leading-none">{CATEGORY_ICONS[cat]}</span>
                    {CATEGORY_LABELS[cat]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Note + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>
                หมายเหตุ
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น ข้าวมันไก่"
                maxLength={60}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-sub)' }}>
                วันที่
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  colorScheme: 'dark',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: 'var(--success)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              บันทึกสำเร็จแล้ว!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background: success ? 'var(--success)' : 'var(--accent)',
              boxShadow: loading || success ? 'none' : '0 0 24px var(--accent-glow)',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin-slow w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                กำลังบันทึก...
              </>
            ) : success ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                บันทึกสำเร็จ!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                บันทึกรายการ
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}