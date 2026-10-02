import { useState } from 'react'
import { Edit2, Trash2, Globe } from 'lucide-react'
import { adminApi, type Release } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Textarea, Select, Btn, ActionRow, Toast, Badge } from './ui'

type FormState = Omit<Release, 'id'>
const emptyForm: FormState = {
  project_slug: '', version: '', release_date: '', summary: '', changes: '',
  breaking_changes: '', download_links: '', documentation_link: '',
  repository_tag: '', status: 'draft', downloads_count: 0,
}

const statusColor: Record<string, 'green' | 'yellow' | 'gray'> = {
  published: 'green', draft: 'yellow', archived: 'gray',
}

export default function ReleasesPage() {
  const crud = useCrud<Release>(adminApi.releases.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openEdit = (r: Release) => { const { id, ...rest } = r; setForm(rest); crud.openEdit(r) }

  const save = async () => {
    setSaving(true)
    try {
      await adminApi.releases.update(crud.editItem!.id!, form)
      crud.showToast('Release updated!')
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'version', label: 'Version', render: (r: Release) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontFamily: 'var(--mono)' }}>v{r.version}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{r.project_slug}</div>
      </div>
    )},
    { key: 'release_date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r: Release) => (
      <Badge color={statusColor[r.status?.toLowerCase()] ?? 'gray'}>{r.status}</Badge>
    )},
    { key: 'downloads_count', label: 'Downloads' },
    { key: 'actions', label: '', width: '120px', render: (r: Release) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(r)} />
        <Btn size="sm" variant="ghost" icon={<Globe size={13} />}
          onClick={() => crud.mutate(() => adminApi.releases.publish(r.id!), 'Published!')} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete release?')) crud.mutate(() => adminApi.releases.delete(r.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Releases" subtitle="Project release versions and changelogs" />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No releases yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title="Edit Release" size="lg">
        <div className="form-grid">
          <Field label="Project Slug" required><Input value={form.project_slug} onChange={f('project_slug')} /></Field>
          <Field label="Version" required><Input value={form.version} onChange={f('version')} placeholder="1.0.0" /></Field>
          <Field label="Release Date"><Input value={form.release_date} onChange={f('release_date')} type="date" /></Field>
          <Field label="Repository Tag"><Input value={form.repository_tag} onChange={f('repository_tag')} placeholder="v1.0.0" /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Downloads Count"><Input value={form.downloads_count} onChange={f('downloads_count')} type="number" /></Field>
          <Field label="Summary"><Textarea value={form.summary} onChange={f('summary')} rows={2} /></Field>
          <Field label="Changes (Markdown)"><Textarea value={form.changes} onChange={f('changes')} rows={5} /></Field>
          <Field label="Breaking Changes"><Textarea value={form.breaking_changes} onChange={f('breaking_changes')} rows={3} /></Field>
          <Field label="Download Links"><Input value={form.download_links} onChange={f('download_links')} /></Field>
          <Field label="Documentation Link"><Input value={form.documentation_link} onChange={f('documentation_link')} type="url" /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>Save Changes</Btn>
        </div>
      </Modal>
    </div>
  )
}
