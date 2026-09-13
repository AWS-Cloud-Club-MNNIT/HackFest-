import { motion } from 'framer-motion'
import { viewport } from './motion'

/**
 * Reveals a heading word by word as it scrolls into view, each word
 * fading and lifting in on a short stagger.
 */
export default function SplitText({ text, className = '', as = 'h2' }) {
  const words = text.split(' ')
  const Tag = motion[as] || motion.h2

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0.15, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}