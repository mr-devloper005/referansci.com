import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Layers, ShieldCheck, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Log in', description: pagesContent.auth.login.metadataDescription })
}

const perks = [
  { icon: Bookmark, label: 'Save any link in seconds' },
  { icon: Layers, label: 'Organise shelves the way you think' },
  { icon: ShieldCheck, label: 'Private by default, public when you want' },
]

export default function LoginPage() {
  const brand = SITE_CONFIG.name
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[var(--editable-container-wide)] items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-28">
          <EditableReveal className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
              {pagesContent.auth.login.badge}
            </span>
            <h1 className="editable-display mt-8 max-w-xl text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.auth.login.description}
            </p>
            <ul className="mt-10 grid gap-4">
              {perks.map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-sm text-[var(--slot4-page-text)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
                    <p.icon className="h-4 w-4" />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>
          </EditableReveal>

          <EditableReveal delay={120} className="order-1 lg:order-2">
            <div className="rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-white p-8 shadow-[0_30px_70px_-30px_rgba(22,22,22,0.25)] sm:p-10">
              <h2 className="editable-display text-3xl leading-tight tracking-[-0.015em]">
                {pagesContent.auth.login.formTitle}
              </h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">
                Log back into your {brand} shelves.
              </p>
              <EditableLocalLoginForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                First time here?{' '}
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 font-medium text-[var(--slot4-page-text)] underline-offset-4 hover:underline"
                >
                  {pagesContent.auth.login.createCta} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
