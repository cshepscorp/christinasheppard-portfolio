# christinasheppard-portfolio

## Project Overview
Personal portfolio site for Christy Sheppard — a software developer based in Richmond, VA with a background in full-stack web development, enterprise insurance technology (ION architecture, Allstate/Aon), and most recently AI-powered application development using the Claude API and MCP protocol.

The site lives at **christinasheppard.com**, hosted via **AWS Amplify** with auto-deploy on push to `main`. Domain is registered via Bluehost and pointed at Route 53 nameservers.

## Tech Stack
- **Framework:** React (Vite scaffold)
- **Language:** JavaScript (not TypeScript)
- **Styling:** Plain CSS injected via useEffect (no CSS modules, no Tailwind yet)
- **Routing:** React Router (to be added)
- **Hosting:** AWS Amplify (auto-deploys on push to main)
- **Domain:** christinasheppard.com

## Design Direction
- Dark theme by default with light/dark mode toggle
- Respects user's system `prefers-color-scheme` setting
- Typography: Cormorant Garamond (serif, display) + DM Mono (monospace, labels/body)
- Color palette: deep navy background (`#080c10`), soft blue accent (`#7eb8d4`), warm gold accent (`#c4a882`)
- Aesthetic: refined, editorial, not generic — subtle grid background, frosted glass card, thin accent lines
- NO purple gradients, NO Inter/Roboto, NO generic AI aesthetics

## Current State
- `App.jsx` — landing page with name, one-liner, links (LinkedIn, GitHub, Email), "Portfolio in progress" footer note
- No routing yet
- No resume page yet
- PDF resume lives at `public/christy_sheppard_resume.pdf` and is the canonical source of truth. Copy shown on the site is mirrored in `src/data/resume.js`; when the PDF changes, update that file and bump `RESUME_PDF_VERSION` for cache-busting (the version is appended to the download link as `?v=…`).

## Planned Page Structure
- **`/` (home)** — landing page with summary, links, and a horizontal left-to-right career timeline (condensed cards). Clicking a timeline card navigates to `/resume`
- **`/resume`** — full expanded resume page with complete bullet points per role, skills section, download resume button, light/dark toggle, footer with all links

## Career Timeline Data
Use this data to populate the timeline components:

### Buddy Technology — Software Developer | June 2022 – Present
**Tags:** ION Architecture, Allstate · Aon, Claude API, React, Node.js, AWS
**Sections:**
- ION Architecture & Partner Implementation (Primary Role)
- Enterprise Technical Liaison — Allstate & Aon
- AI & Agentic Development (Most Recent)
- Backend & Infrastructure

### PopMount, Inc. — Senior Visual / UX Designer | Aug 2018 – June 2022
**Tags:** Shopify, WordPress, Adobe Suite

### Nexstar / Media General — Senior Creative Services Designer | 2011 – 2017
**Tags:** Digital Advertising, Rich Media, Broadcast

### Richmond.com / Richmond Times-Dispatch — Web & Content Manager | Prior to 2011
**Tags:** Web Publishing, Content Management

## Resume Content (for /resume page)

### Summary
Software developer with experience building production web applications for enterprise insurance clients including Allstate and Aon. Known for bridging the gap between complex technical systems and business stakeholders — serving as a primary technical liaison while shipping full-stack features across the entire product lifecycle. Most recently contributed to AI-powered development, including a Claude API-powered conversational insurance interface and MCP-based backend integrations. Actively pursuing expertise in LLM integration as a direction for future growth.

### Technical Skills
- **Languages:** JavaScript (ES2020+), TypeScript, Bash
- **Frontend:** React, Next.js, Chakra UI, Shadcn UI, Tailwind CSS, React Hook Form, SWR
- **Backend:** Node.js, REST APIs, Express, SST (Serverless Framework)
- **Database:** MongoDB, AWS DynamoDB
- **Cloud & Infra:** AWS (Amplify, Cognito, CloudWatch, IAM), GitHub Actions CI/CD, Sentry
- **AI / MCP:** Anthropic Claude API, MCP (Model Context Protocol), LLM adapter pattern
- **Testing:** Jest, React Testing Library
- **Other:** Shopify, WordPress, Adobe Creative Suite (Photoshop, Illustrator, InDesign)

### Experience Bullets

#### Buddy Technology — Software Developer | June 2022 – Present

**ION Architecture & Partner Implementation — Primary Role**
- Designed and built Insurance Object Notation (ION™) data models for enterprise carrier partners including Allstate and Aon, translating complex insurance products into Buddy's structured data format for digital deployment
- Managed the full ION build process from initial product digitization through carrier approval and go-live, including API connectivity for quoting, binding, endorsements, and refunds
- Troubleshot and solved unique partner implementation challenges — custom payment methods, state-specific compliance requirements, endorsements — often contributing fixes upstream to shared libraries (ion-helpers, ion-to-react)

**Enterprise Technical Liaison — Allstate & Aon**
- Coordinated with implementation partners (Vero, Remax, Payscore, Avail, Jobble, Snap Finance, Progressive Leasing) on technical onboarding, documentation, and ongoing product evolution

**AI & Agentic Development — Most Recent**
- Collaborated closely with the MCP architect to build a carrier-facing demo chat interface — including conversational insurance quoting, binding, and inline Stripe payment flow
- Contributed to MCP design decisions by surfacing integration requirements discovered during chat development, resulting in targeted improvements to the MCP itself
- Designed the interface to be white-label configurable with carrier-specific theming, making it adaptable for different client deployments

**Backend & Infrastructure**
- Built user management system with Cognito-backed listing, org scoping, role filtering, pagination, and full deletion workflow with test coverage
- Designed and shipped single-policy renew and customer charge endpoints with role-based authorization scoped to customer, producer, and admin access levels

#### PopMount, Inc. — Senior Visual / UX Designer | Aug 2018 – June 2022
- Converted all e-commerce industry sites from RapidWeaver to Shopify; built and maintained all e-commerce websites alongside design and maintenance of internal WordPress and Shopify sites
- Created in-house graphics, templates, marketing materials, and digital outreach for internal use and outside business partnerships
- Processed daily print production orders using Photoshop, Illustrator, and InDesign

#### Nexstar / Media General — Senior Creative Services Designer | 2011 – 2017
- Designed and implemented digital solutions for clients advertising across a network of 170+ broadcast television stations
- Produced dynamic digital products including banner ads (rich media, video, static), e-blasts, and responsive splash pages
- Managed multiple projects and team members simultaneously in a high-paced environment

#### Richmond.com / Richmond Times-Dispatch — Web & Content Manager | Prior to 2011
- Earlier career in web content management and digital publishing

### Education
- **University of Richmond Coding Bootcamp Certificate** — August 2021 – February 2022
  Completed while working full time at PopMount, Inc.
- **University of Maryland, Baltimore County** — Imaging and Digital Arts, Animation Track; Art History Minor | 1999–2003

## Personal Context (for Claude's reference)
- Christy is exploring a career transition toward AI engineering / solutions engineering / pre-sales engineering
- She prefers stable, established companies over startups
- Remote or hybrid preferred, based in Richmond, VA
- Strong customer-facing background — primary technical liaison for Allstate and Aon at Buddy Technology
- Has been furloughed to 2 days/week and is actively job searching
- LinkedIn: https://www.linkedin.com/in/christinasheppard/
- GitHub: https://github.com/cshepscorp
- Email: sheppard.christy@gmail.com
