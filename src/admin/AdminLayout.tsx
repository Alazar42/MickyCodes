import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Zap,
  Award,
  Briefcase,
  Link2,
  Tag,
  Navigation,
  MessageSquare,
  BarChart2,
  Settings,
  Package,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image,
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/admin/releases', icon: Package, label: 'Releases' },
  { to: '/admin/skills', icon: Zap, label: 'Skills' },
  { to: '/admin/achievements', icon: Award, label: 'Achievements' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/social-links', icon: Link2, label: 'Social Links' },
  { to: '/admin/tags', icon: Tag, label: 'Tags' },
  { to: '/admin/navigation', icon: Navigation, label: 'Navigation' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/media', icon: Image, label: 'Media' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand" onClick={() => navigate('/admin')}>
              <img src="/logo.png" alt="MickyCodes" className="sidebar-logo" />
              <div>
                <div className="sidebar-title">MickyCodes</div>
                <div className="sidebar-subtitle">Admin Portal</div>
              </div>
            </div>
          )}
          {collapsed && (
            <img
              src="/logo.png"
              alt="MickyCodes"
              className="sidebar-logo collapsed-logo"
              onClick={() => navigate('/admin')}
            />
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={16} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            title="View Portfolio"
          >
            <ExternalLink size={16} />
            {!collapsed && <span>View Portfolio</span>}
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
