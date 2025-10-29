import { createElement, memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import type {
  RichTextBlock,
  RichTextSectionContent,
} from '../../lib/types'
import type { SectionComponentProps } from '../types'

const paragraphVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const spotlightVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

function renderBlock(block: RichTextBlock) {
  if (block.type === 'paragraph') {
    return <p className="rt-block">{block.text}</p>
  }

  if (block.type === 'heading') {
    const level = Math.min(Math.max(block.level, 1), 4) as 1 | 2 | 3 | 4
    const tagName = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
    return createElement(tagName, { className: 'rt-heading' }, block.text)
  }

  return (
    <div className="rt-block">
      {block.title ? <h4 className="rt-list-title">{block.title}</h4> : null}
      <ul className={`rt-list rt-list--${block.style}`}>
        {block.items.map((item) => (
          <li key={item} className="rt-list-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RichTextSection({
  data,
  isActive,
}: SectionComponentProps<RichTextSectionContent>) {
  const { hero, content, spotlight } = data
  const shouldReduceMotion = useReducedMotion()

  const heroMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.6 },
        transition: { staggerChildren: 0.08 },
      }

  const bodyMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.4 },
        transition: { staggerChildren: 0.1 },
      }

  const spotlightMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.5 },
        transition: { staggerChildren: 0.12 },
      }

  const hasSpotlight = Boolean(spotlight?.items?.length)
  const hasProfileColumn = Boolean(hero?.image?.src || hero?.eyebrow || hasSpotlight)

  return (
    <section
      id={data.slug}
      className={`section section--rich-text ${isActive ? 'section--active' : ''}`}
      aria-labelledby={`${data.slug}-title`}
    >
      <div className="section__inner">
        <div
          className={`section__content rt-layout ${hasProfileColumn ? 'rt-layout--two-column' : ''}`}
        >
          {hasProfileColumn ? (
            <motion.div className="rt-profile" {...heroMotionProps}>
              {hero?.image?.src ? (
                <motion.figure className="rt-profile__portrait" variants={paragraphVariant}>
                  <img src={hero.image.src} alt={hero.image.alt ?? ''} loading="lazy" />
                </motion.figure>
              ) : null}

              {hero?.eyebrow ? (
                <motion.p className="rt-profile__role" variants={paragraphVariant}>
                  {hero.eyebrow}
                </motion.p>
              ) : null}

              {hasSpotlight ? (
                <motion.div className="rt-spotlight" {...spotlightMotionProps}>
                  {spotlight!.items.map((item) => (
                    <motion.div key={item.label} className="rt-spotlight-card" variants={spotlightVariant}>
                      <span className="rt-spotlight-label">{item.label}</span>
                      <span className="rt-spotlight-value">{item.value}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
            </motion.div>
          ) : null}

          <div className="rt-main">
            <motion.header className="rt-header" {...heroMotionProps}>
              <motion.h2 id={`${data.slug}-title`} className="rt-title" variants={paragraphVariant}>
                {data.title}
              </motion.h2>

              {hero?.headline ? (
                <motion.h3 className="rt-headline" variants={paragraphVariant}>
                  {hero.headline}
                </motion.h3>
              ) : null}

              {hero?.subtitle ? (
                <motion.p className="rt-subtitle" variants={paragraphVariant}>
                  {hero.subtitle}
                </motion.p>
              ) : null}
              {content.lead ? (
                <motion.p className="rt-lead" variants={paragraphVariant}>
                  {content.lead}
                </motion.p>
              ) : null}
            </motion.header>

            <motion.div className="rt-body" {...bodyMotionProps}>
              {content.blocks.map((block, index) => (
                <motion.div key={`${data.slug}-block-${index}`} variants={paragraphVariant}>
                  {renderBlock(block)}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(RichTextSection)
