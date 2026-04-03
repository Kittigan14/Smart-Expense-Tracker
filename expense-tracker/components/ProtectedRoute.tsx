// 'use client'

// import { useAuth } from '@/context/AuthContext'
// import LoadingScreen from './LoadingScreen'

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth()
//   if (loading) return <LoadingScreen />
//   if (!user) return null
//   return <>{children}</>
// }

'use client'

import { useAuth } from '@/context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function ProtectedRoute({
  children,
  allowRoles,
}: {
  children: React.ReactNode
  allowRoles?: ('admin' | 'staff')[]
}) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!user) return null

  if (allowRoles && !allowRoles.includes(user.role!)) {
    return <div className="text-white p-6">ไม่มีสิทธิ์เข้าถึง</div>
  }

  return <>{children}</>
}