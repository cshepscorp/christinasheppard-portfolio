import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CONTACT,
  SKILLS,
  EXPERIENCE,
  EARLIER_CAREER,
  EDUCATION,
  RESUME_PDF_PATH,
} from '../data/resume'
import './Resume.css'

// Flip to true to show the phone number from the PDF on the page.
const SHOW_PHONE = false

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
  const toggle = useCallback(() => setTheme(t => {
    if (t === 'dark') return 'light'
    if (t === 'light') return 'crt'
    return 'dark'
  }), [])
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
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  return (
    <div className="resume">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="top-chrome">
        <div className="term-path">
          <button className="back-link" onClick={() => navigate('/')}>
            <span className="term-user">christy</span>
          </button>
          <span className="term-at">@</span>
          <span className="term-host">portfolio</span>
          <span className="term-at"> ~ / resume %</span>

        </div>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle light/dark mode">
          {theme === 'dark' ? 'Light' : theme === 'light' ? 'CRT' : 'Dark'}
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

      {/* ── Experience ── */}
      <section className="section">
        <div className="section-label">
          <span className="comment">// </span>
          <span className="keyword">section</span>
          <span className="punct">: </span>
          <span className="string">"experience"</span>
        </div>

        {EXPERIENCE.map((role, roleIdx) => {
          // const sideContent = ROLE_SIDE_CONTENT[role.id]
          // const hasSide = Boolean(sideContent)
          return (
            // <div className={`role${hasSide ? '' : ' role-solo'}`} key={role.id}>
            <div className="role-solo" key={role.id}>
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

              {/* {hasSide && <aside className="role-side">{sideContent}</aside>} */}
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
