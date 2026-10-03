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
  Plus,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Server,
  Layers,
} from 'lucide-react'
import { adminApi } from '../lib/api'
import { cmsBackend } from '../lib/cmsBackend'
import { PageHeader, StatCard, Btn } from './ui'

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
  { label: 'Projects', to: '/admin/projects', icon: FolderOpen, desc: 'Manage works & repos' },
  { label: 'Posts', to: '/admin/posts', icon: FileText, desc: 'Writeups & engineering' },
  { label: 'Releases', to: '/admin/releases', icon: Package, desc: 'Versions & downloads' },
  { label: 'Skills', to: '/admin/skills', icon: Zap, desc: 'Tech stack & levels' },
  { label: 'Achievements', to: '/admin/achievements', icon: Award, desc: 'Hackathons & awards' },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare, desc: 'Contact inquiries' },
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

  const handleExportJson = () => {
    const data = cmsBackend.getSnapshot()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mickycodes-cms-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statCards = [
    { label: 'Projects', value: stats.total_projects ?? 0, icon: <FolderOpen size={18} /> },
    { label: 'Articles', value: stats.total_posts ?? 0, icon: <FileText size={18} /> },
    { label: 'Releases', value: stats.total_releases ?? 0, icon: <Package size={18} /> },
    { label: 'Skills', value: stats.total_skills ?? 0, icon: <Zap size={18} /> },
    { label: 'Awards', value: stats.total_achievements ?? 0, icon: <Award size={18} /> },
    { label: 'Messages', value: stats.total_messages ?? 0, icon: <MessageSquare size={18} /> },
    { label: 'Telemetry', value: stats.total_views ?? 0, icon: <Eye size={18} /> },
  ]

  return (
    <div className="admin-page space-y-8">
      {/* Page Header */}
      <PageHeader
        monoTag="CONTROL CENTER / SYSTEM OVERVIEW"
        title="Dashboard"
        subtitle="Live state, metrics, and identity management conforming to OpenAPI 3.0"
        action={
          <div className="flex items-center gap-3">
            <Btn
              variant="secondary"
              icon={<Download size={13} />}
              onClick={handleExportJson}
              title="Download entire CMS database as JSON"
            >
              Export JSON
            </Btn>
            <Btn
              icon={<Plus size={14} />}
              onClick={() => navigate('/admin/projects')}
            >
              New Project
            </Btn>
          </div>
        }
      />

      {/* Hero Welcome Card matching portfolio */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 md:p-10 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="mono-label text-neutral-400">Mickyas Tesfaye</span>
              <span className="text-neutral-600 font-mono">/</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.65rem] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Backend Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Identity, Content & System Engine
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Manage all portfolio projects, technical releases, skills inventory, and visitor messages.
              Any modifications made here immediately persist and update the live portfolio view.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate('/admin/projects')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95"
            >
              <span>Manage Work</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:border-white/40 hover:bg-white/[0.06] active:scale-95"
            >
              Site Settings
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <div className="mono-label mb-3 text-neutral-500">SYSTEM METRICS</div>
        <div className="stats-grid">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <section className="dash-section">
        <h2 className="dash-section-title">
          <TrendingUp size={15} /> Quick Navigation
        </h2>
        <div className="quick-links">
          {quickLinks.map(({ label, to, icon: Icon, desc }) => (
            <button
              key={to}
              className="quick-link-card group text-left items-start p-5"
              onClick={() => navigate(to)}
            >
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white transition-transform group-hover:scale-105">
                <Icon size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm text-white group-hover:text-neutral-200 transition-colors">
                  {label}
                </div>
                <div className="text-[0.7rem] text-neutral-400 font-mono mt-1">
                  {desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Two Column Section: Recent Content & Activity Log */}
      <div className="dash-two-col">
        {/* Recent Content */}
        <section className="dash-section">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <h2 className="dash-section-title mb-0">
              <FileText size={15} /> Recent Records
            </h2>
            <span className="text-[0.68rem] font-mono text-neutral-500 uppercase">
              {recent.length} items
            </span>
          </div>

          <div className="dash-list">
            {loading && <p className="dash-empty">Loading records...</p>}
            {!loading && !recent.length && (
              <p className="dash-empty">No content added yet.</p>
            )}
            {recent.map((item: any, i) => (
              <div key={i} className="dash-list-item items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="dash-list-dot" />
                  <div className="min-w-0">
                    <div className="dash-list-title truncate">
                      {item.title ?? item.name ?? item.slug ?? 'Untitled'}
                    </div>
                    <div className="dash-list-meta">
                      {item.type || 'Item'} · {item.date ? new Date(item.date).toLocaleDateString() : 'Active'}
                    </div>
                  </div>
                </div>

                {item.status && (
                  <span className="shrink-0 text-[0.65rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-neutral-300">
                    {item.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Activity Log */}
        <section className="dash-section">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <h2 className="dash-section-title mb-0">
              <Activity size={15} /> Activity Log
            </h2>
            <span className="text-[0.68rem] font-mono text-neutral-500 uppercase">
              Audit Trail
            </span>
          </div>

          <div className="dash-list">
            {loading && <p className="dash-empty">Loading logs...</p>}
            {!loading && !activity.length && (
              <p className="dash-empty">No activity logged.</p>
            )}
            {activity.slice(0, 6).map((item: any, i) => (
              <div key={i} className="dash-list-item items-start">
                <div className="dash-list-dot activity mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="dash-list-title font-mono text-xs">
                      {item.action || 'ACTION'}
                    </div>
                    <div className="text-[0.65rem] font-mono text-neutral-500">
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                  <div className="dash-list-meta text-neutral-400 truncate">
                    {item.details || `${item.target_type || ''} ${item.target_id || ''}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* OpenAPI Specs Info Card */}
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.04] text-white">
              <Server size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">OpenAPI 3.0.0 Architecture</h3>
                <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={10} /> Fully Compatible
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Endpoints for Projects, Releases, Posts, Skills, Experience, Achievements, Categories, Tags, Media, Settings, Messages, and Analytics are available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/analytics')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:border-white/30"
            >
              <Layers size={13} />
              <span>Inspect Telemetry</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

