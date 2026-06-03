'use client'
import { useState } from 'react'
import { QuestionPaper } from '@/types'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'

export default function OutputPage({ paper }: { paper: QuestionPaper }) {
  const [showAnswerKey, setShowAnswerKey] = useState(false)

  const totalQ = paper.sections.reduce((s, sec) => s + sec.questions.length, 0)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 60px' }}>

      {/* ── Dark AI Greeting Banner ── */}
      <div
        className="no-print"
        style={{
          background: '#1a1a1a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ margin: '0 0 16px 0', fontSize: '13.5px', lineHeight: '1.65', color: '#e4e4e7', fontWeight: '500' }}>
          Certainly, Lakshya! Here are customized Question Paper for your{' '}
          <strong style={{ color: '#fff' }}>
            {paper.className ? `Class ${paper.className}` : ''}{' '}
            {paper.subject}
          </strong>{' '}
          classes.{' '}
          {paper.sections[0]?.instruction && (
            <span style={{ color: '#a1a1aa' }}>{paper.sections[0].instruction}</span>
          )}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.15s ease'
            }}
          >
            <Download size={13} /> Download as PDF
          </button>

          <button
            onClick={() => setShowAnswerKey(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#a1a1aa',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {showAnswerKey ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showAnswerKey ? 'Hide' : 'Show'} Answer Key
          </button>
        </div>
      </div>

      {/* ── Printable Question Paper ── */}
      <div
        id="question-paper-print"
        style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          padding: '40px 52px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {/* School / Paper Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '17px',
            fontWeight: '800',
            color: '#0a0a0a',
            letterSpacing: '0.01em',
            margin: '0 0 4px 0',
            fontFamily: 'inherit'
          }}>
            {paper.schoolName || 'Delhi Public School, Sector-4, Bokaro'}
          </h1>
          <div style={{ fontSize: '13px', color: '#333', fontWeight: '500', marginBottom: '2px' }}>
            Subject: {paper.subject}
          </div>
          <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>
            Class: {paper.className}
          </div>
        </div>

        {/* Thin divider */}
        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 14px 0' }} />

        {/* Time & Marks */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#333', fontWeight: '500', marginBottom: '10px' }}>
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.totalMarks}</span>
        </div>

        {/* Instructions */}
        <p style={{ fontSize: '12.5px', color: '#333', margin: '0 0 14px 0', fontWeight: '500' }}>
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student Info Lines */}
        <div style={{ marginBottom: '20px', fontSize: '12.5px', color: '#0a0a0a' }}>
          <div style={{ marginBottom: '8px' }}>
            Name: <span style={{ display: 'inline-block', width: '180px', borderBottom: '1px solid #000' }}>&nbsp;</span>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              Roll Number: <span style={{ display: 'inline-block', width: '100px', borderBottom: '1px solid #000' }}>&nbsp;</span>
            </div>
            <div>
              Class: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #000' }}>&nbsp;</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        {paper.sections.map((section, si) => {
          let questionCounter = 0
          for (let i = 0; i < si; i++) {
            questionCounter += paper.sections[i].questions.length
          }

          return (
            <div key={si} style={{ marginBottom: '28px' }}>
              {/* Section Title */}
              <h2 style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#0a0a0a',
                margin: '0 0 4px 0',
                fontFamily: 'inherit'
              }}>
                {section.title}
              </h2>

              {section.instruction && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#555', fontStyle: 'italic', margin: '0 0 14px 0' }}>
                  {section.instruction}
                </p>
              )}

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.questions.map((q, qi) => {
                  const num = questionCounter + qi + 1
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        fontSize: '12.5px',
                        color: '#1a1a1a',
                        lineHeight: '1.65',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontWeight: '600', minWidth: '22px', flexShrink: 0 }}>
                        {num}.
                      </span>
                      <div style={{ flex: 1 }}>
                        {/* Difficulty inline */}
                        <span style={{ fontWeight: '500' }}>
                          [{q.difficulty}]{' '}
                        </span>
                        {q.text}
                        <span style={{ color: '#555', fontWeight: '600', marginLeft: '8px', fontSize: '12px' }}>
                          [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* End of Paper */}
        <div style={{ textAlign: 'center', margin: '20px 0', paddingTop: '14px', borderTop: '1px solid #ccc' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#555', letterSpacing: '0.06em' }}>
            End of Question Paper
          </span>
        </div>

        {/* Answer Key — visible when toggled, hidden on print */}
        {paper.answerKey && paper.answerKey.length > 0 && showAnswerKey && (
          <div className="no-print" style={{ borderTop: '2px dashed #d4d4d8', paddingTop: '24px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0a0a0a', marginBottom: '14px', fontFamily: 'inherit' }}>
              Answer Key:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paper.answerKey.map((ak, idx) => (
                <div key={ak.questionId} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: '#333', lineHeight: '1.65', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '600', minWidth: '22px', flexShrink: 0 }}>
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
