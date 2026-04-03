export type Category =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'other'

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช้อปปิ้ง',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  other: 'อื่นๆ',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  food: '🍜',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  health: '💊',
  other: '📦',
}

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  food:          { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  transport:     { bg: 'rgba(52,211,153,0.15)',  text: '#34d399' },
  shopping:      { bg: 'rgba(124,109,250,0.15)', text: '#7c6dfa' },
  entertainment: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
  health:        { bg: 'rgba(56,189,248,0.15)',  text: '#38bdf8' },
  other:         { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  category: Category
  note: string
  date: string
  month: string
  createdAt: number
}

export interface Budget {
  id: string
  userId: string
  category: Category
  limitAmount: number
  month: string
}