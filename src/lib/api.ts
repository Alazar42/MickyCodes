const BASE = import.meta.env.VITE_BACKEND_URL as string

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ─── Public Types ────────────────────────────────────────────────────────────

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
