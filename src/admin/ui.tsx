import { ReactNode, useEffect, useRef } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'

// ─── Page Header ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── Stats Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: string
}
export function StatCard({ label, value, icon, color = 'white' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// ─── Data Table ──────────────────────────────────────────────────────────────

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField?: keyof T
  loading?: boolean
  error?: string | null
  emptyText?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  loading,
  error,
  emptyText = 'No data found.',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="table-state">
        <Loader2 size={24} className="spin" />
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="table-state error">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    )
  }
  if (!data.length) {
    return <div className="table-state muted">{emptyText}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={String(row[keyField] ?? i)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

// ─── Form Field ──────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}
export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {children}
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="admin-input" {...props} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="admin-textarea" rows={4} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return <select className="admin-input" {...rest}>{children}</select>
}

// ─── Button ──────────────────────────────────────────────────────────────────

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}
export function Btn({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      className={`admin-btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 size={14} className="spin" /> : icon}
      {children}
    </button>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: ReactNode
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
}
export function Badge({ children, color = 'gray' }: BadgeProps) {
  return <span className={`badge badge-${color}`}>{children}</span>
}

// ─── Action Row ──────────────────────────────────────────────────────────────

export function ActionRow({ children }: { children: ReactNode }) {
  return <div className="action-row">{children}</div>
}

// ─── Alert Toast ─────────────────────────────────────────────────────────────

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onDismiss: () => void
}
export function Toast({ message, type = 'success', onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={`admin-toast toast-${type}`}>
      {type === 'error' ? <AlertCircle size={14} /> : '✓'}
      {message}
      <button onClick={onDismiss}><X size={12} /></button>
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="toggle-wrap">
      <div
        className={`toggle ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onChange(!checked) }}
      >
        <div className="toggle-thumb" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  )
}
