'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  FileText,
  ImageIcon,
  Lock,
  PlusCircle,
  Send,
  Sparkles,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask, taskLabelOf } from '@/editable/content/global.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: Bookmark,
}

const field =
  'w-full rounded-full border border-[var(--editable-border)] bg-white px-5 py-3.5 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'
const textarea =
  'w-full rounded-[var(--r-md)] border border-[var(--editable-border)] bg-white px-5 py-4 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Hidden tasks (profile) never appear as a create option in the public UI.
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    [],
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? taskLabelOf(activeTask.key) : 'resource'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[var(--editable-container-wide)] items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
            <EditableReveal className="relative overflow-hidden rounded-[var(--r-xxl)] bg-[var(--slot4-page-text)] p-10 text-white sm:p-14">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--slot4-accent)] opacity-40 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em]">
                  <Lock className="h-3.5 w-3.5" />
                  Login required
                </span>
                <h2 className="editable-display mt-6 text-4xl leading-[1.02] tracking-[-0.015em]">
                  Doors locked, shelves waiting.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                  Only signed-in curators can add resources. Free to join, no card required.
                </p>
              </div>
            </EditableReveal>
            <EditableReveal delay={120}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                {pagesContent.create.locked.badge}
              </span>
              <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.create.locked.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
                >
                  Log in <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 px-6 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
                >
                  Get started
                </Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pt-20 sm:px-6 sm:pt-28 lg:px-10">
          <EditableReveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
              {pagesContent.create.hero.badge}
            </span>
            <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.create.hero.description}
            </p>
          </EditableReveal>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pb-24 pt-14 sm:px-6 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-10 lg:pb-32">
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              What are you adding?
            </p>
            <h2 className="editable-display mt-3 text-3xl leading-tight tracking-[-0.015em]">
              Pick a shelf format.
            </h2>
            <div className="mt-8 grid gap-3">
              {enabledTasks.map((item) => {
                const Icon = taskIcon[item.key] || FileText
                const active = item.key === task
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTask(item.key)}
                    className={`group flex items-start gap-4 rounded-[var(--r-lg)] border p-5 text-left transition duration-300 ${
                      active
                        ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                        : 'border-[var(--editable-border)] bg-white hover:border-[var(--slot4-page-text)]/40'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        active ? 'bg-white/10 text-white' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{taskLabelOf(item.key)}</p>
                      <p className={`mt-1 text-xs leading-6 ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </EditableReveal>

          <EditableReveal delay={140} className="mt-12 lg:mt-0">
            <form
              onSubmit={submit}
              className="rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(22,22,22,0.20)] sm:p-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                    New {activeLabel.toLowerCase()}
                  </p>
                  <h2 className="editable-display mt-1 text-2xl leading-tight tracking-[-0.015em]">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em]">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={field} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Collection / shelf" />
                  <input className={field} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Resource URL" />
                </div>
                <input className={field} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Cover image URL (optional)" />
                <textarea className={`${textarea} min-h-28`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One-line summary — why this earns a spot on the shelf." required />
                <textarea className={`${textarea} min-h-56`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notes, context, quotes worth remembering..." required />
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-3 rounded-[var(--r-md)] border border-[var(--slot4-accent-green)]/40 bg-[color-mix(in_oklab,var(--slot4-accent-green)_10%,white)] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--slot4-accent-green)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--slot4-page-text)]">
                      {pagesContent.create.successTitle}
                    </p>
                    <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">
                      Filed as {created.title}
                    </p>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-4 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
