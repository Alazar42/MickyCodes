export interface TelegramChannel {
  title: string
  username: string
  link: string
  description: string
  image: string
  subscribers: string
}

export interface TelegramFeed {
  ok: boolean
  channel: TelegramChannel
  postIds: number[]
  updatedAt?: string
}

export const DEFAULT_CHANNEL: TelegramChannel = {
  title: 'Micky Codes',
  username: 'MickyCodes',
  link: 'https://t.me/MickyCodes',
  description: "Software engineer | Game developer\nLet's explore the coding world.",
  image:
    'https://cdn4.telesco.pe/file/ARWz9N9AlHRJzd_aaW8SG9jyVQPKufVo0mjLQJ1tfeRfH2VHYBVDAMNoP-o4ecJ_HOimuf8F690jpUGz0YtYBjBG-dcGS_XVuPX4S_eIj_2exrL1sQ2mDV4DuGnv9D3TlZljpbDzJS_S15EM7sFbTO3k7NVMR-bgQxn-Y8cn0tkwjaF0yz2gZwDS4swIyiin5Qmm8_oZ4Z8_CnwFYElzvdF4rWIvKlus2YmTNN00wcicITv3kJIDKSkUBMYoZixfqTN4I7D3NVG-UFl4pM-U08FHVriZ3OdxI4a455iIvTZ3IM9DmboLFfD0pOR0jF8VX9LN6q_E9KZqlMasVuSkcg.jpg',
  subscribers: '294+ subscribers',
}

export const FALLBACK_POST_IDS = [675, 674, 673]

const CACHE_KEY = 'mickycodes_tg_feed_v1'

export async function fetchLatestTelegramFeed(): Promise<TelegramFeed> {
  // First, check if we have cached feed in localStorage for immediate rendering
  let cached: TelegramFeed | null = null
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        cached = JSON.parse(raw)
      }
    } catch {
      // ignore storage error
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    const response = await fetch('/api/telegram', {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (response.ok) {
      const data: TelegramFeed = await response.json()
      if (data.postIds && data.postIds.length > 0) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data))
          } catch {
            // ignore
          }
        }
        return data
      }
    }
  } catch (err) {
    console.warn('Could not fetch live Telegram feed from /api/telegram, falling back:', err)
  }

  // Return cached feed if available, else standard fallback
  if (cached && cached.postIds && cached.postIds.length > 0) {
    return cached
  }

  return {
    ok: true,
    channel: DEFAULT_CHANNEL,
    postIds: FALLBACK_POST_IDS,
  }
}
