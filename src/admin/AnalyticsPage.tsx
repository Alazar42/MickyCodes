import { useEffect, useState } from 'react'
import { BarChart2, Eye, TrendingUp, FolderOpen, FileText } from 'lucide-react'
import { adminApi } from '../lib/api'
import { PageHeader, StatCard } from './ui'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null)
  const [postStats, setPostStats] = useState<any[]>([])
  const [projectStats, setProjectStats] = useState<any[]>([])
  const [views, setViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [o, p, pr, v] = await Promise.allSettled([
        adminApi.analytics.overview(),
        adminApi.analytics.posts(),
        adminApi.analytics.projects(),
        adminApi.analytics.views(),
      ])
      if (o.status === 'fulfilled') setOverview(o.value)
      if (p.status === 'fulfilled') setPostStats(Array.isArray(p.value) ? p.value : [])
      if (pr.status === 'fulfilled') setProjectStats(Array.isArray(pr.value) ? pr.value : [])
      if (v.status === 'fulfilled') setViews(Array.isArray(v.value) ? v.value : [])
      setLoading(false)
    }
    load()
  }, [])

  const ov: any = overview && (Array.isArray(overview) ? overview[0] : overview)

  return (
    <div className="admin-page">
      <PageHeader title="Analytics" subtitle="Traffic and engagement overview" />

      {loading ? (
        <p style={{ color: 'var(--admin-muted)', padding: '2rem' }}>Loading analytics…</p>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Total Views" value={ov?.total_views ?? views.length} icon={<Eye size={20} />} color="#60a5fa" />
            <StatCard label="Unique Visitors" value={ov?.unique_visitors ?? '—'} icon={<TrendingUp size={20} />} color="#34d399" />
            <StatCard label="Post Views" value={ov?.post_views ?? postStats.length} icon={<FileText size={20} />} color="#f472b6" />
            <StatCard label="Project Views" value={ov?.project_views ?? projectStats.length} icon={<FolderOpen size={20} />} color="#818cf8" />
          </div>

          <div className="dash-two-col" style={{ marginTop: '2rem' }}>
            <section className="dash-section">
              <h2 className="dash-section-title"><FileText size={16} /> Top Posts</h2>
              <div className="dash-list">
                {!postStats.length && <p className="dash-empty">No post analytics yet.</p>}
                {postStats.slice(0, 10).map((item: any, i) => (
                  <div key={i} className="dash-list-item">
                    <div className="dash-list-dot" style={{ background: '#f472b6' }} />
                    <div style={{ flex: 1 }}>
                      <div className="dash-list-title">{item.title ?? item.slug ?? 'Post'}</div>
                      <div className="dash-list-meta">{item.views ?? item.count ?? 0} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dash-section">
              <h2 className="dash-section-title"><FolderOpen size={16} /> Top Projects</h2>
              <div className="dash-list">
                {!projectStats.length && <p className="dash-empty">No project analytics yet.</p>}
                {projectStats.slice(0, 10).map((item: any, i) => (
                  <div key={i} className="dash-list-item">
                    <div className="dash-list-dot" style={{ background: '#818cf8' }} />
                    <div style={{ flex: 1 }}>
                      <div className="dash-list-title">{item.name ?? item.slug ?? 'Project'}</div>
                      <div className="dash-list-meta">{item.views ?? item.count ?? 0} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="dash-section" style={{ marginTop: '2rem' }}>
            <h2 className="dash-section-title"><BarChart2 size={16} /> Recent Events</h2>
            <div className="dash-list">
              {!views.length && <p className="dash-empty">No view events yet.</p>}
              {views.slice(0, 20).map((item: any, i) => (
                <div key={i} className="dash-list-item">
                  <div className="dash-list-dot activity" />
                  <div>
                    <div className="dash-list-title">{item.event_type ?? item.type ?? 'View'} — {item.target_slug ?? ''}</div>
                    <div className="dash-list-meta">{item.country} · {item.device} · {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
