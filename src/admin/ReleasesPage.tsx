import { useState } from 'react'
import { Plus, Edit2, Trash2, Globe } from 'lucide-react'
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

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (r: Release) => { const { id: _id, ...rest } = r; setForm(rest); crud.openEdit(r) }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.releases.update(crud.editItem.id, form)
        crud.showToast('Release updated!')
      } else {
        await adminApi.projects.createRelease(form.project_slug || 'general', form)
        crud.showToast('Release created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'version', label: 'Version & Project', render: (r: Release) => (
      <div>
        <div className="font-semibold text-white font-mono text-sm">{r.version.startsWith('v') ? r.version : `v${r.version}`}</div>
        <div className="text-[0.72rem] text-neutral-400 font-mono mt-0.5">{r.project_slug}</div>
      </div>
    )},
    { key: 'release_date', label: 'Release Date', render: (r: Release) => (
      <span className="font-mono text-xs text-neutral-300">{r.release_date || '—'}</span>
    )},
    { key: 'status', label: 'Status', render: (r: Release) => (
      <Badge color={statusColor[r.status?.toLowerCase()] ?? 'gray'}>{r.status}</Badge>
    )},
    { key: 'downloads_count', label: 'Downloads', render: (r: Release) => (
      <span className="font-mono text-xs text-neutral-300">{(r.downloads_count || 0).toLocaleString()}</span>
    )},
    { key: 'actions', label: '', width: '120px', render: (r: Release) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(r)} title="Edit" />
        <Btn size="sm" variant="ghost" icon={<Globe size={13} />}
          onClick={() => crud.mutate(() => adminApi.releases.publish(r.id!), 'Published!')} title="Publish" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete release?')) crud.mutate(() => adminApi.releases.delete(r.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="SOFTWARE BUILDS / VERSIONS"
        title="Releases"
        subtitle="Manage tagged software releases, changelogs, and download binaries"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Release</Btn>}
      />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No releases yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Release' : 'New Release'} size="lg">
        <div className="form-grid">
          <Field label="Project Slug" required><Input value={form.project_slug} onChange={f('project_slug')} placeholder="drawviz" /></Field>
          <Field label="Version" required><Input value={form.version} onChange={f('version')} placeholder="v1.2.0" /></Field>
          <Field label="Release Date"><Input value={form.release_date} onChange={f('release_date')} type="date" /></Field>
          <Field label="Repository Tag"><Input value={form.repository_tag} onChange={f('repository_tag')} placeholder="v1.2.0" /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Downloads Count"><Input value={form.downloads_count} onChange={f('downloads_count')} type="number" min={0} /></Field>
          <Field label="Summary"><Textarea value={form.summary} onChange={f('summary')} rows={2} placeholder="Brief summary of the build" /></Field>
          <Field label="Changes (Markdown)"><Textarea value={form.changes} onChange={f('changes')} rows={5} placeholder="- Feature 1\n- Fix 2" /></Field>
          <Field label="Breaking Changes"><Textarea value={form.breaking_changes} onChange={f('breaking_changes')} rows={3} placeholder="None" /></Field>
          <Field label="Download Links"><Input value={form.download_links} onChange={f('download_links')} placeholder="https://..." /></Field>
          <Field label="Documentation Link"><Input value={form.documentation_link} onChange={f('documentation_link')} type="url" placeholder="https://..." /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create Release'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
