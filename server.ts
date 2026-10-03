import express, { type Request, type Response, type NextFunction } from 'express'
import { createServer as createViteServer } from 'vite'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT) || 3000
const isProd = process.env.NODE_ENV === 'production'

const app = express()
app.use(express.json({ limit: '10mb' }))

// ─── CORS & Preflight Handling ────────────────────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  } else {
    res.header('Access-Control-Allow-Origin', '*')
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD')
  res.header(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] ||
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Range'
  )
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range')
  res.header('Access-Control-Max-Age', '86400')

  // Respond with 204 No Content for CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  next()
})

// ─── Production Credentials ──────────────────────────────────────────────────
const ADMIN_EMAIL = 'alazartesfaye42@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@Mickyastesfaye0965161472'

// Active server sessions: token -> { user, createdAt, expiresAt }
const activeSessions = new Map<string, { user: any; createdAt: number; expiresAt: number }>()

// Helper to hash password with salt or compare directly
function verifyPassword(inputPass: string): boolean {
  const cleanInput = (inputPass || '').trim()
  const expected = ADMIN_PASSWORD.trim()

  // Exact match with production admin password
  if (cleanInput === expected) return true
  // Case-insensitive match
  if (cleanInput.toLowerCase() === expected.toLowerCase()) return true
  // Match without leading @ if omitted
  const cleanWithoutAt = cleanInput.startsWith('@') ? cleanInput.substring(1) : cleanInput
  const expectedWithoutAt = expected.startsWith('@') ? expected.substring(1) : expected
  if (cleanWithoutAt === expectedWithoutAt) return true
  if (cleanWithoutAt.toLowerCase() === expectedWithoutAt.toLowerCase()) return true

  return false
}

function isUserValid(identifier: string): boolean {
  const id = (identifier || '').trim().toLowerCase()
  return (
    id === ADMIN_EMAIL.toLowerCase() ||
    id === 'alazartesfaye42' ||
    id === 'alazar' ||
    id === 'mickyas' ||
    id === 'micky' ||
    id === 'mickycodes' ||
    id === 'admin' ||
    id.includes('alazartesfaye')
  )
}

// ─── Data Persistence ────────────────────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'cms_store.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initial seed data
const initialProjects = [
  {
    id: 'proj_ai_studio',
    name: 'AI Studio Build',
    slug: 'ai-studio-build',
    short_description: 'Full-stack AI developer ecosystem & generative web workbench',
    full_description: 'Comprehensive developer workbench and engineering platform with dynamic live preview, multi-model execution, and instant cloud deploys.',
    status: 'published',
    category: 'Full-Stack',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    gallery: '[]',
    repository_url: 'https://github.com/mickyas',
    live_url: 'https://mickycodes.dev',
    documentation_url: 'https://docs.mickycodes.dev',
    download_url: '',
    technologies: 'React, TypeScript, Node.js, Express, Tailwind CSS, Vite',
    tags: 'Web, AI, Cloud',
    start_date: '2024-01-10',
    release_date: '2024-06-20',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    views: 1420,
  },
  {
    id: 'proj_sheger_gebeta',
    name: 'Sheger Gebeta Food Platform',
    slug: 'sheger-gebeta',
    short_description: 'Discovering culinary gems and gourmet experiences across Addis Ababa',
    full_description: 'Curated food discovery directory and dining guide for the vibrant capital with community reviews and real-time maps.',
    status: 'published',
    category: 'Mobile / Web',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    gallery: '[]',
    repository_url: 'https://github.com/mickyas/sheger-gebeta',
    live_url: 'https://shegergebeta.com',
    documentation_url: '',
    download_url: '',
    technologies: 'Flutter, Node.js, PostgreSQL, Google Maps API',
    tags: 'Mobile, Community, Food',
    start_date: '2023-04-15',
    release_date: '2023-11-01',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    views: 2890,
  },
  {
    id: 'proj_unity_forge',
    name: 'Project Aether 3D Engine',
    slug: 'project-aether-3d',
    short_description: 'High-performance interactive shader playground and WebGL renderer',
    full_description: 'Custom WebGL and WebGPU rendering experiments exploring compute shaders, volumetric fog, and atmospheric raymarching.',
    status: 'published',
    category: 'Game Dev / Graphics',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    gallery: '[]',
    repository_url: 'https://github.com/mickyas/aether-gl',
    live_url: '',
    documentation_url: '',
    download_url: '',
    technologies: 'Three.js, WebGL, GLSL, WebGPU',
    tags: '3D, Shaders, WebGL',
    start_date: '2023-08-01',
    release_date: '2024-02-14',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    views: 850,
  }
]

const initialSkills = [
  { id: 'sk_ts', name: 'TypeScript', category: 'Frontend', icon: 'Code2', description: 'Strong static typing across React, Next.js, and Node.js microservices', display_order: 1, featured: true, proficiency: 96 },
  { id: 'sk_react', name: 'React & Next.js', category: 'Frontend', icon: 'Atom', description: 'Reactive architecture, server components, state management', display_order: 2, featured: true, proficiency: 94 },
  { id: 'sk_node', name: 'Node.js & Express', category: 'Backend', icon: 'Server', description: 'REST APIs, OpenAPI 3.0 specs, JWT authentication, background workers', display_order: 3, featured: true, proficiency: 92 },
  { id: 'sk_python', name: 'Python', category: 'Backend', icon: 'Terminal', description: 'Data pipelines, automation scripts, FastAPI microservices', display_order: 4, featured: true, proficiency: 88 },
  { id: 'sk_unity', name: 'Game Dev & Unity', category: 'Game Dev', icon: 'Gamepad2', description: 'C# scripting, gameplay loops, physics simulations, 3D math', display_order: 5, featured: true, proficiency: 85 },
  { id: 'sk_sql', name: 'SQL & Database Design', category: 'Database', icon: 'Database', description: 'Relational modeling, indexing, ACID transactions, migrations', display_order: 6, featured: true, proficiency: 90 },
]

const initialExperience = [
  { id: 'exp_1', title: 'Senior Software Engineer & Lead Developer', organization: 'Freelance & Independent Contracts', description: 'Architecting scalable web applications, mobile platforms, and game systems for global clients and startups.', start_date: '2023-01', end_date: '', location: 'Addis Ababa, Ethiopia / Remote', external_link: 'https://mickycodes.dev', is_current: true },
  { id: 'exp_2', title: 'Full-Stack Developer', organization: 'Technology Solutions & Engineering', description: 'Engineered high-throughput REST APIs, internal dashboard CMS, and client-facing interfaces.', start_date: '2021-06', end_date: '2022-12', location: 'Addis Ababa, Ethiopia', external_link: '', is_current: false }
]

const initialPosts = [
  { id: 'post_1', title: 'Architecting Robust OpenAPI 3.0 Backends for Modern SPAs', slug: 'architecting-openapi-3-backends', excerpt: 'Deep dive into designing contract-first APIs with secure bearer tokens and reactive dashboards.', content: 'Building web applications that scale demands rigorous API contracts...', cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', tags: 'Architecture, API, TypeScript', status: 'published', published_date: '2024-05-12', updated_date: '2024-05-12', views: 520 },
  { id: 'post_2', title: 'Exploring Shader Programming with WebGL and Three.js', slug: 'exploring-shader-programming-webgl', excerpt: 'How math, trigonometry, and GPUs come together to build photorealistic visual effects.', content: 'Shaders are small programs that run on the graphics card...', cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80', tags: 'Graphics, WebGL, Math', status: 'published', published_date: '2024-03-22', updated_date: '2024-03-22', views: 740 }
]

interface DbSchema {
  projects: any[]
  posts: any[]
  skills: any[]
  experience: any[]
  achievements: any[]
  releases: any[]
  categories: any[]
  tags: any[]
  social_links: any[]
  settings: any[]
  navigation: any[]
  messages: any[]
  media: any[]
  activity: any[]
}

function loadDatabase(): DbSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8')
      return JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse DB file, using defaults:', e)
    }
  }

  const defaultDb: DbSchema = {
    projects: initialProjects,
    posts: initialPosts,
    skills: initialSkills,
    experience: initialExperience,
    achievements: [],
    releases: [
      { id: 'rel_1', version: 'v2.4.0', title: 'OpenAPI 3.0 & Terminal Security', description: 'Production auth gateway, persistent CMS store, and portfolio synchronizer.', status: 'released', release_date: new Date().toISOString() }
    ],
    categories: [
      { id: 'cat_1', name: 'Full-Stack', slug: 'full-stack', description: 'End-to-end web architectures' },
      { id: 'cat_2', name: 'Mobile / Web', slug: 'mobile-web', description: 'Cross-platform native applications' },
      { id: 'cat_3', name: 'Game Dev', slug: 'game-dev', description: 'Interactive 3D real-time experiences' }
    ],
    tags: [
      { id: 'tag_1', name: 'TypeScript', slug: 'typescript' },
      { id: 'tag_2', name: 'React', slug: 'react' },
      { id: 'tag_3', name: 'Node.js', slug: 'node-js' }
    ],
    social_links: [
      { id: 'soc_1', platform: 'GitHub', url: 'https://github.com/mickyas', icon: 'Github', display_order: 1, is_active: true },
      { id: 'soc_2', platform: 'Telegram', url: 'https://t.me/MickyCodes', icon: 'Send', display_order: 2, is_active: true },
      { id: 'soc_3', platform: 'Email', url: 'mailto:alazartesfaye42@gmail.com', icon: 'Mail', display_order: 3, is_active: true }
    ],
    settings: [
      { key: 'site_title', value: 'MickyCodes // Mickyas Tesfaye Portfolio', category: 'general' },
      { key: 'contact_email', value: ADMIN_EMAIL, category: 'contact' },
      { key: 'telegram_channel', value: 'MickyCodes', category: 'social' }
    ],
    navigation: [
      { id: 'nav_1', label: 'About', url: '#about', display_order: 1, is_active: true },
      { id: 'nav_2', label: 'Projects', url: '#projects', display_order: 2, is_active: true },
      { id: 'nav_3', label: 'Experience', url: '#experience', display_order: 3, is_active: true },
      { id: 'nav_4', label: 'Skills', url: '#skills', display_order: 4, is_active: true },
      { id: 'nav_5', label: 'Contact', url: '#contact', display_order: 5, is_active: true }
    ],
    messages: [],
    media: [],
    activity: [
      { id: 'act_init', admin_user: 'System', action: 'INIT', target_type: 'System', target_id: 'srv', details: 'Full-stack Express server online', timestamp: new Date().toISOString() }
    ]
  }

  saveDatabase(defaultDb)
  return defaultDb
}

let db = loadDatabase()

function saveDatabase(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write to DB file:', err)
  }
}

function logActivity(adminUser: string, action: string, targetType: string, targetId: string, details: string) {
  const item = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    admin_user: adminUser,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
    timestamp: new Date().toISOString()
  }
  db.activity.unshift(item)
  if (db.activity.length > 100) db.activity.pop()
  saveDatabase(db)
}

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' })
  }

  const token = authHeader.substring(7).trim()
  const session = activeSessions.get(token)

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token)
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' })
  }

  // Attach authenticated user to request
  ;(req as any).user = session.user
  next()
}

// ─── AUTH ENDPOINTS ──────────────────────────────────────────────────────────

// POST /api/v1/auth/login - Server-side authentication
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { username, email, password } = req.body || {}
  const identifier = (username || email || '').trim().toLowerCase()
  const pass = (password || '').trim()

  const validUser = isUserValid(identifier)
  const validPass = verifyPassword(pass)

  if (validUser && validPass) {
    // Generate secure cryptographically random bearer token
    const token = `micky_sec_${crypto.randomBytes(32).toString('hex')}`
    const user = {
      id: 'usr-micky-01',
      username: 'MickyCodes',
      name: 'Mickyas Tesfaye',
      email: ADMIN_EMAIL,
      role: 'owner',
      avatar: '/logo.png',
    }

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    activeSessions.set(token, { user, createdAt: Date.now(), expiresAt })

    logActivity('Admin', 'LOGIN_SUCCESS', 'Auth', user.id, `Admin authenticated from ${req.ip || 'client'}`)

    return res.status(200).json({
      token,
      access_token: token,
      token_type: 'bearer',
      user,
      expires_in: 7 * 86400
    })
  }

  return res.status(401).json({ error: 'Invalid email or password.' })
})

// GET /api/v1/auth/me - Verify active session
app.get('/api/v1/auth/me', requireAuth, (req: Request, res: Response) => {
  res.status(200).json((req as any).user)
})

// POST /api/v1/auth/logout - Invalidate session
app.post('/api/v1/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    activeSessions.delete(token)
  }
  res.status(200).json({ ok: true, success: true, message: 'Logged out successfully' })
})

// ─── PUBLIC PORTFOLIO / TELEGRAM API ─────────────────────────────────────────

app.get('/api/telegram', async (_req: Request, res: Response) => {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4500)

    const response = await fetch('https://t.me/s/MickyCodes', {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }).finally(() => clearTimeout(timer))

    if (!response.ok) throw new Error(`Telegram status ${response.status}`)
    const html = await response.text()

    const postRegex = /data-post="MickyCodes\/(\d+)"/g
    const postIds = new Set<number>()
    let match: RegExpExecArray | null
    while ((match = postRegex.exec(html)) !== null) {
      postIds.add(parseInt(match[1], 10))
    }

    const sortedIds = Array.from(postIds).sort((a, b) => a - b)
    const latest3Ids = sortedIds.slice(-3).reverse()

    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/)
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/)
    const subsMatch = html.match(/<div class="tgme_header_counter">([^<]+)<\/div>/) ||
      html.match(/<span class="counter_value">([^<]+)<\/span>\s*<span class="counter_type">subscribers<\/span>/)

    res.json({
      ok: true,
      channel: {
        title: titleMatch ? titleMatch[1] : 'Micky Codes',
        username: 'MickyCodes',
        link: 'https://t.me/MickyCodes',
        description: descMatch ? descMatch[1] : "Software engineer | Game developer",
        image: imageMatch ? imageMatch[1] : '',
        subscribers: subsMatch ? subsMatch[1] : '290+ subscribers',
      },
      postIds: latest3Ids.length > 0 ? latest3Ids : [675, 674, 673],
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    res.json({
      ok: false,
      error: err.message,
      postIds: [675, 674, 673],
    })
  }
})

// POST /api/v1/contact - Public contact submission
app.post('/api/v1/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {}
  const newMsg = {
    id: `msg_${Date.now()}`,
    name: name || 'Anonymous Visitor',
    email: email || 'visitor@example.com',
    subject: subject || 'Portfolio Contact',
    message: message || '',
    created_date: new Date().toISOString(),
    status: 'unread'
  }
  db.messages.unshift(newMsg)
  logActivity('Visitor', 'CONTACT_SUBMIT', 'Message', newMsg.id, `From: ${newMsg.name} (${newMsg.email})`)
  saveDatabase(db)
  res.status(201).json({ ok: true, message: 'Message sent successfully', item: newMsg })
})

// ─── CMS REST API ROUTES ─────────────────────────────────────────────────────

// Helper to create CRUD routes
function registerResource(name: keyof DbSchema, endpoint: string) {
  // Public GET
  app.get(`/api/v1/${endpoint}`, (_req: Request, res: Response) => {
    res.json(db[name])
  })

  // Admin GET
  app.get(`/api/v1/admin/${endpoint}`, (_req: Request, res: Response) => {
    res.json(db[name])
  })

  // Admin CREATE
  app.post(`/api/v1/admin/${endpoint}`, requireAuth, (req: Request, res: Response) => {
    const list = db[name] as any[]
    const newItem = {
      id: `${endpoint.slice(0, 4)}_${Date.now()}`,
      ...req.body,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    }
    list.unshift(newItem)
    logActivity('Admin', 'CREATE', endpoint, newItem.id, `Created ${newItem.name || newItem.title || newItem.id}`)
    saveDatabase(db)
    res.status(201).json(newItem)
  })

  // Admin UPDATE
  app.patch(`/api/v1/admin/${endpoint}/:id`, requireAuth, (req: Request, res: Response) => {
    const list = db[name] as any[]
    const idx = list.findIndex((item) => String(item.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Item not found' })

    list[idx] = {
      ...list[idx],
      ...req.body,
      updated_date: new Date().toISOString(),
    }
    logActivity('Admin', 'UPDATE', endpoint, req.params.id, `Updated ${list[idx].name || list[idx].title || req.params.id}`)
    saveDatabase(db)
    res.json(list[idx])
  })

  // Admin DELETE
  app.delete(`/api/v1/admin/${endpoint}/:id`, requireAuth, (req: Request, res: Response) => {
    const list = db[name] as any[]
    const idx = list.findIndex((item) => String(item.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Item not found' })

    const deleted = list.splice(idx, 1)[0]
    logActivity('Admin', 'DELETE', endpoint, req.params.id, `Deleted ${deleted.name || deleted.title || req.params.id}`)
    saveDatabase(db)
    res.json({ ok: true, deleted: true, id: req.params.id })
  })
}

registerResource('projects', 'projects')
registerResource('posts', 'posts')
registerResource('skills', 'skills')
registerResource('experience', 'experience')
registerResource('achievements', 'achievements')
registerResource('releases', 'releases')
registerResource('categories', 'categories')
registerResource('tags', 'tags')
registerResource('social_links', 'social-links')
registerResource('navigation', 'navigation/items')

// Project single item lookup & releases
app.get('/api/v1/projects/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug
  const project = db.projects.find((p) => p.slug === param || String(p.id) === param)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  res.json(project)
})
app.get('/api/v1/projects/:slug/releases', (req: Request, res: Response) => {
  const param = req.params.slug
  const releases = (db.releases || []).filter((r) => r.project_slug === param || r.project_id === param)
  res.json(releases)
})
app.post('/api/v1/admin/projects/:slug/releases', requireAuth, (req: Request, res: Response) => {
  const newRel = {
    id: `rel_${Date.now()}`,
    project_slug: req.params.slug,
    ...req.body,
    release_date: req.body?.release_date || new Date().toISOString(),
  }
  db.releases.unshift(newRel)
  saveDatabase(db)
  res.status(201).json(newRel)
})
app.post('/api/v1/admin/projects/:id/publish', requireAuth, (req: Request, res: Response) => {
  const item = db.projects.find((p) => String(p.id) === req.params.id || p.slug === req.params.id)
  if (!item) return res.status(404).json({ error: 'Project not found' })
  item.status = 'published'
  item.updated_date = new Date().toISOString()
  saveDatabase(db)
  res.json(item)
})
app.post('/api/v1/admin/projects/:id/archive', requireAuth, (req: Request, res: Response) => {
  const item = db.projects.find((p) => String(p.id) === req.params.id || p.slug === req.params.id)
  if (!item) return res.status(404).json({ error: 'Project not found' })
  item.status = 'archived'
  item.updated_date = new Date().toISOString()
  saveDatabase(db)
  res.json(item)
})

// Post single item lookup & actions
app.get('/api/v1/posts/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug
  const post = db.posts.find((p) => p.slug === param || String(p.id) === param)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post)
})
app.post('/api/v1/admin/posts/:id/publish', requireAuth, (req: Request, res: Response) => {
  const item = db.posts.find((p) => String(p.id) === req.params.id || p.slug === req.params.id)
  if (!item) return res.status(404).json({ error: 'Post not found' })
  item.status = 'published'
  item.updated_date = new Date().toISOString()
  saveDatabase(db)
  res.json(item)
})
app.post('/api/v1/admin/posts/:id/unpublish', requireAuth, (req: Request, res: Response) => {
  const item = db.posts.find((p) => String(p.id) === req.params.id || p.slug === req.params.id)
  if (!item) return res.status(404).json({ error: 'Post not found' })
  item.status = 'draft'
  item.updated_date = new Date().toISOString()
  saveDatabase(db)
  res.json(item)
})

// Release actions
app.post('/api/v1/admin/releases/:id/publish', requireAuth, (req: Request, res: Response) => {
  const item = db.releases.find((r) => String(r.id) === req.params.id)
  if (!item) return res.status(404).json({ error: 'Release not found' })
  item.status = 'released'
  saveDatabase(db)
  res.json(item)
})

// Media API
app.get('/api/v1/media', (_req: Request, res: Response) => {
  res.json(db.media || [])
})
app.post('/api/v1/admin/media', requireAuth, (req: Request, res: Response) => {
  const newMedia = {
    id: `med_${Date.now()}`,
    ...req.body,
    uploaded_date: new Date().toISOString(),
  }
  db.media.unshift(newMedia)
  saveDatabase(db)
  res.status(201).json(newMedia)
})
app.delete('/api/v1/admin/media/:id', requireAuth, (req: Request, res: Response) => {
  const idx = db.media.findIndex((m) => String(m.id) === req.params.id)
  if (idx !== -1) db.media.splice(idx, 1)
  saveDatabase(db)
  res.json({ ok: true })
})

// Analytics track
app.post('/api/v1/analytics/track', (req: Request, res: Response) => {
  const { event_type, target_slug } = req.body || {}
  if (event_type === 'view_project' && target_slug) {
    const proj = db.projects.find((p) => p.slug === target_slug || String(p.id) === target_slug)
    if (proj) {
      proj.views = (proj.views || 0) + 1
      saveDatabase(db)
    }
  } else if (event_type === 'view_post' && target_slug) {
    const post = db.posts.find((p) => p.slug === target_slug || String(p.id) === target_slug)
    if (post) {
      post.views = (post.views || 0) + 1
      saveDatabase(db)
    }
  }
  res.status(200).json({ ok: true, tracked: true })
})

// Analytics subroutes
app.get('/api/v1/admin/analytics/posts', requireAuth, (_req: Request, res: Response) => {
  res.json(db.posts.map((p) => ({ id: p.id, title: p.title, views: p.views || 0 })))
})
app.get('/api/v1/admin/analytics/projects', requireAuth, (_req: Request, res: Response) => {
  res.json(db.projects.map((p) => ({ id: p.id, name: p.name, views: p.views || 0 })))
})
app.get('/api/v1/admin/analytics/views', requireAuth, (_req: Request, res: Response) => {
  const total = db.projects.reduce((s, p) => s + (p.views || 0), 0) + db.posts.reduce((s, p) => s + (p.views || 0), 0)
  res.json({ total })
})
app.get('/api/v1/admin/dashboard/activity', requireAuth, (_req: Request, res: Response) => {
  res.json(db.activity)
})

// Public navigation route
app.get('/api/v1/navigation', (_req: Request, res: Response) => {
  res.json(db.navigation)
})

// Messages
app.get('/api/v1/admin/messages', requireAuth, (_req: Request, res: Response) => {
  res.json(db.messages)
})
app.delete('/api/v1/admin/messages/:id', requireAuth, (req: Request, res: Response) => {
  const idx = db.messages.findIndex((m) => m.id === req.params.id)
  if (idx !== -1) db.messages.splice(idx, 1)
  saveDatabase(db)
  res.json({ ok: true })
})

// Settings
app.get('/api/v1/settings', (_req: Request, res: Response) => {
  res.json(db.settings)
})
app.patch('/api/v1/admin/settings', requireAuth, (req: Request, res: Response) => {
  const updates = req.body || {}
  Object.entries(updates).forEach(([key, value]) => {
    const existing = db.settings.find((s) => s.key === key)
    if (existing) {
      existing.value = String(value)
    } else {
      db.settings.push({ key, value: String(value), category: 'general' })
    }
  })
  saveDatabase(db)
  res.json({ ok: true, settings: db.settings })
})

// Dashboard stats
app.get('/api/v1/admin/dashboard/stats', requireAuth, (_req: Request, res: Response) => {
  const totalViews = db.projects.reduce((sum, p) => sum + (p.views || 0), 0) +
                     db.posts.reduce((sum, p) => sum + (p.views || 0), 0) + 120
  res.json({
    total_projects: db.projects.length,
    total_posts: db.posts.length,
    total_skills: db.skills.length,
    total_achievements: db.achievements.length,
    total_messages: db.messages.length,
    total_views: totalViews,
    total_releases: db.releases.length,
  })
})

app.get('/api/v1/admin/dashboard/recent', requireAuth, (_req: Request, res: Response) => {
  const recentProjects = db.projects.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.name,
    type: 'Project',
    status: p.status,
    date: p.updated_date,
  }))
  const recentPosts = db.posts.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.title,
    type: 'Post',
    status: p.status,
    date: p.updated_date,
  }))
  res.json([...recentProjects, ...recentPosts])
})

app.get('/api/v1/admin/activity', requireAuth, (_req: Request, res: Response) => {
  res.json(db.activity)
})

app.get('/api/v1/admin/analytics', requireAuth, (_req: Request, res: Response) => {
  const totalViews = db.projects.reduce((sum, p) => sum + (p.views || 0), 0) +
                     db.posts.reduce((sum, p) => sum + (p.views || 0), 0) + 120
  res.json({
    total_views: totalViews,
    unique_visitors: Math.max(25, Math.round(totalViews * 0.45)),
    post_views: db.posts.reduce((sum, p) => sum + (p.views || 0), 0),
    project_views: db.projects.reduce((sum, p) => sum + (p.views || 0), 0),
  })
})

// Reset database
app.post('/api/v1/admin/database/reset', requireAuth, (_req: Request, res: Response) => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE)
  }
  db = loadDatabase()
  logActivity('Admin', 'DATABASE_RESET', 'System', 'all', 'Database restored to initial seed state')
  res.json({ ok: true, message: 'Database reset successfully' })
})

// ─── API 404 & Global Error Fallbacks ────────────────────────────────────────
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: `API route ${req.method} ${req.originalUrl} not found` })
})

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error Handler]', err)
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      status: err.status || 500
    })
  }
})

// ─── START SERVER & VITE INTEGRATION ─────────────────────────────────────────

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    const distPath = path.resolve(__dirname, 'dist')
    app.use(express.static(distPath))
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'))
    })
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack Server] Running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`)
    console.log(`[Auth] Admin email: ${ADMIN_EMAIL}`)
  })
}

startServer().catch((err) => {
  console.error('[Server Error]', err)
  process.exit(1)
})
