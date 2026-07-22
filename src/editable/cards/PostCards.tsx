import Link from 'next/link'
import { ArrowUpRight, Bookmark, Globe } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  Card kit for Slot 5. Reference: reels-wbs.webflow.io — soft rounded
  surfaces on a whitesmoke page, hairline borders, pill meta chips,
  subtle lift on hover, image zoom on hover. Every card centers on the
  bookmark/collection/resource idea; there are no dates on cards or
  detail views (see TaskDetailPage).
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Resource'
}

export function getEditableDomain(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw = (typeof content.website === 'string' && content.website)
    || (typeof content.url === 'string' && content.url)
    || (typeof content.link === 'string' && content.link)
    || ''
  return raw ? raw.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/** Signature featured tile — dark band with soft image behind display type. */
export function EditorialFeatureCard({ post, href, label = 'Featured collection' }: { post: SitePost; href: string; label?: string }) {
  const category = getEditableCategory(post)
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.band} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[600px]">
        <img
          src={getEditablePostImage(post)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.15),rgba(22,22,22,0.85))]" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end lg:min-h-[520px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-white">
            {label}
          </span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.75rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 group-hover:bg-[var(--slot4-accent-fill)] group-hover:text-white">
              Open collection <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="rounded-full border border-white/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
              {category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/** Horizontal-rail card — used in marquees and collection strips. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(22,22,22,0.20)]`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-page-text)] backdrop-blur">
          {getEditableCategory(post)}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-3 text-2xl leading-[1.1] tracking-[-0.015em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${pal.mutedText}`}>
          {getEditableExcerpt(post, 135)}
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

/** Compact numbered row — pill icon + short summary. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.card} p-6 transition duration-500 hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]/20`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${pal.darkBg} text-xs font-medium text-white`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
            <Bookmark className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-2 line-clamp-2 text-xl leading-tight tracking-[-0.015em] text-[var(--slot4-page-text)]">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>
            {getEditableExcerpt(post, 105)}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--slot4-accent)] opacity-0 transition group-hover:opacity-100">
            Open resource <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Wide article/list card — big media on the left, tag + title + summary right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(22,22,22,0.20)] sm:grid-cols-[240px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img
          src={getEditablePostImage(post)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-6">
        <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>
          Entry {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-display mt-3 line-clamp-3 text-2xl leading-tight tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-3xl">
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-white transition duration-500 group-hover:bg-[var(--slot4-accent-fill)]">
          Open resource <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
