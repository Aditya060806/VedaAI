'use client'
import { Settings as SettingsIcon, User, Bell, Shield, Paintbrush } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { useClerk } from '@clerk/nextjs'

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal details and avatar' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure email and push notifications' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Update password and authentication methods' },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush, description: 'Customize the app theme and layout' },
]

export default function SettingsPage() {
  const clerk = useClerk()

  const handleCardClick = (id: string) => {
    if (id === 'profile' || id === 'security') {
      clerk.openUserProfile()
    } else {
      alert(`${id.charAt(0).toUpperCase() + id.slice(1)} settings coming soon!`)
    }
  }

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {settingsSections.map(({ id, label, icon: Icon, description }) => (
            <div 
              key={id} 
              className="card" 
              onClick={() => handleCardClick(id)}
              style={{ padding: '20px 16px', cursor: 'pointer', transition: 'box-shadow 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: '12px', minHeight: '110px' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} style={{ color: '#52525b' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#09090b', marginBottom: '4px' }}>{label}</h3>
                <p style={{ fontSize: '11px', color: '#71717a', lineHeight: '1.4' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}
