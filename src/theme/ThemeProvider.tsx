import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  type ColorSchemeSetting,
  type ResolvedColorScheme,
  type ThemeDefinition,
} from '../lib/types'
import { themeRepository } from '../lib/theme/themeRepository'
import { ThemeContext } from './context'

const LOCAL_STORAGE_KEY = 'website-theme-preference'
const mediaQuery = '(prefers-color-scheme: dark)'

const themeDefinition = themeRepository.getDefinition()

function readStoredScheme(): ColorSchemeSetting | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!stored) {
    return null
  }

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return null
}

function getSystemScheme(): ResolvedColorScheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(mediaQuery).matches ? 'dark' : 'light'
}

function resolveScheme(
  setting: ColorSchemeSetting,
  systemScheme: ResolvedColorScheme,
): ResolvedColorScheme {
  return setting === 'system' ? systemScheme : setting
}

function applyTheme(
  definition: ThemeDefinition,
  scheme: ResolvedColorScheme,
): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const palette = definition.schemes[scheme].colors
  const { spacing, radii, typography, layout } = definition
  const shadowTokens = { ...definition.shadows, ...definition.schemes[scheme].shadows }

  const cssVariables: Record<string, string> = {
    '--color-background': palette.background,
    '--color-surface': palette.surface,
    '--color-surface-alt': palette.surfaceAlt,
    '--color-text': palette.text,
    '--color-text-muted': palette.textMuted,
    '--color-primary': palette.primary,
    '--color-primary-contrast': palette.primaryContrast,
    '--color-accent': palette.accent,
    '--color-border': palette.border,
    '--font-family-base': typography.fontFamily,
    '--font-family-heading': typography.headingFamily,
    '--font-size-base': `${typography.baseSize}px`,
    '--line-height-snug': `${typography.lineHeights.snug ?? 1.25}`,
    '--line-height-normal': `${typography.lineHeights.normal ?? 1.6}`,
    '--layout-content-width': `${layout.contentWidth}px`,
    '--layout-max-width-narrow': `${layout.maxWidthNarrow}px`,
    '--layout-section-gap': `${layout.sectionGap}px`,
    '--layout-nav-height': `${layout.navHeight}px`,
  }

  Object.entries(spacing).forEach(([token, value]) => {
    cssVariables[`--space-${token}`] = `${value}px`
  })

  Object.entries(radii).forEach(([token, value]) => {
    cssVariables[`--radius-${token}`] = `${value}px`
  })

  Object.entries(shadowTokens).forEach(([token, value]) => {
    cssVariables[`--shadow-${token}`] = value
  })

  Object.entries(cssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value)
  })

  root.setAttribute('data-color-scheme', scheme)
  root.style.setProperty('color-scheme', scheme)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultScheme = themeDefinition.defaultScheme ?? 'system'

  const [scheme, setSchemeState] = useState<ColorSchemeSetting>(() => {
    return readStoredScheme() ?? defaultScheme
  })

  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>(() =>
    getSystemScheme(),
  )

  const resolvedScheme = useMemo(
    () => resolveScheme(scheme, systemScheme),
    [scheme, systemScheme],
  )

  useEffect(() => {
    applyTheme(themeDefinition, resolvedScheme)
  }, [resolvedScheme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaList = window.matchMedia(mediaQuery)

    const listener = (event: MediaQueryListEvent) => {
      setSystemScheme(event.matches ? 'dark' : 'light')
    }

    mediaList.addEventListener('change', listener)
    return () => mediaList.removeEventListener('change', listener)
  }, [])

  const setScheme = useCallback((value: ColorSchemeSetting) => {
    setSchemeState(value)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, value)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      definition: themeDefinition,
      scheme,
      resolvedScheme,
      setScheme,
    }),
    [scheme, resolvedScheme, setScheme],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
