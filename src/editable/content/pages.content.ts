import { slot4BrandConfig } from '@/editable/theme/brand.config'

/*
  Copy is written for a bookmarks / collections / resources site.
  Never say "social bookmarking" (renamed to "The Library") or
  "profiles" (hidden from public UI) in user-visible text.
*/
export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — a quiet home for the internet worth keeping`,
      description:
        'Save any link, sort it into a collection, come back and it is still there. Curated bookmarks and resources, kept tidy.',
      openGraphTitle: `${slot4BrandConfig.siteName} — the Library`,
      openGraphDescription:
        'A quiet home for the internet worth keeping. Curated collections of bookmarks, tools, references and reading.',
      keywords: ['bookmarks', 'collections', 'resources', 'curated links', 'reference'],
    },
    hero: {
      badge: 'Welcome to The Library',
      title: ['Discover something', 'worth your time.'],
      description:
        'A calmer way to browse, explore and find what matters — one thoughtfully curated collection at a time.',
      primaryCta: { label: 'Start exploring', href: '/sbm' },
      secondaryCta: { label: 'Browse collections', href: '/sbm' },
      searchPlaceholder: 'Search anything…',
      focusLabel: 'In focus',
      featureCardBadge: 'Editor’s pick',
      featureCardTitle: 'A standout worth your attention.',
      featureCardDescription:
        'Every collection surfaces one Editor’s pick — the piece we think is worth spending time with.',
    },
    intro: {
      badge: 'How the Library works',
      title: 'Not a feed. A shelf.',
      paragraphs: [
        'Feeds forget. Shelves remember. Every resource you save stays exactly where you put it — no re-ranking, no timeline, no algorithm deciding what you see next.',
        'Collections are shelves. Move a link between them whenever you rethink it. Make a shelf public and it gets its own clean page you can share; keep it private and it is only for you.',
        'The Library is browsable without an account. You only sign in when you want to add your own resources or build private shelves.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A quiet index of the internet worth keeping.',
        'Save from anywhere, come back and it is still there.',
        'Shelves are searchable and shareable.',
        'Private by default; public when you want.',
      ],
      primaryLink: { label: 'Open the Library', href: '/sbm' },
      secondaryLink: { label: 'Browse collections', href: '/sbm' },
    },
    cta: {
      badge: 'Start a shelf',
      title: 'Your best links, kept somewhere they will last.',
      description:
        'Sign in, save a link, drop it on a shelf. That is the entire onboarding — everything else grows from there.',
      primaryCta: { label: 'Get started', href: '/signup' },
      secondaryCta: { label: 'Say hello', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest on {label}',
      descriptionSuffix: 'Fresh additions to the shelf.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'The web deserves a quieter place to keep the good bits.',
    description: `${slot4BrandConfig.siteName} is a home for bookmarks, collections and references that would otherwise get lost in bookmark folders and read-later apps.`,
    paragraphs: [
      'Most tools want to show you what is new. This one wants to remember what was good — long after the tab is closed and the feed has moved on.',
      'Every resource here has been added by a curator on purpose. No scraping, no algorithmic surfacing. Just tidy shelves you can reach for when you actually need something.',
      'Browse without an account. Sign in when you want to keep your own shelf.',
    ],
    values: [
      {
        title: 'Kept, not surfaced',
        description:
          'No feed to scroll, no ranking to fight. Every collection stays exactly the shape its curator gave it.',
      },
      {
        title: 'Shelves, not silos',
        description:
          'Move a resource between shelves any time. Split a shelf when it grows too broad. The structure follows the ideas, not the other way around.',
      },
      {
        title: 'Quiet by design',
        description:
          'No notifications, no streaks, no engagement metrics on your screen. Just an index of things you might want to come back to.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'A resource, a shelf idea, a bug report — the inbox is real.',
    description:
      'Send us a link that belongs on a shelf, an idea for a whole new collection, an application to become a curator, or anything else on your mind.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: `Search — ${slot4BrandConfig.siteName}`,
      description: 'Search across every public shelf on the Library.',
    },
    hero: {
      badge: 'Search the Library',
      title: 'Find any resource on any shelf.',
      description:
        'Type a keyword, narrow to a collection, and dig through every public shelf. Indexed continuously — nothing important goes missing.',
      placeholder: 'Search resources, collections, curators…',
    },
    resultsTitle: 'Everything on the shelf right now',
  },
  create: {
    metadata: {
      title: `Submit a resource — ${slot4BrandConfig.siteName}`,
      description: 'Add a bookmark, tool, or reference to your shelves.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Sign in to add to the shelves.',
      description:
        'Only signed-in curators can add resources. It is free — sign in or create an account and the workspace opens up.',
    },
    hero: {
      badge: 'Curator workspace',
      title: 'Add a resource to the shelf.',
      description:
        'Drop a URL, pick a shelf, add a note. Nothing more required — you can flesh it out later.',
    },
    formTitle: 'Resource details',
    submitLabel: 'File on the shelf',
    successTitle: 'Filed successfully.',
  },
  auth: {
    login: {
      metadataDescription: `Log back into ${slot4BrandConfig.siteName}.`,
      badge: 'Curator access',
      title: 'Welcome back to the shelves.',
      description:
        'Log in to add resources, tidy your collections, and keep the shelves the way you left them.',
      formTitle: 'Log in',
      submitLabel: 'Continue',
      noAccount: 'No account matched — create one first, then log in.',
      success: 'Signed in. Taking you to the shelves…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create an account on ${slot4BrandConfig.siteName}.`,
      badge: 'Start a shelf',
      title: 'One account, endless shelves.',
      description:
        'Create an account to start saving resources, building collections, and keeping the internet you actually use.',
      formTitle: 'Create your account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for your password.',
      success: 'Account created. Opening the shelves…',
      loginCta: 'Log in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More notes on the shelf',
      fallbackTitle: 'Note',
    },
    listing: {
      relatedTitle: 'More in the directory',
      fallbackTitle: 'Directory record',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Visual',
    },
    profile: {
      relatedTitle: 'From this curator',
      fallbackDescription: 'Curator page — direct link only.',
      visitButton: 'Visit website',
    },
  },
} as const
