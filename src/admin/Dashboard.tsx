import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  FolderOpen,
  FileText,
  Zap,
  Award,
  Eye,
  MessageSquare,
  TrendingUp,
  Activity,
  Package,
} from 'lucide-react'
import { adminApi } from '../lib/api'
import { PageHeader, StatCard } from './ui'

interface Stats {
  total_projects?: number
  total_posts?: number
  total_skills?: number
  total_achievements?: number
  total_messages?: number
  total_views?: number
  total_releases?: number
}

const quickLinks = [
  { label: 'Projects', to: '/admin/projects', icon: FolderOpen, color: '#818cf8' },
  { label: 'Posts', to: '/admin/posts', icon: FileText, color: '#34d399' },
  { label: 'Skills', to: '/admin/skills', icon: Zap, color: '#fbbf24' },
  { label: 'Achievements', to: '/admin/achievements', icon: Award, color: '#f472b6' },
  { label: 'Releases', to: '/admin/releases', icon: Package, color: '#60a5fa' },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare, color: '#fb923c' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({})
  const [recent, setRecent] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [s, r, a] = await Promise.allSettled([
        adminApi.dashboard.stats(),
        adminApi.dashboard.recent(),
        adminApi.dashboard.activity(),
      ])
      if (s.status === 'fulfilled' && s.value) {
        const v: any = s.value
        setStats(Array.isArray(v) ? (v[0] ?? {}) : v)
      }
      if (r.status === 'fulfilled') setRecent(Array.isArray(r.value) ? r.value : [])
      if (a.status === 'fulfilled') setActivity(Array.isArray(a.value) ? a.value : [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Projects', value: stats.total_projects ?? '—', icon: <FolderOpen size={20} />, color: '#818cf8' },
    { label: 'Posts', value: stats.total_posts ?? '—', icon: <FileText size={20} />, color: '#34d399' },
    { label: 'Skills', value: stats.total_skills ?? '—', icon: <Zap size={20} />, color: '#fbbf24' },
    { label: 'Achievements', value: stats.total_achievements ?? '—', icon: <Award size={20} />, color: '#f472b6' },
    { label: 'Messages', value: stats.total_messages ?? '—', icon: <MessageSquare size={20} />, color: '#fb923c' },
    { label: 'Total Views', value: stats.total_views ?? '—', icon: <Eye size={20} />, color: '#60a5fa' },
    { label: 'Releases', value: stats.total_releases ?? '—', icon: <Package size={20} />, color: '#a78bfa' },
  ]

  return (
    <div className="admin-page">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your portfolio content"
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick Links */}
      <section className="dash-section">
        <h2 className="dash-section-title">
          <TrendingUp size={16} /> Quick Actions
        </h2>
        <div className="quick-links">
          {quickLinks.map(({ label, to, icon: Icon, color }) => (
            <button
              key={to}
              className="quick-link-card"
              onClick={() => navigate(to)}
            >
              <Icon size={22} style={{ color }} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent + Activity */}
      <div className="dash-two-col">
        <section className="dash-section">
          <h2 className="dash-section-title">
            <FileText size={16} /> Recent Content
          </h2>
          <div className="dash-list">
            {loading && <p className="dash-empty">Loading...</p>}
            {!loading && !recent.length && (
              <p className="dash-empty">No recent content yet.</p>
            )}
            {recent.map((item: any, i) => (
              <div key={i} className="dash-list-item">
                <div className="dash-list-dot" />
                <div>
                  <div className="dash-list-title">{item.title ?? item.name ?? item.slug ?? 'Untitled'}</div>
                  {item.status && (
                    <div className="dash-list-meta">{item.status}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dash-section">
          <h2 className="dash-section-title">
            <Activity size={16} /> Activity Log
          </h2>
          <div className="dash-list">
            {loading && <p className="dash-empty">Loading...</p>}
            {!loading && !activity.length && (
              <p className="dash-empty">No recent activity.</p>
            )}
            {activity.map((item: any, i) => (
              <div key={i} className="dash-list-item">
                <div className="dash-list-dot activity" />
                <div>
                  <div className="dash-list-title">
                    {item.action ?? item.event_type ?? 'Action'}
                  </div>
                  <div className="dash-list-meta">
                    {item.target_type ?? item.target_slug ?? ''}
                    {item.timestamp && ` · ${new Date(item.timestamp).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
