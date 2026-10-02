import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, type Skill } from '../lib/api'
import { useCrud } from './useCrud'
import {
  PageHeader, DataTable, Modal, Field, Input, Textarea, Select,
  Btn, ActionRow, Toast, Toggle,
} from './ui'

type FormState = Omit<Skill, 'id'>

const emptyForm: FormState = {
  name: '', category: '', icon: '', description: '',
  display_order: 0, featured: false, proficiency: 50,
}

export default function SkillsPage() {
  const crud = useCrud<Skill>(adminApi.skills.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (s: Skill) => {
    const { id, ...rest } = s
    setForm(rest)
    crud.openEdit(s)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.skills.update(crud.editItem.id, form)
        crud.showToast('Skill updated!')
      } else {
        await adminApi.skills.create(form)
        crud.showToast('Skill created!')
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
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'name', label: 'Name', render: (s: Skill) => (
      <div style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{s.icon && <span style={{ marginRight: 6 }}>{s.icon}</span>}{s.name}</div>
    )},
    { key: 'category', label: 'Category' },
    { key: 'proficiency', label: 'Proficiency', render: (s: Skill) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, background: 'var(--admin-border)', borderRadius: 4, height: 4, maxWidth: 80 }}>
          <div style={{ width: `${s.proficiency}%`, background: 'var(--admin-accent)', height: '100%', borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--admin-muted)' }}>{s.proficiency}%</span>
      </div>
    )},
    { key: 'featured', label: 'Featured', render: (s: Skill) => (
      <span style={{ color: s.featured ? '#34d399' : 'var(--admin-muted)' }}>{s.featured ? '★' : '—'}</span>
    )},
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: '', width: '100px', render: (s: Skill) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(s)} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete skill?')) crud.mutate(() => adminApi.skills.delete(s.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Skills" subtitle="Manage your technical skills" action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Skill</Btn>} />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No skills yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Skill' : 'New Skill'} size="md">
        <div className="form-grid">
          <Field label="Name" required><Input value={form.name} onChange={f('name')} placeholder="React" /></Field>
          <Field label="Category">
            <Select value={form.category} onChange={f('category')}>
              <option value="">Select category</option>
              <option value="Languages">Languages</option>
              <option value="Frameworks">Frameworks</option>
              <option value="Databases">Databases</option>
              <option value="Tools">Tools</option>
              <option value="Game Development">Game Development</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
            </Select>
          </Field>
          <Field label="Icon" hint="Emoji or icon name"><Input value={form.icon} onChange={f('icon')} placeholder="⚛️" /></Field>
          <Field label="Proficiency (%)" hint="0–100">
            <Input value={form.proficiency} onChange={f('proficiency')} type="number" min={0} max={100} />
          </Field>
          <Field label="Display Order"><Input value={form.display_order} onChange={f('display_order')} type="number" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f('description')} rows={2} /></Field>
          <Field label="Featured"><Toggle checked={form.featured} onChange={(v) => setForm((s) => ({ ...s, featured: v }))} label="Mark as featured" /></Field>
        </div>
        <div className="modal-actions">
          <Btn variant="secondary" onClick={crud.closeModal}>Cancel</Btn>
          <Btn loading={saving} onClick={save}>{crud.editItem ? 'Save Changes' : 'Create Skill'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
