import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement, SVGProps } from 'react'

import type { ColorSchemeSetting } from '../../lib/types'
import { useTheme } from '../../theme/useTheme'

type IconProps = SVGProps<SVGSVGElement>

const OPTIONS: Array<{
  value: ColorSchemeSetting
  label: string
  Icon: (props: IconProps) => ReactElement
}> = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'Auto', Icon: SystemIcon },
  { value: 'dark', label: 'Dark', Icon: HalfMoonIcon },
]

export function ThemeToggle() {
  const { scheme, resolvedScheme, setScheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const triggerId = useId()
  const menuId = `${triggerId}-menu`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return

      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const focusOption = (value: ColorSchemeSetting) => {
    const option = menuRef.current?.querySelector<HTMLButtonElement>(
      `[data-theme-option="${value}"]`,
    )
    option?.focus()
  }

  const openMenu = () => {
    if (isOpen) {
      return
    }

    setIsOpen(true)
    requestAnimationFrame(() => {
      focusOption(scheme)
    })
  }

  const closeMenu = () => {
    if (!isOpen) {
      return
    }

    setIsOpen(false)
    requestAnimationFrame(() => {
      triggerRef.current?.focus()
    })
  }

  const handleTriggerClick = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMenu()
    }
  }

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[data-theme-option]') ?? [],
    )

    if (items.length === 0) {
      return
    }

    if (event.key === 'Tab') {
      setIsOpen(false)
      return
    }

    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
      items[nextIndex]?.focus()
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const previousIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1
      items[previousIndex]?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      items[0]?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      items[items.length - 1]?.focus()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
    }
  }

  const handleOptionSelect = (value: ColorSchemeSetting) => {
    setScheme(value)
    closeMenu()
  }

  const ActiveIcon = resolvedScheme === 'dark' ? HalfMoonIcon : SunIcon

  return (
    <div className={`theme-toggle${isOpen ? ' is-open' : ''}`}>
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className="theme-toggle__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-label="Change color theme"
      >
        <ActiveIcon className="theme-toggle__icon" aria-hidden="true" focusable="false" />
      </button>

      <div
        id={menuId}
        ref={menuRef}
        role="menu"
        className="theme-toggle__menu"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        onKeyDown={handleMenuKeyDown}
      >
        {OPTIONS.map(({ value, label, Icon }) => {
          const isSelected = scheme === value

          return (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={isSelected}
              tabIndex={-1}
              className={`theme-toggle__item${isSelected ? ' is-selected' : ''}`}
              data-theme-option={value}
              onClick={() => handleOptionSelect(value)}
            >
              <Icon className="theme-toggle__item-icon" aria-hidden="true" focusable="false" />
              <span className="theme-toggle__item-label">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5.22 5.22 6.64 6.64" />
      <path d="M17.36 17.36 18.78 18.78" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5.22 18.78 6.64 17.36" />
      <path d="M17.36 6.64 18.78 5.22" />
    </svg>
  )
}

function HalfMoonIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      <path d="M15.5 6.5a3 3 0 0 0 3 3" />
    </svg>
  )
}

function SystemIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  )
}
