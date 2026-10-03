import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminApi, type NavigationItem } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Field, Input, Btn, ActionRow, Toast, Toggle } from './ui'

type FormState = Omit<NavigationItem, 'id'>
const emptyForm: FormState = { label: '', url: '', visibility: true, display_order: 0, is_external: false }

export default function NavigationPage() {
  const crud = useCrud<NavigationItem>(adminApi.navigation.list)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm(emptyForm); crud.openCreate() }
  const openEdit = (n: NavigationItem) => { const { id: _id, ...rest } = n; setForm(rest); crud.openEdit(n) }

  const save = async () => {
    setSaving(true)
    try {
      if (crud.editItem?.id) {
        await adminApi.navigation.update(crud.editItem.id, form)
        crud.showToast('Navigation item updated!')
      } else {
        await adminApi.navigation.create(form)
        crud.showToast('Navigation item created!')
      }
      crud.closeModal(); crud.load()
    } catch (e: any) { crud.showToast(e.message, 'error') }
    finally { setSaving(false) }
  }

  const f = (k: keyof FormState) => (e: any) =>
    setForm((s) => ({ ...s, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const cols = [
    { key: 'label', label: 'Navigation Item', render: (n: NavigationItem) => (
      <span className="font-semibold text-white text-sm">{n.label}</span>
    )},
    { key: 'url', label: 'Route / Link Target', render: (n: NavigationItem) => (
      <span className="font-mono text-xs text-neutral-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-md">
        {n.url}
      </span>
    )},
    { key: 'visibility', label: 'Visibility', render: (n: NavigationItem) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.65rem] font-mono uppercase ${n.visibility ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${n.visibility ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
        {n.visibility ? 'Visible' : 'Hidden'}
      </span>
    )},
    { key: 'is_external', label: 'Target', render: (n: NavigationItem) => (
      <span className="text-xs font-mono text-neutral-400">
        {n.is_external ? 'External ↗' : 'Internal Anchor'}
      </span>
    )},
    { key: 'display_order', label: 'Order', render: (n: NavigationItem) => (
      <span className="font-mono text-xs text-neutral-500">#{n.display_order}</span>
    )},
    { key: 'actions', label: '', width: '100px', render: (n: NavigationItem) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(n)} title="Edit" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete nav item?')) crud.mutate(() => adminApi.navigation.delete(n.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="STRUCTURE / SITE MAP"
        title="Navigation"
        subtitle="Manage portfolio header menu links, anchor jumps, and visibility"
        action={<Btn icon={<Plus size={14} />} onClick={openCreate}>Add Item</Btn>}
      />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No navigation items yet." />

      <Modal open={crud.showModal} onClose={crud.closeModal} title={crud.editItem ? 'Edit Nav Item' : 'New Nav Item'} size="sm">
        <div className="form-grid">
          <Field label="Label" required><Input value={form.label} onChange={f('label')} placeholder="About" /></Field>
          <Field label="URL" required><Input value={form.url} onChange={f('url')} placeholder="#about or https://…" /></Field>
          <Field label="Display Order"><Input value={form.display_order} onChange={f('display_order')} type="number" /></Field>
          <Field label="Visible">
            <Toggle checked={form.visibility} onChange={(v) => setForm((s) => ({ ...s, visibility: v }))} label="Show in nav" />
          </Field>
          <Field label="External Link">
            <Toggle checked={form.is_external} onChange={(v) => setForm((s) => ({ ...s, is_external: v }))} label="Opens in new tab" />
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
