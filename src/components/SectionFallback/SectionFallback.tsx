export function SectionFallback({ title }: { title: string }) {
  return (
    <section className="section section--fallback" aria-busy="true" aria-label={title}>
      <div className="section__inner">
        <div className="skeleton" />
        <div className="skeleton skeleton--wide" />
      </div>
    </section>
  )
}
