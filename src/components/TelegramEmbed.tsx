import { useState, useEffect, useRef } from 'react'
import { ExternalLink, MessageSquare, Loader2 } from 'lucide-react'

interface TelegramEmbedProps {
  postId: number
  channelUsername?: string
}

export default function TelegramEmbed({
  postId,
  channelUsername = 'MickyCodes',
}: TelegramEmbedProps) {
  const [height, setHeight] = useState<number>(360)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const postUrl = `https://t.me/${channelUsername}/${postId}`
  const embedUrl = `https://t.me/${channelUsername}/${postId}?embed=1&dark=1`

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security & origin check
      if (
        event.origin !== 'https://t.me' &&
        event.origin !== 'https://telegram.org'
      ) {
        return
      }

      // Check if message is from this specific iframe
      if (
        iframeRef.current &&
        event.source === iframeRef.current.contentWindow
      ) {
        try {
          const data =
            typeof event.data === 'string'
              ? JSON.parse(event.data)
              : event.data

          if (data && data.event === 'resize' && typeof data.height === 'number') {
            setHeight(data.height)
            setLoaded(true)
          } else if (data && data.event === 'ready') {
            setLoaded(true)
          }
        } catch {
          // Non-JSON message, ignore
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    // Timeout fallback: if iframe takes > 8 seconds, don't keep spinner indefinitely
    const timeout = setTimeout(() => {
      if (!loaded) {
        setLoaded(true)
      }
    }, 7000)
    return () => clearTimeout(timeout)
  }, [loaded])

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.035]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#24A1DE]/15 text-[#24A1DE]">
            <MessageSquare size={12} />
          </span>
          <span className="font-mono text-[0.7rem] text-neutral-300">
            Post #{postId}
          </span>
        </div>

        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] text-neutral-400 transition-all duration-300 hover:border-[#24A1DE]/50 hover:bg-[#24A1DE]/10 hover:text-white"
        >
          <span>Open</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Embed Container */}
      <div className="relative w-full overflow-hidden bg-black/40">
        {/* Skeleton while loading */}
        {!loaded && !loadError && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950/80 p-6 backdrop-blur-sm transition-opacity duration-300"
            style={{ minHeight: `${height}px` }}
          >
            <Loader2 className="h-6 w-6 animate-spin text-[#24A1DE]" />
            <span className="font-mono text-xs text-neutral-500">
              Loading Telegram embed...
            </span>
          </div>
        )}

        {loadError ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-neutral-400">
              Unable to load preview embed directly.
            </p>
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#24A1DE] px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              View Post on Telegram
              <ExternalLink size={12} />
            </a>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`Telegram Post ${postId}`}
            className="w-full border-0 transition-opacity duration-500"
            style={{
              height: `${height}px`,
              opacity: loaded ? 1 : 0.01,
            }}
            loading="lazy"
            scrolling="no"
            onError={() => {
              setLoadError(true)
              setLoaded(true)
            }}
            onLoad={() => {
              // Give it 500ms to send message before setting loaded
              setTimeout(() => setLoaded(true), 600)
            }}
          />
        )}
      </div>
    </div>
  )
}
