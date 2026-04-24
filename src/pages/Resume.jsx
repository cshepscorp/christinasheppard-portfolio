import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CONTACT,
  SUMMARY,
  SKILLS,
  EXPERIENCE,
  EARLIER_CAREER,
  EDUCATION,
  RESUME_PDF_PATH,
} from '../data/resume'

// Flip to true to show the phone number from the PDF on the page.
const SHOW_PHONE = false

const STYLES = `
  .resume {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  .back-bar {
    position: relative;
    z-index: 1;
    padding: 4.5rem 2rem 0;
    max-width: 980px;
    margin: 0 auto;
    width: 100%;
  }

  .back-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;
  }
  .back-link .back-sigil { color: var(--accent); }
  .back-link:hover { color: var(--accent); }

  /* ── Page header ── */
  .resume-header {
    position: relative;
    z-index: 1;
    padding: 2rem 2rem 2.5rem;
    max-width: 980px;
    margin: 0 auto;
    width: 100%;
    animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .resume-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .resume-eyebrow .sigil { color: var(--accent); }

  .resume-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }

  .resume h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 7vw, 4rem);
    font-weight: 300;
    line-height: 1.02;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .resume h1 span { color: var(--accent2); font-style: italic; }

  .contact-strip {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-bottom: 2rem;
  }
  .contact-strip a, .contact-strip .cs-item {
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .contact-strip a:hover { color: var(--accent); }
  .contact-strip .sep { color: var(--border-strong); opacity: 0.6; }

  .download-btn {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--card-bg-subtle);
    border: 1px solid var(--accent);
    padding: 0.65rem 1.1rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .download-btn:hover {
    background: var(--accent);
    color: var(--bg);
  }

  /* ── Summary ── */
  .summary {
    position: relative;
    z-index: 1;
    max-width: 980px;
    margin: 0 auto 3.5rem;
    padding: 0 2rem;
    width: 100%;
    animation: fadeUp 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .summary-prose {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: clamp(1.05rem, 1.5vw, 1.2rem);
    line-height: 1.7;
    color: var(--text-dim);
    max-width: 760px;
    padding-left: 1.25rem;
    border-left: 2px solid var(--accent);
  }

  /* ── Section wrapper ── */
  .section {
    position: relative;
    z-index: 1;
    max-width: 980px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
    width: 100%;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .section-label .comment  { color: var(--code-comment); }
  .section-label .keyword  { color: var(--code-keyword); }
  .section-label .fn       { color: var(--code-fn); }
  .section-label .punct    { color: var(--code-punct); }
  .section-label .string   { color: var(--code-string); }

  /* ── Role (Experience entry) ── */
  .role {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 2.5rem;
    margin-bottom: 4rem;
    align-items: start;
  }
  .role-solo { grid-template-columns: 1fr; }

  .role-main { min-width: 0; }

  .role-meta {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.6rem;
  }
  .role-meta.current::after {
    content: '● running';
    margin-left: 0.75rem;
    color: var(--code-comment);
    letter-spacing: 0.08em;
    text-transform: none;
  }

  .role-company {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 1.85rem);
    font-weight: 400;
    color: var(--accent2);
    line-height: 1.15;
    margin-bottom: 0.2rem;
  }

  .role-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: var(--text-dim);
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
  }

  .role-subhead {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 1.75rem 0 0.75rem;
    padding-left: 0.75rem;
    border-left: 2px solid var(--accent);
  }
  .role-subhead .ann { color: var(--muted); text-transform: none; letter-spacing: 0.04em; margin-left: 0.4rem; }

  .role-bullets {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .role-bullets li {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    line-height: 1.65;
    color: var(--text-dim);
    padding-left: 1.5rem;
    margin-bottom: 0.85rem;
    position: relative;
  }
  .role-bullets li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    top: 0.25rem;
  }

  /* Earlier-career pointer (Richmond.com) */
  .earlier-career {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--muted);
    padding: 1.25rem 0 2rem;
    border-top: 1px dashed var(--border);
  }
  .earlier-career .ec-period {
    font-family: 'DM Mono', monospace;
    font-style: normal;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: var(--accent);
    text-transform: uppercase;
    margin-left: 0.5rem;
  }

  /* ── Code card decoration ── */
  .code-card {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    line-height: 1.75;
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    padding: 1.1rem 1.25rem;
    overflow-x: auto;
    position: relative;
  }
  .code-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 2px;
    background: var(--accent);
  }

  .code-filename {
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .code-filename::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--accent2);
    opacity: 0.8;
    border-radius: 50%;
  }

  .code-label {
    font-size: 0.58rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--code-comment);
    margin-bottom: 0.9rem;
    font-style: italic;
  }

  .code-card pre {
    margin: 0;
    white-space: pre;
    font: inherit;
    color: var(--text-dim);
  }
  .code-kw      { color: var(--code-keyword); }
  .code-str     { color: var(--code-string); }
  .code-fn      { color: var(--code-fn); }
  .code-comment { color: var(--code-comment); font-style: italic; }
  .code-punct   { color: var(--code-punct); }

  /* ── Skills as config ── */
  .skills-wrap {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    line-height: 2;
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-left: 2px solid var(--accent);
    padding: 1.5rem 1.75rem;
    color: var(--text-dim);
    overflow-x: auto;
  }
  .skills-filename {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .skills-filename::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--accent2);
    opacity: 0.8;
    border-radius: 50%;
  }
  .skill-row {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 0.75rem;
    padding-left: 1.5rem;
  }
  .skill-key { color: var(--code-fn); }
  .skill-vals {
    color: var(--code-string);
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem 0.5rem;
  }
  .skill-vals .v::before { content: '"'; color: var(--code-punct); }
  .skill-vals .v::after  { content: '",'; color: var(--code-punct); }
  .skill-vals .v:last-child::after { content: '"'; }

  /* ── Education ── */
  .edu-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 2rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
    align-items: baseline;
  }
  .edu-item:last-child { border-bottom: none; }
  .edu-school {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
    color: var(--accent2);
    line-height: 1.3;
    margin-bottom: 0.3rem;
  }
  .edu-program {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--text-dim);
    line-height: 1.6;
  }
  .edu-note {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
    margin-top: 0.35rem;
  }
  .edu-period {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--accent);
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ── Footer ── */
  .resume-footer {
    position: relative;
    z-index: 1;
    margin-top: auto;
    padding: 2rem;
    border-top: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    line-height: 1.9;
    color: var(--code-comment);
    text-align: center;
  }
  .resume-footer .footer-slash { color: var(--code-punct); opacity: 0.7; margin-right: 0.5rem; }
  .resume-footer a, .resume-footer .footer-link {
    color: var(--code-comment);
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    transition: color 0.2s;
  }
  .resume-footer a:hover, .resume-footer .footer-link:hover { color: var(--accent); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 820px) {
    .role { grid-template-columns: 1fr; gap: 1.5rem; }
    .skill-row { grid-template-columns: 1fr; padding-left: 0.75rem; }
    .skill-key { color: var(--code-fn); margin-top: 0.4rem; }
  }
  @media (max-width: 640px) {
    .back-bar     { padding: 4rem 1.25rem 0; }
    .resume-header, .summary, .section { padding-left: 1.25rem; padding-right: 1.25rem; }
    .resume-title-row { flex-direction: column; align-items: flex-start; }
    .edu-item { grid-template-columns: 1fr; gap: 0.5rem; }
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

/* ──────────────────────────────────────────────────────────────
 * Decorative code snippets
 *
 * These are REPRESENTATIVE examples of the shape of code Christy
 * writes — they are NOT verbatim excerpts from Buddy Technology
 * source, and each card is labeled "illustrative" on-screen so
 * readers don't treat them as literal claims. Replace with real
 * sanitized fragments (or keep as-is) when ready.
 * ──────────────────────────────────────────────────────────────*/

function McpToolSnippet() {
  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-filename">mcp/tools/quote_tool.ts</div>
      <div className="code-label">// illustrative — not production source</div>
      <pre>
<span className="code-comment">{`// Shape of a typical MCP tool we expose to the agent.\n`}</span>
{`export const `}<span className="code-fn">quoteTool</span>{` =
  server.`}<span className="code-fn">tool</span>{`(
    `}<span className="code-str">"get_quote"</span>{`,
    { line: z.string(), state: z.string() },
    `}<span className="code-kw">async</span>{` ({ line, state }) => {
      `}<span className="code-kw">const</span>{` result = `}<span className="code-kw">await</span>{` resolveProduct(line, state)
      `}<span className="code-kw">return</span>{` { content: [{ type: `}<span className="code-str">"text"</span>{`,
                     text: JSON.stringify(result) }] }
    }
  )`}
      </pre>
    </div>
  )
}

function ClaudeStreamSnippet() {
  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-filename">chat/quote_stream.ts</div>
      <div className="code-label">// illustrative — shape, not source</div>
      <pre>
<span className="code-comment">{`// Carrier-branded conversational quoting.\n`}</span>
{`const stream = `}<span className="code-kw">await</span>{` anthropic.messages.stream({
  model:    `}<span className="code-str">"claude-sonnet-4-6"</span>{`,
  tools:    registeredTools,
  system:   systemPromptFor(carrier),
  messages: history,
})

`}<span className="code-kw">for await</span>{` (`}<span className="code-kw">const</span>{` event `}<span className="code-kw">of</span>{` stream) {
  `}<span className="code-kw">if</span>{` (event.type === `}<span className="code-str">"content_block_delta"</span>{`) {
    appendToken(event.delta.text)
  }
}`}
      </pre>
    </div>
  )
}

function IonSchemaSnippet() {
  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-filename">ion/products/example.yaml</div>
      <div className="code-label">// illustrative — shape, not a real product</div>
      <pre>
{`product:  example_liability
lines:
  - coverage: bodily_injury
    limits:  [ ... ]
  - coverage: property_damage
    limits:  [ ... ]
states:   [ ... ]
endorsements:
  - ...`}
      </pre>
    </div>
  )
}

function ShopifyWebhookSnippet() {
  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-filename">shopify/orders.js</div>
      <div className="code-label">// illustrative — shape, not source</div>
      <pre>
{`app.`}<span className="code-fn">post</span>{`(`}<span className="code-str">"/webhook/orders"</span>{`, `}<span className="code-kw">async</span>{` (req, res) => {
  `}<span className="code-kw">const</span>{` order = verifyShopifySignature(req)
  `}<span className="code-kw">await</span>{` syncToProduction(order)
  res.sendStatus(`}<span className="code-str">200</span>{`)
})`}
      </pre>
    </div>
  )
}

/* Map role id → decorative side content (optional) */
const ROLE_SIDE_CONTENT = {
  buddy_technology: (
    <>
      <McpToolSnippet />
      <div style={{ height: '1.25rem' }} />
      <IonSchemaSnippet />
      <div style={{ height: '1.25rem' }} />
      <ClaudeStreamSnippet />
    </>
  ),
  popmount_inc: <ShopifyWebhookSnippet />,
}

export default function Resume() {
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
    <div className="resume">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="top-chrome">
        <div className="term-path">
          <span className="term-user">christy</span>
          <span className="term-at">@</span>
          <span className="term-host">portfolio</span>
          <span className="term-at"> ~ / resume %</span>
        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle light/dark mode">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="back-bar">
        <button className="back-link" onClick={() => navigate('/')}>
          <span className="back-sigil">$</span> cd ..
        </button>
      </div>

      <header className="resume-header">
        <div className="resume-eyebrow">
          <span className="sigil">$</span>
          <span>cat resume.md</span>
        </div>
        <div className="resume-title-row">
          <h1>Christy <span>Sheppard</span></h1>
          <a
            className="download-btn"
            href={RESUME_PDF_PATH}
            download="christy_sheppard_resume.pdf"
          >
            ↓ Download PDF
          </a>
        </div>

        <div className="contact-strip" aria-label="Contact">
          <span className="cs-item">{CONTACT.location}</span>
          <span className="sep">|</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          {SHOW_PHONE && (<>
            <span className="sep">|</span>
            <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`}>{CONTACT.phone}</a>
          </>)}
          <span className="sep">|</span>
          <a href={CONTACT.linkedin.href} target="_blank" rel="noreferrer">LinkedIn</a>
          <span className="sep">|</span>
          <a href={CONTACT.github.href} target="_blank" rel="noreferrer">GitHub</a>
          <span className="sep">|</span>
          <a href={`https://${CONTACT.site}`}>{CONTACT.site}</a>
        </div>
      </header>

      <section className="summary">
        <p className="summary-prose">{SUMMARY}</p>
      </section>

      {/* ── Experience ── */}
      <section className="section">
        <div className="section-label">
          <span className="comment">// </span>
          <span className="keyword">section</span>
          <span className="punct">: </span>
          <span className="string">"experience"</span>
        </div>

        {EXPERIENCE.map((role, roleIdx) => {
          const sideContent = ROLE_SIDE_CONTENT[role.id]
          const hasSide = Boolean(sideContent)
          return (
            <div className={`role${hasSide ? '' : ' role-solo'}`} key={role.id}>
              <div className="role-main">
                <div className={`role-meta${role.current ? ' current' : ''}`}>
                  {role.period}
                </div>
                <div className="role-company">{role.company}</div>
                <div className="role-title">{role.title}</div>

                {role.subsections && role.subsections.map((sub, subIdx) => (
                  <div key={subIdx}>
                    <div className="role-subhead">
                      {sub.heading}
                      {sub.note && (
                        <span className="ann"> &nbsp;// {sub.note.toLowerCase()}</span>
                      )}
                    </div>
                    <ul className="role-bullets">
                      {sub.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}

                {role.bullets && (
                  <ul className="role-bullets">
                    {role.bullets.map((b, i) => <li key={`b-${roleIdx}-${i}`}>{b}</li>)}
                  </ul>
                )}
              </div>

              {hasSide && <aside className="role-side">{sideContent}</aside>}
            </div>
          )
        })}

        {/* Earlier-career one-liner, matching the PDF's treatment */}
        <div className="earlier-career">
          {EARLIER_CAREER.text} — {EARLIER_CAREER.company}
          <span className="ec-period">({EARLIER_CAREER.period})</span>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="section">
        <div className="section-label">
          <span className="comment">// </span>
          <span className="keyword">section</span>
          <span className="punct">: </span>
          <span className="string">"skills"</span>
        </div>

        <div className="skills-wrap" aria-label="Technical skills">
          <div className="skills-filename">skills.config.js</div>
          <div><span className="code-kw">export default</span> <span className="code-punct">{'{'}</span></div>
          {SKILLS.map(({ key, values }) => (
            <div className="skill-row" key={key}>
              <span className="skill-key">{key}<span className="code-punct">:</span> [</span>
              <span className="skill-vals">
                {values.map((v, i) => <span className="v" key={i}>{v}</span>)}
                <span className="code-punct" style={{ marginLeft: '0.1rem' }}>],</span>
              </span>
            </div>
          ))}
          <div><span className="code-punct">{'}'}</span></div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="section">
        <div className="section-label">
          <span className="comment">// </span>
          <span className="keyword">section</span>
          <span className="punct">: </span>
          <span className="string">"education"</span>
        </div>

        {EDUCATION.map((edu, i) => (
          <div className="edu-item" key={i}>
            <div>
              <div className="edu-school">{edu.school}</div>
              {edu.program && <div className="edu-program">{edu.program}</div>}
              {edu.note && <div className="edu-note">{edu.note}</div>}
            </div>
            <div className="edu-period">{edu.period}</div>
          </div>
        ))}
      </section>

      <footer className="resume-footer">
        <span className="footer-slash">//</span>
        <a href={CONTACT.linkedin.href} target="_blank" rel="noreferrer">linkedin</a>
        <span> · </span>
        <a href={CONTACT.github.href} target="_blank" rel="noreferrer">github</a>
        <span> · </span>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </footer>
    </div>
  )
}
