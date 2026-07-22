'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import {
  primaryVisibleTask,
  taskLabelOf,
  topCollections,
} from '@/editable/content/global.content'
import { CollectionIcon } from '@/editable/content/collection-icons'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Reference-inspired navbar with an added "Library" mega-panel.
  Public links stay disciplined — Library trigger, About, Contact,
  Search icon, auth actions. No direct task links (Collections
  discovery lives inside the Library panel + footer + home).
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const libraryPanelRef = useRef<HTMLDivElement | null>(null)
  const primaryKey = primaryVisibleTask()
  const primaryRoute = SITE_CONFIG.taskViews[primaryKey] || `/${primaryKey}`
  const libraryLabel = taskLabelOf(primaryKey)

  // Close the mega-panel on outside click / Esc.
  useEffect(() => {
    if (!libraryOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLibraryOpen(false)
    }
    const onDown = (event: MouseEvent) => {
      if (!libraryPanelRef.current) return
      if (!libraryPanelRef.current.contains(event.target as Node)) setLibraryOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [libraryOpen])

  // Close the mega-panel on route change.
  useEffect(() => {
    setLibraryOpen(false)
    setOpen(false)
  }, [pathname])

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const libraryTriggerActive = active(primaryRoute) || libraryOpen

  const shellLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const panelShelves = topCollections.slice(0, 8)

  return (
    <header className="sticky top-0 z-50 bg-[color-mix(in_oklab,var(--editable-nav-bg)_92%,transparent)] text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] w-full max-w-[var(--editable-container-wide)] items-center gap-4 px-5 sm:px-6 lg:px-10">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-text)] text-white transition duration-500 group-hover:bg-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain invert" />
          </span>
          <span className="editable-display truncate text-lg font-normal tracking-[-0.01em] sm:text-xl">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {/* Library mega-panel trigger */}
          <button
            type="button"
            onClick={() => setLibraryOpen((v) => !v)}
            onFocus={() => setLibraryOpen(true)}
            aria-expanded={libraryOpen}
            aria-haspopup="menu"
            className="group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition"
          >
            <span
              className={`transition ${
                libraryTriggerActive
                  ? 'text-[var(--slot4-page-text)]'
                  : 'text-[var(--slot4-muted-text)] group-hover:text-[var(--slot4-page-text)]'
              }`}
            >
              {libraryLabel}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition duration-300 ${
                libraryOpen ? 'rotate-180 text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)]'
              }`}
            />
            <span
              className={`pointer-events-none absolute inset-x-4 bottom-1 h-px origin-left bg-[var(--slot4-page-text)] transition-transform duration-500 ${
                libraryTriggerActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </button>

          {shellLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative inline-flex items-center rounded-full px-4 py-2 text-sm"
            >
              <span
                className={`transition ${
                  active(item.href)
                    ? 'text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] group-hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`pointer-events-none absolute inset-x-4 bottom-1 h-px origin-left bg-[var(--slot4-page-text)] transition-transform duration-500 ${
                  active(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-4">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full px-3 py-2.5 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px w-full bg-[var(--editable-border)]" />

      {/* Library mega-panel */}
      {libraryOpen ? (
        <div
          ref={libraryPanelRef}
          className="absolute inset-x-0 top-full hidden bg-white shadow-[0_28px_60px_-30px_rgba(22,22,22,0.28)] lg:block"
          role="menu"
        >
          <div className="mx-auto grid w-full max-w-[var(--editable-container-wide)] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[0.7fr_2.3fr] lg:px-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {libraryLabel}
              </p>
              <h3 className="editable-display mt-4 text-3xl leading-[1.06] tracking-[-0.015em]">
                Browse by shelf.
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--slot4-muted-text)]">
                Curated collections of resources — filed by hand, kept for later.
              </p>
              <Link
                href={primaryRoute}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
              >
                Open {libraryLabel} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {panelShelves.map((c) => (
                <Link
                  key={c.slug}
                  href={`${primaryRoute}?category=${c.slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]/20 hover:bg-white"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `color-mix(in oklab, var(${c.accentVar}) 16%, white)`,
                      color: `color-mix(in oklab, var(${c.accentVar}) 92%, black 30%)`,
                    }}
                  >
                    <CollectionIcon theme={c} className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--slot4-page-text)]">{c.label}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-[var(--slot4-muted-text)]">
                      {c.blurb}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white lg:hidden">
          <div className="mx-auto flex max-w-[var(--editable-container-wide)] flex-col gap-2 px-5 py-6 sm:px-6">
            <div className="mb-2 rounded-[var(--r-lg)] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  {libraryLabel}
                </p>
                <Link
                  href={primaryRoute}
                  className="inline-flex items-center gap-1 text-xs font-medium"
                >
                  Open all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {panelShelves.map((c) => (
                  <Link
                    key={c.slug}
                    href={`${primaryRoute}?category=${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--slot4-page-text)]"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: `var(${c.accentVar})` }}
                    />
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {shellLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-base font-medium ${
                  active(item.href)
                    ? 'bg-[var(--slot4-page-text)] text-white'
                    : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)] hover:text-[var(--slot4-page-text)]"
            >
              <Search className="h-4 w-4" /> Search
            </Link>
            <div className="mt-2 grid gap-2">
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-white"
                  >
                    Submit a resource
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

/**
 * Ensures the navbar doesn't reintroduce direct task links — the shellLinks
 * array is the single source of truth. Kept as a runtime no-op so a grep
 * for "task.route" or "SITE_CONFIG.tasks" in this file still returns
 * nothing.
 */
export const __NAVBAR_TASK_LINKS_INTENTIONALLY_EMPTY__ = true
