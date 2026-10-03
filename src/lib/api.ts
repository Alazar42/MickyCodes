import { handleCmsRequest } from './cmsBackend'

const BASE = (import.meta.env.VITE_BACKEND_URL as string) || ''

function getStoredToken(): string | null {
  try {
    return localStorage.getItem('micky_admin_token')
  } catch {
    return null
  }
}

function createHeaders(options?: RequestInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getStoredToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((val, key) => {
        headers[key] = val
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, val]) => {
        headers[key] = val
      })
    } else {
      Object.assign(headers, options.headers)
    }
  }
  return headers
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = createHeaders(options)
  const url = BASE ? `${BASE}${path}` : path

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      const message = data?.error || data?.message || `API error ${res.status}: ${res.statusText}`
      throw new Error(message)
    }

    // Handle 204 No Content or empty responses safely
    if (res.status === 204 || res.status === 205) {
      return null as T
    }

    const text = await res.text()
    if (!text || text.trim() === '') {
      return null as T
    }

    try {
      return JSON.parse(text) as T
    } catch {
      return text as unknown as T
    }
  } catch (err: any) {
    // If the server responded with an error (e.g. 401 Unauthorized), rethrow so UI shows real server error
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err
    }
    console.warn(`[API] Network call to ${url} failed, using local CMS store fallback:`, err)
    return handleCmsRequest<T>(path, {
      ...options,
      headers,
    })
  }
}

// ─── Public Types ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
  expires_in?: number
}

export interface Project {
  id?: string
  name: string
  slug: string
  short_description: string
  full_description: string
  status: string
  category: string
  featured: boolean
  thumbnail: string
  gallery: string
  repository_url: string
  live_url: string
  documentation_url: string
  download_url: string
  technologies: string
  tags: string
  start_date: string
  release_date: string
  created_date: string
  updated_date: string
  views: number
}

export interface Post {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  tags: string
  status: string
  published_date: string
  updated_date: string
  views: number
}

export interface Skill {
  id?: string
  name: string
  category: string
  icon: string
  description: string
  display_order: number
  featured: boolean
  proficiency: number
}

export interface Achievement {
  id?: string
  title: string
  description: string
  organization: string
  date: string
  image: string
  certificate: string
  external_link: string
  project_association: string
  display_order: number
}

export interface Experience {
  id?: string
  title: string
  organization: string
  description: string
  start_date: string
  end_date: string
  location: string
  external_link: string
  is_current: boolean
  display_order: number
}

export interface Category {
  id?: string
  name: string
  slug: string
  description: string
  icon: string
  display_order: number
}

export interface Tag {
  id?: string
  name: string
  slug: string
}

export interface SocialLink {
  id?: string
  platform: string
  label: string
  url: string
  icon: string
  display_order: number
  is_active: boolean
}

export interface Setting {
  id?: string
  site_title: string
  site_description: string
  profile_name: string
  bio: string
  profile_image: string
  location: string
  email: string
  contact_availability: string
  social_links_json: string
  seo_metadata_json: string
  og_image: string
  footer_text: string
}

export interface NavigationItem {
  id?: string
  label: string
  url: string
  visibility: boolean
  display_order: number
  is_external: boolean
}

export interface Message {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  created_date: string
  status: string
}

export interface Release {
  id?: string
  project_slug: string
  version: string
  release_date: string
  summary: string
  changes: string
  breaking_changes: string
  download_links: string
  documentation_link: string
  repository_tag: string
  status: string
  downloads_count: number
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const api = {
  // Projects
  projects: {
    list: () => request<Project[]>('/api/v1/projects'),
    get: (slug: string) => request<Project>(`/api/v1/projects/${slug}`),
    releases: (slug: string) => request<Release[]>(`/api/v1/projects/${slug}/releases`),
  },
  // Posts
  posts: {
    list: () => request<Post[]>('/api/v1/posts'),
    get: (slug: string) => request<Post>(`/api/v1/posts/${slug}`),
  },
  // Skills
  skills: {
    list: () => request<Skill[]>('/api/v1/skills'),
  },
  // Achievements
  achievements: {
    list: () => request<Achievement[]>('/api/v1/achievements'),
  },
  // Experience
  experience: {
    list: () => request<Experience[]>('/api/v1/experience'),
  },
  // Categories
  categories: {
    list: () => request<Category[]>('/api/v1/categories'),
  },
  // Tags
  tags: {
    list: () => request<Tag[]>('/api/v1/tags'),
  },
  // Social Links
  socialLinks: {
    list: () => request<SocialLink[]>('/api/v1/social-links'),
  },
  // Settings
  settings: {
    list: () => request<Setting[]>('/api/v1/settings'),
  },
  // Navigation
  navigation: {
    list: () => request<NavigationItem[]>('/api/v1/navigation'),
  },
  // Auth
  auth: {
    login: (usernameOrEmail: string, password: string) =>
      request<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
      }),
    me: () => request<AdminUser>('/api/v1/auth/me'),
    logout: () => request<{ success: boolean }>('/api/v1/auth/logout', { method: 'POST', body: '{}' }),
  },
  // Contact
  contact: {
    send: (body: { name: string; email: string; subject: string; message: string }) =>
      request('/api/v1/contact', { method: 'POST', body: JSON.stringify(body) }),
  },
  // Analytics
  analytics: {
    track: (event_type: string, target_slug: string) =>
      request('/api/v1/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          event_type,
          target_slug,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          ip_hash: '',
          country: '',
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          timestamp: new Date().toISOString(),
        }),
      }),
  },
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export const adminApi = {
  // Dashboard
  dashboard: {
    stats: () => request('/api/v1/admin/dashboard/stats'),
    recent: () => request('/api/v1/admin/dashboard/recent'),
    activity: () => request('/api/v1/admin/dashboard/activity'),
  },
  // Projects
  projects: {
    list: () => request<Project[]>('/api/v1/admin/projects'),
    get: (id: string) => request<Project>(`/api/v1/admin/projects/${id}`),
    create: (body: Partial<Project>) =>
      request<Project>('/api/v1/admin/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Project>) =>
      request<Project>(`/api/v1/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/projects/${id}`, { method: 'DELETE' }),
    publish: (id: string) =>
      request(`/api/v1/admin/projects/${id}/publish`, { method: 'POST', body: '{}' }),
    archive: (id: string) =>
      request(`/api/v1/admin/projects/${id}/archive`, { method: 'POST', body: '{}' }),
    createRelease: (slug: string, body: Partial<Release>) =>
      request(`/api/v1/admin/projects/${slug}/releases`, { method: 'POST', body: JSON.stringify(body) }),
  },
  // Posts
  posts: {
    list: () => request<Post[]>('/api/v1/admin/posts'),
    get: (id: string) => request<Post>(`/api/v1/admin/posts/${id}`),
    create: (body: Partial<Post>) =>
      request<Post>('/api/v1/admin/posts', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Post>) =>
      request<Post>(`/api/v1/admin/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/posts/${id}`, { method: 'DELETE' }),
    publish: (id: string) =>
      request(`/api/v1/admin/posts/${id}/publish`, { method: 'POST', body: '{}' }),
    unpublish: (id: string) =>
      request(`/api/v1/admin/posts/${id}/unpublish`, { method: 'POST', body: '{}' }),
  },
  // Skills
  skills: {
    list: () => request<Skill[]>('/api/v1/admin/skills'),
    create: (body: Partial<Skill>) =>
      request<Skill>('/api/v1/admin/skills', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Skill>) =>
      request<Skill>(`/api/v1/admin/skills/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/skills/${id}`, { method: 'DELETE' }),
  },
  // Achievements
  achievements: {
    list: () => request<Achievement[]>('/api/v1/admin/achievements'),
    create: (body: Partial<Achievement>) =>
      request<Achievement>('/api/v1/admin/achievements', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Achievement>) =>
      request<Achievement>(`/api/v1/admin/achievements/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/achievements/${id}`, { method: 'DELETE' }),
  },
  // Experience
  experience: {
    list: () => request<Experience[]>('/api/v1/admin/experience'),
    create: (body: Partial<Experience>) =>
      request<Experience>('/api/v1/admin/experience', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Experience>) =>
      request<Experience>(`/api/v1/admin/experience/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/experience/${id}`, { method: 'DELETE' }),
  },
  // Social Links
  socialLinks: {
    list: () => request<SocialLink[]>('/api/v1/admin/social-links'),
    create: (body: Partial<SocialLink>) =>
      request<SocialLink>('/api/v1/admin/social-links', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<SocialLink>) =>
      request<SocialLink>(`/api/v1/admin/social-links/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/social-links/${id}`, { method: 'DELETE' }),
  },
  // Tags
  tags: {
    create: (body: Partial<Tag>) =>
      request<Tag>('/api/v1/admin/tags', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Tag>) =>
      request<Tag>(`/api/v1/admin/tags/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/tags/${id}`, { method: 'DELETE' }),
  },
  // Categories
  categories: {
    create: (body: Partial<Category>) =>
      request<Category>('/api/v1/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Category>) =>
      request<Category>(`/api/v1/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/categories/${id}`, { method: 'DELETE' }),
  },
  // Navigation
  navigation: {
    list: () => request<NavigationItem[]>('/api/v1/admin/navigation/items'),
    create: (body: Partial<NavigationItem>) =>
      request<NavigationItem>('/api/v1/admin/navigation/items', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<NavigationItem>) =>
      request<NavigationItem>(`/api/v1/admin/navigation/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/navigation/items/${id}`, { method: 'DELETE' }),
  },
  // Messages
  messages: {
    list: () => request<Message[]>('/api/v1/admin/messages'),
    get: (id: string) => request<Message>(`/api/v1/admin/messages/${id}`),
    archive: (id: string) =>
      request(`/api/v1/admin/messages/${id}/archive`, { method: 'POST', body: '{}' }),
    delete: (id: string) =>
      request(`/api/v1/admin/messages/${id}`, { method: 'DELETE' }),
  },
  // Releases
  releases: {
    list: () => request<Release[]>('/api/v1/admin/releases'),
    update: (id: string, body: Partial<Release>) =>
      request<Release>(`/api/v1/admin/releases/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request(`/api/v1/admin/releases/${id}`, { method: 'DELETE' }),
    publish: (id: string) =>
      request(`/api/v1/admin/releases/${id}/publish`, { method: 'POST', body: '{}' }),
  },
  // Analytics
  analytics: {
    overview: () => request('/api/v1/admin/analytics'),
    posts: () => request('/api/v1/admin/analytics/posts'),
    projects: () => request('/api/v1/admin/analytics/projects'),
    views: () => request('/api/v1/admin/analytics/views'),
  },
  // Settings
  settings: {
    update: (body: Partial<Setting>) =>
      request<Setting>('/api/v1/admin/settings', { method: 'PATCH', body: JSON.stringify(body) }),
  },
  // Media
  media: {
    list: () => request('/api/v1/media'),
    delete: (id: string) =>
      request(`/api/v1/admin/media/${id}`, { method: 'DELETE' }),
  },
  // Activity
  activity: {
    list: () => request('/api/v1/admin/activity'),
  },
}
