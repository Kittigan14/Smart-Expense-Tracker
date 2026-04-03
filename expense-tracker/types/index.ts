export type Category =
  | 'office'
  | 'travel'
  | 'salary'
  | 'utilities'
  | 'marketing'
  | 'software'
  | 'maintenance'
  | 'other'

export const CATEGORY_LABELS: Record<Category, string> = {
  office: 'สำนักงาน',
  travel: 'เดินทาง',
  salary: 'เงินเดือน',
  utilities: 'สาธารณูปโภค',
  marketing: 'การตลาด',
  software: 'ซอฟต์แวร์',
  maintenance: 'ซ่อมบำรุง',
  other: 'อื่นๆ',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  office: '🏢',
  travel: '🚗',
  salary: '💰',
  utilities: '⚡',
  marketing: '📢',
  software: '💻',
  maintenance: '🔧',
  other: '📦',
}

export const CATEGORY_COLORS: Record<
  Category,
  { bg: string; text: string }
> = {
  office:       { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  travel:       { bg: 'rgba(52,211,153,0.15)',  text: '#34d399' },
  salary:       { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  utilities:    { bg: 'rgba(56,189,248,0.15)',  text: '#38bdf8' },
  marketing:    { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
  software:     { bg: 'rgba(124,109,250,0.15)', text: '#7c6dfa' },
  maintenance:  { bg: 'rgba(244,114,182,0.15)', text: '#f472b6' },
  other:        { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
}

export interface Transaction {
  id: string
  userId: string

  amount: number
  type: 'expense' | 'income'

  category: Category
  note?: string

  date: string
  month: string

  createdAt: number
  updatedAt?: number        
}

export interface Budget {
  id: string
  userId: string

  category: Category
  limitAmount: number

  month: string
  createdAt: number
}

export type UserRole = 'admin' | 'staff'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: number
}

export const CATEGORIES: Category[] = [
  'office',
  'travel',
  'salary',
  'utilities',
  'marketing',
  'software',
  'maintenance',
  'other',
]