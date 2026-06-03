'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload, Plus, Minus, X, ChevronDown,
  ArrowLeft, FileText, Mic, Bell, Calendar
} from 'lucide-react'
import { useFormStore, useAssignmentStore } from '@/store'
import { api } from '@/lib/api'

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Essay Questions',
  'Fill in the Blanks',
  'True/False',
  'Match the Following',
]

export default function CreateAssignmentPage() {
  const router = useRouter()
  const store = useFormStore()
  const { addAssignment } = useAssignmentStore()

  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (f: File) => {
    const allowed = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg']
    if (!allowed.includes(f.type)) {
      setErrors(e => ({ ...e, file: 'Only PDF, TXT, PNG, JPG files are allowed.' }))
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrors(e => ({ ...e, file: 'File must be smaller than 10MB.' }))
      return
    }
    store.setFile(f)
    setErrors(e => { const n = { ...e }; delete n.file; return n })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!store.dueDate) newErrors.dueDate = 'Due date is required'
    if (store.questionTypes.length === 0) newErrors.questionTypes = 'Add at least one question type'
    for (let i = 0; i < store.questionTypes.length; i++) {
      const qt = store.questionTypes[i]
      if (!qt.type) newErrors[`qt_type_${i}`] = 'Select a type'
      if (qt.count < 1) newErrors[`qt_count_${i}`] = 'Min 1 question'
      if (qt.marks < 1) newErrors[`qt_marks_${i}`] = 'Min 1 mark'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('dueDate', store.dueDate)
      fd.append('questionTypes', JSON.stringify(store.questionTypes))
      fd.append('additionalInstructions', store.additionalInstructions)
      fd.append('title', title.trim() || `Assignment – ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`)
      if (store.file) fd.append('file', store.file)
      const { assignment } = await api.createAssignment(fd)
      addAssignment(assignment)
      store.resetForm()
      router.push(`/assignments/${assignment._id}`)
    } catch (e: any) {
      setErrors({ submit: e.message || 'Failed to create assignment. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const totalQ = store.totalQuestions()
  const totalM = store.totalMarks()

  return (
    <>
      {/* Topbar */}
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
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => router.push('/assignments')}
            className="btn-ghost"
            style={{ width: 28, height: 28, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={14} />
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: '500' }}>Assignment</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-ghost" style={{ width: 28, height: 28, padding: 0, borderRadius: '50%', position: 'relative' }}>
            <Bell size={14} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#ea580c' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#fef08a,#fde047)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: '#854d0e' }}>
              JD
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)' }}>John Doe</span>
            <ChevronDown size={11} style={{ color: 'var(--text-4)' }} />
          </div>
        </div>
      </div>

      {/* Page body — fills content area */}
      <div className="page-body" style={{ paddingTop: 24 }}>

        {/* Mobile sub-header (hidden on desktop) */}
        <div className="mobile-sub-header" style={{ display: 'none' }}>
          <button onClick={() => router.push('/assignments')} className="btn-ghost" style={{ width: 32, height: 32, padding: 0, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-1)' }}>Create Assignment</span>
        </div>

        {/* Title */}
        <div className="desktop-only" style={{ marginBottom: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
              Create Assignment
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: 4 }}>
            Set up a new assignment for your students
          </p>
        </div>

        {/* Step bar */}
        <div className="desktop-only" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 200, height: 3, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', background: '#09090b' }} />
          </div>
        </div>

        {/* Card */}
        <div className="card-mobile-tight" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', marginBottom: 28 }}>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-1)', margin: 0 }}>Assignment Details</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: 2 }}>Basic information about your assignment</p>
          </div>

          {/* File Upload */}
          <div
            className={`drop-zone${dragOver ? ' over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !store.file && document.getElementById('file-input')?.click()}
            style={{
              border: '1.5px dashed #d4d4d8',
              borderRadius: 12,
              padding: '36px 20px',
              textAlign: 'center',
              background: '#fafafa',
              cursor: store.file ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
              marginBottom: 8,
            }}
          >
            {store.file ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} style={{ color: 'var(--text-2)' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: '700', color: 'var(--text-1)' }}>{store.file.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{(store.file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button
                  style={{ marginLeft: 12, width: 28, height: 28, padding: 0, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); store.setFile(null) }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <Upload size={18} style={{ color: 'var(--text-3)' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: '600', color: 'var(--text-1)', marginBottom: 4 }}>
                  Choose a file or drag &amp; drop it here
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 14 }}>
                  JPEG, PNG, upto 10MB
                </div>
                <label style={{ cursor: 'pointer' }}>
                  <span className="btn btn-outline btn-sm" style={{ pointerEvents: 'none', borderRadius: 8, border: '1.5px solid var(--border-strong)', padding: '6px 18px', fontSize: '12px', fontWeight: '600' }}>
                    Browse Files
                  </span>
                  <input id="file-input" type="file" style={{ display: 'none' }} accept=".pdf,.txt,.png,.jpg,.jpeg" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
                </label>
              </>
            )}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-4)', textAlign: 'center', marginBottom: 24 }}>
            Upload images of your preferred document/image
          </p>
          {errors.file && <div className="form-error" style={{ marginBottom: 16 }}>{errors.file}</div>}

          {/* Due Date */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', display: 'block', marginBottom: 8 }}>
              Due Date
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="input"
                style={{ padding: '10px 36px 10px 14px', fontSize: '13px', borderRadius: 10, border: '1px solid var(--border)', background: '#fff' }}
                value={store.dueDate}
                onChange={e => {
                  store.setDueDate(e.target.value)
                  setErrors(err => { const n = { ...err }; delete n.dueDate; return n })
                }}
                min={new Date().toISOString().split('T')[0]}
                suppressHydrationWarning
              />
              <Calendar size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
            </div>
            {errors.dueDate && <div className="form-error" style={{ marginTop: 6 }}>{errors.dueDate}</div>}
          </div>

          {/* Question Type — horizontal rows */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 12 }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', flex: 1 }}>
                Question Type
              </label>
              <div style={{ display: 'flex', gap: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', width: 110, textAlign: 'center' }}>No. of Questions</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-3)', width: 90, textAlign: 'center' }}>Marks</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {store.questionTypes.map((qt, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 0',
                    borderBottom: idx < store.questionTypes.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {/* Type dropdown */}
                  <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                    <select
                      className="input"
                      style={{
                        appearance: 'none',
                        padding: '9px 28px 9px 14px',
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: '#fafafa',
                        height: 38,
                      }}
                      value={qt.type}
                      onChange={e => {
                        store.updateQuestionType(idx, 'type', e.target.value)
                        setErrors(err => { const n = { ...err }; delete n[`qt_type_${idx}`]; return n })
                      }}
                    >
                      {QUESTION_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={11} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                  </div>

                  {/* X button */}
                  <button
                    onClick={() => store.removeQuestionType(idx)}
                    style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <X size={13} style={{ color: 'var(--text-3)' }} />
                  </button>

                  {/* Count stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#fff', height: 34, flexShrink: 0 }}>
                    <button onClick={() => store.updateQuestionType(idx, 'count', Math.max(1, qt.count - 1))} style={{ width: 30, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                      <Minus size={11} />
                    </button>
                    <input
                      type="number"
                      style={{ width: 32, textAlign: 'center', border: 'none', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', outline: 'none', fontSize: '13px', fontWeight: '600', color: 'var(--text-1)', background: 'transparent', height: '100%' }}
                      min={1} max={50} value={qt.count}
                      onChange={e => store.updateQuestionType(idx, 'count', Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={() => store.updateQuestionType(idx, 'count', Math.min(50, qt.count + 1))} style={{ width: 30, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Marks stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#fff', height: 34, flexShrink: 0 }}>
                    <button onClick={() => store.updateQuestionType(idx, 'marks', Math.max(1, qt.marks - 1))} style={{ width: 30, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                      <Minus size={11} />
                    </button>
                    <input
                      type="number"
                      style={{ width: 32, textAlign: 'center', border: 'none', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', outline: 'none', fontSize: '13px', fontWeight: '600', color: 'var(--text-1)', background: 'transparent', height: '100%' }}
                      min={1} max={20} value={qt.marks}
                      onChange={e => store.updateQuestionType(idx, 'marks', Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={() => store.updateQuestionType(idx, 'marks', Math.min(20, qt.marks + 1))} style={{ width: 30, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.questionTypes && <div className="form-error" style={{ marginTop: 8 }}>{errors.questionTypes}</div>}

            {/* Add Question Type */}
            <button
              onClick={store.addQuestionType}
              style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '12.5px', fontWeight: '600', padding: '6px 14px', color: 'var(--text-1)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={11} color="white" />
              </div>
              Add Question Type
            </button>

            {/* Totals */}
            {totalQ > 0 && (
              <div style={{ marginTop: 16, textAlign: 'right', fontSize: '12px', color: 'var(--text-3)', fontWeight: '600' }}>
                <div>Total Questions : <strong style={{ color: 'var(--text-1)' }}>{totalQ}</strong></div>
                <div style={{ marginTop: 2 }}>Total Marks : <strong style={{ color: 'var(--text-1)' }}>{totalM}</strong></div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', display: 'block', marginBottom: 8 }}>
              Additional Information <span style={{ fontWeight: 400, color: 'var(--text-4)' }}>(For better output)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                className="input"
                style={{ height: 90, fontSize: 13, lineHeight: 1.6, borderRadius: 10, border: '1px solid var(--border)', padding: '10px 40px 10px 14px', resize: 'none' }}
                placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                value={store.additionalInstructions}
                onChange={e => store.setAdditionalInstructions(e.target.value)}
                maxLength={500}
              />
              <button
                type="button"
                style={{ position: 'absolute', bottom: 10, right: 10, width: 28, height: 28, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5', border: '1px solid var(--border)', cursor: 'pointer' }}
                onClick={() => alert('Voice input is a mock feature.')}
              >
                <Mic size={13} style={{ color: 'var(--text-2)' }} />
              </button>
            </div>
          </div>

        </div>
        {/* END CARD */}

        {/* Submit error */}
        {errors.submit && (
          <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fff1f2', border: '1px solid #fecdd3', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
            {errors.submit}
          </div>
        )}

        {/* Footer */}
        <div className="mobile-footer-buttons" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 48 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-outline"
            style={{ borderRadius: 99, padding: '10px 24px', fontSize: '13px', fontWeight: '600', border: '1.5px solid var(--border-strong)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={13} /> Previous
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-black"
            style={{ minWidth: 120, borderRadius: 99, padding: '10px 28px', fontSize: '13px', fontWeight: '600' }}
          >
            {submitting ? (
              <>
                <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} className="anim-spin" />
                Generating...
              </>
            ) : 'Next →'}
          </button>
        </div>

      </div>
    </>
  )
}
