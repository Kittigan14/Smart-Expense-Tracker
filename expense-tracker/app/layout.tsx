import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Smart Expense Tracker',
  description: 'บันทึกค่าใช้จ่าย วิเคราะห์การเงิน ด้วย AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}