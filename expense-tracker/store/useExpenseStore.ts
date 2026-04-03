import { create } from 'zustand'
import { Transaction } from '@/types'
import { format } from 'date-fns'

interface ExpenseState {
  transactions: Transaction[]
  isLoading: boolean
  selectedMonth: string
  isFormOpen: boolean

  setTransactions: (txs: Transaction[]) => void
  setLoading: (v: boolean) => void
  setSelectedMonth: (m: string) => void
  setFormOpen: (v: boolean) => void
  addTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void

  totalForMonth: () => number
  countForMonth: () => number
}

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  transactions: [],
  isLoading: false,
  selectedMonth: format(new Date(), 'yyyy-MM'),
  isFormOpen: false,

  setTransactions: (txs) => set({ transactions: txs }),
  setLoading: (v) => set({ isLoading: v }),
  setSelectedMonth: (m) => set({ selectedMonth: m }),
  setFormOpen: (v) => set({ isFormOpen: v }),

  addTransaction: (tx) =>
    set((s) => ({ transactions: [tx, ...s.transactions] })),

  deleteTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    })),

  totalForMonth: () => {
    const { transactions, selectedMonth } = get()
    return transactions
      .filter((t) => t.month === selectedMonth)
      .reduce((sum, t) => sum + t.amount, 0)
  },

  countForMonth: () => {
    const { transactions, selectedMonth } = get()
    return transactions.filter((t) => t.month === selectedMonth).length
  },
}))