import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const TIMELINE = [
  {
    company: 'Richmond.com / RTD',
    title: 'Web & Content Manager',
    period: 'Pre-2011',
    tags: ['Web Publishing', 'Content Management'],
  },
  {
    company: 'Nexstar / Media General',
    title: 'Sr. Creative Services Designer',
    period: '2011 – 2017',
    tags: ['Digital Advertising', 'Rich Media', 'Broadcast'],
  },
  {
    company: 'PopMount, Inc.',
    title: 'Senior Visual / UX Designer',
    period: '2018 – 2022',
    tags: ['Shopify', 'WordPress', 'Adobe Suite'],
  },
  {
    company: 'Buddy Technology',
    title: 'Software Developer',
    period: '2022 – Present',
    tags: ['React', 'Node.js', 'Claude API', 'AWS'],
    current: true,
  },
]

const STYLES = `
  .home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background ── */
  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .bg-glow {
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 600px;
    background: radial-gradient(ellipse, var(--glow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Theme toggle ── */
  .theme-toggle {
    position: fixed;
    top: 1.5rem;
    right: 1.75rem;
    z-index: 10;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    backdrop-filter: blur(8px);
    background: var(--card-bg-subtle);
  }

  .theme-toggle:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  /* ── Header ── */
  .home-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    padding: 5rem 2rem 3rem;
  }

  .header-card {
    max-width: 900px;
    width: 100%;
    border: 1px solid var(--border);
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    padding: 4rem;
    position: relative;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .header-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.6;
  }

  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .eyebrow::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--accent);
    opacity: 0.6;
    flex-shrink: 0;
  }

  .home h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 10vw, 4.5rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .home h1 span {
    color: var(--accent2);
    font-style: italic;
  }

  .tagline {
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--muted);
    line-height: 1.85;
    margin-bottom: 3rem;
  }

  .tagline strong {
    color: var(--text);
    opacity: 0.75;
    font-weight: 400;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--border);
    margin-bottom: 2.5rem;
  }

  .header-links {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .link {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--accent);
    transition: width 0.3s ease;
  }

  .link:hover { color: var(--accent); }
  .link:hover::after { width: 100%; }

  .link-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.5;
    flex-shrink: 0;
  }

  /* ── Timeline section ── */
  .timeline-section {
    position: relative;
    z-index: 1;
    padding: 0 2rem 4rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    animation: fadeUp 0.9s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .timeline-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.5rem;
  }

  .timeline-eyebrow::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--muted);
    opacity: 0.4;
    flex-shrink: 0;
  }

  .timeline-scroll {
    overflow-x: auto;
    padding: 10px 12px 1.5rem;
    /* hide scrollbar but keep scroll */
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .timeline-scroll::-webkit-scrollbar {
    height: 3px;
  }
  .timeline-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .timeline-scroll::-webkit-scrollbar-thumb {
    background: var(--border);
  }

  .timeline-track {
    display: flex;
    position: relative;
    width: 100%;
    gap: 0;
    padding: 0 0.5rem;
    overflow: visible;
  }

  /* The horizontal connector line — gradient left→right shows progression */
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
    min-width: 200px;
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

  .timeline-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(126,184,212,0.03), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .timeline-card:hover {
    border-color: rgba(126, 184, 212, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18), 0 0 12px rgba(126,184,212,0.06);
  }

  .timeline-card:hover::before { opacity: 0.6; }
  .timeline-card:hover::after  { opacity: 1; }

  .timeline-item.current .timeline-card {
    border-color: rgba(126, 184, 212, 0.25);
    background: linear-gradient(145deg, var(--card-bg-subtle), rgba(126,184,212,0.04));
  }

  .card-period {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .card-company {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
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
    font-size: 0.6rem;
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

  /* ── Footer ── */
  .home-footer {
    position: relative;
    z-index: 1;
    margin-top: auto;
    padding: 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .footer-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover { color: var(--accent); }

  .footer-copy {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: rgba(74, 85, 104, 0.4);
    text-transform: uppercase;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .home-header { padding: 4rem 1rem 2rem; }
    .header-card { padding: 2.5rem 1.75rem; }
    .header-links { gap: 1.25rem; }
    .timeline-section { padding: 0 1rem 3rem; }
    .timeline-item { width: 200px; }
    .home-footer { padding: 1.5rem 1rem; flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 400px) {
    .header-card { padding: 2rem 1.25rem; }
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

export default function Home() {
  const styleRef = useRef(null)
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = STYLES
    document.head.appendChild(el)
    styleRef.current = el
    return () => el.remove()
  }, [])

  return (
    <div className="home">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <button className="theme-toggle" onClick={toggle} aria-label="Toggle light/dark mode">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>

      {/* ── Header ── */}
      <header className="home-header">
        <div className="header-card">
          <div className="eyebrow">Software Developer</div>

          <h1>
            Christy <span>Sheppard</span>
          </h1>

          <p className="tagline">
            Software developer with experience building production web applications for enterprise insurance clients including Allstate and Aon. Known for bridging the gap between complex technical systems and business stakeholders — serving as a primary technical liaison while shipping full-stack features across the entire product lifecycle. Most recently contributed to AI-powered development, including a Claude API-powered conversational insurance interface and MCP-based backend integrations, and am actively growing expertise in LLM integration as a direction for future growth.{' '}
            Based in <strong>Richmond, VA</strong> — open to remote opportunities.
          </p>

          <div className="divider" />

          <nav className="header-links">
            <a className="link" href="https://www.linkedin.com/in/christinasheppard/" target="_blank" rel="noreferrer">
              <span className="link-dot" />LinkedIn
            </a>
            <a className="link" href="https://github.com/cshepscorp" target="_blank" rel="noreferrer">
              <span className="link-dot" />GitHub
            </a>
            <a className="link" href="mailto:sheppard.christy@gmail.com">
              <span className="link-dot" />Email
            </a>
            <button className="link" onClick={() => navigate('/resume')}>
              <span className="link-dot" />Resume
            </button>
          </nav>
        </div>
      </header>

      {/* ── Timeline ── */}
      <section className="timeline-section">
        <div className="timeline-eyebrow">Career timeline</div>
        <div className="timeline-scroll">
          <div className="timeline-track">
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`timeline-item${item.current ? ' current' : ''}`}
                style={{ '--delay': 0.15 + i * 0.09 }}
              >
                <div className="timeline-dot" />
                <div
                  className="timeline-card"
                  onClick={() => navigate('/resume')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate('/resume')}
                  aria-label={`${item.company} — view full resume`}
                >
                  <div className="card-period">{item.period}</div>
                  <div className="card-company">{item.company}</div>
                  <div className="card-title">{item.title}</div>
                  <div className="card-tags">
                    {item.tags.map((tag, j) => (
                      <span key={j} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-links">
          <a className="footer-link" href="https://www.linkedin.com/in/christinasheppard/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="footer-link" href="https://github.com/cshepscorp" target="_blank" rel="noreferrer">GitHub</a>
          <a className="footer-link" href="mailto:sheppard.christy@gmail.com">Email</a>
          <button className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => navigate('/resume')}>Resume</button>
        </div>
        <div className="footer-copy">christinasheppard.com</div>
      </footer>
    </div>
  )
}
