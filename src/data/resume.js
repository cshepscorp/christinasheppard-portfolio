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
export const RESUME_PDF_VERSION = '2026-05-13'

// export const RESUME_PDF_PATH = `/christy_sheppard_resume.pdf?v=${RESUME_PDF_VERSION}`
export const RESUME_PDF_PATH = '/christy_sheppard_resume.pdf';

export const CONTACT = {
  name: 'Christy Sheppard',
  location: 'Richmond, VA',
  email: 'sheppard.christy@gmail.com',
  // Phone is on the PDF but intentionally kept off the public site by default
  // (spam harvesting). Flip `showPhone` to true in Resume.jsx to render it.
  phone: '804-928-1876',
  linkedin: { label: '@christinasheppard', href: 'https://www.linkedin.com/in/christinasheppard/' },
  github: { label: '@cshepscorp', href: 'https://github.com/cshepscorp' },
  site: 'christinasheppard.com',
}

// Web-only summary — intentionally NOT mirrored in the PDF.
// Shown on the Home page hero. Edit freely; no PDF sync required.
export const WEB_SUMMARY =
  "I'm a software developer with extensive experience building production web " +
  'applications for enterprise insurance clients. As the primary technical liaison ' +
  'for both external carrier partners and internal stakeholders, I empower ' +
  'engineering, product, sales, and operations teams alike, ensuring alignment and ' +
  'enabling success across the full breadth of a fast-moving insuretech platform. ' +
  "Most recently, I've delivered AI-powered projects, including a conversational " +
  'insurance chat interface built on the Claude API, a custom MCP server, and ' +
  'proprietary insurance data models.'

// Skills — categories and ordering exactly as they appear in the PDF.
export const SKILLS = [
  { key: 'Languages', values: ['JavaScript (ES2020+)', 'TypeScript'] },
  { key: 'Frontend', values: ['React', 'Next.js', 'Chakra UI', 'Shadcn UI', 'Tailwind CSS', 'React Hook Form', 'SWR'] },
  { key: 'Backend', values: ['Node.js', 'REST APIs', 'Express', 'SST'] },
  { key: 'Database', values: ['MongoDB', 'AWS DynamoDB'] },
  { key: 'Cloud & Infra', values: ['AWS (Amplify, Cognito, CloudWatch, IAM)', 'GitHub Actions CI/CD', 'Sentry'] },
  { key: 'AI / MCP', values: ['Anthropic Claude API', 'MCP (Model Context Protocol)', 'LLM adapter pattern'] },
  { key: 'Testing', values: ['Jest', 'React Testing Library'] },
  { key: 'Other', values: ['Shopify', 'WordPress', 'Adobe Creative Suite (Photoshop, Illustrator, InDesign)'] },
]

// Experience — each entry mirrors the PDF. Subsections are optional; roles
// without subsections just use `bullets`. The Richmond.com entry matches the
// PDF treatment as a one-line earlier-career pointer, not a full role card.
export const EXPERIENCE = [
  {
    id: 'buddy_technology',
    company: 'Buddy Technology',
    title: 'Software Developer',
    period: 'June 2022 – Present',
    current: true,
    subsections: [
      {
        heading: 'ION Architecture & Partner Implementation',
        note: 'Primary Role',
        bullets: [
          'Designs and builds Insurance Object Notation (ION™) data models for enterprise carrier partners including Allstate and Aon, translating complex insurance products into Buddy’s structured data format for digital deployment',
          'Manages the full ION build process from initial product digitization through carrier approval and go-live, including API connectivity for quoting, binding, endorsements, refunds, emails, and forms',
          'Troubleshoots and solves unique partner implementation challenges like custom payment requirements, and state-specific compliance regulations while contributing related fixes upstream to shared libraries',
        ],
      },
      {
        heading: 'Enterprise Technical Liaison',
        note: 'Allstate & Aon',
        bullets: [
          'Coordinates with implementation partners (including Vero, Remax, Payscore, Avail, Jobble, Snap Finance, Progressive Leasing) on technical onboarding, documentation, and ongoing product evolution',
        ],
      },
      {
        heading: 'AI & Agentic Development',
        note: 'Most Recent',
        bullets: [
          'Collaborated closely with the MCP architect to build a carrier-facing demo chat interface — including conversational insurance quoting, binding, and inline Stripe payment flow',
          'Contributed to MCP design decisions by surfacing integration requirements discovered during chat development, resulting in targeted improvements to the MCP itself',
          'Designed the interface to be white-label configurable with carrier-specific theming, making it adaptable for different client deployments',
        ],
      },
      {
        heading: 'Backend & Infrastructure',
        bullets: [
          'Built user management system with Cognito-backed listing, org scoping, role filtering, pagination, and full deletion workflow with test coverage',
          'Designed and shipped single-policy renew and customer charge endpoints with role-based authorization scoped to customer, producer, and administrative access levels',
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
]

// Earlier-career pointer — the PDF doesn't list this as a structured role.
export const EARLIER_CAREER = {
  text: 'Earlier career in web content management and digital publishing',
  company: 'Richmond.com / Richmond Times-Dispatch',
  period: 'prior to 2011',
}

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
]
