'use client'
import { useState } from 'react'
import { QuestionPaper } from '@/types'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Easy:     { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  Moderate: { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  Hard:     { bg: '#fff1f2', color: '#dc2626', border: '#fecdd3' },
}

export default function OutputPage({ paper }: { paper: QuestionPaper }) {
  const [showAnswerKey, setShowAnswerKey] = useState(false)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Teacher Greeting Panel — hidden on print */}
      <div
        className="no-print"
        style={{
          background: '#18181b',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '22px 24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef08a, #fde047)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700',
              color: '#854d0e',
              flexShrink: 0
            }}
          >
            AP
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', fontWeight: '500', color: '#e4e4e7' }}>
            Here is your customised question paper for{' '}
            <strong style={{ color: '#fff' }}>Class {paper.className}</strong>{' '}
            <strong style={{ color: '#fff' }}>{paper.subject}</strong>.
            It contains{' '}
            <strong style={{ color: '#fff' }}>
              {paper.sections.reduce((s, sec) => s + sec.questions.length, 0)} questions
            </strong>{' '}
            across {paper.sections.length} section{paper.sections.length !== 1 ? 's' : ''} for{' '}
            <strong style={{ color: '#fff' }}>{paper.totalMarks} marks</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            className="btn"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              borderRadius: '99px',
              padding: '6px 16px',
              fontSize: '11.5px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Download size={13} /> Download as PDF
          </button>
          <button
            onClick={() => setShowAnswerKey(v => !v)}
            className="btn"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#a1a1aa',
              borderRadius: '99px',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {showAnswerKey ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showAnswerKey ? 'Hide' : 'Show'} Answer Key
          </button>
        </div>
      </div>

      {/* Printable Question Paper Sheet */}
      <div
        id="question-paper-print"
        style={{
          background: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 48px'
        }}
      >
        {/* School Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-1)', letterSpacing: '-0.01em', margin: '0 0 4px 0' }}>
            {paper.schoolName || 'Delhi Public School, Sector-4, Bokaro'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-2)', fontWeight: '600' }}>
            <span>Subject: {paper.subject}</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span>Class: {paper.className}</span>
          </div>
        </div>

        {/* Time & Marks Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-2)', fontWeight: '600' }}>
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.totalMarks}</span>
        </div>

        {/* General Instructions */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-2)', fontWeight: '500', lineHeight: '1.5' }}>
          All questions are compulsory unless stated otherwise.
        </div>

        {/* Student Info Fields */}
        <div style={{ padding: '16px 0 24px', borderBottom: '1.5px solid #000', fontSize: '12.5px', color: 'var(--text-1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ marginRight: '6px', fontWeight: '600' }}>Name:</span>
              <div style={{ flex: 1, borderBottom: '1px solid #000', minHeight: '18px' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, minWidth: '150px' }}>
                <span style={{ marginRight: '6px', fontWeight: '600' }}>Roll Number:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000', minHeight: '18px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, minWidth: '150px' }}>
                <span style={{ marginRight: '6px', fontWeight: '600' }}>Class:</span>
                <span style={{ borderBottom: '1px solid #000', minWidth: '36px', textAlign: 'center', fontWeight: '700' }}>
                  {paper.className}
                </span>
                <span style={{ marginLeft: '12px', marginRight: '6px', fontWeight: '600' }}>Section:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000', minHeight: '18px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Question Sections */}
        <div style={{ padding: '24px 0 12px' }}>
          {paper.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: '32px' }}>

              {/* Section Header */}
              <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  {section.title}
                </h2>
                {section.instruction && (
                  <p style={{ fontSize: '11.5px', color: 'var(--text-3)', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                    {section.instruction}
                  </p>
                )}
              </div>

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.questions.map((q, qi) => {
                  const ds = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Easy
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        fontSize: '12.5px',
                        color: 'var(--text-1)',
                        lineHeight: '1.6',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'right', flexShrink: 0, paddingTop: '1px' }}>
                        {qi + 1}.
                      </span>
                      <div style={{ flex: 1 }}>
                        <span>{q.text}</span>
                        <span style={{ marginLeft: '10px', whiteSpace: 'nowrap' }}>
                          {/* Difficulty badge */}
                          <span
                            className="no-print"
                            style={{
                              display: 'inline-block',
                              padding: '1px 7px',
                              borderRadius: '99px',
                              fontSize: '10px',
                              fontWeight: '700',
                              background: ds.bg,
                              color: ds.color,
                              border: `1px solid ${ds.border}`,
                              marginRight: '6px',
                              verticalAlign: 'middle'
                            }}
                          >
                            {q.difficulty}
                          </span>
                          {/* Marks — shown in print too */}
                          <strong style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>
                            [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </strong>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* End of Paper */}
        <div style={{ textAlign: 'center', padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            *** End of Question Paper ***
          </span>
        </div>

        {/* Collapsible Answer Key */}
        {paper.answerKey && paper.answerKey.length > 0 && showAnswerKey && (
          <div className="no-print" style={{ borderTop: '2px dashed var(--border-strong)', paddingTop: '28px', marginTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                Answer Key
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paper.answerKey.map((ak, idx) => (
                <div key={ak.questionId} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.6', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'right', flexShrink: 0 }}>
                    {idx + 1}.
                  </span>
                  <p style={{ margin: 0, flex: 1 }}>{ak.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
