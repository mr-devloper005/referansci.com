import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  BookmarkPlus,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Hash,
  Layers,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { featuredCollections, taskLabelOf } from '@/editable/content/global.content'
import { CollectionIcon } from '@/editable/content/collection-icons'
import { EditableCopyLinkButton } from '@/editable/components/EditableCopyLinkButton'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>,
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------ Data helpers ----------------------------- */
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((k) => asText(content[k]))
    .filter((u) => u && isUrl(u))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 12)
}
const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}
const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-text)]">
      <Sparkles className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
      {theme.kicker}
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)]" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </span>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {taskLabelOf(task).toLowerCase()}
    </Link>
  )
}

/* -------------------------------- Article -------------------------------- */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <BackLink task="article" />
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
          {categoryOf(post, 'Note')}
        </p>
        <h1 className="editable-display mt-5 text-balance text-5xl leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
          {post.title}
        </h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]">{SITE_CONFIG.name}</div>
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="mt-12 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover"
          />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ------------------------------- Listing --------------------------------- */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-16 sm:py-24 lg:px-10">
      <BackLink task="listing" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">Directory record</Kicker>
              <h1 className="editable-display mt-4 text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">{post.title}</h1>
            </div>
          </div>
          {leadText(post) ? <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ------------------------------ Classified ------------------------------- */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container-wide)] gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(22,22,22,0.22)]">
            <Kicker task="classified">Offer</Kicker>
            <h1 className="editable-display mt-4 text-3xl leading-tight tracking-[-0.015em]">{post.title}</h1>
            <p className="editable-display mt-6 text-4xl tracking-[-0.02em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* --------------------------------- Image --------------------------------- */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-16 sm:py-24 lg:px-10">
        <BackLink task="image" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">Visual story</Kicker>
            <h1 className="editable-display mt-6 text-4xl leading-[1.04] tracking-[-0.02em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* -------------------------------- Bookmark ------------------------------- */
/*
  Public detail (bookmark / resource):
  - No hero image, no date.
  - Per-collection accent tint threads the whole page (background halo,
    icon, related strip chip color).
  - Breadcrumb + action row (Visit / Save / Copy / Share) up top.
  - Big display H1 in a hero band with radial glow.
  - At-a-glance strip: Collection · Domain · Verified · Read time.
  - TL;DR pull card above the body when a lead exists.
  - Sticky sidebar: resource card, trust panel, curator strip,
    related shelves, one sidebar Ad.
  - "More from this collection" strip with per-related color chips.
*/
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const tagList = Array.isArray(post.tags) ? post.tags.filter(Boolean) : []
  const rawCollection = categoryOf(post, 'Uncategorized')
  const collectionTheme =
    featuredCollections.find(
      (c) =>
        c.slug === String(rawCollection).toLowerCase().replace(/\s+/g, '-') ||
        c.label.toLowerCase() === String(rawCollection).toLowerCase(),
    ) || undefined
  const accentVar = collectionTheme?.accentVar || '--tk-accent'
  const collectionLabel = collectionTheme?.label || rawCollection
  const collectionHref = collectionTheme ? `/sbm?category=${collectionTheme.slug}` : '/sbm'
  const description = leadText(post)
  const brand = SITE_CONFIG.name
  const bodyPlain = stripHtml(getBody(post))
  const readMinutes = Math.max(1, Math.round(bodyPlain.split(/\s+/).filter(Boolean).length / 220))
  const relatedInCollection = related.filter((r) => {
    const rc = String(getContent(r).category || '').toLowerCase().replace(/\s+/g, '-')
    return collectionTheme ? rc === collectionTheme.slug : true
  })

  return (
    <>
      {/* Hero band */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 h-[540px]"
          style={{
            background: `radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(${accentVar}) 22%, transparent), transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-10 h-[380px] w-[380px] rounded-full opacity-30 blur-3xl"
          style={{ background: `var(${accentVar})` }}
        />
        <div className="relative mx-auto max-w-[var(--editable-container-wide)] px-6 pt-14 sm:pt-20 lg:px-10 lg:pt-28">
          <EditableReveal>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-[var(--tk-muted)]">
              <Link href="/" className="hover:text-[var(--tk-text)]">Home</Link>
              <ChevronRight className="h-3 w-3 opacity-60" />
              <Link href="/sbm" className="hover:text-[var(--tk-text)]">{taskLabelOf('sbm')}</Link>
              <ChevronRight className="h-3 w-3 opacity-60" />
              <Link href={collectionHref} className="hover:text-[var(--tk-text)]">{collectionLabel}</Link>
              <ChevronRight className="h-3 w-3 opacity-60" />
              <span className="truncate text-[var(--tk-text)]">{post.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={collectionHref}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in oklab, var(${accentVar}) 22%, white)`,
                    color: `color-mix(in oklab, var(${accentVar}) 92%, black 30%)`,
                  }}
                >
                  {collectionTheme ? (
                    <CollectionIcon theme={collectionTheme} className="h-3 w-3" strokeWidth={2.4} />
                  ) : (
                    <Layers className="h-3 w-3" />
                  )}
                </span>
                {collectionLabel}
              </Link>
              {domain ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--tk-text)]">
                  <Globe2 className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {domain}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--tk-muted)]">
                <Clock className="h-3.5 w-3.5 text-[var(--tk-accent-green,#33c791)]" />
                {readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--tk-muted)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
                Verified
              </span>
            </div>

            <h1 className="editable-display mt-8 max-w-5xl text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem]">
              {post.title}
            </h1>
            {description ? (
              <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--tk-muted)]">{description}</p>
            ) : null}

            {/* Action row */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="noreferrer nofollow noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]"
                >
                  Visit resource <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <SaveShelfButton />
              <EditableCopyLinkButton />
              <ShareButton title={post.title} />
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* At-a-glance strip */}
      <section className="border-y border-[var(--tk-line)] bg-white">
        <div className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-6 lg:px-10">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <QuickFactCollection theme={collectionTheme} label={collectionLabel} accentVar={accentVar} />
            <QuickFact icon={Globe2} label="Domain" value={domain || 'referansci.com'} />
            <QuickFact icon={Clock} label="Read time" value={`${readMinutes} min`} />
            <QuickFact icon={ShieldCheck} label="Status" value="Curated & checked" />
          </dl>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-20 sm:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            {/* TL;DR pull card */}
            {description ? (
              <div
                className="relative overflow-hidden rounded-[var(--tk-radius)] border p-6 sm:p-7"
                style={{
                  borderColor: `color-mix(in oklab, var(${accentVar}) 25%, var(--tk-line))`,
                  background: `color-mix(in oklab, var(${accentVar}) 6%, white)`,
                }}
              >
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: `var(${accentVar})` }} />
                  TL;DR
                </div>
                <p className="editable-display mt-3 text-xl leading-[1.4] tracking-[-0.005em] text-[var(--tk-text)] sm:text-2xl">
                  {description}
                </p>
              </div>
            ) : null}

            <BodyContent post={post} display />

            {tagList.length ? (
              <div className="mt-14 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  Tagged
                </span>
                {tagList.slice(0, 12).map((t) => (
                  <Link
                    key={t}
                    href={`/search?q=${encodeURIComponent(String(t))}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                  >
                    <Hash className="h-3 w-3 text-[var(--tk-accent)]" />
                    {t}
                  </Link>
                ))}
              </div>
            ) : null}

            {/* Bottom action band */}
            <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                  Ready to open?
                </p>
                <p className="editable-display mt-2 text-2xl leading-tight tracking-[-0.01em]">
                  Head over to {domain || 'the resource'}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {website ? (
                  <Link
                    href={website}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]"
                  >
                    Visit resource <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  href={collectionHref}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                >
                  Back to {collectionLabel}
                </Link>
              </div>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Resource card, accent-tinted */}
            <div
              className="relative overflow-hidden rounded-[var(--tk-radius)] border p-6 shadow-[0_20px_50px_-30px_rgba(22,22,22,0.20)]"
              style={{
                borderColor: `color-mix(in oklab, var(${accentVar}) 25%, var(--tk-line))`,
                background: `linear-gradient(180deg, color-mix(in oklab, var(${accentVar}) 8%, white), white)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in oklab, var(${accentVar}) 18%, white)`,
                    color: `color-mix(in oklab, var(${accentVar}) 92%, black 30%)`,
                  }}
                >
                  <Bookmark className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Resource</p>
                  <p className="truncate text-sm font-medium text-[var(--tk-text)]">{domain || post.title}</p>
                </div>
              </div>
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="noreferrer nofollow noopener"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]"
                >
                  Visit resource <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <div className="mt-4 grid gap-2 text-xs text-[var(--tk-muted)]">
                <div className="flex items-center justify-between">
                  <span>Collection</span>
                  <Link href={collectionHref} className="font-medium text-[var(--tk-text)] hover:underline">
                    {collectionLabel}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span>Read time</span>
                  <span className="font-medium text-[var(--tk-text)]">{readMinutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curator</span>
                  <span className="font-medium text-[var(--tk-text)]">{brand}</span>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Trust</p>
              <ul className="mt-4 grid gap-3 text-sm text-[var(--tk-muted)]">
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> Manually reviewed
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--tk-accent)]" /> External link opens in a new tab
                </li>
                <li className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[var(--tk-accent)]" /> Filed under {collectionLabel}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--tk-accent)]" /> Curated for {brand}
                </li>
              </ul>
            </div>

            {/* Nearby shelves */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Nearby shelves</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredCollections
                  .filter((c) => c.slug !== collectionTheme?.slug)
                  .slice(0, 6)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/sbm?category=${c.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full"
                        style={{
                          background: `color-mix(in oklab, var(${c.accentVar}) 20%, white)`,
                          color: `color-mix(in oklab, var(${c.accentVar}) 92%, black 30%)`,
                        }}
                      >
                        <CollectionIcon theme={c} className="h-2.5 w-2.5" strokeWidth={2.4} />
                      </span>
                      {c.label}
                    </Link>
                  ))}
              </div>
            </div>

            <Ads
              slot="sidebar"
              size={pickRandom(getSlotSizes('sidebar'))}
              showLabel
              className="w-full"
            />
          </aside>
        </div>
      </section>

      {/* More from this collection */}
      <RelatedStrip
        task="sbm"
        related={relatedInCollection.length ? relatedInCollection : related}
        label={`More from ${collectionLabel}`}
      />
    </>
  )
}

function QuickFact({
  icon: Icon,
  label,
  value,
  accentVar,
}: {
  icon: typeof Layers
  label: string
  value: string
  accentVar?: string
}) {
  const tint = accentVar || '--tk-accent'
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: `color-mix(in oklab, var(${tint}) 16%, white)`,
          color: `color-mix(in oklab, var(${tint}) 92%, black 30%)`,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</dt>
        <dd className="mt-1 truncate text-sm font-medium text-[var(--tk-text)]">{value}</dd>
      </div>
    </div>
  )
}

/**
 * QuickFact variant that renders the CollectionIcon inline — kept as its
 * own component so no capitalised icon variable is created during render.
 */
function QuickFactCollection({
  theme,
  label,
  accentVar,
}: {
  theme?: import('@/editable/content/global.content').CollectionTheme
  label: string
  accentVar: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: `color-mix(in oklab, var(${accentVar}) 16%, white)`,
          color: `color-mix(in oklab, var(${accentVar}) 92%, black 30%)`,
        }}
      >
        {theme ? <CollectionIcon theme={theme} className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Collection</dt>
        <dd className="mt-1 truncate text-sm font-medium text-[var(--tk-text)]">{label}</dd>
      </div>
    </div>
  )
}

function ShareButton({ title }: { title: string }) {
  return (
    <a
      href={`mailto:?subject=${encodeURIComponent(`Worth saving: ${title}`)}`}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
    >
      <Share2 className="h-4 w-4" /> Share
    </a>
  )
}

function SaveShelfButton() {
  return (
    <Link
      href="/create"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
    >
      <BookmarkPlus className="h-4 w-4" /> Save to shelf
    </Link>
  )
}


/* ---------------------------------- PDF ---------------------------------- */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-16 sm:py-24 lg:px-10">
      <BackLink task="pdf" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <FileText className="h-9 w-9" />
            </div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-3xl leading-[1.02] tracking-[-0.015em] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-medium">Preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={post.title}
                className="h-[78vh] w-full bg-[var(--tk-raised)]"
              />
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
              <p className="text-sm font-medium">Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" related={related} />
        </aside>
      </div>
    </section>
  )
}

/* -------------------------------- Profile -------------------------------- */
/*
  Profile detail — direct-URL only. It stays functional (routes still work)
  but is never promoted in the public UI. No date, no back-to-archive link,
  no more-profiles strip. Identity hero with cover band + overlapping avatar,
  contact/links, "their content" section, identity sidebar.
*/
function ProfileDetail({ post }: { post: SitePost }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company', 'title'])
  const locationField = getField(post, ['location', 'city', 'country'])
  const bio = leadText(post) || stripHtml(summaryText(post))
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const twitter = getField(post, ['twitter', 'x'])
  const linkedin = getField(post, ['linkedin'])
  const github = getField(post, ['github'])
  const initials = (post.title || 'User').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const links = [
    website ? { icon: Globe2, label: 'Website', href: website } : null,
    email ? { icon: Mail, label: email, href: `mailto:${email}` } : null,
    phone ? { icon: Phone, label: phone, href: `tel:${phone}` } : null,
    twitter ? { icon: ArrowUpRight, label: 'X / Twitter', href: /^https?:/.test(twitter) ? twitter : `https://x.com/${twitter.replace(/^@/, '')}` } : null,
    linkedin ? { icon: ArrowUpRight, label: 'LinkedIn', href: /^https?:/.test(linkedin) ? linkedin : `https://linkedin.com/in/${linkedin}` } : null,
    github ? { icon: ArrowUpRight, label: 'GitHub', href: /^https?:/.test(github) ? github : `https://github.com/${github}` } : null,
  ].filter(Boolean) as { icon: typeof Globe2; label: string; href: string }[]

  return (
    <>
      {/* Identity hero */}
      <section className="relative">
        <div className="h-56 w-full bg-[linear-gradient(135deg,var(--tk-accent-soft),white)] sm:h-72" />
        <div className="mx-auto max-w-[var(--editable-container-wide)] px-6 lg:px-10">
          <EditableReveal className="-mt-24 flex flex-col items-center text-center sm:-mt-28">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--tk-bg)] bg-[var(--tk-raised)] shadow-[0_20px_50px_-24px_rgba(22,22,22,0.28)] sm:h-48 sm:w-48">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="editable-display text-4xl tracking-[-0.02em] text-[var(--tk-muted)]">{initials}</span>
              )}
            </div>
            <h1 className="editable-display mt-8 text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
              {role ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--tk-text)]">
                  <UserRound className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {role}
                </span>
              ) : null}
              {locationField ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--tk-text)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {locationField}
                </span>
              ) : null}
            </div>
            {bio ? (
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">{bio}</p>
            ) : null}
          </EditableReveal>
        </div>
      </section>

      {/* Contact + links */}
      {links.length ? (
        <section className="mx-auto max-w-3xl px-6 pt-14 lg:px-10">
          <EditableReveal className="grid gap-3 sm:grid-cols-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-center gap-3 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                  <l.icon className="h-4 w-4" />
                </span>
                <span className="truncate">{l.label}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 transition group-hover:opacity-100" />
              </a>
            ))}
          </EditableReveal>
        </section>
      ) : null}

      {/* Their content + identity sidebar */}
      <section className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-20 sm:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
              Their content
            </p>
            <h2 className="editable-display mt-3 text-3xl leading-[1.08] tracking-[-0.015em] sm:text-4xl">
              What {post.title.split(' ')[0]} has been building.
            </h2>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Identity</p>
              <dl className="mt-5 grid gap-4 text-sm">
                <DlRow label="Name" value={post.title} />
                {role ? <DlRow label="Role" value={role} /> : null}
                {locationField ? <DlRow label="Based in" value={locationField} /> : null}
                {website ? <DlRow label="Website" value={cleanDomain(website)} /> : null}
                {email ? <DlRow label="Email" value={email} /> : null}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function DlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--tk-line)] pb-3 last:border-0 last:pb-0">
      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</dt>
      <dd className="truncate text-right font-medium text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

/* -------------------------- Shared building blocks ----------------------- */
function Divider() {
  return <div className="my-12 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false, display = false }: { post: SitePost; compact?: boolean; display?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-7' : display ? 'text-[1.125rem] leading-[1.85]' : 'text-[1.0625rem] leading-8'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white">
      <div className="flex items-center gap-2 p-4 text-sm font-medium">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const label = taskLabelOf(task)
  if (!related.length) return null
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editable-display text-lg tracking-[-0.015em]">More like this</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">
          View {label}
        </Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related, label }: { task: TaskKey; related: SitePost[]; label?: string }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const taskLabel = taskLabelOf(task)
  const heading = label || `More ${taskLabel.toLowerCase()}`
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container-wide)] px-6 py-16 sm:py-20 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-3xl leading-tight tracking-[-0.015em] sm:text-4xl">{heading}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_-24px_rgba(22,22,22,0.20)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          ) : (
            <div className="flex h-full items-center justify-center"><Camera className="h-7 w-7 text-[var(--tk-muted)]" /></div>
          )}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-lg leading-tight tracking-[-0.01em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-2xl border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--tk-raised)]">
          <Bookmark className="h-5 w-5 text-[var(--tk-muted)]" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-[-0.005em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
