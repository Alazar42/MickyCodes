import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { adminApi } from '../lib/api'
import { PageHeader, Btn, Toast, Modal, Field, Input } from './ui'

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
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    filename: '',
    url: '',
    alt_text: '',
    associated_resource: 'general',
  })
  const [saving, setSaving] = useState(false)

  const load = useCallback((showSpinner = true) => {
    if (showSpinner) setLoading(true)
    adminApi.media.list().then((data: any) => {
      setMedia(Array.isArray(data) ? data : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let active = true
    adminApi.media.list().then((data: any) => {
      if (active) {
        setMedia(Array.isArray(data) ? data : [])
        setLoading(false)
      }
    }).catch(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const del = async (id: string) => {
    if (!confirm('Delete media record?')) return
    try {
      await adminApi.media.delete(id)
      setToast({ message: 'Media record removed!', type: 'success' })
      load()
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' })
    }
  }

  const handleCreate = async () => {
    if (!form.url) {
      setToast({ message: 'URL is required', type: 'error' })
      return
    }
    setSaving(true)
    try {
      await adminApi.media.list().then(() => {
        return adminApi.media.delete('mock').catch(() => {})
      })
      // Post to media endpoint via cmsBackend
      const res = await fetch('/api/v1/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: form.filename || form.url.split('/').pop() || 'media.png',
          url: form.url,
          alt_text: form.alt_text || 'Portfolio asset',
          mime_type: form.url.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
          size: 64200,
          associated_resource: form.associated_resource,
        }),
      })
      if (!res.ok) throw new Error('Failed to create media')
      setToast({ message: 'Media asset added!', type: 'success' })
      setShowModal(false)
      setForm({ filename: '', url: '', alt_text: '', associated_resource: 'general' })
      load()
    } catch (e: any) {
      setToast({ message: e.message || 'Error creating media', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <div className="admin-page space-y-6">
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
      <PageHeader
        monoTag="DIGITAL ASSETS / MEDIA REPOSITORY"
        title="Media"
        subtitle="Manage images, logos, graphics, and asset references"
        action={<Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Add Asset</Btn>}
      />

      {loading && (
        <div className="table-state border border-white/[0.08] rounded-2xl bg-white/[0.02]">
          <span className="text-neutral-400">Loading asset gallery...</span>
        </div>
      )}

      {!loading && !media.length && (
        <div className="media-empty border border-white/[0.08] rounded-2xl bg-white/[0.02]">
          <ImageIcon size={40} className="text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-mono text-sm">No media files registered yet.</p>
        </div>
      )}

      <div className="media-grid">
        {media.map((item, i) => (
          <div key={item.id ?? i} className="media-card group">
            {item.mime_type?.startsWith('image/') || item.url?.match(/\.(png|jpg|jpeg|svg|webp)$/i) ? (
              <div className="relative overflow-hidden bg-black/60 h-[145px] flex items-center justify-center p-2">
                <img
                  src={item.url}
                  alt={item.alt_text}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png'
                  }}
                />
              </div>
            ) : (
              <div className="media-file-icon">
                <ImageIcon size={32} />
              </div>
            )}
            <div className="media-info">
              <div className="media-name font-medium text-white" title={item.filename}>{item.filename}</div>
              <div className="media-meta text-neutral-400">{item.mime_type} · {formatSize(item.size)}</div>
              {item.associated_resource && (
                <div className="mt-1">
                  <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400">
                    {item.associated_resource}
                  </span>
                </div>
              )}
            </div>
            <div className="media-actions">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-white hover:text-neutral-300 font-mono"
              >
                <span>View</span>
                <ExternalLink size={11} />
              </a>
              {item.id && (
                <button
                  className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                  onClick={() => del(item.id!)}
                  title="Delete Media Record"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Media Asset" size="md">
        <div className="form-grid">
          <Field label="Asset URL" required hint="Direct image URL or public path (e.g. /logo.png)">
            <Input
              value={form.url}
              onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
              placeholder="https://... or /logo.png"
            />
          </Field>
          <Field label="Filename" hint="Display filename">
            <Input
              value={form.filename}
              onChange={(e) => setForm((s) => ({ ...s, filename: e.target.value }))}
              placeholder="my-screenshot.png"
            />
          </Field>
          <Field label="Alt Text" hint="Screen reader description">
            <Input
              value={form.alt_text}
              onChange={(e) => setForm((s) => ({ ...s, alt_text: e.target.value }))}
              placeholder="Project preview on desktop"
            />
          </Field>
          <Field label="Associated Resource">
            <Input
              value={form.associated_resource}
              onChange={(e) => setForm((s) => ({ ...s, associated_resource: e.target.value }))}
              placeholder="projects, profile, or general"
            />
          </Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleCreate}>Save Asset</Btn>
        </div>
      </Modal>
    </div>
  )
}

