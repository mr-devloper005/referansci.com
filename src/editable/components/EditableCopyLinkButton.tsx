'use client'

import { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * Copy the current page URL. Used in the SBM detail action row.
 * The copied-state message auto-clears after ~1.4s.
 */
export function EditableCopyLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }, [])

  return (
    <button
      type="button"
      onClick={onCopy}
      className={
        className ||
        'inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]'
      }
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-[var(--tk-accent-green,#33c791)]" /> Link copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> Copy link
        </>
      )}
    </button>
  )
}
