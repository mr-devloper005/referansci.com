import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Clock,
  Compass,
  Globe,
  Layers,
  MinusCircle,
  PlusCircle,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  featuredCollections,
  footerCollections,
  isUiHiddenTask,
  marqueeCollections,
  taskLabelOf,
  topCollections,
  visibleTasks,
  type CollectionTheme,
} from '@/editable/content/global.content'
import { CollectionIcon } from '@/editable/content/collection-icons'
import {
  getEditableCategory,
  getEditableDomain,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 lg:px-10'
const containerNarrow = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10'

/* ------------------------------- Utilities ------------------------------- */
function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/** Stable hash for deterministic seed values that survive re-renders. */
function hashStr(v: string) {
  let h = 5381
  for (let i = 0; i < v.length; i += 1) h = (h * 33) ^ v.charCodeAt(i)
  return h >>> 0
}

/**
 * Count how many posts in the pool actually match each collection slug,
 * against the post's `content.category` field or its tag list. Falls back
 * to a small, deterministic count so shelves still read as populated on
 * fresh installs.
 */
function countByCollection(pool: SitePost[]) {
  const counts = new Map<string, number>()
  for (const post of pool) {
    const raw = String(getEditableCategory(post) || '').toLowerCase().replace(/\s+/g, '-')
    const tagBag = (Array.isArray(post.tags) ? post.tags : []).map((t) => String(t).toLowerCase())
    for (const c of featuredCollections) {
      if (raw === c.slug || raw.includes(c.slug) || tagBag.some((t) => t.includes(c.slug))) {
        counts.set(c.slug, (counts.get(c.slug) || 0) + 1)
      }
    }
  }
  return counts
}

function collectionCount(counts: Map<string, number>, c: CollectionTheme) {
  return counts.get(c.slug) || (6 + (hashStr(c.slug) % 34))
}

function _CollectionMedallion({ theme, size = 44 }: { theme: CollectionTheme; size?: number }) {
  const px = `${size}px`
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: px,
        height: px,
        background: `color-mix(in oklab, var(${theme.accentVar}) 16%, white)`,
        color: `color-mix(in oklab, var(${theme.accentVar}) 92%, black 30%)`,
      }}
      aria-hidden
    >
      <CollectionIcon theme={theme} className="h-5 w-5" strokeWidth={1.8} />
    </span>
  )
}

/* ------------------------------- Hero band ------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const feature = pool[0]
  const featureImg = feature ? getEditablePostImage(feature) : ''
  const totalPosts = pool.length > 0 ? pool.length : 240
  const collectionsCount = featuredCollections.length
  const libraryLabel = taskLabelOf(primaryTask)
  const primaryCta = pagesContent.home.hero.primaryCta
  const secondaryCta = pagesContent.home.hero.secondaryCta
  const secondaryFeeds = pool.slice(1, 4)
  const heroChips = topCollections.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)] pt-16 sm:pt-24 lg:pt-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-[540px]"
           style={{ background: 'radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--slot4-accent) 22%, transparent), transparent 70%)' }} />
      <div className="pointer-events-none absolute inset-x-0 -bottom-40 h-64 sm:h-80"
           style={{ background: 'radial-gradient(50% 50% at 50% 100%, color-mix(in oklab, var(--slot4-accent-pink) 20%, transparent), transparent 70%)' }} />

      <div className={`${container} relative`}>
        <EditableReveal className="mx-auto max-w-4xl text-center" delay={20}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/80 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-page-text)] backdrop-blur">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--slot4-accent)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--slot4-accent)]" />
            </span>
            {pagesContent.home.hero.badge}
          </span>
          <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem] xl:text-[7rem]">
            {pagesContent.home.hero.title.join(' ')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
            {pagesContent.home.hero.description}
          </p>

          {/* Inline search bar */}
          <form
            action="/search"
            className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white p-2 shadow-[0_28px_60px_-40px_rgba(22,22,22,0.30)] focus-within:border-[var(--slot4-page-text)]"
          >
            <span className="pl-4 text-[var(--slot4-muted-text)]">
              <Search className="h-4 w-4" />
            </span>
            <input
              name="q"
              type="search"
              placeholder={pagesContent.home.hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)]"
            >
              Search
            </button>
          </form>

          {/* Category shortcuts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
              Try
            </span>
            {heroChips.map((c) => (
              <Link
                key={c.slug}
                href={`${primaryRoute}?category=${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white/90 px-3.5 py-1.5 text-xs font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: `var(${c.accentVar})` }}
                />
                {c.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-4 text-sm font-medium text-white transition duration-500 hover:bg-[var(--slot4-accent)]"
            >
              {primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 bg-transparent px-7 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--slot4-muted-text)]">
            <span className="inline-flex items-center gap-2">
              <span className="font-medium text-[var(--slot4-page-text)]">{totalPosts.toLocaleString()}+</span>{' '}
              resources indexed
            </span>
            <span className="hidden h-4 w-px bg-[var(--editable-border)] sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
              <span className="font-medium text-[var(--slot4-page-text)]">{collectionsCount}</span> curated collections
            </span>
            <span className="hidden h-4 w-px bg-[var(--editable-border)] sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--slot4-accent-green)]" />
              Updated daily
            </span>
          </div>
        </EditableReveal>

        {/* Bento product visual */}
        <EditableReveal className="mt-16 sm:mt-20" delay={220}>
          <div className="relative mx-auto max-w-6xl">
            <div className="pointer-events-none absolute inset-x-16 -bottom-8 h-24 rounded-[var(--r-xxl)] bg-black/10 blur-2xl" />
            <div className="relative grid gap-4 sm:grid-cols-1 lg:grid-cols-[1.4fr_0.9fr]">
              {/* Left: feature browser card */}
              <div className="relative overflow-hidden rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-white shadow-[0_40px_100px_-40px_rgba(22,22,22,0.30)]">
                <div className="flex items-center gap-2 border-b border-[var(--editable-border)] bg-[var(--slot4-warm)] px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--slot4-accent-coral)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--slot4-accent-amber)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--slot4-accent-green)]" />
                  <span className="ml-3 truncate text-xs font-medium text-[var(--slot4-muted-text)]">
                    {SITE_CONFIG.baseUrl.replace(/^https?:\/\//, '')}
                    {primaryRoute}
                  </span>
                  <span className="ml-auto hidden text-[10px] uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)] sm:inline">
                    Preview
                  </span>
                </div>
                <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)] md:aspect-auto md:min-h-[420px]">
                    {featureImg ? (
                      <img
                        src={featureImg}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(135deg, color-mix(in oklab, var(--slot4-accent) 45%, white), color-mix(in oklab, var(--slot4-accent-pink) 55%, white))',
                        }}
                      />
                    )}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-page-text)] backdrop-blur">
                        <Sparkles className="h-3 w-3 text-[var(--slot4-accent)]" />
                        Editor’s pick
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-6 p-8 sm:p-10">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent-strong)]">
                        {feature ? getEditableCategory(feature) : 'Featured'}
                      </span>
                      <h3 className="editable-display mt-5 text-3xl leading-[1.06] tracking-[-0.02em]">
                        {feature?.title || `${libraryLabel} — the internet you actually use, kept.`}
                      </h3>
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
                        {feature
                          ? getEditableExcerpt(feature, 170)
                          : 'Save any link, sort it into a shelf, come back and it is still there. No feed, no algorithm.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={feature ? postHref(primaryTask, feature, primaryRoute) : primaryRoute}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-white transition duration-500 hover:bg-[var(--slot4-accent)]"
                      >
                        Open resource <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--slot4-muted-text)]">
                        <Globe className="h-3.5 w-3.5" />
                        {feature ? getEditableDomain(feature) || 'referansci.com' : 'referansci.com'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: mini "saved" feed */}
              <div className="grid gap-4">
                <div className="flex flex-col justify-between rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-[var(--slot4-page-text)] p-6 text-white">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">Just saved</p>
                    <h4 className="editable-display mt-3 text-2xl leading-tight">
                      Fresh from the shelves today.
                    </h4>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {secondaryFeeds.length
                      ? secondaryFeeds.map((p) => (
                          <li key={p.id || p.slug} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                              <Bookmark className="h-3.5 w-3.5" />
                            </span>
                            <Link
                              href={postHref(primaryTask, p, primaryRoute)}
                              className="min-w-0 flex-1"
                            >
                              <p className="line-clamp-1 text-sm font-medium text-white">
                                {p.title}
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-xs text-white/50">
                                {getEditableDomain(p) || getEditableCategory(p) || libraryLabel}
                              </p>
                            </Link>
                          </li>
                        ))
                      : [1, 2, 3].map((i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                              <Bookmark className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="h-3 w-3/4 rounded-full bg-white/10" />
                              <div className="mt-2 h-2 w-1/2 rounded-full bg-white/5" />
                            </div>
                          </li>
                        ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-5">
                    <Layers className="h-4 w-4 text-[var(--slot4-accent)]" />
                    <p className="editable-display mt-4 text-3xl leading-none">{collectionsCount}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
                      Shelves
                    </p>
                  </div>
                  <div className="rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-5">
                    <Bookmark className="h-4 w-4 text-[var(--slot4-accent-blue)]" />
                    <p className="editable-display mt-4 text-3xl leading-none">
                      {totalPosts.toLocaleString()}+
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
                      Resources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* --------------------------- Collections marquee ------------------------- */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const track = [...marqueeCollections, ...marqueeCollections]
  return (
    <section className="editable-marquee mt-24 overflow-hidden border-y border-[var(--editable-border)] bg-white py-6 sm:mt-32">
      <div className="editable-marquee-track flex w-max items-center gap-3">
        {track.map((c, i) => (
          <Link
            key={`${c.slug}-${i}`}
            href={`${primaryRoute}?category=${c.slug}`}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
          >
            <span
              className="inline-block h-2 w-2 rounded-full transition"
              style={{ background: `var(${c.accentVar})` }}
            />
            {c.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---------------------- Value props & collections grid ------------------- */
const valueProps = [
  {
    title: 'Save any link, calmly.',
    body: 'Drop a URL into a collection. Add a note if you want. Come back tomorrow and it is still there — no feed, no algorithm, no re-ranking.',
    points: ['One-click save from anywhere', 'Notes stay with the link', 'Nothing disappears on you'],
  },
  {
    title: 'Sort by shelf, not by date.',
    body: 'Collections are shelves — Technology, Finance, Design, Reading. Move a resource between shelves whenever you rethink it.',
    points: ['Move between collections', 'Nested tags when you need them', 'Zero busywork'],
  },
  {
    title: 'Public when you want, private when you don’t.',
    body: 'Keep a shelf to yourself, or open one for the world. Every public collection has its own quiet page you can link to.',
    points: ['Private by default', 'Public shelves link-shareable', 'Search across every open shelf'],
  },
]

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const highlight = pool[1] || pool[0]
  const highlightImg = highlight ? getEditablePostImage(highlight) : ''
  const libraryLabel = taskLabelOf(primaryTask)
  const counts = countByCollection(pool)

  return (
    <>
      {/* Alternating checkmark features */}
      <section className="mt-24 sm:mt-32">
        <div className={`${container} space-y-24 sm:space-y-32`}>
          {valueProps.map((v, i) => {
            const flipped = i % 2 === 1
            return (
              <EditableReveal key={v.title} index={i} className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className={flipped ? 'order-2 lg:order-1' : ''}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    Value {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="editable-display mt-4 text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-[3.625rem]">
                    {v.title}
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                    {v.body}
                  </p>
                  <ul className="mt-8 grid gap-3">
                    {v.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px] leading-7 text-[var(--slot4-page-text)]">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={flipped ? 'order-1 lg:order-2' : ''}>
                  <div className="relative overflow-hidden rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-white p-6 shadow-[0_28px_80px_-40px_rgba(22,22,22,0.28)] sm:p-8">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--slot4-accent-soft)] blur-3xl" />
                    <div className="relative grid gap-4">
                      {(pool.slice(i * 2, i * 2 + 3).length ? pool.slice(i * 2, i * 2 + 3) : pool.slice(0, 3)).map((post, j) => (
                        <Link
                          key={post.id || post.slug || j}
                          href={postHref(primaryTask, post, primaryRoute)}
                          className="group flex items-center gap-4 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-4 transition hover:border-[var(--slot4-page-text)]/20 hover:bg-white"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--slot4-accent-strong)] shadow-[0_2px_8px_rgba(22,22,22,0.06)]">
                            <Bookmark className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-[var(--slot4-page-text)]">{post.title}</p>
                            <p className="mt-1 line-clamp-1 text-xs text-[var(--slot4-muted-text)]">
                              {getEditableDomain(post) || getEditableCategory(post) || libraryLabel}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </EditableReveal>
            )
          })}
        </div>
      </section>

      {/* Collections grid — real archive categories, distinct icons + palette */}
      <section className="mt-24 sm:mt-32">
        <div className={container}>
          <EditableReveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                Browse by shelf
              </p>
              <h2 className="editable-display mt-4 text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-[3.75rem]">
                Collections.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {featuredCollections.length} shelves. Every archive category, sorted by hand.
              </p>
            </div>
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
            >
              View every shelf <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topCollections.map((c, i) => {
              const count = collectionCount(counts, c)
              return (
                <EditableReveal key={c.slug} index={i} step={55}>
                  <Link
                    href={`${primaryRoute}?category=${c.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(22,22,22,0.22)]"
                  >
                    {/* Colored halo tinted per collection */}
                    <div
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition duration-500 group-hover:opacity-70"
                      style={{ background: `var(${c.accentVar})` }}
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{
                          background: `color-mix(in oklab, var(${c.accentVar}) 16%, white)`,
                          color: `color-mix(in oklab, var(${c.accentVar}) 92%, black 30%)`,
                        }}
                      >
                        <CollectionIcon theme={c} className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <span className="rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="editable-display relative mt-8 text-2xl leading-tight tracking-[-0.015em]">
                      {c.label}
                    </h3>
                    <p className="relative mt-2 line-clamp-2 text-sm text-[var(--slot4-muted-text)]">
                      {c.blurb}
                    </p>
                    <div className="relative mt-auto flex items-end justify-between pt-8">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--slot4-soft-muted-text)]">
                        <Bookmark className="h-3.5 w-3.5" />
                        {count.toLocaleString()} resources
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--slot4-page-text)]">
                        Open shelf
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
                      </span>
                    </div>
                  </Link>
                </EditableReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured + stats */}
      {highlight ? (
        <section className="mt-24 sm:mt-32">
          <div className={container}>
            <EditableReveal className="grid gap-8 rounded-[var(--r-xxl)] bg-[var(--slot4-page-text)] p-6 text-white sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
                  <Star className="h-3.5 w-3.5" /> Editor’s pick
                </span>
                <h2 className="editable-display mt-6 text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-[3.75rem]">
                  {highlight.title}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
                  {getEditableExcerpt(highlight, 220)}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={postHref(primaryTask, highlight, primaryRoute)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)] hover:text-white"
                  >
                    Open resource <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={primaryRoute}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:border-white/60"
                  >
                    Browse the {taskLabelOf(primaryTask)}
                  </Link>
                </div>
              </div>
              <div className="grid gap-4">
                {highlightImg ? (
                  <div className="relative aspect-[16/12] overflow-hidden rounded-[var(--r-xl)] border border-white/10">
                    <img src={highlightImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Resources', value: pool.length ? pool.length : 240, Icon: Bookmark },
                    { label: 'Collections', value: featuredCollections.length, Icon: Layers },
                    { label: 'Fresh weekly', value: 120, Icon: Compass },
                  ].map((s) => (
                    <div key={s.label} className="rounded-[var(--r-lg)] border border-white/10 bg-white/[0.04] p-4">
                      <s.Icon className="h-4 w-4 text-white/60" />
                      <p className="editable-display mt-3 text-2xl leading-none">{s.value.toLocaleString()}+</p>
                      <p className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-white/50">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* --------------------- Dynamic bookmark grids (time) -------------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Just added', title: 'This week on the shelf' },
  browse: { eyebrow: 'Reaching for often', title: 'Picked up this month' },
  index: { eyebrow: 'Evergreen', title: 'Kept coming back to' },
}

function BookmarkGridCard({ post, href }: { post: SitePost; href: string }) {
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(22,22,22,0.20)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-page-text)] backdrop-blur">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-xl leading-[1.15] tracking-[-0.01em]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 120)}
        </p>
        <div className="mt-5 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-[var(--slot4-soft-muted-text)]">
            <Globe className="h-3.5 w-3.5" /> {domain || 'referansci.com'}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-[var(--slot4-accent)]">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className="mt-24 sm:mt-32">
            <div className={container}>
              <EditableReveal className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    {copy.eyebrow}
                  </p>
                  <h2 className="editable-display mt-4 text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-[3.625rem]">
                    {copy.title}
                  </h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
                >
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i} step={60}>
                    <BookmarkGridCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------- Social proof band + FAQ + CTA ---------------------- */
const socialProof = [
  { quote: 'Finally a place I can just drop links and know I’ll find them tomorrow.', by: 'Design lead' },
  { quote: 'It replaced three read-later apps and my browser bookmarks folder.', by: 'Product engineer' },
  { quote: 'The shelves keep me honest — I actually go back to what I saved.', by: 'Writer' },
  { quote: 'My team shares one shelf and the group chat got quieter overnight.', by: 'Staff engineer' },
]

const faqs = [
  { q: 'What can I save?', a: 'Any URL — an article, a doc, a repo, a tool page, a video. Add a note and pick a shelf; the rest is automatic.' },
  { q: 'Are my resources public?', a: 'Private by default. When a collection is ready to share, flip it public and get a clean link — the shelf becomes its own page.' },
  { q: 'Can I browse without an account?', a: 'Yes. Every public shelf is indexed and browsable. You only need an account to save new resources or build private shelves.' },
  { q: 'How is this different from bookmark folders?', a: 'Folders live inside one browser and rot when it changes. Shelves live on the web, are searchable, and travel with you.' },
  { q: 'Do you re-rank or personalize the feed?', a: 'No feed, no ranking, no personalization. Shelves are exactly the order you leave them in.' },
]

export function EditableHomeCta() {
  return (
    <>
      {/* Social proof */}
      <section className="mt-24 sm:mt-32">
        <div className={container}>
          <EditableReveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                What people say
              </p>
              <h2 className="editable-display mt-4 max-w-2xl text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl">
                Curators using {SITE_CONFIG.name}.
              </h2>
            </div>
          </EditableReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {socialProof.map((s, i) => (
              <EditableReveal key={s.by} index={i} step={70}>
                <figure className="flex h-full flex-col justify-between gap-6 rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-6">
                  <blockquote className="editable-display text-lg leading-snug tracking-[-0.005em] text-[var(--slot4-page-text)]">
                    “{s.quote}”
                  </blockquote>
                  <figcaption className="inline-flex items-center gap-3 text-xs text-[var(--slot4-muted-text)]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[10px] font-medium uppercase text-[var(--slot4-accent-strong)]">
                      {s.by.slice(0, 2)}
                    </span>
                    <span className="font-medium text-[var(--slot4-page-text)]">{s.by}</span>
                  </figcaption>
                </figure>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="mt-24 sm:mt-32">
        <div className={containerNarrow}>
          <EditableReveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                Answers
              </p>
              <h2 className="editable-display mt-4 text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl">
                Frequently asked.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-8 text-[var(--slot4-muted-text)]">
                The short version of how {SITE_CONFIG.name} works, in case you skipped straight down.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
              >
                Ask a real person <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-[var(--editable-border)] rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white">
              {faqs.map((f, i) => (
                <details key={f.q} className="group px-6 py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                    <span className="editable-display text-xl leading-[1.15] tracking-[-0.005em]">
                      {f.q}
                    </span>
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition group-open:bg-[var(--slot4-page-text)] group-open:text-white">
                      <PlusCircle className="h-4 w-4 group-open:hidden" />
                      <MinusCircle className="hidden h-4 w-4 group-open:block" />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">{f.a}</p>
                </details>
              ))}
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* CTA band */}
      <section id="get-app" className="mt-24 scroll-mt-24 sm:mt-32">
        <div className={container}>
          <EditableReveal className="relative overflow-hidden rounded-[var(--r-xxl)] bg-[var(--slot4-page-text)] p-10 text-white sm:p-16 lg:p-24">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent)] opacity-40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--slot4-accent-pink)] opacity-25 blur-3xl" />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">
                {pagesContent.home.cta.badge}
              </p>
              <h2 className="editable-display mt-6 text-4xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
                {pagesContent.home.cta.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
                {pagesContent.home.cta.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={pagesContent.home.cta.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)] hover:text-white"
                >
                  {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={pagesContent.home.cta.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white transition hover:border-white/60"
                >
                  {pagesContent.home.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>
    </>
  )
}

// Silent no-op — keeps the hidden-task guard visible via grep for auditability.
// Uses `footerCollections` too so tree-shakers keep the export alive.
export const __HOME_HIDDEN_GUARD__ = () =>
  visibleTasks().every((t) => !isUiHiddenTask(t.key)) && footerCollections.length > 0

/**
 * Helper reused by non-home surfaces (search, footer) that need a small
 * "explore" strip. Kept here so all curated marketing lists live together.
 */
export function CollectionMiniCard({
  theme,
  href,
  size = 'md',
}: {
  theme: CollectionTheme
  href: string
  size?: 'sm' | 'md'
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
    >
      <span
        className={`flex ${size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} items-center justify-center rounded-full transition`}
        style={{
          background: `color-mix(in oklab, var(${theme.accentVar}) 18%, white)`,
          color: `color-mix(in oklab, var(${theme.accentVar}) 92%, black 30%)`,
        }}
      >
        <CollectionIcon theme={theme} className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      {theme.label}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
    </Link>
  )
}
