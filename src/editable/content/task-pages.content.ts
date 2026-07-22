import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Voices for each task's archive page. The primary voice is `sbm` (The
  Library) — the rest are kept so other task routes stay presentable
  when hit directly, but they never surface in the public UI navigation.
*/
export const taskPageVoices = {
  article: {
    eyebrow: 'Reading shelf',
    headline: 'Notes and long-reads worth keeping.',
    description:
      'Long-form pieces we keep coming back to — bookmarked, tagged and easier to find than in the wild.',
    filterLabel: 'Choose a shelf',
    secondaryNote: 'Reading rewards a calm surface.',
    chips: ['Long-reads', 'Notes', 'Guides'],
  },
  classified: {
    eyebrow: 'Board',
    headline: 'Time-sensitive finds and offers.',
    description:
      'A quick-scan board of things moving fast. Curated, brief, and action-oriented.',
    filterLabel: 'Filter board',
    secondaryNote: 'Speed and clarity first.',
    chips: ['Fast scan', 'Offers', 'Now'],
  },
  sbm: {
    eyebrow: 'The Library',
    headline: 'Collections of the internet worth keeping.',
    description:
      'Every shelf is a curated collection of bookmarks, tools and references. Filed by hand — no algorithm, no feed, no re-ranking.',
    filterLabel: 'Pick a shelf',
    secondaryNote: 'Shelves stay the shape their curators gave them.',
    chips: ['Curated', 'Shelves', 'Kept, not surfaced'],
  },
  profile: {
    // Public UI never exposes this voice (profile is hidden). Kept for
    // direct-URL access only.
    eyebrow: 'Curators',
    headline: 'The people behind the shelves.',
    description:
      'Curator pages are direct-URL only — a quiet page to send someone if they ask who filed a particular shelf.',
    filterLabel: 'Filter curators',
    secondaryNote: 'Identity, credit, links.',
    chips: ['Identity', 'Credit', 'Links'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Downloadable references, briefs and reports.',
    description:
      'PDFs worth keeping around — briefs, guides, papers, and reports we reach for by name.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Archive-quality references.',
    chips: ['Downloadable', 'References', 'Briefs'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Places, services and businesses worth remembering.',
    description:
      'A working directory of businesses and services — with the metadata you actually need to pick between them.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Trust cues over marketing.',
    chips: ['Directory', 'Comparable', 'Trusted'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'A gallery-first shelf of images.',
    description:
      'Image-led collections — cover art, screenshots, references worth keeping in one place.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'The picture leads.',
    chips: ['Gallery', 'Visual-first', 'Reference'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
