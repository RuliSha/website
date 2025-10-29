import { Suspense, useMemo } from 'react'

import { NavigationBar } from './components/Navigation/NavigationBar'
import { SectionFallback } from './components/SectionFallback/SectionFallback'
import { useSectionsObserver } from './hooks/useSectionsObserver'
import { sectionRepository } from './lib/content/SectionRepository'
import type { SectionRecord } from './lib/types'
import { ThemeProvider } from './theme/ThemeProvider'
import { getLazySectionComponent } from './sections/registry'

const sections = sectionRepository.getAll()

function AppContent({ sectionRecords }: { sectionRecords: SectionRecord[] }) {
  const sectionIds = useMemo(
    () => sectionRecords.map((section) => section.data.slug),
    [sectionRecords],
  )

  const { activeId: activeSectionId, setActiveId } = useSectionsObserver(sectionIds)

  return (
    <div className="app-shell">
      <NavigationBar
        items={sectionRecords.map((section) => ({
          slug: section.data.slug,
          title: section.data.title,
        }))}
        activeSlug={activeSectionId}
        onNavigate={setActiveId}
      />

      <main className="app-main" id="top">
        {sectionRecords.map((section) => {
          const LazySection = getLazySectionComponent(section.data.component)

          return (
            <Suspense
              key={section.id}
              fallback={<SectionFallback title={section.data.title} />}
            >
              <LazySection
                data={section.data}
                isActive={activeSectionId === section.data.slug}
              />
            </Suspense>
          )
        })}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent sectionRecords={sections} />
    </ThemeProvider>
  )
}
