import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c10;
    --surface: #0d1117;
    --border: rgba(255,255,255,0.07);
    --text: #e8edf2;
    --muted: #4a5568;
    --accent: #7eb8d4;
    --accent2: #c4a882;
    --glow: rgba(126, 184, 212, 0.15);
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    background: var(--bg);
    color: var(--text);
  }

  .container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(126,184,212,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(126,184,212,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .bg-glow {
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(ellipse, rgba(126,184,212,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .card {
    position: relative;
    z-index: 1;
    max-width: 680px;
    width: 100%;
    border: 1px solid var(--border);
    background: rgba(13,17,23,0.8);
    backdrop-filter: blur(20px);
    padding: 4rem 4rem;
    animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card::before {
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
  }

  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 10vw, 4.5rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 1.5rem;
    text-align: left;
  }

  h1 span {
    color: var(--accent2);
    font-style: italic;
  }

  .tagline {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 3rem;
    max-width: 420px;
    text-align: left;
  }

  .tagline strong {
    color: rgba(232,237,242,0.6);
    font-weight: 400;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--border);
    margin-bottom: 2.5rem;
  }

  .links {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
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

  .link:hover {
    color: var(--accent);
  }

  .link:hover::after {
    width: 100%;
  }

  .link-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.5;
    flex-shrink: 0;
  }

  .footer-note {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: rgba(74,85,104,0.5);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    z-index: 1;
    white-space: nowrap;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .container { padding: 1.5rem 1rem; align-items: stretch; }
    .card { padding: 2.5rem 1.75rem; }
    .links { gap: 1.25rem; flex-direction: column; }
    .footer-note { font-size: 0.6rem; width: 90%; text-align: center; }
  }

  @media (max-width: 400px) {
    .card { padding: 2rem 1.25rem; }
  }
`;

export default function App() {
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = styles;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  return (
    <div className="container">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="card">
        <div className="eyebrow">Software Developer</div>

        <h1>
          Christy<br />
          <span>Sheppard</span>
        </h1>

        <p className="tagline">
          Building <strong>web applications & AI-powered interfaces</strong> at the
          intersection of complex systems and real-world business needs.
          Based in <strong>Richmond, VA</strong> — open to remote opportunities.
        </p>

        <div className="divider" />

        <div className="links">
          <a className="link" href="https://www.linkedin.com/in/christinasheppard/" target="_blank" rel="noreferrer">
            <span className="link-dot" />
            LinkedIn
          </a>
          <a className="link" href="https://github.com/cshepscorp" target="_blank" rel="noreferrer">
            <span className="link-dot" />
            GitHub
          </a>
          <a className="link" href="mailto:sheppard.christy@gmail.com">
            <span className="link-dot" />
            Email
          </a>
        </div>
      </div>

      <div className="footer-note">Portfolio in progress · christinasheppard.com</div>
    </div>
  );
}