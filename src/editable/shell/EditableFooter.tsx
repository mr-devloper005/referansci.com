'use client'

import Link from 'next/link'
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import {
  footerCollections,
  globalContent,
  primaryVisibleTask,
  taskLabelOf,
} from '@/editable/content/global.content'
import { CollectionIcon } from '@/editable/content/collection-icons'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Premium footer:
  brand column (with primary CTA into the Library)
  · Collections (real archive categories, iconified per shelf)
  · Site links
  · Newsletter form
  · Legal + social row on a hairline separator.
*/
export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const primaryKey = primaryVisibleTask()
  const primaryRoute =
    SITE_CONFIG.taskViews[primaryKey] ||
    SITE_CONFIG.tasks.find((task) => task.key === primaryKey)?.route ||
    `/${primaryKey}`
  const libraryLabel = taskLabelOf(primaryKey)
  const brandName = SITE_CONFIG.name

  const siteColumn = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Search', href: '/search' },
    ...(session
      ? [{ label: 'Submit a resource', href: '/create' }]
      : [{ label: 'Log in', href: '/login' }, { label: 'Get started', href: '/signup' }]),
  ]

 

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Top display band — big brand statement over a soft gradient */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: 'var(--slot4-accent)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: 'var(--slot4-accent-pink)' }}
        />
        <div className="relative mx-auto grid w-full max-w-[var(--editable-container-wide)] items-end gap-8 px-5 pb-14 pt-20 sm:px-6 lg:grid-cols-[1.4fr_0.9fr] lg:px-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
              {globalContent.footer.tagline}
            </p>
            <h2 className="editable-display mt-6 text-balance text-4xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
              {libraryLabel}. Kept, not surfaced.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)] hover:text-white"
            >
              Open {libraryLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-white transition hover:border-white/60"
            >
              Say hello <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container-wide)] gap-14 px-5 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.2fr_1.4fr_0.8fr_1fr] lg:gap-16 lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white text-[var(--slot4-page-text)]">
              <img src="/favicon.png?v=20260413" alt={brandName} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-xl">{brandName}</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
            {globalContent.footer.description}
          </p>

          
        </div>

        {/* Collections column — REAL archive categories, per-shelf icon + accent */}
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            Collections
          </h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {footerCollections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${primaryRoute}?category=${c.slug}`}
                  className="group flex items-center gap-3 rounded-full border border-transparent px-2 py-1.5 text-sm text-white/75 transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: `color-mix(in oklab, var(${c.accentVar}) 22%, transparent)`,
                      color: `color-mix(in oklab, var(${c.accentVar}) 85%, white 15%)`,
                    }}
                  >
                    <CollectionIcon theme={c} className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="truncate">{c.label}</span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={primaryRoute}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white"
          >
            View every shelf <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">Site</h3>
          <ul className="mt-6 grid gap-3">
            {siteColumn.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {session ? (
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-sm text-white/75 transition hover:text-white"
                >
                  Log out
                </button>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
            Newsletter
          </h3>
          <p className="mt-6 text-sm leading-7 text-white/70">
            One quiet email a week — the best resources added to {brandName}.
          </p>
          <form
            action="/contact"
            className="mt-5 flex items-center gap-2 rounded-full bg-white/[0.05] p-1.5 backdrop-blur"
          >
            <input
              type="email"
              name="email"
              placeholder="you@domain.com"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)] hover:text-white"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-white/40">No spam. Unsubscribe with one click.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container-wide)] flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-10">
          <span>
            © {year} {brandName}. {globalContent.footer.bottomNote}
          </span>
          <div className="inline-flex items-center gap-6">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/search" className="hover:text-white">Search</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
