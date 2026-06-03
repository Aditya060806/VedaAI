'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, BookOpen, Clock, CheckCircle, AlertCircle,
  ArrowRight, Zap, TrendingUp, Users, Activity
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { api } from '@/lib/api'
import { Assignment } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatusPill({ status }: { status: Assignment['status'] }) {
  const map: Record<string, { cls: string; dot: string; label: string }> = {
    completed:  { cls: 'pill-success',  dot: 'dot-success', label: 'Completed'  },
    processing: { cls: 'pill-info',     dot: 'dot-info',    label: 'Processing' },
    pending:    { cls: 'pill-warning',  dot: 'dot-warning', label: 'Pending'    },
    failed:     { cls: 'pill-danger',   dot: 'dot-danger',  label: 'Failed'     },
  }
  const c = map[status] || map.pending
  return (
    <span className={`pill ${c.cls}`}>
      <span className={`dot ${c.dot}`} />
      {c.label}
    </span>
  )
}

export default function HomePage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAssignments()
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total     = assignments.length
  const completed = assignments.filter(a => a.status === 'completed').length
  const active    = assignments.filter(a => a.status === 'pending' || a.status === 'processing').length
  const failed    = assignments.filter(a => a.status === 'failed').length
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0
  const recent    = assignments.slice(0, 5)

  const fmtDate = (d: string) => {
    try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
  }
  const fmtRelative = (d: string) => {
    try { return formatDistanceToNow(new Date(d), { addSuffix: true }) } catch { return d }
  }

  return (
    <>
      <Topbar title="Home" />
      <div className="page-body">

        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <p suppressHydrationWarning style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>
            {getGreeting()}, Aditya 👋
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            {loading ? 'Loading your workspace...' : total === 0 ? 'Welcome to VedaAI' : `You have ${total} assignment${total !== 1 ? 's' : ''}`}
          </h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total',      value: total,     icon: BookOpen,      sub: 'All time' },
            { label: 'Completed',  value: completed,  icon: CheckCircle,   sub: `${rate}% rate` },
            { label: 'In Progress',value: active,     icon: Activity,      sub: 'Generating' },
            { label: 'Failed',     value: failed,     icon: AlertCircle,   sub: 'Need retry' },
          ].map(({ label, value, icon: Icon, sub }, i) => (
            <div
              key={label}
              className="card animate-fade-up"
              style={{ padding: '20px', animationDelay: `${i * 50}ms` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}>{label}</span>
                <Icon size={14} style={{ color: 'var(--text-4)' }} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1 }}>
                {loading ? <div className="skeleton" style={{ width: 40, height: 28 }} /> : value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 6 }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

          {/* Recent assignments */}
          <div className="card">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Recent Assignments</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Your latest activity</div>
              </div>
              <Link href="/assignments" className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: 24 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ width: '60%', height: 12, marginBottom: 6 }} />
                      <div className="skeleton" style={{ width: '40%', height: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    {/* SVG Illustration of Document */}
                    <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
                      <rect x="25" y="10" width="50" height="70" rx="8" fill="#f4f4f5" stroke="#e4e4e7" strokeWidth="2.5"/>
                      <line x1="38" y1="26" x2="62" y2="26" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="38" y1="36" x2="54" y2="36" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="38" y1="46" x2="58" y2="46" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="38" y1="56" x2="48" y2="56" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    {/* Magnifying Glass with Red X */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '3px solid #09090b',
                      boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* Red X icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    {/* Magnifier Handle */}
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '14px',
                      height: '6px',
                      background: '#09090b',
                      transform: 'rotate(45deg)',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>
                
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px', textAlign: 'center' }}>
                  No assignments yet
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', maxWidth: '380px', lineHeight: '1.6', textAlign: 'center', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
                
                <Link 
                  href="/assignments/create" 
                  className="btn btn-black"
                  style={{ 
                    borderRadius: '99px',
                    padding: '8px 20px',
                    fontSize: '12.5px',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={14} /> Create Your First Assignment
                </Link>
              </div>
            ) : (
              <div>
                {recent.map((a, i) => (
                  <Link
                    key={a._id}
                    href={`/assignments/${a._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 24px',
                      borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.1s ease',
                      textDecoration: 'none',
                    }}
                    className="animate-fade-up"
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={14} style={{ color: 'var(--text-3)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>
                        Due {fmtDate(a.dueDate)} · Created {fmtRelative(a.createdAt)}
                      </div>
                    </div>
                    <StatusPill status={a.status} />
                    <ArrowRight size={13} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Quick actions */}
            <div className="card">
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Quick Actions</div>
              </div>
              <div style={{ padding: '8px' }}>
                {[
                  { icon: Plus,       label: 'New Assignment', sub: 'Generate with AI',  href: '/assignments/create' },
                  { icon: Users,      label: 'My Groups',      sub: 'Manage classes',    href: '/groups'             },
                  { icon: Zap,        label: 'AI Toolkit',     sub: 'Teaching tools',    href: '/toolkit'            },
                  { icon: TrendingUp, label: 'My Library',     sub: 'Saved papers',      href: '/library'            },
                ].map(({ icon: Icon, label, sub, href }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 10px',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background 0.1s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={12} style={{ color: 'var(--text-3)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{sub}</div>
                    </div>
                    <ArrowRight size={11} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Completion */}
            {!loading && total > 0 && (
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Completion Rate</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{rate}%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${rate}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-4)' }}>
                  <span>{completed} completed</span>
                  <span>{total - completed} remaining</span>
                </div>
              </div>
            )}

            {/* System status */}
            <div className="card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginBottom: 10 }}>System</div>
              {[
                { label: 'AI Generation',   status: 'Operational' },
                { label: 'Database',         status: 'Operational' },
                { label: 'Queue Worker',     status: 'Operational' },
              ].map(({ label, status }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#15803d' }}>
                    <span className="dot dot-success" style={{ width: 5, height: 5 }} />{status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}