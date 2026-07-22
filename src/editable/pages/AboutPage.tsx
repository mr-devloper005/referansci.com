import Link from 'next/link'
import { ArrowUpRight, Bookmark, Compass, Layers, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

/*
  About is deliberately task-agnostic: it explains the site's purpose
  without pointing at any single task lane. Public UI never mentions
  "profiles" (see uiHiddenTaskKeys) or "social bookmarking" (renamed).
*/

const stats = [
  { icon: Bookmark, label: 'Resources indexed', value: '10k+' },
  { icon: Layers, label: 'Curated collections', value: '80+' },
  { icon: Compass, label: 'Fresh finds weekly', value: '120' },
]

export default function AboutPage() {
  const brand = SITE_CONFIG.name
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)]" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pt-24 sm:px-6 sm:pt-32 lg:px-10 lg:pt-40">
            <EditableReveal className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                {pagesContent.about.badge}
              </span>
              <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem]">
                {pagesContent.about.title}
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto mt-20 w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 lg:px-10">
          <EditableReveal className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-6">
                <s.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                <p className="editable-display mt-5 text-4xl tracking-[-0.02em]">{s.value}</p>
                <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">{s.label}</p>
              </div>
            ))}
          </EditableReveal>
        </section>

        {/* Narrative */}
        <section className="mx-auto mt-24 w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 sm:mt-32 lg:px-10">
          <EditableReveal className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                The why
              </p>
              <h2 className="editable-display mt-4 text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl">
                A quiet home for the internet worth keeping.
              </h2>
            </div>
            <div className="grid gap-5 text-lg leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </EditableReveal>
        </section>

        {/* Value cards */}
        <section className="mx-auto mt-24 w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 sm:mt-32 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {pagesContent.about.values.map((value, i) => (
              <EditableReveal key={value.title} index={i} step={90}>
                <div className="h-full rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
                    <Bookmark className="h-5 w-5" />
                  </span>
                  <h3 className="editable-display mt-6 text-2xl leading-tight tracking-[-0.015em]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-24 w-full max-w-[var(--editable-container-wide)] px-5 pb-24 sm:mt-32 sm:px-6 lg:px-10">
          <EditableReveal className="relative overflow-hidden rounded-[var(--r-xxl)] bg-[var(--slot4-page-text)] p-10 text-white sm:p-16 lg:p-24">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent)] opacity-45 blur-3xl" />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">
                Open the shelves
              </p>
              <h2 className="editable-display mt-6 text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">
                Start browsing {brand}.
              </h2>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/sbm"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)] hover:text-white"
                >
                  Open the Library <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white transition hover:border-white/60"
                >
                  Say hello
                </Link>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
