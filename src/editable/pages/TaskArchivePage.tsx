import Link from 'next/link'
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  Download,
  FileText,
  Globe,
  Layers,
  MapPin,
  Phone,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { featuredCollections, taskLabelOf } from '@/editable/content/global.content'
import { CollectionIcon } from '@/editable/content/collection-icons'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}
const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value
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
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(22,22,22,0.20)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskLabelOf(task) || taskConfig?.label || task
  const activeCollection = category !== 'all' ? featuredCollections.find((c) => c.slug === category) : undefined
  const categoryLabel = category === 'all' ? 'All shelves' : (activeCollection?.label || CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category)
  const isSbm = task === 'sbm'
  const showInFeedAd = isSbm

  // Interleave one in-feed ad in the SBM grid (only for the sbm archive per contract).
  const grid = posts
  const midpoint = Math.min(6, Math.max(0, Math.floor(grid.length / 2)))
  const gridWithAd = showInFeedAd && grid.length > 0
    ? [...grid.slice(0, midpoint), { __ad: true } as any, ...grid.slice(midpoint)]
    : grid

  // Chip rail = first ~10 archive categories, promoted for scannable browsing.
  const chipRail = featuredCollections.slice(0, 10)

  const totalCount = pagination.total || posts.length

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Hero band */}
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px]"
               style={{ background: 'radial-gradient(60% 60% at 50% 0%, var(--tk-glow), transparent 70%)' }} />
          {activeCollection ? (
            <div
              className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
              style={{ background: `var(${activeCollection.accentVar})` }}
            />
          ) : null}

          <div className="relative mx-auto max-w-[var(--editable-container-wide)] px-5 pt-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-36">
            <EditableReveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[var(--tk-muted)]">
                <Link href="/" className="hover:text-[var(--tk-text)]">Home</Link>
                <span>/</span>
                <span className="text-[var(--tk-text)]">{label}</span>
                {activeCollection ? (
                  <>
                    <span>/</span>
                    <span className="text-[var(--tk-text)]">{activeCollection.label}</span>
                  </>
                ) : null}
              </nav>

              <div className="max-w-4xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
                  {theme.kicker}
                  <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)]" />
                  <span className="text-[var(--tk-muted)]">{label}</span>
                </span>
                <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem]">
                  {activeCollection ? `${activeCollection.label}.` : (voice?.headline || `Browse ${label}.`)}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">
                  {activeCollection ? activeCollection.blurb + ' — curated by hand.' : (voice?.description || theme.note)}
                </p>
              </div>
            </EditableReveal>

            {/* Stat strip */}
            <EditableReveal delay={100} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-3xl">
              <StatChip icon={Bookmark} label="On this shelf" value={String(totalCount || posts.length)} />
              <StatChip icon={Layers} label="Total shelves" value={String(featuredCollections.length)} />
              <StatChip icon={Compass} label="Page" value={`${page} / ${pagination.totalPages || 1}`} />
              <StatChip icon={Sparkles} label="Curated" value="By hand" />
            </EditableReveal>

            {/* Chip rail — real archive categories */}
            <EditableReveal delay={160} className="mt-10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Popular shelves
                </p>
                <span className="hidden text-[11px] text-[var(--tk-muted)] sm:inline">
                  {featuredCollections.length} in total
                </span>
              </div>
              <div className="mt-4 flex snap-x gap-2.5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Link
                  href={basePath}
                  className={`shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition ${
                    category === 'all'
                      ? 'border-[var(--tk-text)] bg-[var(--tk-text)] text-white'
                      : 'border-[var(--tk-line)] bg-white text-[var(--tk-text)] hover:border-[var(--tk-text)]'
                  }`}
                >
                  All shelves
                </Link>
                {chipRail.map((c) => {
                  const isActive = c.slug === category
                  return (
                    <Link
                      key={c.slug}
                      href={`${basePath}?category=${c.slug}`}
                      className={`shrink-0 snap-start inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'border-[var(--tk-text)] bg-[var(--tk-text)] text-white'
                          : 'border-[var(--tk-line)] bg-white text-[var(--tk-text)] hover:border-[var(--tk-text)]'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${isActive ? 'bg-white/15 text-white' : ''}`}
                        style={
                          isActive
                            ? undefined
                            : {
                                background: `color-mix(in oklab, var(${c.accentVar}) 18%, white)`,
                                color: `color-mix(in oklab, var(${c.accentVar}) 92%, black 30%)`,
                              }
                        }
                      >
                        <CollectionIcon theme={c} className="h-3 w-3" strokeWidth={2.2} />
                      </span>
                      {c.label}
                    </Link>
                  )
                })}
              </div>
            </EditableReveal>

            {/* Filter + result summary */}
            <EditableReveal delay={220} className="mt-8 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--tk-muted)]">
                <span className="font-medium text-[var(--tk-text)]">{posts.length}</span>{' '}
                {posts.length === 1 ? 'resource' : 'resources'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-white pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                    aria-label={voice?.filterLabel || 'Filter shelf'}
                  >
                    <option value="all">All shelves</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>{item.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-text)] px-6 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]">
                  Apply
                </button>
              </form>
            </EditableReveal>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container-wide)] px-5 py-20 sm:px-6 sm:py-28 lg:px-10">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {gridWithAd.map((item, index) => {
                if ((item as any).__ad) {
                  return (
                    <div
                      key="__ad"
                      className="col-span-full md:col-span-2 xl:col-span-3"
                    >
                      <Ads
                        slot="feature"
                        size={pickRandom(getSlotSizes('feature'))}
                        showLabel
                        className="mx-auto w-full"
                      />
                    </div>
                  )
                }
                const post = item as SitePost
                return (
                  <EditableReveal key={post.id || post.slug} index={index} step={55}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                )
              })}
            </div>
          ) : (
            <EditableReveal className="mx-auto max-w-2xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-white px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-2xl">Nothing on this shelf yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--tk-muted)]">
                Try a nearby shelf, or check back — {label.toLowerCase()} arrives here as it’s curated.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {featuredCollections.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`${basePath}?category=${c.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                  >
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{
                        background: `color-mix(in oklab, var(${c.accentVar}) 18%, white)`,
                        color: `color-mix(in oklab, var(${c.accentVar}) 92%, black 30%)`,
                      }}
                    >
                      <CollectionIcon theme={c} className="h-3 w-3" strokeWidth={2.2} />
                    </span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </EditableReveal>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-medium transition hover:border-[var(--tk-accent)]">Previous</Link>
              ) : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-medium transition hover:border-[var(--tk-accent)]">Next</Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function StatChip({ icon: Icon, label, value }: { icon: typeof Bookmark; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
        <p className="editable-display truncate text-lg leading-none tracking-[-0.01em] text-[var(--tk-text)]">{value}</p>
      </div>
    </div>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const image = getImages(post)[0]
  const rawCat = getCategory(post, 'Resource')
  const collection =
    featuredCollections.find(
      (c) => c.slug === String(rawCat).toLowerCase().replace(/\s+/g, '-') || c.label.toLowerCase() === String(rawCat).toLowerCase(),
    ) || undefined
  const accentVar = collection?.accentVar || '--tk-accent'

  return (
    <Link href={href} className={`${cardBase} relative flex h-full flex-col overflow-hidden`}>
      {/* Accent halo per collection */}
      <div
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-40 blur-3xl transition duration-500 group-hover:opacity-60"
        style={{ background: `var(${accentVar})` }}
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, var(${accentVar}) 45%, white), color-mix(in oklab, var(${accentVar}) 20%, white))`,
            }}
          />
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--tk-text)] backdrop-blur">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full"
            style={{
              background: `color-mix(in oklab, var(${accentVar}) 25%, white)`,
              color: `color-mix(in oklab, var(${accentVar}) 90%, black 20%)`,
            }}
          >
            {collection ? (
              <CollectionIcon theme={collection} className="h-2.5 w-2.5" strokeWidth={2.5} />
            ) : (
              <Bookmark className="h-2.5 w-2.5" />
            )}
          </span>
          {collection?.label || rawCat}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[var(--tk-text)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col p-6">
        <h2 className="editable-display text-2xl leading-[1.15] tracking-[-0.015em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]">
          {getSummary(post)}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-5 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[var(--tk-muted)]">
            <Globe className="h-3.5 w-3.5" /> {domain || 'referansci.com'}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-[var(--tk-accent)]">
            Open resource <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          <span>{category}</span>
          <span className="text-[var(--tk-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-4 text-2xl leading-tight tracking-[-0.015em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Open note" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--r-md)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-xl tracking-[-0.015em]">{post.title}</h2>
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl tracking-[-0.02em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-xl leading-snug tracking-[-0.015em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.78))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg leading-snug tracking-[-0.015em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/70">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-xl leading-snug tracking-[-0.015em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-lg tracking-[-0.015em]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
