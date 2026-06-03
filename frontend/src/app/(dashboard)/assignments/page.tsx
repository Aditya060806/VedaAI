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
              AP
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)' }}>Aditya Pandey</span>
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
          /* Slide 4 High Fidelity Magnifier-X Empty State */
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
            <div className="no-print floating-bottom-area" style={{ position: 'fixed', bottom: 0, left: '260px', right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, var(--surface) 80%)', pointerEvents: 'none', zIndex: 90 }} />
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
