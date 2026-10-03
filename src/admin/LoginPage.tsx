import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Lock, Mail, ArrowRight, ArrowLeft, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { auth } from '../lib/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (auth.isAuthenticated()) {
      const from = (location.state as any)?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    }
  }, [navigate, location])

  // Ensure mini-me mascot is not running on login page
  useEffect(() => {
    const purgeMinime = () => {
      document.querySelectorAll('mini-me').forEach((el) => {
        el.remove()
      })
    }
    purgeMinime()
    const timer = setTimeout(purgeMinime, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanUser = username.trim()
    const cleanPass = password.trim()

    if (!cleanUser || !cleanPass) {
      setError('Please provide both administrator email and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await auth.login(cleanUser, cleanPass)
      const from = (location.state as any)?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error('[Auth Error]', err)
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="noise-overlay min-h-screen bg-black text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Ambient gradient glow in the center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 60%, transparent 80%)',
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          <span>PORTFOLIO</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[0.7rem] font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SECURITY GATEWAY ACTIVE</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-6">
        <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative">
          {/* Subtle top border highlight */}
          <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Logo / Badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-center relative overflow-hidden group">
                <img src="/logo.png" alt="MickyCodes" className="w-10 h-10 object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-emerald-400">
                <Shield size={12} />
              </div>
            </div>

            <p className="mono-label mb-2">RESTRICTED TERMINAL</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Admin Access
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Sign in to manage portfolio content, engineering writeups, and telemetry.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Administrator Email / Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="name@example.com or admin"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 transition-colors focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-11 py-3 text-sm text-white placeholder-neutral-600 transition-colors focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-white accent-white focus:ring-0"
                />
                <span className="text-xs text-neutral-400">Remember session</span>
              </label>
              <span className="text-[0.7rem] font-mono text-neutral-500">SHA-256 Bearer</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 text-center text-xs font-mono text-neutral-600">
        MickyCodes CMS • Protected Environment • {new Date().getFullYear()}
      </footer>
    </div>
  )
}
