import { useState, useEffect, useCallback } from 'react'
import {
  Send,
  Users,
  RefreshCw,
  ExternalLink,
  Radio,
  Sparkles,
} from 'lucide-react'
import TelegramEmbed from './TelegramEmbed'
import {
  fetchLatestTelegramFeed,
  DEFAULT_CHANNEL,
  FALLBACK_POST_IDS,
  type TelegramFeed,
} from '../lib/telegram'

export default function TelegramCommunity() {
  const [feed, setFeed] = useState<TelegramFeed>({
    ok: true,
    channel: DEFAULT_CHANNEL,
    postIds: FALLBACK_POST_IDS,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const loadFeed = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const data = await fetchLatestTelegramFeed()
      setFeed(data)
    } catch (err) {
      console.error('Failed to load telegram feed:', err)
    } finally {
      setLoading(false)
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500)
      }
    }
  }, [])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  const latestThree = feed.postIds.slice(0, 3)

  return (
    <section
      id="community"
      className="relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32"
    >
      {/* Ambient background glow strictly centered without horizontal translation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-12 -z-10 mx-auto h-64 max-w-md opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(36, 161, 222, 0.35) 0%, rgba(36, 161, 222, 0.05) 50%, transparent 75%)',
        }}
      />

      {/* Header */}
      <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="mono-label">Community / Telegram</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[0.68rem] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dynamic Feed
            </span>
          </div>

          <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Join the Micky Codes Community.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400 sm:mt-4 sm:text-base">
            Devlogs, game releases, backend insights, and interactive updates.
            Below are the latest 3 dispatches fetched live from the channel.
          </p>
        </div>

        {/* Live sync control */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadFeed(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-neutral-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
            title="Refresh latest messages"
          >
            <RefreshCw
              size={13}
              className={`text-[#24A1DE] ${refreshing ? 'animate-spin' : ''}`}
            />
            <span>{refreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* Channel Spotlight Banner Card */}
      <div
        className="reveal mt-8 sm:mt-10 w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 sm:p-6 md:p-8"
        data-reveal
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between min-w-0">
          {/* Avatar & Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {feed.channel.image ? (
                <img
                  src={feed.channel.image}
                  alt={feed.channel.title}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover ring-2 ring-[#24A1DE]/30"
                />
              ) : (
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#24A1DE]/20 text-white font-bold text-lg sm:text-xl ring-2 ring-[#24A1DE]/30">
                  MC
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#24A1DE] text-white shadow-lg">
                <Send size={10} className="-translate-x-0.5 translate-y-0.5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                  {feed.channel.title}
                </h3>
                <span className="rounded-full border border-[#24A1DE]/30 bg-[#24A1DE]/10 px-2.5 py-0.5 font-mono text-[0.68rem] text-[#24A1DE]">
                  @{feed.channel.username}
                </span>
              </div>

              <p className="mt-1.5 whitespace-pre-line text-xs sm:text-sm text-neutral-400 break-words leading-relaxed">
                {feed.channel.description}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <Users size={12} className="text-neutral-400" />
                  {feed.channel.subscribers}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Radio size={12} className="text-emerald-400" />
                  Public Channel
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              href={feed.channel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#24A1DE] px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-[#24A1DE]/25 transition-all duration-300 hover:bg-[#1f8fc5] hover:shadow-[#24A1DE]/40 text-center"
            >
              <Send size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Join on Telegram
            </a>

            <a
              href={`https://t.me/s/${feed.channel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 sm:px-5 py-2.5 sm:py-3 text-sm text-neutral-300 transition-all duration-300 hover:border-white/35 hover:text-white text-center"
            >
              <span>Channel Web View</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Subtitle / Dispatches header */}
      <div className="reveal mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-2" data-reveal>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#24A1DE] flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white">
            Latest 3 Messages
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
          <span>Live Embedded Feed</span>
          <span>•</span>
          <span>#{latestThree[0] ?? ''} — #{latestThree[latestThree.length - 1] ?? ''}</span>
        </div>
      </div>

      {/* Dynamic 3 Embedded Posts Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
        {loading ? (
          // Skeleton loaders
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-[380px] sm:h-[420px] w-full min-w-0 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
          ))
        ) : (
          latestThree.map((postId, index) => (
            <div
              key={postId}
              data-reveal
              className="reveal w-full min-w-0"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <TelegramEmbed
                postId={postId}
                channelUsername={feed.channel.username}
              />
            </div>
          ))
        )}
      </div>

      {/* Channel Footer Link */}
      <div className="reveal mt-10 sm:mt-12 text-center" data-reveal>
        <a
          href={feed.channel.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 transition-colors duration-300 hover:text-[#24A1DE]"
        >
          <span>View all posts & devlogs on @{feed.channel.username}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  )
}
