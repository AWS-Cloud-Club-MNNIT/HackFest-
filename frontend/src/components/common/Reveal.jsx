import { motion } from 'framer-motion'
import { fadeUp, viewport } from './motion'

/**
 * Fades + slides a block up into place the first time it scrolls
 * into view. Wraps any element via the `as` prop.
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  className = '',
  ...props
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}