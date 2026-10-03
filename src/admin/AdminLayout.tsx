import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router'
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
  ArrowUpRight,
  Image,
  RotateCcw,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { cmsBackend } from '../lib/cmsBackend'
import { auth } from '../lib/auth'
import type { AdminUser } from '../lib/api'

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
  const [user, setUser] = useState<AdminUser | null>(() => auth.getUser())
  const navigate = useNavigate()
  const location = useLocation()

  // Track auth changes
  useEffect(() => {
    return auth.subscribe(() => {
      setUser(auth.getUser())
    })
  }, [])

  // Ensure mini-me mascot is never rendered or running on the admin dashboard
  useEffect(() => {
    const purgeMinime = () => {
      document.querySelectorAll('mini-me').forEach((el) => {
        el.remove()
      })
    }
    purgeMinime()
    const timer = setTimeout(purgeMinime, 100)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Route Guard: require authentication
  if (!auth.isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const currentItem = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )

  const handleSignOut = async () => {
    await auth.logout()
    navigate('/admin/login', { replace: true })
  }

  const handleResetData = () => {
    if (confirm('Reset all CMS data back to original portfolio seed data? Any new additions will be replaced.')) {
      cmsBackend.resetDatabase()
      window.location.reload()
    }
  }

  return (
    <div className="noise-overlay admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand" onClick={() => navigate('/admin')}>
              <div className="relative flex items-center justify-center">
                <div className="absolute h-8 w-8 rounded-full bg-white/10 blur-sm" />
                <img src="/logo.png" alt="MickyCodes" className="sidebar-logo relative z-10" />
              </div>
              <div className="min-w-0">
                <div className="sidebar-title">MickyCodes</div>
                <div className="sidebar-subtitle">CMS & Identity</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="relative mx-auto flex items-center justify-center cursor-pointer" onClick={() => navigate('/admin')}>
              <img
                src="/logo.png"
                alt="MickyCodes"
                className="sidebar-logo"
              />
            </div>
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="px-3 pt-3 pb-1">
          {!collapsed && (
            <div className="text-[0.62rem] font-mono tracking-widest text-neutral-500 uppercase px-2 py-1">
              Management
            </div>
          )}
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
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleResetData}
            className="sidebar-link text-neutral-400 hover:text-white"
            title="Reset to default seed data"
          >
            <RotateCcw size={15} />
            {!collapsed && <span className="text-xs">Reset Seed Data</span>}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            title="View Live Portfolio"
          >
            <ArrowUpRight size={16} />
            {!collapsed && <span>View Portfolio</span>}
          </a>
          <button
            onClick={handleSignOut}
            className="sidebar-link text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            title="Sign out of CMS"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="flex items-center gap-3">
            <span className="mono-label text-neutral-400">CMS</span>
            <span className="text-neutral-600 font-mono">/</span>
            <span className="text-sm font-semibold text-white tracking-tight">
              {currentItem ? currentItem.label : 'Control Panel'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-[0.68rem] font-mono tracking-wider uppercase text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OpenAPI 3.0 Connected
            </div>

            {/* User Profile Capsule */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[0.65rem] font-mono font-bold text-white border border-white/20">
                <ShieldCheck size={11} className="text-emerald-400" />
              </div>
              <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
                {user?.name || 'Mickyas Tesfaye'}
              </span>
              <span className="text-[0.6rem] font-mono text-neutral-400 bg-white/[0.06] border border-white/10 px-1.5 py-0.2 rounded uppercase">
                {user?.role || 'Owner'}
              </span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95"
            >
              <span>Portfolio</span>
              <ArrowUpRight
                size={13}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}

