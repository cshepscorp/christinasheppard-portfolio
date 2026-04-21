import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
        Christy Sheppard
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '480px' }}>
        Software Developer · Aspiring Forward Deployed AI Engineer · Richmond, VA
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="https://www.linkedin.com/in/christinasheppard/" target="_blank" rel="noreferrer"
          style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '1rem' }}>
          LinkedIn
        </a>
        <a href="https://github.com/cshepscorp" target="_blank" rel="noreferrer"
          style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '1rem' }}>
          GitHub
        </a>
        <a href="mailto:sheppard.christy@gmail.com"
          style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '1rem' }}>
          Email
        </a>
      </div>
      <p style={{ marginTop: '3rem', fontSize: '0.85rem', color: '#475569' }}>
        Portfolio coming soon.
      </p>
    </div>
  )
}

export default App
