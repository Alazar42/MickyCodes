import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, type SocialLink } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Select, Btn, ActionRow, Toast, Toggle } from './ui'

type FormState = Omit<SocialLink, 'id'>
const emptyForm: FormState = { platform: '', label: '', url: '', icon: '', display_order: 0, is_active: true }

export default function SocialLinksPage() {
  const crud = useCrud<SocialLink>(adminApi.socialLinks.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (s: SocialLink) => { const { id, ...rest } = s; setForm(rest); crud.openEdit(s) }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.socialLinks.update(crud.editItem.id, form)
        crud.showToast('Social link updated!')
      } else {
        await adminApi.socialLinks.create(form)
        crud.showToast('Social link created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'platform', label: 'Platform', render: (s: SocialLink) => (
      <div>
        <div style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{s.icon} {s.platform}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{s.label}</div>
      </div>
    )},
    { key: 'url', label: 'URL', render: (s: SocialLink) => (
      <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--admin-accent)', fontSize: '0.8rem' }}>{s.url}</a>
    )},
    { key: 'is_active', label: 'Active', render: (s: SocialLink) => (
      <span style={{ color: s.is_active ? '#34d399' : 'var(--admin-muted)' }}>{s.is_active ? '✓' : '✗'}</span>
    )},
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: '', width: '100px', render: (s: SocialLink) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(s)} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete?')) crud.mutate(() => adminApi.socialLinks.delete(s.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Social Links" subtitle="Manage social media profiles" action={<Btn icon={<Plus size={14} />} onClick={openCreate}>Add Link</Btn>} />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No social links yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Social Link' : 'New Social Link'} size="md">
        <div className="form-grid">
          <Field label="Platform" required>
            <Select value={form.platform} onChange={f('platform')}>
              <option value="">Select platform</option>
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter / X</option>
              <option value="Telegram">Telegram</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
              <option value="Email">Email</option>
            </Select>
          </Field>
          <Field label="Label"><Input value={form.label} onChange={f('label')} placeholder="GitHub Profile" /></Field>
          <Field label="URL" required><Input value={form.url} onChange={f('url')} type="url" placeholder="https://github.com/…" /></Field>
          <Field label="Icon" hint="Emoji or icon name"><Input value={form.icon} onChange={f('icon')} placeholder="🐙" /></Field>
          <Field label="Display Order"><Input value={form.display_order} onChange={f('display_order')} type="number" /></Field>
          <Field label="Active"><Toggle checked={form.is_active} onChange={(v) => setForm((s) => ({ ...s, is_active: v }))} label="Show on portfolio" /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
