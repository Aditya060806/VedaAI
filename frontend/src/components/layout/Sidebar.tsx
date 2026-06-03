'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Users, BookOpen, Wand2, Library, Settings,
  Sparkles
} from 'lucide-react'
import { useAssignmentStore } from '@/store'
import Image from 'next/image'
import { Show, UserButton, SignInButton } from '@clerk/nextjs'

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

        {/* School Card / Clerk Auth Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'var(--surface-2)',
        }}>
          <Show when="signed-out">
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <SignInButton mode="modal">
                <button className="btn-black" style={{ width: '100%', padding: '8px 0', fontSize: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: '600', color: 'white' }}>
                  Sign In
                </button>
              </SignInButton>
            </div>
          </Show>
          <Show when="signed-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, flexShrink: 0 }}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 34, height: 34 } } }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, cursor: 'default' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.3' }}>
                Delhi Public School
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                Bokaro Steel City
              </div>
            </div>
          </Show>
        </div>
      </div>
    </aside>
  )
}
