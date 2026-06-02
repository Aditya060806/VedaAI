'use client'
import { useState, useCallback, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload, Plus, Minus, X, Calendar, ChevronDown,
  ArrowLeft, FileText, Info, Mic, Bell
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

  // ── File handling ──────────────────────────────
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

  // ── Validation ─────────────────────────────────
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

  // ── Submit ─────────────────────────────────────
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
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: '500' }}>Assignment</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

      <div className="page-body" style={{ maxWidth: 740, margin: '0 auto', paddingTop: 20 }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
              Create Assignment
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
            Set up a new assignment for your students
          </p>
        </div>

        {/* Slide 3 Centered Step Progress Line */}
        <div style={{ display: 'flex', width: '220px', height: '3px', background: 'var(--surface-3)', borderRadius: '2px', overflow: 'hidden', margin: '14px auto 28px' }}>
          <div style={{ width: '50%', height: '100%', background: '#09090b' }} />
        </div>

        {/* Unified Card Details Panel */}
        <div 
          className="card" 
          style={{ 
            background: 'white', 
            border: '1.5px solid var(--border)', 
            borderRadius: '16px', 
            padding: '32px 36px', 
            boxShadow: 'var(--shadow-md)',
            marginBottom: '28px'
          }}
        >
          {/* Card Title block */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-1)', margin: 0 }}>
              Assignment Details
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-4)', marginTop: '2px' }}>
              Basic information about your assignment
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Optional Title input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assignment Title <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>(optional)</span></label>
              <input
                className="input"
                placeholder="e.g. Mid-Term Exam – Physics Chapter 5"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
                style={{ padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border-strong)' }}
              />
            </div>

            {/* Dash File Drop Zone */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div
                className={`drop-zone${dragOver ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !store.file && document.getElementById('file-input')?.click()}
                style={{
                  border: '1.5px dashed var(--border-strong)',
                  borderRadius: '12px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {store.file ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, background: '#ffffff', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={18} style={{ color: 'var(--text-2)' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: '700', color: 'var(--text-1)' }}>{store.file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{(store.file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button
                      style={{ marginLeft: 16, width: 28, height: 28, padding: 0, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border)' }}
                      onClick={e => { e.stopPropagation(); store.setFile(null) }}
                      className="btn-ghost"
                    >
                      <X size={13} style={{ margin: '0 auto' }} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ffffff', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: 'var(--shadow-xs)' }}>
                      <Upload size={16} style={{ color: 'var(--text-2)' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>
                      Choose a file or drag & drop it here
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)', marginBottom: '16px' }}>
                      JPEG, PNG, upto 10MB
                    </div>
                    <label style={{ cursor: 'pointer' }}>
                      <span className="btn btn-outline btn-sm" style={{ pointerEvents: 'none', borderRadius: '8px', border: '1.5px solid var(--border-strong)', padding: '6px 14px', fontSize: '11.5px', fontWeight: '600' }}>
                        Browse Files
                      </span>
                      <input
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        accept=".pdf,.txt,.png,.jpg,.jpeg"
                        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                      />
                    </label>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-4)', textAlign: 'center', marginTop: '8px', fontWeight: '500' }}>
                Upload images of your preferred document/image
              </p>
              {errors.file && <div className="form-error" style={{ marginTop: 8 }}>{errors.file}</div>}
            </div>

            {/* Due Date selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-2)', display: 'block', marginBottom: '8px' }}>
                Due Date
              </label>
              <div style={{ position: 'relative', maxWidth: '100%' }}>
                <input
                  type="date"
                  className={`input${errors.dueDate ? ' !border-red-300' : ''}`}
                  style={{
                    padding: '8px 12px 8px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-strong)',
                    background: 'var(--surface)'
                  }}
                  placeholder="DD-MM-YYYY"
                  value={store.dueDate}
                  onChange={e => {
                    store.setDueDate(e.target.value)
                    setErrors(err => { const n = { ...err }; delete n.dueDate; return n })
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  suppressHydrationWarning
                />
              </div>
              {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
            </div>

            {/* Dynamic Question Types */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-2)', margin: 0 }}>
                  Question Type
                </label>
              </div>

              {/* Stack rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {store.questionTypes.map((qt, idx) => (
                  <div
                    key={idx}
                    className="responsive-qt-row"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border)',
                      background: '#ffffff',
                    }}
                  >
                    {/* Selector */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                      <select
                        className="input"
                        style={{ appearance: 'none', paddingRight: 28, background: 'var(--surface)', fontSize: '12.5px', borderRadius: '6px', border: '1px solid var(--border-strong)', height: '34px' }}
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

                    {/* Delete X on the side of select dropdown */}
                    <button
                      onClick={() => store.removeQuestionType(idx)}
                      className="btn-ghost"
                      style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', color: 'var(--text-4)' }}
                    >
                      <X size={13} style={{ margin: '0 auto' }} />
                    </button>

                    {/* Steppers container */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Count stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600' }}>No. of Questions</span>
                        <div className="stepper" style={{ border: '1.5px solid var(--border-strong)', borderRadius: '99px', overflow: 'hidden', background: '#fafafa', height: '28px' }}>
                          <button className="stepper-btn" style={{ width: '24px', background: 'transparent' }} onClick={() => store.updateQuestionType(idx, 'count', Math.max(1, qt.count - 1))}>
                            <Minus size={9} />
                          </button>
                          <input
                            type="number"
                            className="stepper-val"
                            style={{ width: '32px', fontSize: '12px', background: 'transparent', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
                            min={1} max={50}
                            value={qt.count}
                            onChange={e => store.updateQuestionType(idx, 'count', Math.max(1, Number(e.target.value)))}
                          />
                          <button className="stepper-btn" style={{ width: '24px', background: 'transparent' }} onClick={() => store.updateQuestionType(idx, 'count', Math.min(50, qt.count + 1))}>
                            <Plus size={9} />
                          </button>
                        </div>
                      </div>

                      {/* Marks stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600' }}>Marks</span>
                        <div className="stepper" style={{ border: '1.5px solid var(--border-strong)', borderRadius: '99px', overflow: 'hidden', background: '#fafafa', height: '28px' }}>
                          <button className="stepper-btn" style={{ width: '24px', background: 'transparent' }} onClick={() => store.updateQuestionType(idx, 'marks', Math.max(1, qt.marks - 1))}>
                            <Minus size={9} />
                          </button>
                          <input
                            type="number"
                            className="stepper-val"
                            style={{ width: '32px', fontSize: '12px', background: 'transparent', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
                            min={1} max={20}
                            value={qt.marks}
                            onChange={e => store.updateQuestionType(idx, 'marks', Math.max(1, Number(e.target.value)))}
                          />
                          <button className="stepper-btn" style={{ width: '24px', background: 'transparent' }} onClick={() => store.updateQuestionType(idx, 'marks', Math.min(20, qt.marks + 1))}>
                            <Plus size={9} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.questionTypes && (
                <div className="form-error" style={{ marginTop: 8 }}>{errors.questionTypes}</div>
              )}

              {/* Add row */}
              <button
                onClick={store.addQuestionType}
                className="btn-ghost"
                style={{ 
                  marginTop: '12px', 
                  gap: 6, 
                  fontSize: '12.5px', 
                  fontWeight: '600', 
                  padding: '6px 10px', 
                  color: 'var(--text-1)',
                  background: '#ffffff',
                  border: '1.5px solid var(--border)',
                  borderRadius: '99px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
                  <Plus size={9} color="white" />
                </div>
                Add Question Type
              </button>

              {/* Right-aligned Totals Summary block */}
              {totalQ > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '12px', color: 'var(--text-3)', fontWeight: '600' }}>
                  <span style={{ marginRight: '16px' }}>Total Questions : <strong style={{ color: 'var(--text-1)' }}>{totalQ}</strong></span>
                  <span>Total Marks : <strong style={{ color: 'var(--text-1)' }}>{totalM}</strong></span>
                </div>
              )}
            </div>

            {/* Additional info with Microphone and Character limit */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-2)', display: 'block', marginBottom: '8px' }}>
                Additional Information (For better output)
              </label>
              
              <div style={{ position: 'relative' }}>
                <textarea
                  className="input"
                  style={{ 
                    height: 100, 
                    fontSize: 13, 
                    lineHeight: 1.6, 
                    borderRadius: '10px', 
                    border: '1.5px solid var(--border-strong)',
                    padding: '12px 36px 12px 12px' 
                  }}
                  placeholder="e.g. Generate a question paper for 3 hour exam duration.."
                  value={store.additionalInstructions}
                  onChange={e => store.setAdditionalInstructions(e.target.value)}
                  maxLength={500}
                />
                
                {/* Custom Microphone icon button */}
                <button
                  type="button"
                  className="btn-ghost"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa',
                    border: '1px solid var(--border)'
                  }}
                  onClick={() => alert('Voice input is a mock feature in this development build.')}
                >
                  <Mic size={13} style={{ color: 'var(--text-2)' }} />
                </button>
              </div>
              
              <div className="form-hint" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '6px' }}>
                <span>Specify topic, difficulty, board (CBSE/ICSE), or special requirements</span>
                <span>{store.additionalInstructions.length}/500</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action errors */}
        {errors.submit && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: '#fff1f2', border: '1px solid #fecdd3', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
            {errors.submit}
          </div>
        )}

        {/* Slide 3 Centered / Aligned Footer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '48px' }}>
          <button 
            onClick={() => router.back()} 
            className="btn btn-outline"
            style={{ 
              borderRadius: '99px',
              padding: '8px 20px',
              fontSize: '12.5px',
              fontWeight: '600',
              border: '1.5px solid var(--border-strong)'
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-black"
            style={{ 
              minWidth: 120, 
              borderRadius: '99px', 
              padding: '8px 24px',
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', marginRight: '6px' }} className="anim-spin" />
                Generating...
              </>
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>

      {/* Stack css override for responsive layout row */}
      <style jsx global>{`
        @media (max-width: 600px) {
          .responsive-qt-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .responsive-qt-row > div {
            width: 100% !important;
          }
        }
      `}</style>
    </Fragment>
  )
}
