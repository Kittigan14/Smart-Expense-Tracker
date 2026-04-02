export type Category =
  | 'food' | 'transport' | 'shopping'
  | 'entertainment' | 'health' | 'other'

export interface Transaction {
  id: string
  userId: string
  amount: number
  category: Category
  note: string
  date: string
  createdAt: number
}

export interface Budget {
  id: string
  userId: string
  category: Category
  limitAmount: number
  month: string
}