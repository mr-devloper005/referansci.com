import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Layers, ShieldCheck, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

const perks = [
  { icon: Bookmark, label: 'Save any link, from anywhere' },
  { icon: Layers, label: 'Sort by shelf, not by date' },
  { icon: ShieldCheck, label: 'Private by default — always' },
]

export default function SignupPage() {
  const brand = SITE_CONFIG.name
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[var(--editable-container-wide)] items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
          <EditableReveal className="rounded-[var(--r-xxl)] border border-[var(--editable-border)] bg-white p-8 shadow-[0_30px_70px_-30px_rgba(22,22,22,0.25)] sm:p-10">
            <h1 className="editable-display text-3xl leading-tight tracking-[-0.015em]">
              {pagesContent.auth.signup.formTitle}
            </h1>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">
              A minute now, a decade of tidy shelves later.
            </p>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="inline-flex items-center gap-1 font-medium text-[var(--slot4-page-text)] underline-offset-4 hover:underline"
              >
                {pagesContent.auth.signup.loginCta} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </EditableReveal>

          <EditableReveal delay={120}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
              {pagesContent.auth.signup.badge}
            </span>
            <h2 className="editable-display mt-8 max-w-xl text-balance text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
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
            <p className="mt-10 text-xs text-[var(--slot4-soft-muted-text)]">
              By creating an account you agree to keep your shelves in {brand} for the foreseeable future.
            </p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
