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
    const { id: _id, ...rest } = s
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
    { key: 'name', label: 'Skill', render: (s: Skill) => (
      <div className="font-semibold text-white flex items-center gap-2">
        {s.icon && <span>{s.icon}</span>}
        <span>{s.name}</span>
      </div>
    )},
    { key: 'category', label: 'Category', render: (s: Skill) => (
      <span className="text-[0.7rem] font-mono text-neutral-300 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full">
        {s.category || 'General'}
      </span>
    )},
    { key: 'proficiency', label: 'Proficiency', render: (s: Skill) => (
      <div className="flex items-center gap-3">
        <div className="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div className="bg-white h-full rounded-full" style={{ width: `${s.proficiency}%` }} />
        </div>
        <span className="text-xs font-mono text-neutral-400">{s.proficiency}%</span>
      </div>
    )},
    { key: 'featured', label: 'Featured', render: (s: Skill) => (
      <span className={`font-mono text-xs ${s.featured ? 'text-emerald-400' : 'text-neutral-600'}`}>
        {s.featured ? '★ YES' : '—'}
      </span>
    )},
    { key: 'display_order', label: 'Order', render: (s: Skill) => (
      <span className="font-mono text-xs text-neutral-400">#{s.display_order}</span>
    )},
    { key: 'actions', label: '', width: '100px', render: (s: Skill) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(s)} title="Edit" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete skill?')) crud.mutate(() => adminApi.skills.delete(s.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="TECHNICAL EXPERTISE / STACK"
        title="Skills"
        subtitle="Manage programming languages, frameworks, and proficiencies"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>New Skill</Btn>}
      />
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
