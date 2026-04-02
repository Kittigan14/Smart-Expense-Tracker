import { create } from 'zustand'
import { Transaction } from '@/types'

interface ExpenseState {
  transactions: Transaction[]
  isLoading: boolean
  selectedMonth: string
  setTransactions: (txs: Transaction[]) => void
  setLoading: (v: boolean) => void
  setSelectedMonth: (m: string) => void
  addTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void
}

export const useExpenseStore = create<ExpenseState>()((set) => ({
  transactions: [],
  isLoading: false,
  selectedMonth: new Date().toISOString().slice(0, 7),
  setTransactions: (txs) => set({ transactions: txs }),
  setLoading: (v) => set({ isLoading: v }),
  setSelectedMonth: (m) => set({ selectedMonth: m }),
  addTransaction: (tx) =>
    set((s) => ({ transactions: [tx, ...s.transactions] })),
  deleteTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    })),
}))