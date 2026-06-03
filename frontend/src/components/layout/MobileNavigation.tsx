'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Library, Sparkles, Bell, Plus } from 'lucide-react'

import Image from 'next/image'

const navItems = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: BookOpen, label: 'Assignments', href: '/assignments' },
  { icon: Library, label: 'Library', href: '/library' },
  { icon: Sparkles, label: 'AI Toolkit', href: '/toolkit' },
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
          <div style={{ width: 24, height: 24, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <Image src="/logo.png" alt="VedaAI Logo" width={24} height={24} style={{ transform: 'scale(1.35)', transformOrigin: 'center' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>VedaAI</span>
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

      {/* Floating Action Button */}
      <Link href="/assignments/create" className="mobile-fab">
        <Plus size={22} color="#ea580c" strokeWidth={3} />
      </Link>

      {/* Floating Pill Mobile Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-btn${active ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#ffffff' : '#a1a1aa' }} />
              <span style={{ color: active ? '#ffffff' : '#71717a' }}>{label}</span>
              {active && <div style={{ width: 14, height: 2.5, background: '#ffffff', borderRadius: 2, marginTop: 3 }} />}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
