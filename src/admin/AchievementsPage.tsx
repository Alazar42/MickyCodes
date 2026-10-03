import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, type Achievement } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Textarea, Btn, ActionRow, Toast } from './ui'

type FormState = Omit<Achievement, 'id'>
const emptyForm: FormState = {
  title: '', description: '', organization: '', date: '', image: '',
  certificate: '', external_link: '', project_association: '', display_order: 0,
}

export default function AchievementsPage() {
  const crud = useCrud<Achievement>(adminApi.achievements.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (a: Achievement) => { const { id: _id, ...rest } = a; setForm(rest); crud.openEdit(a) }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.achievements.update(crud.editItem.id, form)
        crud.showToast('Achievement updated!')
      } else {
        await adminApi.achievements.create(form)
        crud.showToast('Achievement created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'title', label: 'Honor / Award', render: (a: Achievement) => (
      <div>
        <div className="font-semibold text-white text-sm">{a.title}</div>
        <div className="text-[0.72rem] text-neutral-400 font-mono mt-0.5">{a.organization || 'General Award'}</div>
      </div>
    )},
    { key: 'date', label: 'Date', render: (a: Achievement) => (
      <span className="font-mono text-xs text-neutral-300">{a.date || '—'}</span>
    )},
    { key: 'project_association', label: 'Association', render: (a: Achievement) => (
      <span className="text-xs text-neutral-400">{a.project_association || 'Independent'}</span>
    )},
    { key: 'display_order', label: 'Order', render: (a: Achievement) => (
      <span className="font-mono text-xs text-neutral-500">#{a.display_order}</span>
    )},
    { key: 'actions', label: '', width: '100px', render: (a: Achievement) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(a)} title="Edit" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete achievement?')) crud.mutate(() => adminApi.achievements.delete(a.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="HONORS & RECOGNITION"
        title="Achievements"
        subtitle="Awards, hackathon wins, certifications, and public honors"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Achievement</Btn>}
      />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No achievements yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Achievement' : 'New Achievement'} size="md">
        <div className="form-grid">
          <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="1st Place Hackathon" /></Field>
          <Field label="Organization"><Input value={form.organization} onChange={f('organization')} /></Field>
          <Field label="Date"><Input value={form.date} onChange={f('date')} type="date" /></Field>
          <Field label="Display Order"><Input value={form.display_order} onChange={f('display_order')} type="number" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f('description')} rows={3} /></Field>
          <Field label="Image URL"><Input value={form.image} onChange={f('image')} type="url" /></Field>
          <Field label="Certificate URL"><Input value={form.certificate} onChange={f('certificate')} type="url" /></Field>
          <Field label="External Link"><Input value={form.external_link} onChange={f('external_link')} type="url" /></Field>
          <Field label="Project Association"><Input value={form.project_association} onChange={f('project_association')} /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
