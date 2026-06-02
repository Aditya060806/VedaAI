'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, Wand2, Bell, Menu } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: BookOpen, label: 'Assignments', href: '/assignments' },
  { icon: Library, label: 'Library', href: '/library' },
  { icon: Wand2, label: 'AI Toolkit', href: '/toolkit' },
]

export default function MobileNavigation() {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #ea580c, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4.5L12 19.5L20 4.5" />
            </svg>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>VedaAI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-2)' }}>
            <Bell size={16} />
          </button>

          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef08a, #fde047)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: '700',
              color: '#854d0e'
            }}
          >
            AP
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-btn${active ? ' active' : ''}`}
            >
              <Icon size={18} style={{ strokeWidth: active ? 2.5 : 2 }} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
