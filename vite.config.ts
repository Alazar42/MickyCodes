import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function telegramDevPlugin(): Plugin {
  return {
    name: 'telegram-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/telegram')) {
          return next()
        }

        try {
          const response = await fetch('https://t.me/s/MickyCodes', {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          })

          if (!response.ok) {
            throw new Error(`Telegram returned status ${response.status}`)
          }

          const html = await response.text()

          // Extract post IDs
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
          const subsMatch =
            html.match(/<div class="tgme_header_counter">([^<]+)<\/div>/) ||
            html.match(/<span class="counter_value">([^<]+)<\/span>\s*<span class="counter_type">subscribers<\/span>/)

          const channel = {
            title: titleMatch ? titleMatch[1] : 'Micky Codes',
            username: 'MickyCodes',
            link: 'https://t.me/MickyCodes',
            description: descMatch
              ? descMatch[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&')
              : "Software engineer | Game developer\nLet's explore the coding world.",
            image: imageMatch ? imageMatch[1] : '',
            subscribers: subsMatch ? subsMatch[1] : '294 subscribers',
          }

          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(
            JSON.stringify({
              ok: true,
              channel,
              postIds: latest3Ids,
              updatedAt: new Date().toISOString(),
            })
          )
        } catch (err: any) {
          console.error('[telegramDevPlugin] Scrape error:', err)
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(
            JSON.stringify({
              ok: false,
              error: err.message,
              postIds: [675, 674, 673],
            })
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), telegramDevPlugin()],
})

