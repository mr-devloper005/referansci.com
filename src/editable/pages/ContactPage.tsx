'use client'

import { Bookmark, Layers, Mail, Sparkles, UserCheck } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { SITE_CONFIG } from '@/lib/site-config'

/*
  Contact page — copy leans into bookmark/collection language. The form
  component itself is untouched; only the surrounding layout and lanes
  copy are editable here.
*/
const lanes = [
  {
    icon: Bookmark,
    title: 'Suggest a resource',
    body: 'A link that belongs on a shelf. Drop it in — with or without a note about why it earns its spot.',
  },
  {
    icon: Layers,
    title: 'Propose a collection',
    body: 'Have a whole shelf in mind? Send us the theme and a handful of starting resources.',
  },
  {
    icon: UserCheck,
    title: 'Curator applications',
    body: 'Want to help maintain a shelf? Tell us the topic you know inside-out.',
  },
  {
    icon: Mail,
    title: 'Everything else',
    body: 'Press, partnerships, weird ideas, a bug report — the inbox is real and a human reads it.',
  },
]

export default function ContactPage() {
  const brand = SITE_CONFIG.name
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)]" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pt-24 sm:px-6 sm:pt-32 lg:px-10 lg:pt-40">
            <EditableReveal className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                {pagesContent.contact.eyebrow}
              </span>
              <h1 className="editable-display mt-8 text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
                {pagesContent.contact.title}
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.contact.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container-wide)] px-5 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-10 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditableReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                What you can send
              </p>
              <h2 className="editable-display mt-4 text-3xl leading-[1.06] tracking-[-0.015em] sm:text-4xl">
                Pick the lane that fits.
              </h2>
              <div className="mt-8 grid gap-4">
                {lanes.map((lane) => (
                  <div
                    key={lane.title}
                    className="rounded-[var(--r-lg)] border border-[var(--editable-border)] bg-white p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="editable-display text-xl leading-tight tracking-[-0.01em]">
                          {lane.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
                          {lane.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal delay={140} className="rounded-[var(--r-xl)] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(22,22,22,0.20)] sm:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                Write to {brand}
              </p>
              <h2 className="editable-display mt-3 text-3xl leading-tight tracking-[-0.015em]">
                {pagesContent.contact.formTitle}
              </h2>
              {/* Form component untouched — only the surrounding layout is editable. */}
              <EditableContactLeadForm />
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
