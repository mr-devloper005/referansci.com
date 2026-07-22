import { slot4BrandConfig } from '@/editable/theme/brand.config'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

/*
  Public UI is bookmarks/collections/resources first — the "Library" of
  curated finds. `profile` is functional (direct-URL access still works
  and its detail view stays functional) but must never surface anywhere
  in the public UI: no navbar item, no home lane, no search filter
  option, no create option, no listing archive promo. Enforce with the
  one rule below and consume it via `isUiHiddenTask`.
*/
export const uiHiddenTaskKeys = ['profile'] as const

export const isUiHiddenTask = (key: string) =>
  (uiHiddenTaskKeys as readonly string[]).includes(key)

/*
  User-visible label overrides. Task keys/routes stay stable
  (SITE_CONFIG.tasks.sbm.route === '/sbm' → '/sbm/[slug]') but everywhere
  the label reaches the user we say "The Library". Person concept: "Curators".
*/
export const taskLabelOverrides: Partial<Record<TaskKey, string>> = {
  sbm: 'The Library',
}

export const taskPersonOverrides: Partial<Record<TaskKey, string>> = {
  sbm: 'Curators',
}

export function taskLabelOf(key: TaskKey): string {
  return (
    taskLabelOverrides[key] ||
    SITE_CONFIG.tasks.find((task) => task.key === key)?.label ||
    key
  )
}

/** Enabled tasks minus anything the public UI must hide. */
export function visibleTasks() {
  return SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key))
}

/** First enabled non-hidden task — used to pick the public "home" lane. */
export function primaryVisibleTask(): TaskKey {
  return (visibleTasks()[0]?.key || 'sbm') as TaskKey
}

/*
  Featured collections shown in the home hero rail, home grid, marquee and
  footer. These use the REAL category taxonomy from `@/lib/categories`, so
  clicking one on any surface lands on `/sbm?category=<slug>` and filters
  correctly through the archive's `normalizeCategory` pipeline.

  Per-slug icon + palette overrides make each shelf card visually
  distinct instead of showing the same three preview avatars. Slugs
  without an explicit override fall back to `defaultCollectionTheme`.
*/

export type CollectionTheme = {
  slug: string
  label: string
  /** short blurb shown under the label on shelf cards */
  blurb: string
  /** Accent CSS var name from design-contract (`--slot4-accent-*`). */
  accentVar: `--slot4-accent${'' | '-pink' | '-amber' | '-green' | '-purple' | '-blue' | '-coral'}`
  /** Icon slug we resolve to a lucide icon in components. */
  icon:
    | 'briefcase' | 'heart-pulse' | 'cpu' | 'landmark' | 'hammer'
    | 'car' | 'plane' | 'pencil' | 'shopping-bag' | 'wrench'
    | 'coffee' | 'sparkles' | 'paw-print' | 'utensils' | 'armchair'
    | 'plug' | 'briefcase-business' | 'wallet' | 'bitcoin' | 'spade'
    | 'leaf' | 'share2' | 'trophy' | 'palette' | 'clapperboard'
    | 'truck' | 'graduation-cap' | 'baby' | 'scale' | 'shirt'
    | 'camera' | 'lock' | 'calendar' | 'code' | 'newspaper' | 'factory'
    | 'book-open'
}

const collectionThemeMap: Record<string, Omit<CollectionTheme, 'slug' | 'label'>> = {
  business:                  { blurb: 'Playbooks, ops and strategy',      accentVar: '--slot4-accent',        icon: 'briefcase' },
  health:                    { blurb: 'Longevity, care and clinics',      accentVar: '--slot4-accent-green',  icon: 'heart-pulse' },
  technology:                { blurb: 'Deep tech and what’s next',        accentVar: '--slot4-accent-blue',   icon: 'cpu' },
  'real-estate':             { blurb: 'Property, land and rentals',       accentVar: '--slot4-accent-amber',  icon: 'landmark' },
  'home-improvement':        { blurb: 'DIY, renovations and gear',        accentVar: '--slot4-accent-coral',  icon: 'hammer' },
  automotive:                { blurb: 'Cars, EVs and maintenance',        accentVar: '--slot4-accent',        icon: 'car' },
  travel:                    { blurb: 'Destinations and long trips',      accentVar: '--slot4-accent-purple', icon: 'plane' },
  blog:                      { blurb: 'Independent writing worth reading', accentVar: '--slot4-accent-pink',  icon: 'pencil' },
  shopping:                  { blurb: 'Shops, sales and marketplaces',    accentVar: '--slot4-accent-amber',  icon: 'shopping-bag' },
  service:                   { blurb: 'Trusted people who do the work',   accentVar: '--slot4-accent-blue',   icon: 'wrench' },
  lifestyle:                 { blurb: 'Living well, quietly',             accentVar: '--slot4-accent-pink',   icon: 'coffee' },
  beauty:                    { blurb: 'Skincare and cosmetics',           accentVar: '--slot4-accent-pink',   icon: 'sparkles' },
  'pet-animal':              { blurb: 'Care, food and companions',        accentVar: '--slot4-accent-green',  icon: 'paw-print' },
  food:                      { blurb: 'Restaurants, recipes and pantry',  accentVar: '--slot4-accent-coral',  icon: 'utensils' },
  furniture:                 { blurb: 'Chairs, tables, and the room',     accentVar: '--slot4-accent-amber',  icon: 'armchair' },
  electric:                  { blurb: 'Wiring, energy and the grid',      accentVar: '--slot4-accent-amber',  icon: 'plug' },
  'jobs-payroll':            { blurb: 'Hiring, HR and remote work',       accentVar: '--slot4-accent-blue',   icon: 'briefcase-business' },
  finance:                   { blurb: 'Money, markets and personal',      accentVar: '--slot4-accent-green',  icon: 'wallet' },
  crypto:                    { blurb: 'Chains, tokens and infra',         accentVar: '--slot4-accent-purple', icon: 'bitcoin' },
  casino:                    { blurb: 'Games, tables and iGaming',        accentVar: '--slot4-accent-coral',  icon: 'spade' },
  cbd:                       { blurb: 'Wellness and cannabinoids',        accentVar: '--slot4-accent-green',  icon: 'leaf' },
  'social-media':            { blurb: 'Platforms, tools and creators',    accentVar: '--slot4-accent-blue',   icon: 'share2' },
  'game-sports':             { blurb: 'Play, teams and equipment',        accentVar: '--slot4-accent',        icon: 'trophy' },
  arts:                      { blurb: 'Craft, exhibitions and galleries', accentVar: '--slot4-accent-purple', icon: 'palette' },
  entertainment:             { blurb: 'Film, music and everything on',    accentVar: '--slot4-accent-pink',   icon: 'clapperboard' },
  'shipping-transportation': { blurb: 'Freight, logistics and last-mile', accentVar: '--slot4-accent-blue',   icon: 'truck' },
  education:                 { blurb: 'Courses, tutors and school',       accentVar: '--slot4-accent-amber',  icon: 'graduation-cap' },
  'family-parenting':        { blurb: 'Kids, home and routines',          accentVar: '--slot4-accent-coral',  icon: 'baby' },
  'law-legal':               { blurb: 'Advice, filings and firms',        accentVar: '--slot4-accent',        icon: 'scale' },
  fashion:                   { blurb: 'Clothes, brands and style',        accentVar: '--slot4-accent-pink',   icon: 'shirt' },
  photography:               { blurb: 'Cameras, prints and portfolios',   accentVar: '--slot4-accent-blue',   icon: 'camera' },
  adult:                     { blurb: 'For grown-ups only',               accentVar: '--slot4-accent',        icon: 'lock' },
  event:                     { blurb: 'Conferences, meetups and dates',   accentVar: '--slot4-accent-purple', icon: 'calendar' },
  digital:                   { blurb: 'Software, agencies and SaaS',      accentVar: '--slot4-accent-blue',   icon: 'code' },
  news:                      { blurb: 'What happened today',              accentVar: '--slot4-accent',        icon: 'newspaper' },
  'industry-manufacturing':  { blurb: 'Factories, materials and supply',  accentVar: '--slot4-accent-amber',  icon: 'factory' },
}

const defaultCollectionTheme: Omit<CollectionTheme, 'slug' | 'label'> = {
  blurb: 'Curated resources',
  accentVar: '--slot4-accent',
  icon: 'book-open',
}

/**
 * The full collection catalog — every archive category, themed.
 * Order = archive display order (from `CATEGORY_OPTIONS`).
 */
export const featuredCollections: readonly CollectionTheme[] = CATEGORY_OPTIONS.map(
  ({ slug, name }) => ({
    slug,
    label: name,
    ...(collectionThemeMap[slug] || defaultCollectionTheme),
  }),
)

export const topCollections = featuredCollections.slice(0, 12)
export const marqueeCollections = featuredCollections.slice(0, 18)
export const footerCollections = featuredCollections.slice(0, 8)

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated collections of resources worth keeping',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated collections of resources',
    // Task links removed by rule — navbar shows About + Contact + search + auth only.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Open the Library', href: '/sbm' },
      secondary: { label: 'Submit a resource', href: '/create' },
    },
  },
  footer: {
    tagline: 'A living index of resources worth keeping.',
    description:
      'Bookmarks, collections and references — curated, sorted, and easy to come back to.',
    columns: [
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'A quiet home for the internet you want to remember.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'Browse all',
    explore: 'Browse',
    latest: 'Just added',
    related: 'From this collection',
    published: 'Added',
  },
} as const
