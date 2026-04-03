'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useExpenseStore } from '@/store/useExpenseStore'
import { addTransaction } from '@/lib/transactions'
import {
  Category,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from '@/types'
import { format } from 'date-fns'

const CATEGORIES: Category[] = [
  'office',
  'travel',
  'salary',
  'utilities',
  'marketing',
  'software',
  'maintenance',
  'other',
]

export default function TransactionForm() {
  const { user } = useAuth()
  const { isFormOpen, setFormOpen, addTransaction: addToStore } =
    useExpenseStore()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('office')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const amountRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFormOpen) {
      setTimeout(() => amountRef.current?.focus(), 150)
      setError('')
      setSuccess(false)
    }
  }, [isFormOpen])

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
    setTimeout(() => {
      setAmount('')
      setCategory('office')
      setType('expense')
      setNote('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setError('')
      setSuccess(false)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) {
      setError('กรุณาระบุจำนวนเงินที่ถูกต้อง')
      return
    }

    setLoading(true)
    setError('')

    try {
      const month = date.slice(0, 7)

      const tx = await addTransaction({
        userId: user.uid,
        amount: parsed,
        category,
        note: note.trim(),
        date,
        month,
        createdAt: Date.now(),
        type,
      })

      addToStore(tx)
      setSuccess(true)

      setTimeout(() => handleClose(), 800)
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  // auto set salary = income
  useEffect(() => {
    if (category === 'salary') setType('income')
  }, [category])

  if (!isFormOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[#111118] border border-white/10 p-5">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-white font-semibold">เพิ่มรายการ</h2>
          <button onClick={handleClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TYPE */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg ${
                type === 'expense'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg ${
                type === 'income'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              รายรับ
            </button>
          </div>

          {/* AMOUNT */}
          <input
            ref={amountRef}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="จำนวนเงิน"
            className="w-full p-4 rounded-xl bg-white/5 text-white text-xl"
          />

          {/* CATEGORY */}
          <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto">
            {CATEGORIES.map((cat) => {
              const active = category === cat
              const col = CATEGORY_COLORS[cat]

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="p-2 rounded-xl text-xs flex flex-col items-center"
                  style={{
                    background: active ? col.bg : '#1a1a24',
                    color: active ? col.text : '#aaa',
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORY_LABELS[cat]}
                </button>
              )
            })}
          </div>

          {/* NOTE */}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="หมายเหตุ"
            className="w-full p-3 rounded-xl bg-white/5 text-white"
          />

          {/* DATE */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 text-white"
          />

          {/* ERROR */}
          {error && <div className="text-red-400">{error}</div>}

          {/* BUTTON */}
          <button className="w-full py-3 bg-indigo-500 rounded-xl text-white">
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </form>
      </div>
    </div>
  )
}