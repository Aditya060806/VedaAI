'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Users, BookOpen, Wand2, Library, Settings,
  Sparkles
} from 'lucide-react'
import { useAssignmentStore } from '@/store'
import Image from 'next/image'
import { Show, UserButton } from '@clerk/nextjs'

const navItems = [
  { icon: Home,     label: 'Home',                 href: '/home' },
  { icon: Users,    label: 'My Groups',            href: '/groups' },
  { icon: BookOpen, label: 'Assignments',          href: '/assignments', hasBadge: false },
  { icon: Wand2,    label: "AI Teacher's Toolkit", href: '/toolkit' },
  { icon: Library,  label: 'My Library',           href: '/library', hasBadge: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { assignments } = useAssignmentStore()

  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  const totalAssignments = assignments.length

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
          <Image src="/logo.png" alt="VedaAI Logo" width={32} height={32} style={{ transform: 'scale(1.35)', transformOrigin: 'center' }} />
        </div>
        <span style={{ fontSize: '15.5px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>VedaAI</span>
      </div>

      {/* Create Assignment Button */}
      <div style={{ padding: '0 14px 8px' }}>
        <Link
          href="/assignments/create"
          className="btn-pill-glow"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          <Sparkles size={14} />
          Create Assignment
        </Link>
      </div>

      {/* Nav Links */}
      <div style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(({ icon: Icon, label, href, hasBadge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item${active ? ' active' : ''}`}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                position: 'relative',
                background: active ? 'var(--surface-2)' : 'transparent',
                color: active ? 'var(--text-1)' : 'var(--text-3)',
                fontWeight: active ? '600' : '500',
                borderLeft: active ? '3px solid #ea580c' : '3px solid transparent',
              }}
            >
              <Icon size={15} className="nav-icon" />
              <span style={{ flex: 1 }}>{label}</span>
              {hasBadge && totalAssignments > 0 && (
                <span className="sidebar-badge">{totalAssignments}</span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '10px 10px 14px' }}>
        {/* Settings */}
        <Link
          href="/settings"
          className={`nav-item${isActive('/settings') ? ' active' : ''}`}
          style={{
            marginBottom: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        >
          <Settings size={15} className="nav-icon" />
          Settings
        </Link>

        {/* School Card — always visible (matches design) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: '14px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
        }}>
          {/* Avatar */}
          <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Show when="signed-in">
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 38, height: 38 } } }} />
            </Show>
            <Show when="signed-out">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="19" cy="19" r="19" fill="#fcd9b6" />
                <circle cx="19" cy="15.5" r="6" fill="#8a5a3c" />
                <path d="M7.5 33 C 8.5 25, 14 22.5, 19 22.5 C 24 22.5, 29.5 25, 30.5 33 Z" fill="#5b3a26" />
                <circle cx="19" cy="16" r="5" fill="#f4b183" />
                <path d="M13.5 14 C 14 10.5, 17 9, 19 9 C 21 9, 24 10.5, 24.5 14 C 24.5 12, 23 11, 19 11 C 15 11, 13.5 12, 13.5 14 Z" fill="#5b3a26" />
              </svg>
            </Show>
          </div>

          {/* School name */}
          <div style={{ flex: 1, minWidth: 0, cursor: 'default' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.3' }}>
              Delhi Public School
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
              Bokaro Steel City
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
