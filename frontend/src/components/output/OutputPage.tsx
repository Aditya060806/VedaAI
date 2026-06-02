'use client'
import { QuestionPaper, Question } from '@/types'
import { Download } from 'lucide-react'

export default function OutputPage({ paper }: { paper: QuestionPaper }) {
  const totalQuestions = paper.sections.reduce((s, sec) => s + sec.questions.length, 0)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px' }}>
      
      {/* Slide 1 High Fidelity Teacher Greeting Panel (no-print) */}
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
              border: '1px solid var(--border-strong)',
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
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', fontWeight: '500', color: '#e4e4e7' }}>
            Certainly, Aditya! Here are customized Question Paper for your CBSE Grade {paper.className || '8'} {paper.subject || 'Science'} classes on the NCERT chapters:
          </p>
        </div>
        
        <div>
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
        </div>
      </div>

      {/* Slide 1 Printable Question Paper Worksheet */}
      <div 
        style={{ 
          background: 'white', 
          border: '1.5px solid var(--border)', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-md)',
          padding: '40px 48px'
        }}
      >
        {/* Header Title Centering */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-1)', letterSpacing: '-0.01em', margin: '0 0 6px 0' }}>
            {paper.schoolName || 'Delhi Public School, Sector-4, Bokaro'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-2)', fontWeight: '600' }}>
            <span>Subject: {paper.subject || 'English'}</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span>Class: {paper.className || '5th'}</span>
          </div>
        </div>

        {/* Time Allowed & Max Marks Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-2)', fontWeight: '600' }}>
          <span>Time Allowed: {paper.timeAllowed || '45 minutes'}</span>
          <span>Maximum Marks: {paper.totalMarks || '20'}</span>
        </div>

        {/* Instructions block */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-2)', fontWeight: '500', lineHeight: '1.5' }}>
          All questions are compulsory unless stated otherwise.
        </div>

        {/* Slide 1 Student Information Fields */}
        <div style={{ padding: '16px 0 24px', borderBottom: '1.5px solid #000000', fontSize: '12.5px', color: 'var(--text-1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ marginRight: '6px', fontWeight: '600' }}>Name:</span>
              <div style={{ flex: 1, borderBottom: '1px solid #000000', minHeight: '18px' }} />
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, minWidth: '150px' }}>
                <span style={{ marginRight: '6px', fontWeight: '600' }}>Roll Number:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000000', minHeight: '18px' }} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, minWidth: '150px' }}>
                <span style={{ marginRight: '6px', fontWeight: '600' }}>Class:</span>
                <span style={{ borderBottom: '1px solid #000000', minWidth: '36px', textAlign: 'center', fontWeight: '700' }}>
                  {paper.className || '5th'}
                </span>
                <span style={{ marginLeft: '12px', marginRight: '6px', fontWeight: '600' }}>Section:</span>
                <div style={{ flex: 1, borderBottom: '1px solid #000000', minHeight: '18px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Sections */}
        <div style={{ padding: '24px 0 12px' }}>
          {paper.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: '28px' }}>
              
              {/* Section Header Title */}
              <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  {section.title || 'Section A'}
                </h2>
                {section.instruction && (
                  <p style={{ fontSize: '11.5px', color: 'var(--text-3)', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                    {section.instruction}
                  </p>
                )}
              </div>

              {/* Questions Stack (No dashed answer lines as in mockup) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.questions.map((q, qi) => (
                  <div
                    key={q.id}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--text-1)',
                      lineHeight: '1.6',
                      alignItems: 'flex-start'
                    }}
                  >
                    <span style={{ fontWeight: '700', minWidth: '18px', textAlign: 'right', flexShrink: 0 }}>
                      {qi + 1}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <span>
                        [{q.difficulty || 'Easy'}] {q.text}
                      </span>
                      <span style={{ fontWeight: '700', marginLeft: '6px', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>
                        [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* End of printable paper */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            End of Question Paper
          </span>
        </div>

        {/* Slide 1 High Fidelity Answer Key block */}
        {paper.answerKey && paper.answerKey.length > 0 && (
          <div style={{ borderTop: '2px dashed var(--border-strong)', paddingTop: '28px', marginTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                Answer Key
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paper.answerKey.map((ak, idx) => (
                <div key={ak.questionId} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.6', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '700', minWidth: '18px', textAlign: 'right', flexShrink: 0 }}>
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
