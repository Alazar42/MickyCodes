import { useEffect, useState } from 'react'
import { Save, Lock, KeyRound } from 'lucide-react'
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

  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPass, setChangingPass] = useState(false)

  useEffect(() => {
    api.settings.list().then((data) => {
      if (Array.isArray(data) && data.length) setForm(data[0])
      else if (data && typeof data === 'object') setForm(data as unknown as Setting)
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim()) {
      setToast({ message: 'Please enter a new password', type: 'error' })
      return
    }
    if (newPassword.trim().length < 6) {
      setToast({ message: 'Password must be at least 6 characters long', type: 'error' })
      return
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setToast({ message: 'Passwords do not match', type: 'error' })
      return
    }

    setChangingPass(true)
    try {
      await api.auth.changePassword({ new_password: newPassword.trim() })
      setToast({ message: 'Password successfully changed on backend!', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to update password', type: 'error' })
    } finally {
      setChangingPass(false)
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

        <section className="settings-section" style={{ border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lock size={16} style={{ color: '#fff' }} />
            <h2 className="settings-section-title" style={{ margin: 0 }}>Security & Password</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: '1.25rem' }}>
            Updates your administrator password on the backend server.
          </p>

          <form onSubmit={handlePasswordChange}>
            <Field label="New Password">
              <Input
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Field label="Confirm New Password">
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>

            <div style={{ marginTop: '1rem' }}>
              <Btn type="submit" icon={<KeyRound size={14} />} loading={changingPass}>
                Update Admin Password
              </Btn>
            </div>
          </form>
        </section>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Btn icon={<Save size={14} />} onClick={save} loading={saving}>Save Settings</Btn>
      </div>
    </div>
  )
}
