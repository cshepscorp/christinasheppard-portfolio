import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HERO_TAGLINE,
  EXPERIENCE,
  EARLIER_CAREER,
  CONTACT as RESUME_CONTACT,
} from '../data/resume'

// Hero tagline is derived from src/data/resume.js so it stays in sync with the
// PDF. If you want to tweak the hero copy, edit HERO_TAGLINE there — don't
// paraphrase here.
const TAGLINE = HERO_TAGLINE

// Decorative tag chips on the timeline cards. These are Home-specific UI, not
// part of the resume data — they're just quick visual cues on each card.
// Keyed by the role id used in src/data/resume.js.
const ROLE_TAGS = {
  buddy_technology:        ['React', 'Node.js', 'Claude API', 'AWS'],
  popmount_inc:            ['Shopify', 'WordPress', 'Adobe Suite'],
  nexstar_media_general:   ['Digital Advertising', 'Rich Media', 'Broadcast'],
  richmond_times_dispatch: ['Web Publishing', 'Content Management'],
}

// Build the timeline chronologically (oldest → newest).
// EXPERIENCE in the data file is newest-first (resume order); we reverse it
// for the timeline and prepend the earlier-career pointer for Richmond.com.
// Richmond.com's "title" here is a soft descriptor derived from
// EARLIER_CAREER.text — the PDF doesn't list a specific job title for that
// role, so we avoid fabricating one.
const TIMELINE = [
  {
    id: 'richmond_times_dispatch',
    company: EARLIER_CAREER.company,
    title: 'Web content & digital publishing',
    period: EARLIER_CAREER.period,
    tags: ROLE_TAGS.richmond_times_dispatch,
  },
  ...[...EXPERIENCE].reverse().map(role => ({
    id: role.id,
    company: role.company,
    title: role.title,
    period: role.period,
    tags: ROLE_TAGS[role.id] || [],
    current: Boolean(role.current),
  })),
]

// Home's contact JSON block. Values come straight from src/data/resume.js so
// the resume PDF remains the single source of truth. The `resume` entry is a
// Home-only affordance (the link into the full resume page) and isn't part of
// the shared CONTACT data.
const CONTACT = [
  { key: 'linkedin', value: RESUME_CONTACT.linkedin.label, href: RESUME_CONTACT.linkedin.href, external: true },
  { key: 'github',   value: RESUME_CONTACT.github.label,   href: RESUME_CONTACT.github.href,   external: true },
  { key: 'email',    value: RESUME_CONTACT.email,          href: `mailto:${RESUME_CONTACT.email}`, external: false },
  { key: 'resume',   value: '→ /resume',                   href: '/resume',                     internal: true },
]

const STYLES = `
  .home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Hero session ── */
  .hero {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    padding: 6rem 2rem 3rem;
  }

  .hero-inner {
    max-width: 860px;
    width: 100%;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* Shell-prompt eyebrow */
  .prompt {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .prompt-sigil { color: var(--accent); font-weight: 400; }
  .prompt-cmd   { color: var(--text-dim); }

  /* Name */
  .home h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 9vw, 5rem);
    font-weight: 300;
    line-height: 1.02;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 1.75rem;
  }
  .home h1 span {
    color: var(--accent2);
    font-style: italic;
  }

  /* Streamed tagline */
  .stream-line {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .stream-arrow { color: var(--accent); }

  .tagline {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: clamp(1.05rem, 1.6vw, 1.2rem);
    line-height: 1.65;
    color: var(--text-dim);
    margin-bottom: 3rem;
    max-width: 680px;
    min-height: 3.3em;
  }
  .tagline-caret {
    display: inline-block;
    width: 0.5ch;
    height: 1.1em;
    background: var(--accent);
    vertical-align: text-bottom;
    margin-left: 3px;
    animation: caretBlink 1.1s steps(1) infinite;
  }

  /* Contact JSON block */
  .contact-block {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    line-height: 2;
    color: var(--muted);
    padding: 1.25rem 1.5rem;
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-left: 2px solid var(--accent);
    max-width: 560px;
  }
  .contact-block .brace { color: var(--code-punct); }
  .contact-row {
    display: grid;
    grid-template-columns: 6rem 1fr;
    gap: 0.5rem;
    padding-left: 1.5rem;
  }
  .contact-key    { color: var(--code-fn); }
  .contact-colon  { color: var(--code-punct); margin: 0 0.25rem 0 -0.4rem; }
  .contact-value  {
    color: var(--code-string);
    text-decoration: none;
    background: none;
    border: none;
    font: inherit;
    padding: 0;
    cursor: pointer;
    text-align: left;
    transition: color 0.2s ease, background 0.2s ease;
  }
  .contact-value:hover {
    color: var(--accent);
    background: rgba(126, 184, 212, 0.06);
  }
  .contact-value::before { content: '"'; color: var(--code-punct); }
  .contact-value::after  { content: '",'; color: var(--code-punct); }
  .contact-row:last-of-type .contact-value::after { content: '"'; }

  /* ── Timeline section ── */
  .timeline-section {
    position: relative;
    z-index: 1;
    padding: 1rem 2rem 4rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    animation: fadeUp 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .timeline-header {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin-bottom: 1.75rem;
    padding: 0 0.5rem;
  }
  .timeline-header .code-comment { color: var(--code-comment); }
  .timeline-header .code-fn      { color: var(--code-fn); }
  .timeline-header .code-keyword { color: var(--code-keyword); }
  .timeline-header .code-punct   { color: var(--code-punct); }

  .timeline-scroll {
    overflow-x: auto;
    padding: 8px 12px 1.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .timeline-scroll::-webkit-scrollbar { height: 3px; }
  .timeline-scroll::-webkit-scrollbar-track { background: transparent; }
  .timeline-scroll::-webkit-scrollbar-thumb { background: var(--border); }

  .timeline-track {
    display: flex;
    position: relative;
    width: 100%;
    gap: 0;
    padding: 0 0.5rem;
    overflow: visible;
  }

  .timeline-line {
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--border) 8%,
      var(--muted) 40%,
      var(--accent) 88%,
      transparent 100%
    );
    opacity: 0.5;
    z-index: 0;
  }

  .timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 220px;
    position: relative;
    animation: cardUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--delay, 0) * 1s);
  }

  .timeline-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--muted);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    margin-bottom: 1.75rem;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
  }

  .timeline-item:hover .timeline-dot {
    transform: scale(1.4);
    border-color: var(--accent);
  }

  .timeline-item.current .timeline-dot {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(126, 184, 212, 0.15), 0 0 14px rgba(126, 184, 212, 0.4);
    animation: dotPulse 2.2s ease-in-out infinite;
  }

  .timeline-card {
    width: calc(100% - 2rem);
    border: 1px solid var(--border);
    background: var(--card-bg-subtle);
    backdrop-filter: blur(12px);
    padding: 1.5rem;
    cursor: pointer;
    transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    position: relative;
    overflow: hidden;
    text-align: left;
    font: inherit;
    color: inherit;
  }

  .timeline-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .timeline-card:hover {
    border-color: rgba(126, 184, 212, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18), 0 0 12px rgba(126,184,212,0.06);
  }
  .timeline-card:hover::before { opacity: 0.6; }

  .timeline-item.current .timeline-card {
    border-color: rgba(126, 184, 212, 0.25);
    background: linear-gradient(145deg, var(--card-bg-subtle), rgba(126,184,212,0.04));
  }

  .card-index {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }
  .card-index .idx-bracket { color: var(--code-punct); }
  .card-index .idx-num     { color: var(--accent); }
  .card-index .idx-status  { color: var(--code-comment); margin-left: 0.4rem; }

  .card-company {
    font-family: 'DM Serif Display', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--accent2);
    line-height: 1.2;
    margin-bottom: 0.35rem;
  }

  .card-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--muted);
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.2rem 0.5rem;
    text-transform: uppercase;
  }

  .timeline-item.current .tag {
    color: var(--accent);
    border-color: rgba(126, 184, 212, 0.2);
  }

  /* ── Footer: commented code ── */
  .home-footer {
    position: relative;
    z-index: 1;
    margin-top: auto;
    padding: 2rem;
    border-top: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    line-height: 1.9;
    color: var(--code-comment);
  }
  .footer-line { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .footer-slash { color: var(--code-punct); opacity: 0.7; }
  .footer-link {
    color: var(--code-comment);
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  .footer-link:hover { color: var(--accent); }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes caretBlink {
    50% { opacity: 0; }
  }
  @keyframes dotPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(126, 184, 212, 0.15), 0 0 14px rgba(126, 184, 212, 0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(126, 184, 212, 0.06), 0 0 18px rgba(126, 184, 212, 0.55); }
  }

  @media (max-width: 640px) {
    .hero { padding: 5rem 1.25rem 2rem; }
    .contact-block { padding: 1rem 1.1rem; font-size: 0.72rem; }
    .contact-row { grid-template-columns: 5rem 1fr; padding-left: 1rem; }
    .timeline-section { padding: 0 1rem 3rem; }
    .home-footer { padding: 1.5rem 1.25rem; }
  }
`

function useTheme() {
  const getInitial = () => {
    const stored = localStorage.getItem('cs-theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  const [theme, setTheme] = useState(getInitial)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cs-theme', theme)
  }, [theme])
  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}

// Token-streaming hook: reveals the text in small variable-sized chunks to mimic
// actual LLM streaming (not a per-character typewriter). For users with
// `prefers-reduced-motion: reduce`, the full text is revealed immediately via
// a lazy state initializer so the effect never has to setState synchronously.
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useStreamedText(text, { startDelay = 600, chunkMin = 2, chunkMax = 5, tickMs = 48 } = {}) {
  const reduce = prefersReducedMotion()
  const [revealed, setRevealed] = useState(() => (reduce ? text.length : 0))
  const [done, setDone] = useState(() => reduce)

  useEffect(() => {
    if (reduce) return

    let cancelled = false
    let interval = null
    const startTimer = setTimeout(() => {
      if (cancelled) return
      interval = setInterval(() => {
        if (cancelled) return
        setRevealed(r => {
          const chunk = Math.floor(Math.random() * (chunkMax - chunkMin + 1)) + chunkMin
          const next = Math.min(text.length, r + chunk)
          if (next >= text.length) {
            clearInterval(interval)
            setDone(true)
          }
          return next
        })
      }, tickMs)
    }, startDelay)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [text, startDelay, chunkMin, chunkMax, tickMs, reduce])

  return { text: text.slice(0, revealed), done }
}

export default function Home() {
  const styleRef = useRef(null)
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const { text: streamedTagline, done: streamDone } = useStreamedText(TAGLINE)

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = STYLES
    document.head.appendChild(el)
    styleRef.current = el
    return () => el.remove()
  }, [])

  const handleContactClick = (item, e) => {
    if (item.internal) {
      e.preventDefault()
      navigate(item.href)
    }
  }

  return (
    <div className="home">
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* ── Top chrome: terminal path + theme toggle ── */}
      <div className="top-chrome">
        <div className="term-path">
          <span className="term-user">christy</span>
          <span className="term-at">@</span>
          <span className="term-host">portfolio</span>
          <span className="term-at"> ~ %</span>
        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle light/dark mode">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* ── Hero session ── */}
      <header className="hero">
        <div className="hero-inner">
          <div className="prompt">
            <span className="prompt-sigil">$</span>
            <span className="prompt-cmd">whoami</span>
          </div>

          <h1>Christy <span>Sheppard</span></h1>

          <div className="stream-line">
            <span className="stream-arrow">→</span>
            <span>resolving identity<span style={{ color: 'var(--accent)' }}>...</span></span>
          </div>

          <p className="tagline" aria-label={TAGLINE}>
            {streamedTagline}
            {!streamDone && <span className="tagline-caret" aria-hidden="true" />}
          </p>

          <div className="prompt">
            <span className="prompt-sigil">$</span>
            <span className="prompt-cmd">cat contact.json</span>
          </div>

          <div className="contact-block" role="group" aria-label="Contact information">
            <div><span className="brace">{'{'}</span></div>
            {CONTACT.map(item => (
              <div className="contact-row" key={item.key}>
                <span className="contact-key">{item.key}<span className="contact-colon">:</span></span>
                {item.external ? (
                  <a
                    className="contact-value"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.value}
                  </a>
                ) : item.internal ? (
                  <button
                    className="contact-value"
                    onClick={(e) => handleContactClick(item, e)}
                    type="button"
                  >
                    {item.value}
                  </button>
                ) : (
                  <a className="contact-value" href={item.href}>{item.value}</a>
                )}
              </div>
            ))}
            <div><span className="brace">{'}'}</span></div>
          </div>
        </div>
      </header>

      {/* ── Timeline section: framed as tool_calls ── */}
      <section className="timeline-section">
        <div className="timeline-header">
          <span className="code-comment">{'// '}</span>
          <span className="code-keyword">const</span>
          <span> </span>
          <span className="code-fn">tool_calls</span>
          <span className="code-punct"> = </span>
          <span className="code-fn">career</span>
          <span className="code-punct">.map</span>
          <span className="code-punct">(</span>
          <span>role </span>
          <span className="code-punct">=&gt;</span>
          <span> role</span>
          <span className="code-punct">.</span>
          <span className="code-fn">resolve</span>
          <span className="code-punct">())</span>
        </div>

        <div className="timeline-scroll">
          <div className="timeline-track">
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => {
              const isCurrent = Boolean(item.current)
              const idx = isCurrent ? '∞' : i
              return (
                <div
                  key={item.id}
                  className={`timeline-item${isCurrent ? ' current' : ''}`}
                  style={{ '--delay': 0.2 + i * 0.09 }}
                >
                  <div className="timeline-dot" />
                  <button
                    className="timeline-card"
                    onClick={() => navigate('/resume')}
                    aria-label={`${item.company} — view full resume`}
                  >
                    <div className="card-index">
                      <span className="idx-bracket">[</span>
                      <span className="idx-num">{idx}</span>
                      <span className="idx-bracket">]</span>
                      <span className="idx-status">
                        {isCurrent ? 'running · 2022 → present' : `returned · ${item.period}`}
                      </span>
                    </div>
                    <div className="card-company">{item.company}</div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-tags">
                      {item.tags.map((tag, j) => (
                        <span key={j} className="tag">{tag}</span>
                      ))}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer: commented-out code ── */}
      <footer className="home-footer">
        <div className="footer-line">
          <span className="footer-slash">//</span>
          <span>© 2026 · </span>
          <button
            className="footer-link"
            onClick={() => (window.location.href = `mailto:${RESUME_CONTACT.email}`)}
          >
            {RESUME_CONTACT.email}
          </button>
          <span>·</span>
          <a className="footer-link" href={RESUME_CONTACT.github.href} target="_blank" rel="noreferrer">github</a>
          <span>·</span>
          <a className="footer-link" href={RESUME_CONTACT.linkedin.href} target="_blank" rel="noreferrer">linkedin</a>
        </div>
        <div className="footer-line">
          <span className="footer-slash">//</span>
          <span>built with react + vite + claude · {RESUME_CONTACT.site}</span>
        </div>
      </footer>
    </div>
  )
}
