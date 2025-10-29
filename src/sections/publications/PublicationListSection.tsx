import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import type { PublicationListSectionContent } from '../../lib/types'
import type { SectionComponentProps } from '../types'

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function PublicationListSection({
  data,
  isActive,
}: SectionComponentProps<PublicationListSectionContent>) {
  const shouldReduceMotion = useReducedMotion()

  const listMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.3 },
        transition: { staggerChildren: 0.1 },
      }

  return (
    <section
      id={data.slug}
      className={`section section--publications ${isActive ? 'section--active' : ''}`}
      aria-labelledby={`${data.slug}-title`}
    >
      <div className="section__inner">
        <header className="section__header">
          <h2 id={`${data.slug}-title`}>{data.title}</h2>
          {data.description ? <p className="section__description">{data.description}</p> : null}
        </header>

        <motion.ul className="pub-grid" {...listMotionProps}>
          {data.content.items.map((item) => {
            const titleHref = item.primaryUrl ?? item.links?.[0]?.url

            return (
              <motion.li key={item.title} className="pub-card" variants={itemVariants}>
                <div className="pub-card__meta">
                  <span className="pub-card__year">{item.year}</span>
                  <span className="pub-card__venue">{item.venue}</span>
                </div>
                <h3 className="pub-card__title">
                  {titleHref ? (
                    <a href={titleHref} target="_blank" rel="noreferrer noopener" className="pub-card__title-link">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="pub-card__authors">{item.authors}</p>
                {item.summary ? <p className="pub-card__summary">{item.summary}</p> : null}
                {item.tags?.length ? (
                  <ul className="pub-card__tags">
                    {item.tags.map((tag) => (
                      <li key={tag} className="pub-card__tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.links?.length ? (
                  <div className="pub-card__links">
                    {item.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        className="pub-card__link"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

export default memo(PublicationListSection)
