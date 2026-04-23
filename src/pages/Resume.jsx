import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const STYLES = `
  .resume-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

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

  .resume-placeholder {
    position: relative;
    z-index: 1;
    max-width: 560px;
    width: 100%;
    margin: 2rem;
    border: 1px solid var(--border);
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    padding: 4rem;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .resume-placeholder::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent2), transparent);
    opacity: 0.6;
  }

  .resume-placeholder .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    color: var(--accent2);
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .resume-placeholder .eyebrow::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--accent2);
    opacity: 0.6;
    flex-shrink: 0;
  }

  .resume-placeholder h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 300;
    color: var(--text);
    margin-bottom: 1.25rem;
    line-height: 1.1;
  }

  .resume-placeholder p {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 2.5rem;
  }

  .back-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
  }

  .back-link:hover { color: var(--accent); }

  .back-arrow {
    display: inline-block;
    transition: transform 0.2s;
  }

  .back-link:hover .back-arrow {
    transform: translateX(-3px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

export default function Resume() {
  const styleRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = STYLES
    document.head.appendChild(el)
    styleRef.current = el
    return () => el.remove()
  }, [])

  return (
    <div className="resume-page">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="resume-placeholder">
        <div className="eyebrow">Resume</div>
        <h2>Coming<br />Soon</h2>
        <p>Full resume page in progress — experience, skills, and a PDF download link.</p>
        <button className="back-link" onClick={() => navigate('/')}>
          <span className="back-arrow">←</span> Back home
        </button>
      </div>
    </div>
  )
}
