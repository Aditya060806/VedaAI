'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Users, BookOpen, Wand2, Library, Settings,
  Plus
} from 'lucide-react'
import { useAssignmentStore } from '@/store'

const navItems = [
  { icon: Home,     label: 'Home',                 href: '/home' },
  { icon: Users,    label: 'My Groups',            href: '/groups' },
  { icon: BookOpen, label: 'Assignments',          href: '/assignments', hasBadge: true },
  { icon: Wand2,    label: "AI Teacher's Toolkit", href: '/toolkit' },
  { icon: Library,  label: 'My Library',           href: '/library' },
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
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
          {/* Stylized custom 'V' for VedaAI */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4.5L12 19.5L20 4.5" />
          </svg>
        </div>
        <span className="sidebar-logo-text" style={{ fontSize: '15px' }}>VedaAI</span>
      </div>

      {/* Create Button with Glow Pill Style */}
      <div style={{ padding: '16px 12px 6px' }}>
        <Link
          href="/assignments/create"
          className="btn-pill-glow"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          <Plus size={14} />
          Create Assignment
        </Link>
      </div>

      {/* Nav Link List */}
      <div className="sidebar-section" style={{ padding: '10px 10px' }}>
        {navItems.map(({ icon: Icon, label, href, hasBadge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item${active ? ' active' : ''}`}
              style={{
                marginBottom: '2px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                background: active ? 'var(--surface-2)' : 'transparent',
                color: active ? 'var(--text-1)' : 'var(--text-3)',
                fontWeight: active ? '600' : '500'
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

      {/* Footer Institution/School Drawer */}
      <div className="sidebar-footer" style={{ padding: '10px 10px' }}>
        <Link 
          href="/settings" 
          className={`nav-item${isActive('/settings') ? ' active' : ''}`} 
          style={{ 
            marginBottom: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '13px'
          }}
        >
          <Settings size={15} className="nav-icon" />
          Settings
        </Link>
        
        <div className="user-card" style={{ padding: '8px 10px', borderRadius: '10px' }}>
          <div 
            className="user-avatar" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #fef08a, #fde047)', 
              border: '1px solid var(--border-strong)', 
              color: '#854d0e', 
              fontSize: '11px', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            DPS
          </div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.2' }}>
              Delhi Public School
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
              Bokaro Steel City
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
