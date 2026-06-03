'use client'
import React from 'react'
import {
  Sparkles, FileText, BarChart2, Brain, MessageSquare,
  PenTool, Zap, ArrowRight, Lock, Wand2
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'

const tools = [
  {
    icon: Sparkles,
    label: 'AI Question Generator',
    desc: 'Generate complete question papers with sections, marks distribution, and answer keys from any topic or uploaded document.',
    badge: 'Live',
    href: '/assignments/create',
  },
  {
    icon: FileText,
    label: 'Rubric Builder',
    desc: 'Create detailed marking rubrics and grading criteria with AI assistance tailored to your curriculum.',
    badge: 'Soon',
    href: null,
  },
  {
    icon: BarChart2,
    label: 'Grade Analyzer',
    desc: 'Analyze student performance trends and automatically identify learning gaps across your class.',
    badge: 'Soon',
    href: null,
  },
  {
    icon: Brain,
    label: 'Lesson Planner',
    desc: 'Generate structured lesson plans aligned with your curriculum objectives and teaching goals.',
    badge: 'Soon',
    href: null,
  },
  {
    icon: MessageSquare,
    label: 'Student Feedback AI',
    desc: 'Generate personalized, constructive feedback for each student submission automatically.',
    badge: 'Soon',
    href: null,
  },
  {
    icon: PenTool,
    label: 'Essay Evaluator',
    desc: 'AI-powered evaluation of long-form answers with detailed scoring and inline comments.',
    badge: 'Soon',
    href: null,
  },
]

export default function ToolkitPage() {
  return (
    <>
      <Topbar title="AI Toolkit" />
      <div className="page-body">

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">AI Teacher's Toolkit</h1>
            <p className="page-desc">Powerful AI tools to supercharge your teaching workflow</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Tools Available', value: '6', sub: '1 active now' },
            { label: 'AI Generations', value: '24+', sub: 'All time' },
            { label: 'Time Saved', value: '12h+', sub: 'Estimated' },
          ].map(({ label, value, sub }, i) => (
            <div key={label} className="card animate-fade-up" style={{ padding: '20px 24px', animationDelay: `${i * 50}ms` }}>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1, marginBottom: 6 }}>
                {value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Featured active tool */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">Active</div>
          <Link
            href="/assignments/create"
            className="card-hover"
            style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px', textDecoration: 'none' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>AI Question Generator</span>
                <span className="pill pill-success" style={{ fontSize: 10 }}>
                  <span className="dot dot-success" style={{ width: 5, height: 5 }} />
                  Live
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>
                Generate complete question papers with sections, marks, and answer keys. Upload a PDF for topic-specific output.
              </p>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          </Link>
        </div>

        {/* Coming soon grid */}
        <div>
          <div className="section-title">Coming Soon</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {tools.filter(t => !t.href).map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="card animate-fade-up"
                style={{ padding: '20px 24px', opacity: 0.55, animationDelay: `${i * 40}ms` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: 'var(--text-3)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 7px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <Lock size={9} style={{ color: 'var(--text-4)' }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)' }}>Coming soon</span>
                  </div>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{label}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="card" style={{ marginTop: 24, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>More tools coming</div>
            <div style={{ fontSize: 12, color: 'var(--text-4)' }}>New AI tools are added regularly — check back soon</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <Zap size={12} style={{ color: 'var(--text-3)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>Powered by Groq LLM</span>
          </div>
        </div>
      </div>
    </>
  )
}