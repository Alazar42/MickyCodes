import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, api } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Btn, ActionRow, Toast } from './ui'

interface TagItem { id?: string; name: string; slug: string }
const emptyForm = { name: '', slug: '' }

export default function TagsPage() {
  const crud = useCrud<TagItem>(api.tags.list)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (t: TagItem) => { setForm({ name: t.name, slug: t.slug }); crud.openEdit(t) }

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.tags.update(crud.editItem.id, form)
        crud.showToast('Tag updated!')
      } else {
        await adminApi.tags.create(form)
        crud.showToast('Tag created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const cols = [
    { key: 'name', label: 'Name', render: (t: TagItem) => <span style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{t.name}</span> },
    { key: 'slug', label: 'Slug', render: (t: TagItem) => <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{t.slug}</span> },
    { key: 'actions', label: '', width: '100px', render: (t: TagItem) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(t)} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete tag?')) crud.mutate(() => adminApi.tags.delete(t.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Tags" subtitle="Content tags for projects and posts" action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Tag</Btn>} />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No tags yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Tag' : 'New Tag'} size="sm">
        <div className="form-grid">
          <Field label="Name" required>
            <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="React" />
          </Field>
          <Field label="Slug" required>
            <Input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} placeholder="react" />
          </Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
