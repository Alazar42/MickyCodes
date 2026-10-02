import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, type Experience } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Textarea, Btn, ActionRow, Toast, Toggle } from './ui'

type FormState = Omit<Experience, 'id'>
const emptyForm: FormState = {
  title: '', organization: '', description: '', start_date: '', end_date: '',
  location: '', external_link: '', is_current: false, display_order: 0,
}

export default function ExperiencePage() {
  const crud = useCrud<Experience>(adminApi.experience.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (e: Experience) => { const { id, ...rest } = e; setForm(rest); crud.openEdit(e) }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.experience.update(crud.editItem.id, form)
        crud.showToast('Experience updated!')
      } else {
        await adminApi.experience.create(form)
        crud.showToast('Experience created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'title', label: 'Role', render: (e: Experience) => (
      <div>
        <div style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{e.title}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{e.organization}</div>
      </div>
    )},
    { key: 'start_date', label: 'Period', render: (e: Experience) => (
      <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>
        {e.start_date} → {e.is_current ? 'Present' : e.end_date}
      </span>
    )},
    { key: 'location', label: 'Location' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: '', width: '100px', render: (e: Experience) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(e)} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete experience?')) crud.mutate(() => adminApi.experience.delete(e.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Experience" subtitle="Work history and roles" action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Entry</Btn>} />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No experience entries yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Experience' : 'New Experience'} size="md">
        <div className="form-grid">
          <Field label="Job Title" required><Input value={form.title} onChange={f('title')} placeholder="Backend Developer" /></Field>
          <Field label="Organization" required><Input value={form.organization} onChange={f('organization')} /></Field>
          <Field label="Location"><Input value={form.location} onChange={f('location')} placeholder="Addis Ababa, Ethiopia" /></Field>
          <Field label="Start Date"><Input value={form.start_date} onChange={f('start_date')} type="date" /></Field>
          <Field label="End Date"><Input value={form.end_date} onChange={f('end_date')} type="date" /></Field>
          <Field label="Currently Working Here">
            <Toggle checked={form.is_current} onChange={(v) => setForm((s) => ({ ...s, is_current: v }))} label="Still working here" />
          </Field>
          <Field label="Display Order"><Input value={form.display_order} onChange={f('display_order')} type="number" /></Field>
          <Field label="External Link"><Input value={form.external_link} onChange={f('external_link')} type="url" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f('description')} rows={4} /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
