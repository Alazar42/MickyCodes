import { useEffect, useRef, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import { X, Loader2, AlertCircle, Search, Check } from 'lucide-react'

// ─── Page Header ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  monoTag?: string
  action?: ReactNode
}
export function PageHeader({ title, subtitle, monoTag = 'PORTFOLIO CONTENT & CMS', action }: PageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        <div className="mono-label mb-2 text-neutral-400/80">{monoTag}</div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
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
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <div className="stat-icon transition-transform duration-200 group-hover:scale-110" style={{ color }}>{icon}</div>
        <span className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
      </div>
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
  searchPlaceholder?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  loading,
  error,
  emptyText = 'No data found.',
  searchPlaceholder = 'Filter records...',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      Object.values(row).some((val) => {
        if (typeof val === 'string') return val.toLowerCase().includes(q)
        if (typeof val === 'number') return String(val).includes(q)
        return false
      })
    )
  }, [data, search])

  if (loading) {
    return (
      <div className="table-state border border-white/[0.08] rounded-2xl bg-white/[0.02]">
        <Loader2 size={22} className="spin text-white" />
        <span className="text-neutral-400">Loading data from OpenAPI backend...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="table-state error border border-rose-500/20 rounded-2xl bg-rose-500/5">
        <AlertCircle size={22} />
        <span>{error}</span>
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="table-state muted border border-white/[0.08] rounded-2xl bg-white/[0.02] flex-col gap-3 py-16">
        <span className="text-neutral-400 text-sm">{emptyText}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.length > 2 && (
        <div className="flex items-center justify-between gap-4 px-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] pl-9 pr-8 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-all font-mono"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div className="text-[0.68rem] font-mono text-neutral-500 uppercase tracking-widest">
            Showing {filtered.length} of {data.length}
          </div>
        </div>
      )}

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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-neutral-500 font-mono text-xs">
                  No records matching &quot;{search}&quot;
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={String(row[keyField] ?? i)}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
          <div>
            <div className="mono-label text-[0.62rem] text-neutral-400 mb-1">RECORD EDITOR</div>
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} title="Close (Esc)">
            <X size={15} />
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
      {type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
      <span>{message}</span>
      <button onClick={onDismiss}><X size={13} /></button>
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

