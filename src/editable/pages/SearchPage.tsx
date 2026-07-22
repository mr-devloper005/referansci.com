import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Globe, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask, taskLabelOf, visibleTasks } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      '',
  )
}
const domainOf = (post: SitePost) => {
  const content = getContent(post)
  const raw = compactRaw(content.website) || compactRaw(content.url) || compactRaw(content.link) || ''
  return raw ? raw.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Enforce hidden-task rule at the search filter layer too — profile posts
  // never appear in public search results.
  if (derivedTask && isUiHiddenTask(String(derivedTask))) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function ResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskConfig = task ? SITE_CONFIG.tasks.find((item) => item.key === task) : null
  const href = `${taskConfig?.route || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = task ? taskLabelOf(task) : 'Resource'
  const domain = domainOf(post)
  const wide = index % 5 === 0
  return (
    <EditableReveal index={index} step={45} className={wide ? 'md:col-span-2' : ''}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(22,22,22,0.22)]"
      >
        {image ? (
          <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${wide ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-page-text)] backdrop-blur">
              {label}
            </span>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          {!image ? (
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
              {label}
            </span>
          ) : null}
          <h2 className={`editable-display line-clamp-3 leading-[1.1] tracking-[-0.015em] ${wide ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
            {post.title}
          </h2>
          {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
          <div className="mt-6 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-[var(--slot4-soft-muted-text)]">
              <Globe className="h-3.5 w-3.5" /> {domain || 'referansci.com'}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-[var(--slot4-accent)]">
              Open <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const rawTask = (resolved.task || '').trim().toLowerCase()
  // Hidden task never accepted from URL either — force it to empty so the
  // full search runs across visible tasks only.
  const task = rawTask && isUiHiddenTask(rawTask) ? '' : rawTask
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key)).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Public search only shows visible tasks — hidden task is stripped entirely.
  const publicTasks = visibleTasks()

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pt-24 sm:px-6 sm:pt-32 lg:px-10 lg:pt-40">
          <EditableReveal className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-page-text)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
              {pagesContent.search.hero.badge}
            </span>
            <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>
          </EditableReveal>

          <EditableReveal delay={160} className="mx-auto mt-12 max-w-4xl">
            <form
              action="/search"
              className="grid gap-3 rounded-full border border-[var(--editable-border)] bg-white p-2 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:rounded-full"
            >
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-2 rounded-full px-4">
                <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full border-l border-[var(--editable-border)] px-4">
                <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Collection"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <select
                name="task"
                defaultValue={task}
                className="rounded-full border-l border-[var(--editable-border)] bg-white px-4 py-3 text-sm outline-none"
                aria-label="Filter by type"
              >
                <option value="">Every type</option>
                {publicTasks.map((item) => (
                  <option key={item.key} value={item.key}>
                    {taskLabelOf(item.key)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
              >
                Search
              </button>
            </form>
          </EditableReveal>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pb-20 pt-16 sm:px-6 sm:pb-28 lg:px-10">
          <EditableReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </p>
              <h2 className="editable-display mt-4 text-3xl leading-tight tracking-[-0.015em] sm:text-4xl">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href="/sbm"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
            >
              Browse the Library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <ResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <EditableReveal className="mt-12 rounded-[var(--r-xl)] border border-dashed border-[var(--editable-border)] bg-white p-14 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
              <p className="editable-display mt-5 text-2xl tracking-[-0.015em]">No matches — yet.</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--slot4-muted-text)]">
                Try a different keyword, or narrow the collection. Every public shelf is indexed here.
              </p>
            </EditableReveal>
          )}

          {/* Search always shows one ad in the footer slot. */}
          <div className="mt-20">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
