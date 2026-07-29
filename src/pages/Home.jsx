import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WEB_SUMMARY,
  EXPERIENCE,
  EARLIER_CAREER,
  CONTACT as RESUME_CONTACT,
  TIMELINE_LAYOUT,
} from '../data/resume';
import { PROJECTS } from '../data/projects';
import './Home.css';

const TAGLINE = WEB_SUMMARY;

// Decorative tag chips — Home-specific UI, keyed by role id from resume.js.
const ROLE_TAGS = {
  buddy_technology: ['React', 'Node.js', 'Claude API', 'AWS'],
  popmount_inc: ['Shopify', 'WordPress', 'Adobe Suite'],
  nexstar_media_general: ['Digital Advertising', 'Rich Media', 'Broadcast'],
  richmond_times_dispatch: ['Web Publishing', 'Content Management'],
};

const EARLIER_CAREER_CARD = {
  id: 'richmond_times_dispatch',
  company: EARLIER_CAREER.company,
  title: 'Web content & digital publishing',
  period: EARLIER_CAREER.period,
  tags: ROLE_TAGS.richmond_times_dispatch,
};

// Current role — the one flagged `current: true` in resume.js.
const CURRENT_ROLE = (() => {
  const r = EXPERIENCE.find((e) => e.current);
  return r
    ? {
        id: r.id,
        company: r.company,
        title: r.title,
        period: r.period,
        tags: ROLE_TAGS[r.id] || [],
        current: true,
      }
    : null;
})();

// Prior roles, most-recent-first (resume order minus the current role), plus earlier-career.
const PRIOR_ROLES = [
  ...EXPERIENCE.filter((r) => !r.current).map((r) => ({
    id: r.id,
    company: r.company,
    title: r.title,
    period: r.period,
    tags: ROLE_TAGS[r.id] || [],
  })),
  EARLIER_CAREER_CARD,
];

// All roles most-recent-first — used by the stacked layout.
const ALL_ROLES = [CURRENT_ROLE, ...PRIOR_ROLES].filter(Boolean);

// Home's contact JSON block. Values come straight from src/data/resume.js so
// the resume PDF remains the single source of truth. The `resume` entry is a
// Home-only affordance (the link into the full resume page) and isn't part of
// the shared CONTACT data.
const CONTACT = [
  {
    key: 'linkedin',
    value: RESUME_CONTACT.linkedin.label,
    href: RESUME_CONTACT.linkedin.href,
    external: true,
  },
  {
    key: 'github',
    value: RESUME_CONTACT.github.label,
    href: RESUME_CONTACT.github.href,
    external: true,
  },
  {
    key: 'email',
    value: RESUME_CONTACT.email,
    href: `mailto:${RESUME_CONTACT.email}`,
    external: false,
  },
  { key: 'resume', value: '→ /resume', href: '/resume', internal: true },
];

function CareerHeader() {
  return (
    <div className='career-header'>
      <span className='code-comment'>{'// '}</span>
      <span className='code-keyword'>const</span>{' '}
      <span className='code-fn'>experience</span>
      <span className='code-punct'> = </span>
      <span className='code-fn'>career</span>
      <span className='code-punct'>.resolve()</span>
    </div>
  );
}

function RoleTags({ tags, isCurrent }) {
  return (
    <div className='card-tags'>
      {tags.map((tag, i) => (
        <span key={i} className={`tag${isCurrent ? ' tag-current' : ''}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedTimeline({ onNavigate }) {
  return (
    <section className='career-section'>
      <CareerHeader />
      <div className='featured-layout'>
        {CURRENT_ROLE && (
          <button
            className='featured-card'
            onClick={onNavigate}
            aria-label={`${CURRENT_ROLE.company} — view full resume`}
          >
            <div className='featured-status'>
              <span className='featured-dot' aria-hidden='true' />
              running · 2022 → July 2026
            </div>
            <div className='featured-company'>{CURRENT_ROLE.company}</div>
            <div className='featured-title'>{CURRENT_ROLE.title}</div>
            <RoleTags tags={CURRENT_ROLE.tags} isCurrent />
            <div className='featured-cta'>→ view full resume</div>
          </button>
        )}
        <div className='prior-roles'>
          {PRIOR_ROLES.map((role) => (
            <button
              key={role.id}
              className='prior-card'
              onClick={onNavigate}
              aria-label={`${role.company} — view full resume`}
            >
              <div className='prior-period'>{role.period}</div>
              <div className='prior-company'>{role.company}</div>
              <div className='prior-title'>{role.title}</div>
              <RoleTags tags={role.tags} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackedTimeline({ onNavigate }) {
  return (
    <section className='career-section'>
      <CareerHeader />
      <div className='stacked-layout'>
        {ALL_ROLES.map((role) => (
          <button
            key={role.id}
            className={`stacked-card${role.current ? ' stacked-card-current' : ''}`}
            onClick={onNavigate}
            aria-label={`${role.company} — view full resume`}
          >
            <div className='stacked-period'>
              {role.current ? '2022 → July 2026' : role.period}
            </div>
            <div className='stacked-main'>
              <div className='stacked-company'>{role.company}</div>
              <div className='stacked-title'>{role.title}</div>
            </div>
            <RoleTags tags={role.tags} isCurrent={role.current} />
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectThumb({ project, featured }) {
  const hasScreenshot = Boolean(project.screenshot);
  return (
    <a
      href={project.url}
      target='_blank'
      rel='noreferrer'
      className={
        featured ? 'project-thumb project-thumb-featured' : 'project-thumb'
      }
      aria-label={`Open ${project.name}`}
      style={{
        '--proj-from': project.gradientFrom,
        '--proj-to': project.gradientTo,
      }}
    >
      {hasScreenshot ? (
        <img
          src={project.screenshot}
          alt={`${project.name} screenshot`}
          className='project-screenshot'
        />
      ) : (
        <div className='project-thumb-placeholder'>
          <span className='project-url-chip'>
            {new URL(project.url).hostname}
          </span>
        </div>
      )}
      <div className='project-thumb-overlay' />
    </a>
  );
}

function ProjectBody({ project }) {
  return (
    <div className='project-body'>
      <div className='project-name'>{project.name}</div>
      <div className='project-tagline'>{project.tagline}</div>
      <p className='project-desc'>{project.description}</p>
      <div className='card-tags'>
        {project.tags.map((t, i) => (
          <span key={i} className='tag'>
            {t}
          </span>
        ))}
      </div>
      <div className='project-links'>
        <a
          href={project.url}
          target='_blank'
          rel='noreferrer'
          className='project-link-live'
        >
          ↗ live site
        </a>
        {project.github.map((g, i) => (
          <a
            key={i}
            href={g.href}
            target='_blank'
            rel='noreferrer'
            className='project-link-gh'
          >
            github/{g.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className='project-card'>
      <ProjectThumb project={project} />
      <ProjectBody project={project} />
    </div>
  );
}

function FeaturedProjectCard({ project }) {
  return (
    <div className='project-card project-card-featured'>
      <ProjectThumb project={project} featured />
      <ProjectBody project={project} />
    </div>
  );
}

function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  return (
    <section className='career-section projects-section'>
      <div className='career-header'>
        <span className='code-comment'>{'// '}</span>
        <span className='code-keyword'>const</span>{' '}
        <span className='code-fn'>projects</span>
        <span className='code-punct'> = </span>
        <span className='code-fn'>portfolio</span>
        <span className='code-punct'>.build()</span>
      </div>
      {featured && <FeaturedProjectCard project={featured} />}
      {rest.length > 0 && (
        <div className='projects-grid'>
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function useTheme() {
  const getInitial = () => {
    const stored = localStorage.getItem('cs-theme');
    if (stored) return stored;
    return 'dark';
  };
  const [theme, setTheme] = useState(getInitial);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cs-theme', theme);
  }, [theme]);
  const toggle = useCallback(
    () =>
      setTheme((t) => {
        if (t === 'dark') return 'light';
        if (t === 'light') return 'crt';
        return 'dark';
      }),
    [],
  );
  return { theme, toggle };
}

// Token-streaming hook: reveals the text in small variable-sized chunks to mimic
// actual LLM streaming (not a per-character typewriter). For users with
// `prefers-reduced-motion: reduce`, the full text is revealed immediately via
// a lazy state initializer so the effect never has to setState synchronously.
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// function useStreamedText(text, { startDelay = 600, chunkMin = 2, chunkMax = 5, tickMs = 48 } = {}) {
//   const reduce = prefersReducedMotion()
//   const [revealed, setRevealed] = useState(() => (reduce ? text.length : 0))
//   const [done, setDone] = useState(() => reduce)

//   useEffect(() => {
//     if (reduce) return

//     let cancelled = false
//     let interval = null
//     const startTimer = setTimeout(() => {
//       if (cancelled) return
//       interval = setInterval(() => {
//         if (cancelled) return
//         setRevealed(r => {
//           const chunk = Math.floor(Math.random() * (chunkMax - chunkMin + 1)) + chunkMin
//           const next = Math.min(text.length, r + chunk)
//           if (next >= text.length) {
//             clearInterval(interval)
//             setDone(true)
//           }
//           return next
//         })
//       }, tickMs)
//     }, startDelay)

//     return () => {
//       cancelled = true
//       clearTimeout(startTimer)
//       if (interval) clearInterval(interval)
//     }
//   }, [text, startDelay, chunkMin, chunkMax, tickMs, reduce])

//   return { text: text.slice(0, revealed), done }
// }

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  // const { text: streamedTagline, done: streamDone } = useStreamedText(TAGLINE)

  const handleContactClick = (item, e) => {
    if (item.internal) {
      e.preventDefault();
      navigate(item.href);
    }
  };

  return (
    <div className='home'>
      <div className='bg-grid' />
      <div className='bg-glow' />

      {/* ── Top chrome: terminal path + theme toggle ── */}
      <div className='top-chrome'>
        <div className='term-path'>
          <span className='term-user'>christy</span>
          <span className='term-at'>@</span>
          <span className='term-host'>portfolio</span>
          <span className='term-at'> ~ %</span>
        </div>
        <button
          className='theme-toggle'
          onClick={toggle}
          aria-label='Toggle light/dark mode'
        >
          {theme === 'dark' ? 'Light' : theme === 'light' ? 'CRT' : 'Dark'}
        </button>
      </div>

      {/* ── Hero session ── */}
      <header className='hero'>
        <div className='hero-inner'>
          <div className='prompt'>
            <span className='prompt-sigil'>$</span>
            <span className='prompt-cmd'>whoami</span>
          </div>

          <h1>
            Christy <span>Sheppard</span>
          </h1>

          <div className='stream-line'>
            <span className='stream-arrow'>→</span>
            <span>
              resolving identity
              <span style={{ color: 'var(--accent)' }}>...</span>
            </span>
          </div>

          <p className='tagline' aria-label={TAGLINE}>
            {/* {streamedTagline}
            {!streamDone && <span className="tagline-caret" aria-hidden="true" />} */}
            {TAGLINE}
          </p>

          <div className='prompt'>
            <span className='prompt-sigil'>$</span>
            <span className='prompt-cmd'>cat contact.json</span>
          </div>

          <div
            className='contact-block'
            role='group'
            aria-label='Contact information'
          >
            <div>
              <span className='brace'>{'{'}</span>
            </div>
            {CONTACT.map((item) => (
              <div className='contact-row' key={item.key}>
                <span className='contact-key'>
                  {item.key}
                  <span className='contact-colon'>:</span>
                </span>
                {item.external ? (
                  <a
                    className='contact-value'
                    href={item.href}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {item.value}
                  </a>
                ) : item.internal ? (
                  <button
                    className='contact-value'
                    onClick={(e) => handleContactClick(item, e)}
                    type='button'
                  >
                    {item.value}
                  </button>
                ) : (
                  <a className='contact-value' href={item.href}>
                    {item.value}
                  </a>
                )}
              </div>
            ))}
            <div>
              <span className='brace'>{'}'}</span>
            </div>
          </div>
        </div>
      </header>

      {TIMELINE_LAYOUT === 'featured' ? (
        <FeaturedTimeline onNavigate={() => navigate('/resume')} />
      ) : (
        <StackedTimeline onNavigate={() => navigate('/resume')} />
      )}

      <ProjectsSection />

      {/* ── Footer: commented-out code ── */}
      <footer className='home-footer'>
        <div className='footer-line'>
          <span className='footer-slash'>//</span>
          <span>© 2026 · </span>
          <button
            className='footer-link'
            onClick={() =>
              (window.location.href = `mailto:${RESUME_CONTACT.email}`)
            }
          >
            {RESUME_CONTACT.email}
          </button>
          <span>·</span>
          <a
            className='footer-link'
            href={RESUME_CONTACT.github.href}
            target='_blank'
            rel='noreferrer'
          >
            github
          </a>
          <span>·</span>
          <a
            className='footer-link'
            href={RESUME_CONTACT.linkedin.href}
            target='_blank'
            rel='noreferrer'
          >
            linkedin
          </a>
        </div>
        <div className='footer-line'>
          <span className='footer-slash'>//</span>
          <span>built with react + vite + claude · {RESUME_CONTACT.site}</span>
        </div>
      </footer>
    </div>
  );
}
