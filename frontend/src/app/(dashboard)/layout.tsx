import Sidebar from '@/components/layout/Sidebar'
import MobileNavigation from '@/components/layout/MobileNavigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <MobileNavigation />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}
