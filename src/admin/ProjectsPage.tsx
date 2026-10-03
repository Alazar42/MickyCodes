import { useState } from 'react'
import { Plus, Edit2, Trash2, Globe, Archive } from 'lucide-react'
import { adminApi, type Project } from '../lib/api'
import { useCrud } from './useCrud'
import {
  PageHeader, DataTable, Modal, Field, Input, Textarea, Select,
  Btn, Badge, ActionRow, Toast, Toggle,
} from './ui'

type FormState = Omit<Project, 'id' | 'created_date' | 'updated_date' | 'views'>

const emptyForm: FormState = {
  name: '', slug: '', short_description: '', full_description: '',
  status: 'draft', category: '', featured: false,
  thumbnail: '', gallery: '', repository_url: '', live_url: '',
  documentation_url: '', download_url: '', technologies: '', tags: '',
  start_date: '', release_date: '',
}

const statusColor: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  published: 'green', live: 'green', draft: 'yellow', archived: 'gray', in_progress: 'blue',
}

export default function ProjectsPage() {
  const crud = useCrud<Project>(adminApi.projects.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (p: Project) => {
    const { id: _id, created_date: _created_date, updated_date: _updated_date, views: _views, ...rest } = p
    setForm(rest as FormState)
    crud.openEdit(p)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.projects.update(crud.editItem.id, form)
        crud.showToast('Project updated!')
      } else {
        await adminApi.projects.create(form)
        crud.showToast('Project created!')
      }
      crud.closeModal()
      crud.load()
    } catch (e: any) {
      crud.showToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const cols = [
    { key: 'name', label: 'Name', render: (p: Project) => (
      <div>
        <div className="font-semibold text-white text-sm">{p.name}</div>
        <div className="text-[0.72rem] text-neutral-400 font-mono mt-0.5">{p.slug}</div>
      </div>
    )},
    { key: 'category', label: 'Category', render: (p: Project) => (
      <span className="text-[0.7rem] font-mono text-neutral-300 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full">
        {p.category || 'General'}
      </span>
    )},
    { key: 'status', label: 'Status', render: (p: Project) => (
      <Badge color={statusColor[p.status?.toLowerCase()] ?? 'gray'}>{p.status}</Badge>
    )},
    { key: 'featured', label: 'Featured', render: (p: Project) => (
      <span className={`font-mono text-xs ${p.featured ? 'text-emerald-400' : 'text-neutral-600'}`}>
        {p.featured ? '★ YES' : '—'}
      </span>
    )},
    { key: 'views', label: 'Views', render: (p: Project) => (
      <span className="font-mono text-xs text-neutral-300">
        {(p.views || 0).toLocaleString()}
      </span>
    )},
    { key: 'actions', label: '', width: '160px', render: (p: Project) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(p)} title="Edit" />
        <Btn size="sm" variant="ghost" icon={<Globe size={13} />}
          onClick={() => crud.mutate(() => adminApi.projects.publish(p.id!), 'Published!')} title="Publish" />
        <Btn size="sm" variant="ghost" icon={<Archive size={13} />}
          onClick={() => crud.mutate(() => adminApi.projects.archive(p.id!), 'Archived!')} title="Archive" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete project?')) crud.mutate(() => adminApi.projects.delete(p.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}

      <PageHeader
        monoTag="PORTFOLIO WORKS / SHOWCASE"
        title="Projects"
        subtitle="Manage, publish, and track works featured on MickyCodes"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Project</Btn>}
      />

      <DataTable
        columns={cols}
        data={crud.data}
        loading={crud.loading}
        error={crud.error}
        emptyText="No projects yet. Create your first project!"
      />

      <Modal
        open={crud.showModal}
        onClose={crud.closeModal}
        title={crud.editItem ? 'Edit Project' : 'New Project'}
        size="xl"
      >
        <div className="form-grid">
          <Field label="Name" required><Input value={form.name} onChange={f('name')} placeholder="Project name" /></Field>
          <Field label="Slug" required><Input value={form.slug} onChange={f('slug')} placeholder="my-project" /></Field>
          <Field label="Category"><Input value={form.category} onChange={f('category')} placeholder="Web, Mobile, Game…" /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="in_progress">In Progress</option>
            </Select>
          </Field>
          <Field label="Short Description" required>
            <Textarea value={form.short_description} onChange={f('short_description')} rows={2} placeholder="One-liner description" />
          </Field>
          <Field label="Full Description">
            <Textarea value={form.full_description} onChange={f('full_description')} rows={5} placeholder="Full markdown description" />
          </Field>
          <Field label="Technologies" hint="Comma-separated: React, Go, PostgreSQL">
            <Input value={form.technologies} onChange={f('technologies')} placeholder="React, Go, PostgreSQL" />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Input value={form.tags} onChange={f('tags')} placeholder="web, fullstack" />
          </Field>
          <Field label="Repository URL"><Input value={form.repository_url} onChange={f('repository_url')} type="url" placeholder="https://github.com/…" /></Field>
          <Field label="Live URL"><Input value={form.live_url} onChange={f('live_url')} type="url" placeholder="https://…" /></Field>
          <Field label="Documentation URL"><Input value={form.documentation_url} onChange={f('documentation_url')} type="url" /></Field>
          <Field label="Download URL"><Input value={form.download_url} onChange={f('download_url')} type="url" /></Field>
          <Field label="Thumbnail URL"><Input value={form.thumbnail} onChange={f('thumbnail')} type="url" /></Field>
          <Field label="Gallery URLs" hint="Comma-separated image URLs">
            <Input value={form.gallery} onChange={f('gallery')} placeholder="https://img1.jpg, https://img2.jpg" />
          </Field>
          <Field label="Start Date"><Input value={form.start_date} onChange={f('start_date')} type="date" /></Field>
          <Field label="Release Date"><Input value={form.release_date} onChange={f('release_date')} type="date" /></Field>
          <Field label="Featured">
            <Toggle checked={form.featured} onChange={(v) => setForm((s) => ({ ...s, featured: v }))} label="Mark as featured" />
          </Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>
            {crud.editItem ? 'Save Changes' : 'Create Project'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
