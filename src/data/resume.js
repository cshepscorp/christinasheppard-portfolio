// ──────────────────────────────────────────────────────────────────────────
// src/data/resume.js
//
// SINGLE SOURCE OF TRUTH for the resume content shown on christinasheppard.com.
// The canonical document is public/christy_sheppard_resume.pdf. This file
// should mirror it. Resume.jsx and Home.jsx both import from here.
//
// Exception: WEB_SUMMARY is web-only copy and does NOT need to match the PDF.
//
// ── Living-document workflow ───────────────────────────────────────────────
// When the resume changes:
//   1. Update public/christy_sheppard_resume.pdf with the new export.
//   2. Edit the relevant fields in this file to match.
//   3. Bump RESUME_PDF_VERSION to today's date (YYYY-MM-DD). The version is
//      appended as ?v=... to the download URL, which busts CDN / browser
//      caches — visitors always get the fresh PDF on the next page load.
//   4. git commit && git push — AWS Amplify will auto-deploy.
//
// If you want an at-a-glance reminder of the sync rule, search this repo for
// "RESUME_PDF_VERSION" — that grep result is the short list of touch-points.
// ──────────────────────────────────────────────────────────────────────────

// Bump this when you replace the PDF. Any string change invalidates caches.
export const RESUME_PDF_VERSION = '2026-07-29';

// export const RESUME_PDF_PATH = `/christy_sheppard_resume.pdf?v=${RESUME_PDF_VERSION}`
export const RESUME_PDF_PATH = '/christy_sheppard_resume.pdf';

// Controls which career section layout renders on the home page.
// 'featured' — current role large + prominent, prior roles compact below
// 'stacked'  — all roles in a vertical list, most-recent-first
export const TIMELINE_LAYOUT = 'stacked';

export const CONTACT = {
  name: 'Christy Sheppard',
  location: 'Richmond, VA',
  email: 'sheppard.christy@gmail.com',
  // Phone is on the PDF but intentionally kept off the public site by default
  // (spam harvesting). Flip `showPhone` to true in Resume.jsx to render it.
  phone: '804-928-1876',
  linkedin: {
    label: '@christinasheppard',
    href: 'https://www.linkedin.com/in/christinasheppard/',
  },
  github: { label: '@cshepscorp', href: 'https://github.com/cshepscorp' },
  site: 'christinasheppard.com',
};

// Web-only summary — intentionally NOT mirrored in the PDF.
// Shown on the Home page hero. Edit freely; no PDF sync required.
export const WEB_SUMMARY =
  "I'm a software developer with years of experience building production web " +
  'applications for enterprise insurance clients. As the primary technical liaison ' +
  'for both external carrier partners and internal stakeholders, I empower ' +
  'engineering, product, sales, and operations teams alike, ensuring alignment and ' +
  'enabling success across the full breadth of a fast-moving insurtech platform. ' +
  "Most recently, I've delivered AI-powered projects, including a conversational " +
  'insurance chat interface built on the Claude API, and ' +
  'proprietary insurance data models.';

// Skills — categories and ordering exactly as they appear in the PDF.
export const SKILLS = [
  {
    key: 'Frontend',
    values: [
      'React',
      'Next.js',
      'Vite',
      'Chakra UI',
      'Shadcn UI',
      'Tailwind CSS',
    ],
  },
  {
    key: 'Backend',
    values: ['JavaScript', 'TypeScript', 'Node.js', 'REST APIs', 'Express'],
  },
  { key: 'Database', values: ['MongoDB', 'DynamoDB'] },
  {
    key: 'Cloud & Infra',
    values: [
      'AWS (Amplify, Cognito, CloudWatch, IAM)',
      'Infrastructure as Code (SST, AWS CDK)',
      'GitHub Actions CI/CD',
      'Sentry',
    ],
  },
  {
    key: 'AI / MCP',
    values: [
      'Anthropic Claude API',
      'MCP (Model Context Protocol)',
      'LLM adapter patterns',
    ],
  },
  { key: 'Testing', values: ['Jest', 'React Testing Library'] },
  {
    key: 'Other',
    values: [
      'Shopify',
      'WordPress',
      'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
    ],
  },
];

// Experience — each entry mirrors the PDF. Subsections are optional; roles
// without subsections just use `bullets`. The Richmond.com entry matches the
// PDF treatment as a one-line earlier-career pointer, not a full role card.
export const EXPERIENCE = [
  {
    id: 'buddy_technology',
    company: 'Buddy Technology',
    title: 'Software Developer',
    period: 'June 2022 – July 2026',
    current: true,
    subsections: [
      {
        heading: 'ION Architecture & Partner Implementation',
        note: 'Primary Role',
        bullets: [
          "Designed and built Insurance Object Notation (ION™) data models for Fortune 500 insurance carriers, translating complex insurance products into Buddy's structured data format for digital deployment",
          'Managed the full ION build process from initial product digitization through partner approval and production launch, including API connectivity for all policy lifecycle events including quoting, binding, endorsements, refunds, emails, and forms',
          'Drove end-to-end resolution of partner implementation challenges, coordinating across internal and external teams to deliver purpose-built solutions and contribute upstream library improvements that strengthen the broader platform',
        ],
      },
      {
        heading: 'Enterprise Technical Liaison',
        note: 'Fortune 500 Insurance Carriers',
        bullets: [
          'Coordinated with implementation partners on technical onboarding, documentation, and ongoing product evolution',
        ],
      },
      {
        heading: 'AI & Agentic Development',
        note: 'Most Recent',
        bullets: [
          'Collaborated closely with internal MCP (Model Context Protocol) architect to build a customer-facing demo chat interface, including conversational insurance quoting, binding, and inline Stripe payment flow',
          'Contributed to MCP design decisions by surfacing integration requirements discovered during chat development, resulting in targeted improvements to the MCP itself',
          'Designed the interface to be white-label configurable with carrier-specific theming, making it adaptable for different client deployments',
        ],
      },
    ],
  },
  {
    id: 'popmount_inc',
    company: 'PopMount, Inc.',
    title: 'Senior Visual / UX Designer',
    period: 'August 2018 – June 2022',
    bullets: [
      'Converted all e-commerce industry sites from RapidWeaver to Shopify; built and maintained all e-commerce websites alongside design and maintenance of internal WordPress and Shopify sites',
      'Created in-house graphics, templates, marketing materials, and digital outreach for internal use and outside business partnerships',
      'Processed daily print production orders using Photoshop, Illustrator, and InDesign',
    ],
  },
  {
    id: 'nexstar_media_general',
    company: 'Nexstar / Media General',
    title: 'Senior Creative Services Designer',
    period: '2011 – 2017',
    bullets: [
      'Designed and implemented digital solutions for clients advertising across a network of 170+ broadcast television stations',
      'Produced dynamic digital products including banner ads (rich media, video, static), e-blasts, and responsive splash pages',
      'Managed multiple projects and team members simultaneously in a high-paced environment',
    ],
  },
];

// Earlier-career pointer — the PDF doesn't list this as a structured role.
export const EARLIER_CAREER = {
  text: 'Earlier career in web content management and digital publishing',
  company: 'Richmond.com / Richmond Times-Dispatch',
  period: 'prior to 2011',
};

export const EDUCATION = [
  {
    school: 'University of Richmond Coding Bootcamp Certificate',
    period: 'August 2021 – February 2022',
    note: 'Completed while working full time at PopMount, Inc.',
  },
  {
    school: 'University of Maryland, Baltimore County',
    program: 'Imaging and Digital Arts, Animation Track; Art History Minor',
    period: '1999 – 2003',
  },
];
