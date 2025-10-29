import { useEffect, useState } from 'react'

import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

export interface NavigationItem {
  slug: string
  title: string
}

interface NavigationBarProps {
  items: NavigationItem[]
  activeSlug: string | null
  onNavigate?: (slug: string) => void
}

export function NavigationBar({ items, activeSlug, onNavigate }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    if (typeof document === 'undefined') {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isMenuOpen])

  const scrollTo = (slug: string) => {
    const element = document.getElementById(slug)
    if (!element) return

    setIsMenuOpen(false)
    onNavigate?.(slug)
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <nav className="nav__primary" aria-label="Primary">
          <button
            className="nav__toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="nav-drawer"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span className="nav__toggle-icon" aria-hidden="true" />
            <span className="nav__toggle-label">Menu</span>
          </button>

          <div id="nav-drawer" className="nav__drawer">
            <ul className="nav__list">
              {items.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    className={`nav__link ${activeSlug === item.slug ? 'is-active' : ''}`}
                    aria-current={activeSlug === item.slug ? 'page' : undefined}
                    onClick={() => scrollTo(item.slug)}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>

            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
