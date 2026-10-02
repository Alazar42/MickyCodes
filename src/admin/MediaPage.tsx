import { useEffect, useState } from 'react'
import { Trash2, Image as ImageIcon } from 'lucide-react'
import { adminApi } from '../lib/api'
import { PageHeader, Btn, Toast } from './ui'

interface MediaItem {
  id?: string
  filename: string
  url: string
  mime_type: string
  size: number
  width?: number
  height?: number
  alt_text: string
  uploaded_date: string
  associated_resource: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = () => {
    setLoading(true)
    adminApi.media.list().then((data: any) => {
      setMedia(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete media file?')) return
    try {
      await adminApi.media.delete(id)
      setToast({ message: 'Deleted!', type: 'success' })
      load()
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' })
    }
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <div className="admin-page">
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
      <PageHeader title="Media" subtitle="Uploaded images and files" />

      {loading && <p style={{ color: 'var(--admin-muted)', padding: '2rem' }}>Loading…</p>}
      {!loading && !media.length && (
        <div className="media-empty">
          <ImageIcon size={40} style={{ color: 'var(--admin-muted)', marginBottom: 12 }} />
          <p>No media files yet.</p>
        </div>
      )}

      <div className="media-grid">
        {media.map((item, i) => (
          <div key={item.id ?? i} className="media-card">
            {item.mime_type?.startsWith('image/') ? (
              <img src={item.url} alt={item.alt_text} className="media-thumb" />
            ) : (
              <div className="media-file-icon">
                <ImageIcon size={28} />
              </div>
            )}
            <div className="media-info">
              <div className="media-name" title={item.filename}>{item.filename}</div>
              <div className="media-meta">{item.mime_type} · {formatSize(item.size)}</div>
              {item.width && item.height && (
                <div className="media-meta">{item.width}×{item.height}</div>
              )}
            </div>
            <div className="media-actions">
              <a href={item.url} target="_blank" rel="noreferrer" className="media-link">View</a>
              {item.id && (
                <Btn size="sm" variant="danger" icon={<Trash2 size={11} />} onClick={() => del(item.id!)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
