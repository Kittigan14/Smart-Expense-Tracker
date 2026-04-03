import { collection, addDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { Transaction } from '@/types'

export async function addTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
  const ref = await addDoc(collection(db, 'transactions'), data)
  return { ...data, id: ref.id }
}

export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, 'transactions', id))
}

export async function fetchTransactions(userId: string, month: string): Promise<Transaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('month', '==', month),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction))
}