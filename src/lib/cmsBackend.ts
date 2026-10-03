import {
  projects as initialProjects,
  experience as initialExperience,
  skills as initialSkills,
  awards as initialAwards,
} from './data'
import type {
  Project,
  Post,
  Skill,
  Achievement,
  Experience,
  Category,
  Tag,
  SocialLink,
  Setting,
  NavigationItem,
  Message,
  Release,
} from './api'

export interface ActivityLog {
  id: string
  admin_user: string
  action: string
  target_type: string
  target_id: string
  details: string
  timestamp: string
}

export interface MediaItem {
  id: string
  filename: string
  url: string
  mime_type: string
  size: number
  width: number
  height: number
  alt_text: string
  uploaded_date: string
  associated_resource: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  target_slug: string
  referrer: string
  user_agent: string
  ip_hash: string
  country: string
  device: string
  timestamp: string
}

interface CmsDatabase {
  projects: Project[]
  posts: Post[]
  releases: Release[]
  skills: Skill[]
  achievements: Achievement[]
  experience: Experience[]
  categories: Category[]
  tags: Tag[]
  socialLinks: SocialLink[]
  settings: Setting
  navigation: NavigationItem[]
  messages: Message[]
  media: MediaItem[]
  activity: ActivityLog[]
  analytics: AnalyticsEvent[]
}

const STORAGE_KEY = 'mickycodes_cms_database_v2'

function generateId(prefix = 'item'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function getInitialDatabase(): CmsDatabase {
  const seededProjects: Project[] = initialProjects.map((p, index) => {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return {
      id: `proj_${index + 1}`,
      name: p.title,
      slug,
      short_description: p.description,
      full_description: `${p.description}\n\n### Overview\nEngineered with a backend-first mindset for high reliability, modular architecture, and smooth user interaction. Built using ${p.tech.join(', ')}.`,
      status: p.status.toLowerCase() === 'live' ? 'published' : p.status.toLowerCase() === 'shipped' ? 'published' : 'in_progress',
      category: p.tech.includes('Godot Engine') ? 'Game Dev' : p.tech.includes('Wails') ? 'Desktop / Tools' : 'Full-Stack Web',
      featured: index < 3,
      thumbnail: p.link ? '/logo.png' : '',
      gallery: '',
      repository_url: p.link ? 'https://github.com/Alazar42' : 'https://github.com/Alazar42',
      live_url: p.link ?? '',
      documentation_url: p.link ? `${p.link}#docs` : '',
      download_url: '',
      technologies: p.tech.join(', '),
      tags: p.tech.map((t) => t.toLowerCase()).join(', '),
      start_date: '2024-01-15',
      release_date: '2024-11-20',
      created_date: new Date(Date.now() - (index + 1) * 86400000 * 30).toISOString(),
      updated_date: new Date().toISOString(),
      views: 120 + index * 65,
    }
  })

  const seededPosts: Post[] = [
    {
      id: 'post_1',
      title: 'Architecting Scalable Backends with Go & Spring Boot',
      slug: 'architecting-scalable-backends',
      excerpt: 'Key architectural lessons learned building microservices, concurrency handling, and enterprise ERP backends.',
      content: `# Architecting Scalable Backends with Go & Spring Boot\n\nBuilding high-performance systems requires choosing the right tool for the job. Go excels in lightweight, highly concurrent networked microservices, while Spring Boot provides enterprise-grade robustness, declarative transaction management, and rock-solid dependency injection.\n\n### Concurrency in Practice\n- Goroutines and channels allow high throughput with minimal overhead.\n- In Spring Boot, virtual threads (Project Loom) bring reactive-like scalability to traditional synchronous coding models.\n\n### Database Connection Pooling\nAlways tune HikariCP or pgx connection pools according to your target deployment environment.`,
      cover_image: '',
      tags: 'backend, architecture, go, spring-boot',
      status: 'published',
      published_date: '2025-02-10T12:00:00.000Z',
      updated_date: new Date().toISOString(),
      views: 342,
    },
    {
      id: 'post_2',
      title: 'Creating Cross-Platform Desktop Apps with Wails & React',
      slug: 'wails-react-desktop-apps',
      excerpt: 'How Wails lets you write Go backends and React frontends with a fraction of Electron’s memory footprint.',
      content: `# Creating Cross-Platform Desktop Apps with Wails & React\n\nWails uses native webview engines (WebKitGTK on Linux, WebKit on macOS, WebView2 on Windows) instead of bundling an entire Chromium runtime. The result is a fast, responsive application with sub-20MB binary sizes.`,
      cover_image: '',
      tags: 'wails, desktop, react, go',
      status: 'published',
      published_date: '2025-03-01T15:30:00.000Z',
      updated_date: new Date().toISOString(),
      views: 218,
    },
    {
      id: 'post_3',
      title: 'Game Loop Optimization & Physics in Godot Engine',
      slug: 'godot-physics-optimization',
      excerpt: 'Techniques for building smooth 60fps cultural & educational games on mobile and web using GDScript.',
      content: `# Game Loop Optimization in Godot Engine\n\nUnderstanding _physics_process vs _process, managing spatial partitioning, and avoiding memory allocations during render cycles.`,
      cover_image: '',
      tags: 'godot, gamedev, gdscript, performance',
      status: 'draft',
      published_date: '',
      updated_date: new Date().toISOString(),
      views: 45,
    },
  ]

  const seededReleases: Release[] = [
    {
      id: 'rel_1',
      project_slug: 'drawviz',
      version: 'v1.2.0',
      release_date: '2025-01-18',
      summary: 'Added 3D arc tools, DXF vector export, and dark mode interface.',
      changes: '- Real-time orthographic view snapping\n- DXF and SVG export pipeline\n- Performance boost on large canvas meshes',
      breaking_changes: 'Updated file schema version to 2.0',
      download_links: 'https://github.com/Alazar42/drawviz/releases',
      documentation_link: 'https://draw-viz.vercel.app/',
      repository_tag: 'v1.2.0',
      status: 'published',
      downloads_count: 520,
    },
    {
      id: 'rel_2',
      project_slug: 'polymorph-ide',
      version: 'v0.9.1',
      release_date: '2025-02-04',
      summary: 'Beta preview with live CSS inspector and AST generator.',
      changes: '- Live CSS property inspector\n- Hot DOM reloading\n- Keyboard navigation shortcuts',
      breaking_changes: '',
      download_links: '',
      documentation_link: '',
      repository_tag: 'v0.9.1-beta',
      status: 'published',
      downloads_count: 140,
    },
  ]

  const seededSkills: Skill[] = initialSkills.map((name, i) => {
    let cat = 'Languages'
    if (['Django', 'Spring Boot', 'FastAPI'].includes(name)) cat = 'Backend Frameworks'
    else if (['React', 'Three.js'].includes(name)) cat = 'Frontend & Visuals'
    else if (['Flutter', 'React Native', 'Kotlin'].includes(name)) cat = 'Mobile & Cross-Platform'
    else if (['MySQL', 'PostgreSQL', 'MongoDB', 'MsSQL'].includes(name)) cat = 'Databases'
    else if (['Godot Engine', 'GDScript'].includes(name)) cat = 'Game Engineering'
    else if (['Wails'].includes(name)) cat = 'Desktop Systems'

    return {
      id: `skill_${i + 1}`,
      name,
      category: cat,
      icon: '',
      description: `Production engineering experience with ${name}`,
      display_order: i,
      featured: i < 8,
      proficiency: 85 - (i % 5) * 3,
    }
  })

  const seededExperience: Experience[] = initialExperience.map((e, i) => {
    const parts = e.period.split(' -- ')
    return {
      id: `exp_${i + 1}`,
      title: e.title,
      organization: e.place,
      description: e.detail,
      start_date: parts[0] ?? '',
      end_date: parts[1] ?? '',
      location: 'Addis Ababa, Ethiopia',
      external_link: '',
      is_current: e.period.includes('Present'),
      display_order: i,
    }
  })

  const seededAchievements: Achievement[] = initialAwards.map((a, i) => ({
    id: `ach_${i + 1}`,
    title: a.title,
    description: a.detail,
    organization: i === 0 ? 'East Africa Digital Hackathon' : i === 1 ? 'Ethiopian Digital ID (Fyda)' : 'Fyda National Identity Lab',
    date: i === 0 ? '2024-11' : '2025-01',
    image: '',
    certificate: '',
    external_link: '',
    project_association: i === 0 ? 'Digital Identity Verification' : '',
    display_order: i,
  }))

  const seededCategories: Category[] = [
    { id: 'cat_1', name: 'Full-Stack Web', slug: 'full-stack-web', description: 'Web applications and reactive tools', icon: 'Globe', display_order: 1 },
    { id: 'cat_2', name: 'Backend Systems', slug: 'backend-systems', description: 'High-throughput APIs and ERP systems', icon: 'Server', display_order: 2 },
    { id: 'cat_3', name: 'Game Development', slug: 'game-development', description: '2D/3D games and engine addons', icon: 'Gamepad2', display_order: 3 },
    { id: 'cat_4', name: 'Desktop Applications', slug: 'desktop-apps', description: 'Cross-platform native desktop utilities', icon: 'Laptop', display_order: 4 },
  ]

  const seededTags: Tag[] = [
    { id: 'tag_1', name: 'Go', slug: 'go' },
    { id: 'tag_2', name: 'Python', slug: 'python' },
    { id: 'tag_3', name: 'React', slug: 'react' },
    { id: 'tag_4', name: 'Spring Boot', slug: 'spring-boot' },
    { id: 'tag_5', name: 'Godot', slug: 'godot' },
    { id: 'tag_6', name: 'PostgreSQL', slug: 'postgresql' },
    { id: 'tag_7', name: 'TypeScript', slug: 'typescript' },
  ]

  const seededSocialLinks: SocialLink[] = [
    { id: 'soc_1', platform: 'GitHub', label: 'GitHub Profile', url: 'https://github.com/Alazar42', icon: 'Github', display_order: 1, is_active: true },
    { id: 'soc_2', platform: 'Telegram', label: 'Telegram Channel', url: 'https://t.me/MickyCodes', icon: 'Send', display_order: 2, is_active: true },
    { id: 'soc_3', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'Linkedin', display_order: 3, is_active: true },
    { id: 'soc_4', platform: 'Email', label: 'Direct Email', url: 'mailto:alazartesfaye42@gmail.com', icon: 'Mail', display_order: 4, is_active: true },
  ]

  const seededSettings: Setting = {
    id: 'setting_global',
    site_title: 'MickyCodes | Mickyas Tesfaye',
    site_description: 'Software Engineer and Computer Scientist. Backend-first developer building full-stack tools, games, and systems.',
    profile_name: 'Mickyas Tesfaye',
    bio: 'Backend-first developer building full-stack tools, games, and systems. I focus on practical software delivery across Django, Spring Boot, React, FastAPI, Flutter, and game development.',
    profile_image: '/logo.png',
    location: 'Addis Ababa, Ethiopia',
    email: 'alazartesfaye42@gmail.com',
    contact_availability: 'Open for freelance, full-time engineering, and consulting projects.',
    social_links_json: JSON.stringify({
      github: 'https://github.com/Alazar42',
      telegram: 'https://t.me/MickyCodes',
      email: 'alazartesfaye42@gmail.com',
    }),
    seo_metadata_json: JSON.stringify({
      keywords: ['Software Engineer', 'Computer Scientist', 'Backend Developer', 'Go', 'React', 'Godot', 'Ethiopia'],
      author: 'Mickyas Tesfaye',
    }),
    og_image: '/logo.png',
    footer_text: 'Crafted with precision by Mickyas Tesfaye (MickyCodes). All systems operational.',
  }

  const seededNavigation: NavigationItem[] = [
    { id: 'nav_1', label: 'Home', url: '/#home', visibility: true, display_order: 1, is_external: false },
    { id: 'nav_2', label: 'About', url: '/#about', visibility: true, display_order: 2, is_external: false },
    { id: 'nav_3', label: 'Work', url: '/#projects', visibility: true, display_order: 3, is_external: false },
    { id: 'nav_4', label: 'Experience', url: '/#experience', visibility: true, display_order: 4, is_external: false },
    { id: 'nav_5', label: 'Community', url: '/#community', visibility: true, display_order: 5, is_external: false },
    { id: 'nav_6', label: 'Contact', url: '/#contact', visibility: true, display_order: 6, is_external: false },
  ]

  const seededMessages: Message[] = [
    {
      id: 'msg_1',
      name: 'Yonas Kebede',
      email: 'yonas@techventures.et',
      subject: 'Inquiry regarding backend architecture consulting',
      message: 'Hello Mickyas, we saw your DrawViz and ERP backend implementations and would like to invite you for a discovery call regarding our enterprise microservices refactor.',
      created_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'unread',
    },
    {
      id: 'msg_2',
      name: 'Helen G.',
      email: 'helen.g@innovate.org',
      subject: 'Speaker invitation: East Africa Dev Meetup',
      message: 'Hi Mickyas! We loved your session on Godot game engines and would love to have you present on fullstack Go applications next month.',
      created_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'read',
    },
  ]

  const seededMedia: MediaItem[] = [
    {
      id: 'med_1',
      filename: 'logo.png',
      url: '/logo.png',
      mime_type: 'image/png',
      size: 45200,
      width: 512,
      height: 512,
      alt_text: 'MickyCodes Brand Logo',
      uploaded_date: new Date(Date.now() - 86400000 * 40).toISOString(),
      associated_resource: 'settings',
    },
    {
      id: 'med_2',
      filename: 'hero-banner.png',
      url: '/src/assets/hero.png',
      mime_type: 'image/png',
      size: 182400,
      width: 1200,
      height: 630,
      alt_text: 'Hero Section Banner',
      uploaded_date: new Date(Date.now() - 86400000 * 20).toISOString(),
      associated_resource: 'home',
    },
  ]

  const seededActivity: ActivityLog[] = [
    {
      id: 'act_1',
      admin_user: 'Mickyas',
      action: 'SYSTEM_BOOT',
      target_type: 'CMS',
      target_id: 'v1.0.0',
      details: 'MickyCodes Portfolio & CMS initialized conforming to OpenAPI 3.0.0',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'act_2',
      admin_user: 'Mickyas',
      action: 'PUBLISH_PROJECT',
      target_type: 'Project',
      target_id: 'DrawViz',
      details: 'Published project DrawViz (v1.2.0) with live demo URL',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'act_3',
      admin_user: 'Visitor',
      action: 'CONTACT_SUBMIT',
      target_type: 'Message',
      target_id: 'msg_1',
      details: 'Received new contact inquiry from Yonas Kebede',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ]

  const seededAnalytics: AnalyticsEvent[] = [
    {
      id: 'evt_1',
      event_type: 'page_view',
      target_slug: 'home',
      referrer: 'https://t.me/MickyCodes',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      ip_hash: 'anon_ip_99a',
      country: 'Ethiopia',
      device: 'desktop',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'evt_2',
      event_type: 'project_view',
      target_slug: 'drawviz',
      referrer: 'https://draw-viz.vercel.app/',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)',
      ip_hash: 'anon_ip_42b',
      country: 'United States',
      device: 'mobile',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'evt_3',
      event_type: 'page_view',
      target_slug: 'home',
      referrer: 'direct',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      ip_hash: 'anon_ip_11c',
      country: 'Germany',
      device: 'desktop',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ]

  return {
    projects: seededProjects,
    posts: seededPosts,
    releases: seededReleases,
    skills: seededSkills,
    achievements: seededAchievements,
    experience: seededExperience,
    categories: seededCategories,
    tags: seededTags,
    socialLinks: seededSocialLinks,
    settings: seededSettings,
    navigation: seededNavigation,
    messages: seededMessages,
    media: seededMedia,
    activity: seededActivity,
    analytics: seededAnalytics,
  }
}

class CmsBackendStore {
  private db: CmsDatabase

  constructor() {
    this.db = this.load()
  }

  private load(): CmsDatabase {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && Array.isArray(parsed.projects) && parsed.settings) {
            return parsed
          }
        }
      } catch (err) {
        console.warn('[CmsBackend] Error reading localStorage, resetting to default seed:', err)
      }
    }
    const initial = getInitialDatabase()
    this.save(initial)
    return initial
  }

  private save(state = this.db) {
    this.db = state
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (err) {
        console.warn('[CmsBackend] Error saving to localStorage:', err)
      }
    }
  }

  public logAction(adminUser: string, action: string, targetType: string, targetId: string, details: string) {
    const log: ActivityLog = {
      id: generateId('act'),
      admin_user: adminUser || 'Mickyas',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: new Date().toISOString(),
    }
    this.db.activity.unshift(log)
    if (this.db.activity.length > 50) this.db.activity.pop()
    this.save()
  }

  public resetDatabase() {
    const initial = getInitialDatabase()
    this.save(initial)
    return initial
  }

  public getSnapshot(): CmsDatabase {
    return this.db
  }

  // --- API HANDLERS conforming to OpenAPI 3.0.0 ---
  public handleRequest<T>(path: string, options?: RequestInit): Promise<T> {
    const method = (options?.method ?? 'GET').toUpperCase()
    let body: any = null
    if (options?.body) {
      try {
        body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
      } catch {
        body = options.body
      }
    }

    // Clean query params
    const [pathname] = path.split('?')
    const cleanPath = pathname.replace(/\/+$/, '') || '/'

    // Health
    if (cleanPath === '/health' || cleanPath === '/api/v1/health') {
      return Promise.resolve({
        status: 'ok',
        service: 'MickyCodes Portfolio & CMS Backend',
        version: '1.0.0',
        openapi: '3.0.0',
        timestamp: new Date().toISOString(),
      } as unknown as T)
    }

    // Auth
    if (cleanPath === '/api/v1/auth/me') {
      return Promise.resolve({
        id: 'usr-micky-01',
        username: 'MickyCodes',
        name: 'Mickyas Tesfaye',
        email: 'alazartesfaye42@gmail.com',
        role: 'owner',
        avatar: '/logo.png',
      } as unknown as T)
    }
    if (cleanPath === '/api/v1/auth/login') {
      const username = (body?.username || body?.email || '').trim().toLowerCase()
      const password = (body?.password || '').trim()

      const PROD_EMAIL = 'alazartesfaye42@gmail.com'
      const PROD_PASS = '@Mickyastesfaye0965161472'

      const isUserValid =
        username === PROD_EMAIL ||
        username === 'alazartesfaye42' ||
        username === 'alazar' ||
        username === 'mickyas' ||
        username === 'micky' ||
        username === 'mickycodes' ||
        username === 'admin' ||
        username.includes('alazartesfaye')

      const cleanPass = password.trim()
      const cleanWithoutAt = cleanPass.startsWith('@') ? cleanPass.substring(1) : cleanPass
      const expectedWithoutAt = PROD_PASS.startsWith('@') ? PROD_PASS.substring(1) : PROD_PASS

      const isPassValid =
        cleanPass === PROD_PASS ||
        cleanPass.toLowerCase() === PROD_PASS.toLowerCase() ||
        cleanWithoutAt === expectedWithoutAt ||
        cleanWithoutAt.toLowerCase() === expectedWithoutAt.toLowerCase()

      if (isUserValid && isPassValid) {
        const token = `micky_bearer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const user = {
          id: 'usr-micky-01',
          username: 'MickyCodes',
          name: 'Mickyas Tesfaye',
          email: PROD_EMAIL,
          role: 'owner',
          avatar: '/logo.png',
        }
        this.logAction('Admin', 'LOGIN_SUCCESS', 'Auth', user.id, `Admin authenticated: ${username}`)
        return Promise.resolve({
          token,
          access_token: token,
          token_type: 'bearer',
          user,
          expires_in: 86400,
        } as unknown as T)
      } else {
        return Promise.reject(new Error('Invalid email or password.'))
      }
    }
    if (cleanPath === '/api/v1/auth/logout') {
      this.logAction('Admin', 'LOGOUT', 'Auth', 'session', 'Admin logged out')
      return Promise.resolve({ ok: true, success: true, message: 'Logged out successfully' } as unknown as T)
    }
    if (cleanPath === '/api/v1/auth/change-password') {
      const newPwd = (body?.new_password || '').trim()
      if (!newPwd || newPwd.length < 4) {
        return Promise.reject(new Error('Password must be at least 4 characters long'))
      }
      try {
        localStorage.setItem('micky_admin_password', newPwd)
      } catch (e) {
        console.error(e)
      }
      this.logAction('Admin', 'PASSWORD_CHANGE', 'Auth', 'usr-micky-01', 'Admin password updated')
      return Promise.resolve({ success: true, message: 'Password updated successfully' } as unknown as T)
    }
    if (cleanPath.startsWith('/api/v1/auth/')) {
      return Promise.resolve({ ok: true, message: 'Auth action completed' } as unknown as T)
    }

    // Contact
    if (cleanPath === '/api/v1/contact' && method === 'POST') {
      const newMsg: Message = {
        id: generateId('msg'),
        name: body?.name || 'Anonymous Visitor',
        email: body?.email || 'unknown@example.com',
        subject: body?.subject || 'Portfolio Inquiry',
        message: body?.message || '',
        created_date: new Date().toISOString(),
        status: 'unread',
      }
      this.db.messages.unshift(newMsg)
      this.logAction('Visitor', 'CONTACT_SUBMIT', 'Message', newMsg.id!, `Message from ${newMsg.name} (${newMsg.email})`)
      this.save()
      return Promise.resolve(newMsg as unknown as T)
    }

    // Analytics Track
    if (cleanPath === '/api/v1/analytics/track' && method === 'POST') {
      const evt: AnalyticsEvent = {
        id: generateId('evt'),
        event_type: body?.event_type || 'page_view',
        target_slug: body?.target_slug || 'home',
        referrer: body?.referrer || 'direct',
        user_agent: body?.user_agent || '',
        ip_hash: body?.ip_hash || 'client_hash',
        country: body?.country || 'Global',
        device: body?.device || 'desktop',
        timestamp: body?.timestamp || new Date().toISOString(),
      }
      this.db.analytics.unshift(evt)
      if (this.db.analytics.length > 200) this.db.analytics.pop()

      // Also increment view counters if project or post
      if (evt.event_type === 'project_view' || evt.target_slug) {
        const proj = this.db.projects.find((p) => p.slug === evt.target_slug || p.id === evt.target_slug)
        if (proj) proj.views = (proj.views || 0) + 1
        const post = this.db.posts.find((p) => p.slug === evt.target_slug || p.id === evt.target_slug)
        if (post) post.views = (post.views || 0) + 1
      }
      this.save()
      return Promise.resolve({ ok: true, tracked: evt } as unknown as T)
    }

    // Dashboard Overview / Stats / Recent / Activity
    if (cleanPath === '/api/v1/admin/dashboard/stats' || cleanPath === '/api/v1/admin/dashboard') {
      const totalViews = this.db.projects.reduce((sum, p) => sum + (p.views || 0), 0) +
                         this.db.posts.reduce((sum, p) => sum + (p.views || 0), 0) +
                         this.db.analytics.length
      return Promise.resolve({
        total_projects: this.db.projects.length,
        total_posts: this.db.posts.length,
        total_skills: this.db.skills.length,
        total_achievements: this.db.achievements.length,
        total_messages: this.db.messages.length,
        total_views: totalViews,
        total_releases: this.db.releases.length,
      } as unknown as T)
    }

    if (cleanPath === '/api/v1/admin/dashboard/recent') {
      const recentProjects = this.db.projects.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.name,
        type: 'Project',
        status: p.status,
        date: p.updated_date,
      }))
      const recentPosts = this.db.posts.slice(0, 4).map((p) => ({
        id: p.id,
        title: p.title,
        type: 'Post',
        status: p.status,
        date: p.updated_date,
      }))
      return Promise.resolve([...recentProjects, ...recentPosts] as unknown as T)
    }

    if (cleanPath === '/api/v1/admin/dashboard/activity' || cleanPath === '/api/v1/admin/activity') {
      return Promise.resolve(this.db.activity as unknown as T)
    }

    // Analytics Pages
    if (cleanPath === '/api/v1/admin/analytics') {
      const totalViews = this.db.projects.reduce((sum, p) => sum + (p.views || 0), 0) +
                         this.db.posts.reduce((sum, p) => sum + (p.views || 0), 0) +
                         this.db.analytics.length
      return Promise.resolve({
        total_views: totalViews,
        unique_visitors: Math.max(12, Math.round(totalViews * 0.42)),
        post_views: this.db.posts.reduce((sum, p) => sum + (p.views || 0), 0),
        project_views: this.db.projects.reduce((sum, p) => sum + (p.views || 0), 0),
      } as unknown as T)
    }

    if (cleanPath === '/api/v1/admin/analytics/posts') {
      return Promise.resolve(
        this.db.posts.map((p) => ({ id: p.id, title: p.title, slug: p.slug, views: p.views || 0 })) as unknown as T
      )
    }

    if (cleanPath === '/api/v1/admin/analytics/projects') {
      return Promise.resolve(
        this.db.projects.map((p) => ({ id: p.id, name: p.name, slug: p.slug, views: p.views || 0 })) as unknown as T
      )
    }

    if (cleanPath === '/api/v1/admin/analytics/views') {
      return Promise.resolve(this.db.analytics as unknown as T)
    }

    // Projects Releases
    const releasesMatch = cleanPath.match(/^\/api\/v1\/projects\/([^/]+)\/releases(?:\/([^/]+))?$/)
    if (releasesMatch) {
      const projectSlug = releasesMatch[1]
      const version = releasesMatch[2]
      if (version) {
        const item = this.db.releases.find((r) => r.project_slug === projectSlug && r.version === version)
        return Promise.resolve((item ?? {}) as unknown as T)
      }
      const list = this.db.releases.filter((r) => r.project_slug === projectSlug)
      return Promise.resolve(list as unknown as T)
    }

    // Admin project release create
    const adminProjectReleaseMatch = cleanPath.match(/^\/api\/v1\/admin\/projects\/([^/]+)\/releases$/)
    if (adminProjectReleaseMatch && method === 'POST') {
      const projectSlug = adminProjectReleaseMatch[1]
      const newRelease: Release = {
        id: generateId('rel'),
        project_slug: projectSlug,
        version: body?.version || 'v1.0.0',
        release_date: body?.release_date || new Date().toISOString().slice(0, 10),
        summary: body?.summary || '',
        changes: body?.changes || '',
        breaking_changes: body?.breaking_changes || '',
        download_links: body?.download_links || '',
        documentation_link: body?.documentation_link || '',
        repository_tag: body?.repository_tag || body?.version || '',
        status: body?.status || 'published',
        downloads_count: 0,
      }
      this.db.releases.unshift(newRelease)
      this.logAction('Mickyas', 'CREATE_RELEASE', 'Release', newRelease.id!, `Release ${newRelease.version} for ${projectSlug}`)
      this.save()
      return Promise.resolve(newRelease as unknown as T)
    }

    // Public Projects
    if (cleanPath === '/api/v1/projects') {
      return Promise.resolve(this.db.projects as unknown as T)
    }
    const publicProjMatch = cleanPath.match(/^\/api\/v1\/projects\/([^/]+)$/)
    if (publicProjMatch && !cleanPath.includes('/admin/')) {
      const slugOrId = publicProjMatch[1]
      const p = this.db.projects.find((it) => it.slug === slugOrId || it.id === slugOrId)
      return Promise.resolve((p ?? null) as unknown as T)
    }

    // Admin Projects
    if (cleanPath === '/api/v1/admin/projects') {
      if (method === 'GET') return Promise.resolve(this.db.projects as unknown as T)
      if (method === 'POST') {
        const item: Project = {
          id: generateId('proj'),
          name: body?.name || 'Untitled Project',
          slug: body?.slug || (body?.name || 'project').toLowerCase().replace(/\s+/g, '-'),
          short_description: body?.short_description || '',
          full_description: body?.full_description || '',
          status: body?.status || 'draft',
          category: body?.category || 'Full-Stack Web',
          featured: Boolean(body?.featured),
          thumbnail: body?.thumbnail || '',
          gallery: body?.gallery || '',
          repository_url: body?.repository_url || '',
          live_url: body?.live_url || '',
          documentation_url: body?.documentation_url || '',
          download_url: body?.download_url || '',
          technologies: body?.technologies || '',
          tags: body?.tags || '',
          start_date: body?.start_date || '',
          release_date: body?.release_date || '',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
          views: 0,
        }
        this.db.projects.unshift(item)
        this.logAction('Mickyas', 'CREATE', 'Project', item.id!, `Created project ${item.name}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }

    const adminProjActionMatch = cleanPath.match(/^\/api\/v1\/admin\/projects\/([^/]+)\/(publish|archive)$/)
    if (adminProjActionMatch && method === 'POST') {
      const id = adminProjActionMatch[1]
      const action = adminProjActionMatch[2]
      const p = this.db.projects.find((it) => it.id === id || it.slug === id)
      if (p) {
        p.status = action === 'publish' ? 'published' : 'archived'
        p.updated_date = new Date().toISOString()
        this.logAction('Mickyas', action.toUpperCase(), 'Project', p.id!, `${action === 'publish' ? 'Published' : 'Archived'} project ${p.name}`)
        this.save()
        return Promise.resolve(p as unknown as T)
      }
    }

    const adminProjMatch = cleanPath.match(/^\/api\/v1\/admin\/projects\/([^/]+)$/)
    if (adminProjMatch) {
      const id = adminProjMatch[1]
      const idx = this.db.projects.findIndex((it) => it.id === id || it.slug === id)
      if (method === 'GET') {
        return Promise.resolve((this.db.projects[idx] ?? null) as unknown as T)
      }
      if (method === 'PATCH') {
        if (idx !== -1) {
          this.db.projects[idx] = { ...this.db.projects[idx], ...body, updated_date: new Date().toISOString() }
          this.logAction('Mickyas', 'UPDATE', 'Project', id, `Updated project ${this.db.projects[idx].name}`)
          this.save()
          return Promise.resolve(this.db.projects[idx] as unknown as T)
        }
      }
      if (method === 'DELETE') {
        if (idx !== -1) {
          const deleted = this.db.projects.splice(idx, 1)[0]
          this.logAction('Mickyas', 'DELETE', 'Project', id, `Deleted project ${deleted.name}`)
          this.save()
          return Promise.resolve({ ok: true, deleted } as unknown as T)
        }
      }
    }

    // Posts
    if (cleanPath === '/api/v1/posts') {
      return Promise.resolve(this.db.posts as unknown as T)
    }
    const publicPostMatch = cleanPath.match(/^\/api\/v1\/posts\/([^/]+)$/)
    if (publicPostMatch && !cleanPath.includes('/admin/')) {
      const slugOrId = publicPostMatch[1]
      const p = this.db.posts.find((it) => it.slug === slugOrId || it.id === slugOrId)
      return Promise.resolve((p ?? null) as unknown as T)
    }

    if (cleanPath === '/api/v1/admin/posts') {
      if (method === 'GET') return Promise.resolve(this.db.posts as unknown as T)
      if (method === 'POST') {
        const item: Post = {
          id: generateId('post'),
          title: body?.title || 'Untitled Post',
          slug: body?.slug || (body?.title || 'post').toLowerCase().replace(/\s+/g, '-'),
          excerpt: body?.excerpt || '',
          content: body?.content || '',
          cover_image: body?.cover_image || '',
          tags: body?.tags || '',
          status: body?.status || 'draft',
          published_date: body?.status === 'published' ? new Date().toISOString() : '',
          updated_date: new Date().toISOString(),
          views: 0,
        }
        this.db.posts.unshift(item)
        this.logAction('Mickyas', 'CREATE', 'Post', item.id!, `Created post ${item.title}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }

    const adminPostActionMatch = cleanPath.match(/^\/api\/v1\/admin\/posts\/([^/]+)\/(publish|unpublish)$/)
    if (adminPostActionMatch && method === 'POST') {
      const id = adminPostActionMatch[1]
      const action = adminPostActionMatch[2]
      const p = this.db.posts.find((it) => it.id === id || it.slug === id)
      if (p) {
        p.status = action === 'publish' ? 'published' : 'draft'
        if (action === 'publish' && !p.published_date) p.published_date = new Date().toISOString()
        p.updated_date = new Date().toISOString()
        this.logAction('Mickyas', action.toUpperCase(), 'Post', p.id!, `${action} post ${p.title}`)
        this.save()
        return Promise.resolve(p as unknown as T)
      }
    }

    const adminPostMatch = cleanPath.match(/^\/api\/v1\/admin\/posts\/([^/]+)$/)
    if (adminPostMatch) {
      const id = adminPostMatch[1]
      const idx = this.db.posts.findIndex((it) => it.id === id || it.slug === id)
      if (method === 'GET') return Promise.resolve((this.db.posts[idx] ?? null) as unknown as T)
      if (method === 'PATCH') {
        if (idx !== -1) {
          this.db.posts[idx] = { ...this.db.posts[idx], ...body, updated_date: new Date().toISOString() }
          this.logAction('Mickyas', 'UPDATE', 'Post', id, `Updated post ${this.db.posts[idx].title}`)
          this.save()
          return Promise.resolve(this.db.posts[idx] as unknown as T)
        }
      }
      if (method === 'DELETE') {
        if (idx !== -1) {
          const deleted = this.db.posts.splice(idx, 1)[0]
          this.logAction('Mickyas', 'DELETE', 'Post', id, `Deleted post ${deleted.title}`)
          this.save()
          return Promise.resolve({ ok: true, deleted } as unknown as T)
        }
      }
    }

    // Skills
    if (cleanPath === '/api/v1/skills' || cleanPath === '/api/v1/admin/skills') {
      if (method === 'GET') return Promise.resolve(this.db.skills as unknown as T)
      if (method === 'POST') {
        const item: Skill = {
          id: generateId('skill'),
          name: body?.name || 'New Skill',
          category: body?.category || 'General',
          icon: body?.icon || '',
          description: body?.description || '',
          display_order: Number(body?.display_order) || this.db.skills.length,
          featured: Boolean(body?.featured),
          proficiency: Number(body?.proficiency) || 80,
        }
        this.db.skills.push(item)
        this.logAction('Mickyas', 'CREATE', 'Skill', item.id!, `Added skill ${item.name}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const skillMatch = cleanPath.match(/^\/api\/v1\/admin\/skills\/([^/]+)$/)
    if (skillMatch) {
      const id = skillMatch[1]
      const idx = this.db.skills.findIndex((s) => s.id === id || s.name === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.skills[idx] = { ...this.db.skills[idx], ...body }
        this.logAction('Mickyas', 'UPDATE', 'Skill', id, `Updated skill ${this.db.skills[idx].name}`)
        this.save()
        return Promise.resolve(this.db.skills[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.skills.splice(idx, 1)[0]
        this.logAction('Mickyas', 'DELETE', 'Skill', id, `Removed skill ${deleted.name}`)
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Experience
    if (cleanPath === '/api/v1/experience' || cleanPath === '/api/v1/admin/experience') {
      if (method === 'GET') return Promise.resolve(this.db.experience as unknown as T)
      if (method === 'POST') {
        const item: Experience = {
          id: generateId('exp'),
          title: body?.title || '',
          organization: body?.organization || '',
          description: body?.description || '',
          start_date: body?.start_date || '',
          end_date: body?.end_date || '',
          location: body?.location || 'Addis Ababa',
          external_link: body?.external_link || '',
          is_current: Boolean(body?.is_current),
          display_order: Number(body?.display_order) || this.db.experience.length,
        }
        this.db.experience.unshift(item)
        this.logAction('Mickyas', 'CREATE', 'Experience', item.id!, `Added experience ${item.title} at ${item.organization}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const expMatch = cleanPath.match(/^\/api\/v1\/admin\/experience\/([^/]+)$/)
    if (expMatch) {
      const id = expMatch[1]
      const idx = this.db.experience.findIndex((e) => e.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.experience[idx] = { ...this.db.experience[idx], ...body }
        this.logAction('Mickyas', 'UPDATE', 'Experience', id, `Updated experience ${this.db.experience[idx].title}`)
        this.save()
        return Promise.resolve(this.db.experience[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.experience.splice(idx, 1)[0]
        this.logAction('Mickyas', 'DELETE', 'Experience', id, `Deleted experience ${deleted.title}`)
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Achievements
    if (cleanPath === '/api/v1/achievements' || cleanPath === '/api/v1/admin/achievements') {
      if (method === 'GET') return Promise.resolve(this.db.achievements as unknown as T)
      if (method === 'POST') {
        const item: Achievement = {
          id: generateId('ach'),
          title: body?.title || '',
          description: body?.description || '',
          organization: body?.organization || '',
          date: body?.date || '',
          image: body?.image || '',
          certificate: body?.certificate || '',
          external_link: body?.external_link || '',
          project_association: body?.project_association || '',
          display_order: Number(body?.display_order) || this.db.achievements.length,
        }
        this.db.achievements.unshift(item)
        this.logAction('Mickyas', 'CREATE', 'Achievement', item.id!, `Added achievement ${item.title}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const achMatch = cleanPath.match(/^\/api\/v1\/admin\/achievements\/([^/]+)$/)
    if (achMatch) {
      const id = achMatch[1]
      const idx = this.db.achievements.findIndex((a) => a.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.achievements[idx] = { ...this.db.achievements[idx], ...body }
        this.logAction('Mickyas', 'UPDATE', 'Achievement', id, `Updated achievement ${this.db.achievements[idx].title}`)
        this.save()
        return Promise.resolve(this.db.achievements[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.achievements.splice(idx, 1)[0]
        this.logAction('Mickyas', 'DELETE', 'Achievement', id, `Deleted achievement ${deleted.title}`)
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Categories
    if (cleanPath === '/api/v1/categories' || cleanPath === '/api/v1/admin/categories') {
      if (method === 'GET') return Promise.resolve(this.db.categories as unknown as T)
      if (method === 'POST') {
        const item: Category = {
          id: generateId('cat'),
          name: body?.name || '',
          slug: body?.slug || (body?.name || '').toLowerCase().replace(/\s+/g, '-'),
          description: body?.description || '',
          icon: body?.icon || 'Folder',
          display_order: Number(body?.display_order) || this.db.categories.length,
        }
        this.db.categories.push(item)
        this.logAction('Mickyas', 'CREATE', 'Category', item.id!, `Added category ${item.name}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const catMatch = cleanPath.match(/^\/api\/v1\/admin\/categories\/([^/]+)$/)
    if (catMatch) {
      const id = catMatch[1]
      const idx = this.db.categories.findIndex((c) => c.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.categories[idx] = { ...this.db.categories[idx], ...body }
        this.save()
        return Promise.resolve(this.db.categories[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.categories.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Tags
    if (cleanPath === '/api/v1/tags' || cleanPath === '/api/v1/admin/tags') {
      if (method === 'GET') return Promise.resolve(this.db.tags as unknown as T)
      if (method === 'POST') {
        const item: Tag = {
          id: generateId('tag'),
          name: body?.name || '',
          slug: body?.slug || (body?.name || '').toLowerCase().replace(/\s+/g, '-'),
        }
        this.db.tags.push(item)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const tagMatch = cleanPath.match(/^\/api\/v1\/admin\/tags\/([^/]+)$/)
    if (tagMatch) {
      const id = tagMatch[1]
      const idx = this.db.tags.findIndex((t) => t.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.tags[idx] = { ...this.db.tags[idx], ...body }
        this.save()
        return Promise.resolve(this.db.tags[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.tags.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Social Links
    if (cleanPath === '/api/v1/social-links' || cleanPath === '/api/v1/admin/social-links') {
      if (method === 'GET') return Promise.resolve(this.db.socialLinks as unknown as T)
      if (method === 'POST') {
        const item: SocialLink = {
          id: generateId('soc'),
          platform: body?.platform || '',
          label: body?.label || '',
          url: body?.url || '',
          icon: body?.icon || 'Link2',
          display_order: Number(body?.display_order) || this.db.socialLinks.length,
          is_active: body?.is_active ?? true,
        }
        this.db.socialLinks.push(item)
        this.logAction('Mickyas', 'CREATE', 'SocialLink', item.id!, `Added social link ${item.platform}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const socMatch = cleanPath.match(/^\/api\/v1\/admin\/social-links\/([^/]+)$/)
    if (socMatch) {
      const id = socMatch[1]
      const idx = this.db.socialLinks.findIndex((s) => s.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.socialLinks[idx] = { ...this.db.socialLinks[idx], ...body }
        this.save()
        return Promise.resolve(this.db.socialLinks[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.socialLinks.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Settings
    if (cleanPath === '/api/v1/settings' || cleanPath === '/api/v1/admin/settings') {
      if (method === 'GET') {
        return Promise.resolve([this.db.settings] as unknown as T)
      }
      if (method === 'PATCH') {
        this.db.settings = { ...this.db.settings, ...body }
        this.logAction('Mickyas', 'UPDATE', 'Settings', 'global', 'Updated portfolio global settings')
        this.save()
        return Promise.resolve(this.db.settings as unknown as T)
      }
    }

    // Navigation
    if (cleanPath === '/api/v1/navigation' || cleanPath === '/api/v1/admin/navigation/items') {
      if (method === 'GET') return Promise.resolve(this.db.navigation as unknown as T)
      if (method === 'POST') {
        const item: NavigationItem = {
          id: generateId('nav'),
          label: body?.label || '',
          url: body?.url || '',
          visibility: body?.visibility ?? true,
          display_order: Number(body?.display_order) || this.db.navigation.length,
          is_external: Boolean(body?.is_external),
        }
        this.db.navigation.push(item)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const navMatch = cleanPath.match(/^\/api\/v1\/admin\/navigation\/items\/([^/]+)$/)
    if (navMatch) {
      const id = navMatch[1]
      const idx = this.db.navigation.findIndex((n) => n.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.navigation[idx] = { ...this.db.navigation[idx], ...body }
        this.save()
        return Promise.resolve(this.db.navigation[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.navigation.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Releases Admin
    if (cleanPath === '/api/v1/admin/releases') {
      if (method === 'GET') return Promise.resolve(this.db.releases as unknown as T)
    }
    const relActionMatch = cleanPath.match(/^\/api\/v1\/admin\/releases\/([^/]+)\/publish$/)
    if (relActionMatch && method === 'POST') {
      const id = relActionMatch[1]
      const r = this.db.releases.find((it) => it.id === id)
      if (r) {
        r.status = 'published'
        this.logAction('Mickyas', 'PUBLISH_RELEASE', 'Release', r.id!, `Published release ${r.version}`)
        this.save()
        return Promise.resolve(r as unknown as T)
      }
    }
    const relMatch = cleanPath.match(/^\/api\/v1\/admin\/releases\/([^/]+)$/)
    if (relMatch) {
      const id = relMatch[1]
      const idx = this.db.releases.findIndex((r) => r.id === id)
      if (method === 'PATCH' && idx !== -1) {
        this.db.releases[idx] = { ...this.db.releases[idx], ...body }
        this.save()
        return Promise.resolve(this.db.releases[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.releases.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Messages Admin
    if (cleanPath === '/api/v1/admin/messages') {
      return Promise.resolve(this.db.messages as unknown as T)
    }
    const msgActionMatch = cleanPath.match(/^\/api\/v1\/admin\/messages\/([^/]+)\/archive$/)
    if (msgActionMatch && method === 'POST') {
      const id = msgActionMatch[1]
      const m = this.db.messages.find((it) => it.id === id)
      if (m) {
        m.status = 'archived'
        this.save()
        return Promise.resolve(m as unknown as T)
      }
    }
    const msgMatch = cleanPath.match(/^\/api\/v1\/admin\/messages\/([^/]+)$/)
    if (msgMatch) {
      const id = msgMatch[1]
      const idx = this.db.messages.findIndex((m) => m.id === id)
      if (method === 'GET') {
        const msg = this.db.messages[idx]
        if (msg && msg.status === 'unread') {
          msg.status = 'read'
          this.save()
        }
        return Promise.resolve((msg ?? null) as unknown as T)
      }
      if (method === 'PATCH' && idx !== -1) {
        this.db.messages[idx] = { ...this.db.messages[idx], ...body }
        this.save()
        return Promise.resolve(this.db.messages[idx] as unknown as T)
      }
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.messages.splice(idx, 1)[0]
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Media
    if (cleanPath === '/api/v1/media' || cleanPath === '/api/v1/admin/media') {
      if (method === 'GET') return Promise.resolve(this.db.media as unknown as T)
      if (method === 'POST') {
        const item: MediaItem = {
          id: generateId('med'),
          filename: body?.filename || 'upload.png',
          url: body?.url || '/logo.png',
          mime_type: body?.mime_type || 'image/png',
          size: Number(body?.size) || 102400,
          width: Number(body?.width) || 800,
          height: Number(body?.height) || 600,
          alt_text: body?.alt_text || 'Uploaded media file',
          uploaded_date: new Date().toISOString(),
          associated_resource: body?.associated_resource || 'general',
        }
        this.db.media.unshift(item)
        this.logAction('Mickyas', 'UPLOAD_MEDIA', 'Media', item.id, `Uploaded ${item.filename}`)
        this.save()
        return Promise.resolve(item as unknown as T)
      }
    }
    const mediaMatch = cleanPath.match(/^\/api\/v1\/(?:admin\/)?media\/([^/]+)$/)
    if (mediaMatch) {
      const id = mediaMatch[1]
      const idx = this.db.media.findIndex((m) => m.id === id)
      if (method === 'GET') return Promise.resolve((this.db.media[idx] ?? null) as unknown as T)
      if (method === 'DELETE' && idx !== -1) {
        const deleted = this.db.media.splice(idx, 1)[0]
        this.logAction('Mickyas', 'DELETE_MEDIA', 'Media', id, `Deleted media ${deleted.filename}`)
        this.save()
        return Promise.resolve({ ok: true, deleted } as unknown as T)
      }
    }

    // Fallback response for unhandled endpoints
    console.warn(`[CmsBackend] Unhandled route: ${method} ${cleanPath}`)
    return Promise.resolve([] as unknown as T)
  }
}

export const cmsBackend = new CmsBackendStore()

export async function handleCmsRequest<T>(path: string, options?: RequestInit): Promise<T> {
  // Simulate tiny instant tick for async fidelity
  await new Promise((r) => setTimeout(r, 20))
  return cmsBackend.handleRequest<T>(path, options)
}
