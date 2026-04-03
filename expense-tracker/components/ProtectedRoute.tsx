'use client'

import { useAuth } from '@/context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return null
  return <>{children}</>
}