import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { adminApi, api, type Setting } from '../lib/api'
import { PageHeader, Field, Input, Textarea, Btn, Toast } from './ui'

const emptySettings: Partial<Setting> = {
  site_title: '', site_description: '', profile_name: '', bio: '',
  profile_image: '', location: '', email: '', contact_availability: '',
  social_links_json: '{}', seo_metadata_json: '{}', og_image: '', footer_text: '',
}

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<Setting>>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    api.settings.list().then((data) => {
      if (Array.isArray(data) && data.length) setForm(data[0])
      else if (data && typeof data === 'object') setForm(data as Setting)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await adminApi.settings.update(form)
      setToast({ message: 'Settings saved!', type: 'success' })
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const f = (k: keyof Setting) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))

  if (loading) return <div className="admin-page"><p style={{ color: 'var(--admin-muted)', padding: '2rem' }}>Loading settings…</p></div>

  return (
    <div className="admin-page">
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
      <PageHeader
        title="Settings"
        subtitle="Global portfolio configuration"
        action={<Btn icon={<Save size={14} />} onClick={save} loading={saving}>Save Settings</Btn>}
      />

      <div className="settings-grid">
        <section className="settings-section">
          <h2 className="settings-section-title">Site Identity</h2>
          <Field label="Site Title"><Input value={form.site_title ?? ''} onChange={f('site_title')} /></Field>
          <Field label="Site Description"><Textarea value={form.site_description ?? ''} onChange={f('site_description')} rows={2} /></Field>
          <Field label="Footer Text"><Input value={form.footer_text ?? ''} onChange={f('footer_text')} /></Field>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Profile</h2>
          <Field label="Profile Name"><Input value={form.profile_name ?? ''} onChange={f('profile_name')} /></Field>
          <Field label="Bio"><Textarea value={form.bio ?? ''} onChange={f('bio')} rows={4} /></Field>
          <Field label="Location"><Input value={form.location ?? ''} onChange={f('location')} /></Field>
          <Field label="Email"><Input value={form.email ?? ''} onChange={f('email')} type="email" /></Field>
          <Field label="Contact Availability"><Input value={form.contact_availability ?? ''} onChange={f('contact_availability')} placeholder="Open to work, Freelance…" /></Field>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Media</h2>
          <Field label="Profile Image URL"><Input value={form.profile_image ?? ''} onChange={f('profile_image')} type="url" /></Field>
          <Field label="OG Image URL" hint="Open Graph image for social sharing"><Input value={form.og_image ?? ''} onChange={f('og_image')} type="url" /></Field>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">JSON Config</h2>
          <Field label="SEO Metadata (JSON)">
            <Textarea value={form.seo_metadata_json ?? ''} onChange={f('seo_metadata_json')} rows={6} style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }} />
          </Field>
          <Field label="Social Links (JSON)" hint="Used internally for SEO">
            <Textarea value={form.social_links_json ?? ''} onChange={f('social_links_json')} rows={4} style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }} />
          </Field>
        </section>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Btn icon={<Save size={14} />} onClick={save} loading={saving}>Save Settings</Btn>
      </div>
    </div>
  )
}
