'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Search, MoreVertical, BookOpen, Filter,
  RefreshCw, ChevronDown, ArrowLeft, Bell, Sparkles
} from 'lucide-react'
import { useAssignmentStore } from '@/store'
import { api } from '@/lib/api'
import { Assignment } from '@/types'
import { format } from 'date-fns'

type Status = 'all' | 'completed' | 'processing' | 'pending' | 'failed'

function Menu({ assignment, onDelete }: { assignment: Assignment; onDelete: () => void }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn-ghost"
        style={{ width: 28, height: 28, padding: 0, borderRadius: 'var(--radius-sm)', color: 'var(--text-3)' }}
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={close} />
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute', right: 0, top: 32,
              zIndex: 50, width: 140, padding: '6px',
              background: '#ffffff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              borderRadius: '12px',
              border: 'none'
            }}
          >
            <button
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--text-1)' }}
              onClick={() => { router.push(`/assignments/${assignment._id}`); close() }}
            >
              View Assignment
            </button>
            <button
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#dc2626' }}
              onClick={() => { onDelete(); close() }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function AssignmentsPage() {
  const { assignments, setAssignments, removeAssignment } = useAssignmentStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<Status>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    else setRefreshing(true)
    try {
      const data = await api.getAssignments()
      setAssignments(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [setAssignments])

  useEffect(() => { load() }, [load])

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || a.status === status
    return matchSearch && matchStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment? This cannot be undone.')) return
    try {
      await api.deleteAssignment(id)
      removeAssignment(id)
    } catch (e) {
      alert('Failed to delete. Please try again.')
    }
  }

  function fmtDate(d: string) {
    try { return format(new Date(d), 'dd-MM-yyyy') } catch { return d }
  }

  return (
    <>
      {/* High-Fidelity Header Navigation */}
      <div 
        className="no-print desktop-only" 
        style={{ 
          height: '52px', 
          borderBottom: '1px solid var(--border)', 
          background: 'var(--surface)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px 0 40px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => router.push('/home')} 
            className="btn-ghost" 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <ArrowLeft size={14} />
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: '500' }}>Assignment</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => load(true)} className="btn-ghost" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%' }}>
            <RefreshCw size={13} className={refreshing ? 'anim-spin' : ''} />
          </button>
          
          <button className="btn-ghost" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', position: 'relative' }}>
            <Bell size={14} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#ea580c' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #fef08a, #fde047)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: '700',
                color: '#854d0e'
              }}
            >
              JD
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)' }}>John Doe</span>
            <ChevronDown size={11} style={{ color: 'var(--text-4)' }} />
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Mobile sub-header (hidden on desktop) */}
        <div className="mobile-sub-header" style={{ display: 'none' }}>
          <button onClick={() => router.push('/home')} className="btn-ghost" style={{ width: 32, height: 32, padding: 0, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-1)' }}>Assignments</span>
        </div>

        {/* Title Header + Search row — hidden in the true empty (0) state to match design */}
        {(loading || assignments.length > 0) && (
          <>
            {/* Title Header with green dot */}
            <div className="desktop-only" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', flexShrink: 0 }} />
                <h1 className="page-title" style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                  Assignments
                </h1>
              </div>
              <p className="page-desc" style={{ fontSize: '12.5px', color: 'var(--text-3)', marginTop: '4px' }}>
                Manage and create assignments for your classes
              </p>
            </div>

            {/* Search & Filter Row */}
            <div className="mobile-search-row" style={{ display: 'flex', gap: '16px', marginBottom: '28px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Filter size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                <select
                  className="input"
                  value={status}
                  onChange={e => setStatus(e.target.value as Status)}
                  style={{
                    appearance: 'none',
                    padding: '10px 36px 10px 40px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderRadius: '99px',
                    border: '1px solid var(--border)',
                    background: '#ffffff',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <option value="all">Filter By</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="search-bar" style={{ flex: 1, position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
                <input
                  className="input"
                  placeholder="Search Assignment"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '10px 16px 10px 40px',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderRadius: '99px',
                    border: '1px solid var(--border)',
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card-assignment" style={{ minHeight: '120px' }}>
                <div>
                  <div className="skeleton" style={{ width: '70%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '10px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <div className="skeleton" style={{ width: '35%', height: '10px' }} />
                  <div className="skeleton" style={{ width: '35%', height: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* High Fidelity Magnifier-X Empty State — centered in content area */
          <div style={{ minHeight: 'calc(100vh - 200px)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
              <svg width="280" height="240" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="emptyBackdrop" cx="50%" cy="42%" r="58%">
                    <stop offset="0%" stopColor="#efeff1" />
                    <stop offset="70%" stopColor="#f1f1f3" />
                    <stop offset="100%" stopColor="#fafafa" stopOpacity="0" />
                  </radialGradient>
                  <filter id="docShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.06" />
                  </filter>
                </defs>

                {/* Soft circular backdrop */}
                <circle cx="140" cy="104" r="92" fill="url(#emptyBackdrop)" />

                {/* Decorative squiggle (top-left) */}
                <path d="M70 64 C 56 52, 58 33, 73 29 C 88 25, 88 11, 76 3" stroke="#3f3f46" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                {/* Comment / tag bubble (top-right) */}
                <rect x="178" y="40" width="44" height="28" rx="9" fill="#e6e6e9" />
                <rect x="188" y="52" width="24" height="4.5" rx="2.25" fill="#3f3f46" />

                {/* Document */}
                <g filter="url(#docShadow)">
                  <rect x="98" y="48" width="84" height="112" rx="12" fill="#ffffff" />
                </g>
                <rect x="114" y="68" width="44" height="10" rx="5" fill="#18181b" />
                <rect x="114" y="92" width="52" height="5" rx="2.5" fill="#e1e1e4" />
                <rect x="114" y="106" width="42" height="5" rx="2.5" fill="#e1e1e4" />
                <rect x="114" y="120" width="50" height="5" rx="2.5" fill="#e1e1e4" />
                <rect x="114" y="134" width="30" height="5" rx="2.5" fill="#e1e1e4" />

                {/* Magnifying glass — handle first, lavender ring overlaps */}
                <line x1="172" y1="162" x2="192" y2="182" stroke="#b7b4dd" strokeWidth="11" strokeLinecap="round" />
                <line x1="172" y1="162" x2="192" y2="182" stroke="#9d99cf" strokeWidth="5" strokeLinecap="round" />
                <circle cx="150" cy="140" r="30" fill="#ffffff" />
                <circle cx="150" cy="140" r="30" fill="#a5a0d6" fillOpacity="0.16" />
                <circle cx="150" cy="140" r="30" stroke="#b7b4dd" strokeWidth="8" />
                {/* Red X */}
                <line x1="138" y1="128" x2="162" y2="152" stroke="#e53935" strokeWidth="7" strokeLinecap="round" />
                <line x1="162" y1="128" x2="138" y2="152" stroke="#e53935" strokeWidth="7" strokeLinecap="round" />

                {/* Sparkle (bottom-left) */}
                <path d="M84 146 L88.5 156.5 L99 161 L88.5 165.5 L84 176 L79.5 165.5 L69 161 L79.5 156.5 Z" fill="#60a5fa" />

                {/* Accent dots */}
                <circle cx="214" cy="120" r="5" fill="#3b82f6" />
              </svg>
            </div>
            
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '10px', textAlign: 'center', letterSpacing: '-0.01em' }}>
              No assignments yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', maxWidth: '360px', lineHeight: '1.65', textAlign: 'center', marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }}>
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>
            
            <Link 
              href="/assignments/create" 
              className="btn btn-black"
              style={{ 
                borderRadius: '99px',
                padding: '11px 22px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <Plus size={15} /> Create Your First Assignment
            </Link>
          </div>
        ) : (
          /* Slide 2 Card Grid Layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px', paddingBottom: '60px' }}>
            {filtered.map(a => {
              return (
                <div
                  key={a._id}
                  className="card-assignment"
                  onClick={() => router.push(`/assignments/${a._id}`)}
                  style={{
                    padding: '24px 28px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
                    minHeight: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-1)', margin: '0 0 24px 0', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                        {a.title}
                      </h3>
                    </div>
                    <div onClick={e => e.stopPropagation()} style={{ flexShrink: 0 }}>
                      <Menu assignment={a} onDelete={() => handleDelete(a._id)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-1)' }}>
                    <span style={{ fontWeight: '700' }}>
                      Assigned on : <span style={{ fontWeight: '500', color: 'var(--text-3)' }}>{fmtDate(a.createdAt)}</span>
                    </span>
                    <span style={{ fontWeight: '700' }}>
                      Due : <span style={{ fontWeight: '500', color: 'var(--text-3)' }}>{fmtDate(a.dueDate)}</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Slide 2 Bottom Floating + Create Assignment Capsule */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="no-print floating-bottom-area" style={{ position: 'fixed', bottom: 0, left: 'var(--sidebar-w, 260px)', right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, var(--surface) 80%)', pointerEvents: 'none', zIndex: 90 }} />
            <Link 
              href="/assignments/create" 
              className="btn-pill-glow floating-pill-create no-print"
              style={{ pointerEvents: 'auto', zIndex: 91, textDecoration: 'none' }}
            >
              <Sparkles size={14} /> Create Assignment
            </Link>
          </>
        )}
      </div>
    </>
  )
}
