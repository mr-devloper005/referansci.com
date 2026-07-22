import type { CSSProperties } from 'react'

/*
  Design contract for Slot 5 — mapped from reels-wbs.webflow.io (Ruma):
  Boldonse display + Interdisplay body, whitesmoke page, near-black text,
  warm orange accent, fully-pill buttons (100px radius), soft hairline
  borders, cards with rounded-lg to rounded-xl radii, and generous
  section spacing (100–200px vertical rhythm).
*/

export const editableRootStyle = {
  // Palette (reference-mapped, but kept keyed the same so nothing else moves).
  '--slot4-page-bg': '#f5f5f5',
  '--slot4-page-text': '#161616',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-raised-bg': '#e8e8e8',
  '--slot4-muted-text': '#4b4b4b',
  '--slot4-soft-muted-text': '#8b8b8b',

  '--slot4-accent': '#ff742e',
  '--slot4-accent-fill': '#ff742e',
  '--slot4-accent-soft': '#fff1e7',
  '--slot4-accent-strong': '#e15a1d',
  '--slot4-on-accent': '#ffffff',

  '--slot4-dark-bg': '#161616',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#e8e8e8',
  '--slot4-cream': '#fff8ef',
  '--slot4-warm': '#faf5ee',
  '--slot4-lavender': '#f2ecff',
  '--slot4-gray': '#f0f0f0',
  '--slot4-body-gradient': 'none',

  // Playful accent set from the reference — used sparingly for chip color.
  '--slot4-accent-pink': '#ffaee7',
  '--slot4-accent-amber': '#ffba43',
  '--slot4-accent-green': '#33c791',
  '--slot4-accent-purple': '#8763ff',
  '--slot4-accent-blue': '#529dff',
  '--slot4-accent-coral': '#f2a0a0',

  // Shell-level shared vars.
  '--editable-page-bg': '#f5f5f5',
  '--editable-page-text': '#161616',
  '--editable-container': '1340px',
  '--editable-container-wide': '1660px',
  '--editable-container-narrow': '920px',
  '--editable-border': '#dddddd',
  '--editable-border-soft': '#e8e8e8',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#161616',
  '--editable-nav-active': '#ff742e',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#161616',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#161616',
  '--editable-footer-text': '#f5f5f5',

  // Radii — pill-forward, matching reference `--border-radius--*`.
  '--r-xs': '6px',
  '--r-sm': '10px',
  '--r-md': '16px',
  '--r-lg': '20px',
  '--r-xl': '30px',
  '--r-xxl': '50px',
  '--r-pill': '100px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  softBorder: 'border-[var(--editable-border-soft)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(22,22,22,0.04)]',
  shadowMd: 'shadow-[0_10px_30px_-12px_rgba(22,22,22,0.16)]',
  shadowStrong: 'shadow-[0_30px_60px_-24px_rgba(22,22,22,0.22)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(22,22,22,0.02),rgba(22,22,22,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10',
    sectionWide: 'mx-auto w-full max-w-[var(--editable-container-wide)] px-5 sm:px-6 lg:px-10',
    sectionNarrow: 'mx-auto w-full max-w-[var(--editable-container-narrow)] px-5 sm:px-6 lg:px-10',
    sectionY: 'py-16 sm:py-24 lg:py-32',
    sectionYTight: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.28em]',
    kicker: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-page-text)] backdrop-blur',
    heroDisplay: 'editable-display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[6.25rem] xl:text-[7rem]',
    heroTitle: 'editable-display text-4xl leading-[1.04] sm:text-5xl lg:text-[3.75rem]',
    sectionTitle: 'editable-display text-3xl leading-[1.08] sm:text-4xl lg:text-[3.125rem]',
    subhead: 'text-base leading-relaxed sm:text-lg text-[var(--slot4-muted-text)]',
    body: 'text-base leading-relaxed text-[var(--slot4-muted-text)]',
    lede: 'text-lg leading-8 text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--r-lg)] border ${editablePalette.softBorder} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    cardHover: `rounded-[var(--r-lg)] border ${editablePalette.softBorder} ${editablePalette.surfaceBg} ${editablePalette.shadow} transition duration-500 hover:-translate-y-1 hover:${editablePalette.shadowMd}`,
    soft: `rounded-[var(--r-lg)] border ${editablePalette.softBorder} bg-white/70 backdrop-blur`,
    dark: `rounded-[var(--r-xl)] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    band: `rounded-[var(--r-xxl)] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    pillChip: `inline-flex items-center gap-2 rounded-full border ${editablePalette.softBorder} bg-white px-4 py-1.5 text-xs font-medium`,
  },
  button: {
    primary:
      'group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent)] hover:text-white active:scale-[0.98]',
    accent:
      'group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-accent-strong)] active:scale-[0.98]',
    ghost:
      'group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-page-text)]/25 bg-transparent px-6 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white active:scale-[0.98]',
    subtle:
      'group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] border border-[var(--editable-border)] transition duration-300 hover:border-[var(--slot4-page-text)] active:scale-[0.98]',
    icon:
      'flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--r-lg)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/9]',
    ratioSquare: 'aspect-square',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(22,22,22,0.22)]',
    zoom: 'transition duration-700 group-hover:scale-[1.05]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Update editableRootStyle for palette-wide changes; everything downstream reads its --slot4-* vars.',
  'Wrap sections in <EditableReveal /> so scroll-in motion stays consistent with the reference.',
  'Use pill buttons (rounded-full) for CTAs; solid dark = primary, accent = brand action, ghost = secondary.',
  'Section rhythm should breathe — prefer dc.shell.sectionY (py-16→py-32) unless the section is compact.',
  'Every card should use `dc.surface.card` or `cardHover` — hairline border, radius-lg, subtle lift.',
  'Keep dynamic post fetching intact; do not swap in mock arrays.',
  'Never hardcode brand-name copy — read SITE_CONFIG.name.',
  'Do not render any UI for tasks listed in uiHiddenTaskKeys.',
] as const
