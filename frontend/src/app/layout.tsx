import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import MobileNavigation from '@/components/layout/MobileNavigation'

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Platform',
  description: 'Generate structured question papers instantly with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <MobileNavigation />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
