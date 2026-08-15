"use client"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  // Use a deterministic initial theme to avoid SSR/client hydration mismatch.
  const [theme, setTheme] = useState<string>('light')

  // On mount, read persisted preference or media query and update theme.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored)
        return
      }
    } catch (e) {
      // ignore
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  // Apply theme to document and persist when it changes (runs only on client)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('theme-dark')
    else root.classList.remove('theme-dark')
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/60 shadow-sm border"
      title="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="var(--brand-500)" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="4" fill="var(--brand-500)" />
          <g stroke="var(--navy-700)" strokeWidth="1.5">
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </g>
        </svg>
      )}
    </button>
  )
}
