'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index — later items animate later. */
  index?: number
  /** Extra classes for the wrapper. */
  className?: string
  /** Element tag — defaults to div. */
  as?: keyof HTMLElementTagNameMap
  /** Reveal delay per-index step, in ms. */
  step?: number
  /** Base delay before staggering. */
  delay?: number
}

/*
  IntersectionObserver-driven fade + upward slide with an index-based stagger.
  The `editable-reveal` hidden state is applied only after mount so users
  running with JS disabled still see the content, and reduced-motion is
  respected via the CSS keyframe guard in editable-global.css.
*/
export function EditableReveal({
  children,
  index = 0,
  className = '',
  as = 'div',
  step = 90,
  delay = 0,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [mounted])

  const Tag = as as any
  const style: CSSProperties = { animationDelay: `${delay + index * step}ms` }
  const revealClass = mounted ? `editable-reveal ${visible ? 'is-visible' : ''}` : ''
  return (
    <Tag ref={ref as any} className={`${revealClass} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  )
}
