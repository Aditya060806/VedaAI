'use client'
import { useEffect, useState, useRef, Fragment } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, RefreshCw, Loader2, XCircle, Printer, CheckCircle, ArrowLeft, Bell, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api'
import { useJobSocket } from '@/lib/useJobSocket'
import { Assignment, QuestionPaper } from '@/types'
import OutputPage from '@/components/output/OutputPage'

const GENERATION_STEPS = [
  { label: 'Analyzing requirements', duration: 4000 },
  { label: 'Structuring question paper', duration: 5000 },
  { label: 'Generating questions', duration: 8000 },
  { label: 'Writing answer key', duration: 5000 },
  { label: 'Finalizing output', duration: 3000 },
]

function GeneratingView() {
  const [stepIdx, setStepIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const elapsedTimer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000)
    let cumulative = 0
    const stepTimers: NodeJS.Timeout[] = GENERATION_STEPS.map((step, i) => {
      cumulative += step.duration
      return setTimeout(() => setStepIdx(Math.min(i + 1, GENERATION_STEPS.length - 1)), cumulative)
    })
    return () => { clearInterval(elapsedTimer); stepTimers.forEach(clearTimeout) }
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#ffffff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '36px 40px', boxShadow: 'var(--shadow-md)' }}>

        {/* Spinner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--border)' }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#09090b',
              animation: 'spin 0.9s linear infinite',
            }} />
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 6, textAlign: 'center' }}>
          Generating your paper
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', marginBottom: 24, fontWeight: '500' }}>
          {elapsed > 0 ? `${elapsed}s elapsed` : 'Starting up...'}
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {GENERATION_STEPS.map((step, i) => {
            const isDone    = i < stepIdx
            const isCurrent = i === stepIdx
            return (
              <div
                key={step.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < GENERATION_STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: i > stepIdx ? 0.35 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? '#09090b' : 'var(--surface-2)',
                  border: isCurrent ? '1.5px solid #09090b' : isDone ? 'none' : '1.5px solid var(--border)',
                  transition: 'all 0.3s ease',
                }}>
                  {isDone ? (
                    <CheckCircle size={11} style={{ color: 'white' }} />
                  ) : isCurrent ? (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#09090b', animation: 'dot-blink 1.2s ease infinite' }} />
                  ) : (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--border-strong)' }} />
                  )}
                </div>
                <span style={{
                  fontSize: 12.5,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone ? 'var(--text-3)' : isCurrent ? 'var(--text-1)' : 'var(--text-4)',
                  transition: 'all 0.3s ease',
                }}>
                  {step.label}
                  {isDone && <span style={{ fontSize: 11, color: 'var(--text-4)', marginLeft: 8 }}>✓</span>}
                </span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 24, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
            This usually takes 20–40 seconds. You can safely keep this page open.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [paper, setPaper] = useState<QuestionPaper | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const stopPolling = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }

  const startPolling = () => {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      try {
        const a = await api.getAssignment(id)
        setAssignment(a)
        if (a.status === 'completed') { const p = await api.getPaper(id); setPaper(p); stopPolling() }
        if (a.status === 'failed') stopPolling()
      } catch {}
    }, 3000)
  }

  useJobSocket(id, (msg) => {
    if (msg.assignmentId !== id) return
    if (msg.type === 'completed') { setAssignment(a => a ? { ...a, status: 'completed' } : a); stopPolling(); api.getPaper(id).then(setPaper).catch(console.error) }
    if (msg.type === 'failed')    { setAssignment(a => a ? { ...a, status: 'failed' }    : a); stopPolling() }
  })

  useEffect(() => {
    const init = async () => {
      try {
        const a = await api.getAssignment(id)
        setAssignment(a)
        if (a.status === 'completed') { const p = await api.getPaper(id).catch(() => null); setPaper(p) }
        else if (a.status === 'pending' || a.status === 'processing') startPolling()
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    init()
    return () => stopPolling()
  }, [id])

  const handleRegenerate = async () => {
    if (!assignment || regenerating) return
    setRegenerating(true)
    setPaper(null)
    setAssignment(a => a ? { ...a, status: 'pending' } : a)
    try { await api.regenerate(id); startPolling() }
    catch (e) { console.error(e) }
    finally { setRegenerating(false) }
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 size={24} style={{ color: 'var(--text-4)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const isPending = assignment?.status === 'pending' || assignment?.status === 'processing'

  return (
    <Fragment>
      {/* High-Fidelity Header Navigation */}
      <div 
        className="no-print" 
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
            onClick={() => router.push('/assignments')} 
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
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: '500' }}>
            {assignment?.title || 'Assignment Detail'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {paper && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '99px', fontSize: '12px', border: '1.5px solid var(--border-strong)' }}
              >
                <RefreshCw size={12} className={regenerating ? 'anim-spin' : ''} style={{ marginRight: 4 }} />
                Regenerate
              </button>
            </div>
          )}

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

      {/* Processing banner */}
      {isPending && !paper && (
        <div className="banner">
          <div style={{ width: 14, height: 14, border: '2px solid var(--border-strong)', borderTopColor: 'var(--text-2)', borderRadius: '50%' }} className="anim-spin" />
          <span>AI is generating your question paper — this takes about 20–40 seconds</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-3)', animation: `dot-blink 1.2s ease ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {paper ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <OutputPage paper={paper} />
        </div>
      ) : assignment?.status === 'failed' ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff1f2', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <XCircle size={22} style={{ color: '#dc2626' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Generation Failed</h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
              The AI couldn't generate your paper. This might be due to API limits or connectivity issues.
            </p>
            <p onClick={handleRegenerate} className="btn btn-black" style={{ borderRadius: '99px' }}>
              <RefreshCw size={13} style={{ marginRight: 4 }} /> Try Again
            </p>
          </div>
        </div>
      ) : (
        <GeneratingView />
      )}
    </Fragment>
  )
}