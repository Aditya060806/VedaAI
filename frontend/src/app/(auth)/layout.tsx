import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Left pane: Branding */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #1f1f1f, #09090b)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#fff', 
        position: 'relative', 
        overflow: 'hidden',
        borderRight: '1px solid var(--border-strong)'
      }}>
        {/* Subtle decorative background pattern */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at top right, rgba(234, 88, 12, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(234, 88, 12, 0.05), transparent 40%)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 40px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, overflow: 'hidden', background: '#fff', margin: '0 auto 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/logo.png" alt="VedaAI Logo" width={80} height={80} style={{ transform: 'scale(1.35)', transformOrigin: 'center' }} />
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.2' }}>
            Empower your teaching<br/>with <span style={{ color: '#ea580c' }}>VedaAI</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#a1a1aa', maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
            Generate structured question papers, manage assignments, and access your AI toolkit in seconds.
          </p>
        </div>
      </div>

      {/* Right pane: Auth Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fafafa' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
