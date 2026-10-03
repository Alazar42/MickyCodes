import { useState } from 'react'
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

  const openMessage = (m: Message) => {
    setSelected(m)
    if (m.id && m.status === 'unread') {
      adminApi.messages.get(m.id).then(() => crud.load()).catch(() => {})
    }
  }

  const cols = [
    { key: 'name', label: 'Sender', render: (m: Message) => (
      <div>
        <div className="font-semibold text-white text-sm">{m.name}</div>
        <div className="text-[0.72rem] text-neutral-400 font-mono mt-0.5">{m.email}</div>
      </div>
    )},
    { key: 'subject', label: 'Subject', render: (m: Message) => (
      <span className="text-neutral-200 text-sm">{m.subject}</span>
    )},
    { key: 'status', label: 'Status', render: (m: Message) => (
      <Badge color={statusColor[m.status?.toLowerCase()] ?? 'gray'}>{m.status}</Badge>
    )},
    { key: 'created_date', label: 'Received', render: (m: Message) => (
      <span className="font-mono text-xs text-neutral-400">
        {m.created_date ? new Date(m.created_date).toLocaleDateString() : '—'}
      </span>
    )},
    { key: 'actions', label: '', width: '120px', render: (m: Message) => (
      <ActionRow>
        <Btn size="sm" variant="ghost" icon={<Eye size={13} />} onClick={() => openMessage(m)} title="Read Message" />
        <Btn size="sm" variant="ghost" icon={<Archive size={13} />}
          onClick={() => crud.mutate(() => adminApi.messages.archive(m.id!), 'Archived!')} title="Archive" />
        <Btn size="sm" variant="danger" icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete message?')) crud.mutate(() => adminApi.messages.delete(m.id!), 'Deleted!') }} title="Delete" />
      </ActionRow>
    )},
  ]

  return (
    <div className="admin-page">
      {crud.toast && <Toast {...crud.toast} onDismiss={crud.dismissToast} />}
      <PageHeader
        monoTag="INBOX / VISITOR INQUIRIES"
        title="Messages"
        subtitle="Contact inquiries submitted from the portfolio contact form"
      />
      <DataTable columns={cols} data={crud.data} loading={crud.loading} error={crud.error} emptyText="No messages yet." />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Inquiry Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="message-meta">
              <span><strong>From:</strong> {selected.name}</span>
              <span><strong>Email:</strong> <a href={`mailto:${selected.email}`} className="text-white underline ml-1">{selected.email}</a></span>
              <span><strong>Subject:</strong> {selected.subject}</span>
              <span><strong>Received:</strong> {selected.created_date ? new Date(selected.created_date).toLocaleString() : '—'}</span>
            </div>
            <div className="message-body">{selected.message}</div>
            <div className="modal-actions">
              <Btn variant="secondary" onClick={() => setSelected(null)}>Close</Btn>
              <Btn variant="secondary" icon={<Archive size={14} />}
                onClick={() => { crud.mutate(() => adminApi.messages.archive(selected.id!), 'Archived!'); setSelected(null) }}>
                Archive
              </Btn>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="admin-btn btn-primary btn-md inline-flex items-center gap-1.5"
              >
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
