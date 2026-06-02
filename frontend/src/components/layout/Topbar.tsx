import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'

interface Props {
  backHref?: string
  backLabel?: string
  title?: string
  actions?: React.ReactNode
}

export default function Topbar({ backHref, backLabel, title = 'Dashboard', actions }: Props) {
  return (
    <div className="topbar">
      <div className="topbar-breadcrumb">
        {backHref ? (
          <>
            <Link href={backHref} className="nav-item btn-ghost" style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              <ArrowLeft size={14} />
              {backLabel || 'Back'}
            </Link>
            <span className="sep">/</span>
            <span className="current">{title}</span>
          </>
        ) : (
          <span className="current">{title}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {actions}
        <button className="btn-ghost btn-sm" style={{ width: 32, padding: 0, height: 32 }}>
          <Bell size={14} />
        </button>
      </div>
    </div>
  )
}
