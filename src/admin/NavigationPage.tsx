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
  const openEdit = (n: NavigationItem) => { const { id, ...rest } = n; setForm(rest); crud.openEdit(n) }

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
    { key: 'label', label: 'Label', render: (n: NavigationItem) => <span style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{n.label}</span> },
    { key: 'url', label: 'URL', render: (n: NavigationItem) => <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{n.url}</span> },
    { key: 'visibility', label: 'Visible', render: (n: NavigationItem) => (
      <span style={{ color: n.visibility ? '#34d399' : 'var(--admin-muted)' }}>{n.visibility ? '✓' : '✗'}</span>
    )},
    { key: 'is_external', label: 'External', render: (n: NavigationItem) => (
      <span style={{ color: n.is_external ? '#818cf8' : 'var(--admin-muted)' }}>{n.is_external ? '↗' : '—'}</span>
    )},
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: '', width: '100px', render: (n: NavigationItem) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Edit2 size={13} />} onClick={() => openEdit(n)} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete nav item?')) crud.mutate(() => adminApi.navigation.delete(n.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Navigation" subtitle="Manage site navigation items" action={<Btn icon={<Plus size={14} />} onClick={openCreate}>Add Item</Btn>} />
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
