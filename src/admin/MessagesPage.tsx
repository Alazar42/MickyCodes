import { useEffect, useState } from 'react'
import { Archive, Trash2, Eye } from 'lucide-react'
import { adminApi, type Message } from '../lib/api'
import { useCrud } from './useCrud'
import { PageHeader, DataTable, Modal, Btn, ActionRow, Toast, Badge } from './ui'

const statusColor: Record<string, 'green' | 'yellow' | 'gray'> = {
  unread: 'yellow', read: 'green', archived: 'gray',
}

export default function MessagesPage() {
  const crud = useCrud<Message>(adminApi.messages.list)
  const [selected, setSelected] = useState<Message | null>(null)

  const cols = [
    { key: 'name', label: 'From', render: (m: Message) => (
      <div>
        <div style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{m.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{m.email}</div>
      </div>
    )},
    { key: 'subject', label: 'Subject', render: (m: Message) => (
      <span style={{ color: 'var(--admin-text)', fontSize: '0.85rem' }}>{m.subject}</span>
    )},
    { key: 'status', label: 'Status', render: (m: Message) => (
      <Badge color={statusColor[m.status?.toLowerCase()] ?? 'gray'}>{m.status}</Badge>
    )},
    { key: 'created_date', label: 'Date', render: (m: Message) => (
      <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>
        {m.created_date ? new Date(m.created_date).toLocaleDateString() : '—'}
      </span>
    )},
    { key: 'actions', label: '', width: '120px', render: (m: Message) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Eye size={13} />} onClick={() => setSelected(m)} />
        <Btn size="sm" variant="ghost" icon={<Archive size={13} />}
          onClick={() => crud.mutate(() => adminApi.messages.archive(m.id!), 'Archived!')} />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete message?')) crud.mutate(() => adminApi.messages.delete(m.id!), 'Deleted!') }} />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader title="Messages" subtitle="Contact form submissions from visitors" />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No messages yet." />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message" size="md">
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="message-meta">
              <span><strong>From:</strong> {selected.name}</span>
              <span><strong>Email:</strong> <a href={`mailto:${selected.email}`} style={{ color: 'var(--admin-accent)' }}>{selected.email}</a></span>
              <span><strong>Subject:</strong> {selected.subject}</span>
              <span><strong>Date:</strong> {selected.created_date ? new Date(selected.created_date).toLocaleString() : '—'}</span>
            </div>
            <div className="message-body">{selected.message}</div>
            <div className="modal-actions">
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn variant="ghost" icon={<Archive size={14} />}
                onClick={() => { crud.mutate(() => adminApi.messages.archive(selected.id!), 'Archived!'); setSelected(null) }}>
                Archive
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
