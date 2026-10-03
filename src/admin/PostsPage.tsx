import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { adminApi, type Post } from '../lib/api'
import { useCrud } from './useCrud'
import {
  PageHeader, DataTable, Modal, Field, Input, Textarea, Select,
  Btn, Badge, ActionRow, Toast,
} from './ui'

type FormState = Omit<Post, 'id' | 'published_date' | 'updated_date' | 'views'>

const emptyForm: FormState = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', tags: '', status: 'draft',
}

const statusColor: Record<string, 'green' | 'yellow' | 'gray'> = {
  published: 'green', draft: 'yellow', archived: 'gray',
}

export default function PostsPage() {
  const crud = useCrud<Post>(adminApi.posts.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (p: Post) => {
    const { id: _id, published_date: _published_date, updated_date: _updated_date, views: _views, ...rest } = p
    setForm(rest as FormState)
    crud.openEdit(p)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.posts.update(crud.editItem.id, form)
        crud.showToast('Post updated!')
      } else {
        await adminApi.posts.create(form)
        crud.showToast('Post created!')
      }
      crud.closeModal()
      crud.load()
    } catch (e: any) {
      crud.showToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))

  const cols = [
    { key: 'title', label: 'Article / Writeup', render: (p: Post) => (
      <div>
        <div className="font-semibold text-white text-sm">{p.title}</div>
        <div className="text-[0.72rem] text-neutral-400 font-mono mt-0.5">{p.slug}</div>
      </div>
    )},
    { key: 'excerpt', label: 'Excerpt', render: (p: Post) => (
      <span className="text-neutral-400 text-xs line-clamp-1">
        {p.excerpt || 'No excerpt'}
      </span>
    )},
    { key: 'tags', label: 'Tags', render: (p: Post) => (
      <span className="font-mono text-[0.7rem] text-neutral-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-md">
        {p.tags || '—'}
      </span>
    )},
    { key: 'status', label: 'Status', render: (p: Post) => (
      <Badge color={statusColor[p.status?.toLowerCase()] ?? 'gray'}>{p.status}</Badge>
    )},
    { key: 'views', label: 'Views', render: (p: Post) => (
      <span className="font-mono text-xs text-neutral-300">
        {(p.views || 0).toLocaleString()}
      </span>
    )},
    { key: 'actions', label: '', width: '160px', render: (p: Post) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(p)} title="Edit" />
        {p.status !== 'published'
          ? <Btn size="sm" variant="ghost" icon={<Eye size={13} />}
              onClick={() => crud.mutate(() => adminApi.posts.publish(p.id!), 'Published!')} title="Publish" />
          : <Btn size="sm" variant="ghost" icon={<EyeOff size={13} />}
              onClick={() => crud.mutate(() => adminApi.posts.unpublish(p.id!), 'Unpublished!')} title="Unpublish" />
        }
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete post?')) crud.mutate(() => adminApi.posts.delete(p.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="PUBLICATIONS / ENGINEERING LOG"
        title="Posts"
        subtitle="Manage articles, tutorials, and engineering writeups"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Post</Btn>}
      />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No posts yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Post' : 'New Post'} size="xl">
        <div className="form-grid">
          <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Post title" /></Field>
          <Field label="Slug" required><Input value={form.slug} onChange={f('slug')} placeholder="my-post-slug" /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={f('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Tags" hint="Comma-separated tags">
            <Input value={form.tags} onChange={f('tags')} placeholder="react, webdev, tutorial" />
          </Field>
          <Field label="Cover Image URL">
            <Input value={form.cover_image} onChange={f('cover_image')} type="url" placeholder="https://…" />
          </Field>
          <Field label="Excerpt">
            <Textarea value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="Brief summary of the post" />
          </Field>
          <Field label="Content (Markdown)">
            <Textarea value={form.content} onChange={f('content')} rows={12} placeholder="# Heading&#10;&#10;Post content in markdown..." style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem' }} />
          </Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create Post'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
