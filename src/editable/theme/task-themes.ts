import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces (Slot 5) — cohesive with the reference:
  whitesmoke page, near-black text, warm orange accent, Boldonse display,
  Inter Tight body. Per-task copy still varies (kicker / note) so each
  surface keeps a distinct voice; tokens are delivered via `--tk-*` vars.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FONT_DISPLAY = "'Boldonse', 'Inter Tight', ui-serif, Georgia, serif"
const FONT_BODY = "'Inter Tight', 'Space Grotesk', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: FONT_DISPLAY,
  fontBody: FONT_BODY,
  bg: '#f5f5f5',
  surface: '#ffffff',
  raised: '#f0f0f0',
  text: '#161616',
  muted: '#4b4b4b',
  line: '#dddddd',
  accent: '#ff742e',
  accentSoft: '#fff1e7',
  onAccent: '#ffffff',
  glow: 'rgba(255,116,46,0.10)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Notes', note: 'Long-reads and guides worth your time.' },
  listing: { ...base, kicker: 'Directory', note: 'Places, businesses and services worth knowing.' },
  classified: { ...base, kicker: 'Board', note: 'Fresh offers ready to act on.' },
  image: { ...base, kicker: 'Visuals', note: 'A visual feed of standout images.' },
  sbm: { ...base, kicker: 'The Library', note: 'Curated collections of resources and links worth keeping.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, briefs and references.' },
  profile: { ...base, kicker: 'Curators', note: 'People behind the collections.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
