// ──────────────────────────────────────────────────────────────────────────
// src/data/projects.js
//
// Portfolio projects shown on the Home page.
//
// To add a screenshot:
//   1. Drop the image in public/images/ (e.g. public/images/parks-screenshot.png)
//   2. Set screenshot: '/images/parks-screenshot.png' on the project entry.
//      The placeholder gradient will automatically be replaced by the image.
// ──────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
  {
    id: 'parks',
    name: 'National Parks Explorer',
    tagline: 'Full-stack NPS companion app',
    description:
      'Search and explore all 400+ parks in the National Park Service database, ' +
      'save favorites, plan multi-park trips, and track activities and hikes. ' +
      'Auth via Google OAuth; trips support drag-and-drop reordering.',
    url: 'https://parks.christinasheppard.com',
    github: [
      { label: 'client', href: 'https://github.com/cshepscorp/parks-client' },
      { label: 'api', href: 'https://github.com/cshepscorp/parks-api' },
    ],
    tags: ['React 19', 'Tailwind v4', 'Mapbox GL', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Google OAuth'],
    // Gradient colors used as placeholder until a screenshot is supplied.
    // Evokes the NPS green + sky palette.
    gradientFrom: '#1a3a2a',
    gradientTo: '#0c1018',
    screenshot: '/images/parks-screenshot.png',
  },
  {
    id: 'mtg_grimoire',
    name: 'MTG Grimoire',
    tagline: 'Magic card art explorer',
    description:
      'A Magic: The Gathering portal built around the illustrators — browse cards ' +
      'by artist, set, or color, flip dual-faced cards, read AI-generated lore ' +
      'via the Claude API, and chat with an agentic deck advisor.',
    url: 'https://main.d2mcrtpcc8h6pd.amplifyapp.com',
    github: [
      { label: 'repo', href: 'https://github.com/cshepscorp/mtg-grimoire' },
    ],
    tags: ['Next.js', 'Claude API', 'Scryfall API', 'CSS Modules', 'AWS Amplify'],
    // Evokes MTG's deep-arcane purple + gold palette.
    gradientFrom: '#2a1a3a',
    gradientTo: '#0c1018',
    screenshot: '/images/mtg-screenshot.png',
  },
]
