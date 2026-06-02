'use client'
import { Settings as SettingsIcon, User, Bell, Shield, Paintbrush } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'

const settingsSections = [
  { label: 'Profile', icon: User, description: 'Manage your personal details and avatar' },
  { label: 'Notifications', icon: Bell, description: 'Configure email and push notifications' },
  { label: 'Security', icon: Shield, description: 'Update password and authentication methods' },
  { label: 'Appearance', icon: Paintbrush, description: 'Customize the app theme and layout' },
]

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Settings" />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-1)' }}>Settings</h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginLeft: '16px' }}>Manage your account settings and preferences.</p>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {settingsSections.map(({ label, icon: Icon, description }) => (
            <div key={label} className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} style={{ color: 'var(--text-2)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-1)', marginBottom: '4px' }}>{label}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-4)', lineHeight: '1.4' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}
