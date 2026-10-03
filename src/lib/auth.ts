// ─── Authentication Service for MickyCodes Admin CMS ────────────────────────
import { api, type AdminUser, type LoginResponse } from './api'

const TOKEN_KEY = 'micky_admin_token'
const USER_KEY = 'micky_admin_user'

const listeners: Array<() => void> = []

function notify() {
  listeners.forEach((l) => {
    try {
      l()
    } catch (e) {
      console.error(e)
    }
  })
}

export const auth = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  getUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken())
  },

  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    const res = await api.auth.login(usernameOrEmail, password)
    try {
      localStorage.setItem(TOKEN_KEY, res.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    } catch (e) {
      console.error('Failed to save auth to localStorage:', e)
    }
    notify()
    return res
  },

  async logout(): Promise<void> {
    try {
      await api.auth.logout()
    } catch {
      // ignore
    } finally {
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } catch (e) {
        console.error(e)
      }
      notify()
    }
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  },
}
