// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { onAuthStateChanged, signOut, User } from 'firebase/auth'
// import { auth } from '@/lib/firebase'
// import { useRouter, usePathname } from 'next/navigation'

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   logout: () => Promise<void>
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   logout: async () => {},
// })

// const PUBLIC_ROUTES = ['/', '/login', '/register']

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser)
//       setLoading(false)

//       const isPublic = PUBLIC_ROUTES.includes(pathname)

//       if (!firebaseUser && !isPublic) {
//         // ยังไม่ login แต่พยายามเข้า protected route → ไป login
//         router.replace('/login')
//       }

//       if (firebaseUser && isPublic && pathname !== '/') {
//         // login แล้ว แต่ยังอยู่หน้า login/register → ไป dashboard
//         router.replace('/dashboard')
//       }
//     })

//     return () => unsubscribe()
//   }, [pathname, router])

//   const logout = async () => {
//     await signOut(auth)
//     router.replace('/login')
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter, usePathname } from 'next/navigation'

type UserRole = 'admin' | 'staff'

interface AuthUser extends User {
  role?: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

const PUBLIC_ROUTES = ['/', '/login']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (!firebaseUser) {
        setUser(null)
        setLoading(false)

        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace('/login')
        }
        return
      }

      try {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)

        const role = snap.exists() ? snap.data().role : 'staff'

        const userWithRole: AuthUser = {
          ...firebaseUser,
          role,
        }

        setUser(userWithRole)
      } catch (err) {
        console.error('Error fetching user role', err)
        setUser(firebaseUser)
      }

      setLoading(false)

      if (PUBLIC_ROUTES.includes(pathname)) {
        router.replace('/dashboard')
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  const logout = async () => {
    await signOut(auth)
    router.replace('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}