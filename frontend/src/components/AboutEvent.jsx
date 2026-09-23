import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import SplitText from './common/SplitText'
import Reveal from './common/Reveal'
import { staggerContainer, staggerItem } from './common/motion'
import { useRef } from 'react'

const HIGHLIGHTS = [
  {
    title: 'The Pitching Spell',
    body: 'Begin your Hackfest journey by submitting your idea or pitch before the main 72-hour challenge begins.',
    icon: '🪄',
  },
  {
    title: 'The Quests Are Revealed',
    body: 'The problem statements are finalized and released, preparing the shortlisted teams for the main challenge.',
    icon: '📜',
  },
  {
    title: 'The Triwizard Challenge',
    body: 'The Top 50 teams enter a 72-hour online sprint from 16–18 October to design, build, and develop their solutions.',
    icon: '⚡',
  },
  {
    title: 'The Grand Finale',
    body: 'The Top 15 teams advance to the offline Grand Finale on 1 November to present and demonstrate their solutions.',
    icon: '🏆',
  },
]

function TiltCard() {
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, {
    stiffness: 150,
    damping: 15,
  })

  const mouseYSpring = useSpring(y, {
    stiffness: 150,
    damping: 15,
  })

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['7.5deg', '-7.5deg']
  )

  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-7.5deg', '7.5deg']
  )

  const handleMouseMove = (e) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / rect.width - 0.5
    const yPct = mouseY / rect.height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className="group relative aspect-[3/4] w-full max-w-lg min-h-[500px] sm:min-h-[560px] overflow-hidden rounded-2xl border-2 border-[#d4af37] bg-[#080b16] shadow-[0_0_45px_rgba(212,175,55,0.4)] transition-all duration-300"
    >
      {/* Official Poster Image Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/aws_triwizard_card_bg.jpg"
          alt="HackFest 1.0 Official Poster"
          className="h-full w-full object-cover object-top opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        {/* Subtle Dark Scrim at bottom only */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b16]/90 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Content Overlay at Bottom */}
      <div
        style={{ transform: 'translateZ(45px)' }}
        className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              THE TRIWIZARD CHALLENGE
            </p>
            <p className="font-harry text-3xl sm:text-4xl font-bold text-[#f4e8c1] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              72-HOUR SPRINT
            </p>
          </div>
          <span className="rounded-full bg-[#10182b]/90 border border-[#d4af37]/60 px-3 py-1 text-xs font-bold text-[#d4af37] shadow-lg backdrop-blur-sm">
            16–18 OCT
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function AboutEvent() {
  return (
    <section
      id="trials"
      className="relative border-t border-[#d4af37]/20 bg-[#080b16] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal
            as="div"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]"
          >
            <span>⚡</span>

            <span>
              HACKFEST 2026 • THE TRIWIZARD CHALLENGE
            </span>
          </Reveal>

          <SplitText
            text="HOGWARTS LEGACY: THE MAGIC BEGINS."
            className="mt-3 text-balance font-harry text-3xl font-bold text-[#f4e8c1] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Main Event Card */}
          <Reveal className="perspective-[1000px] flex w-full justify-center">
            <TiltCard />
          </Reveal>

          {/* Description & Highlights */}
          <div>
            <Reveal
              as="p"
              className="text-base font-serif leading-relaxed text-[#e8d7b5]/90 sm:text-lg"
            >
              Hackfest 2026  72-hour online
              hackathon presented by the AWS Student Builder Group at
              MNNIT Allahabad. Undergraduate witches and wizards wield
              AWS's Magic Infrastructure across AI/ML, Cloud, DevOps,
              and Cybersecurity to solve real-world challenges.
            </Reveal>

            {/* Event Details */}
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {/* Date */}
              <motion.div
                variants={staggerItem}
                className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#10182b] to-[#080b16] p-4 transition hover:border-[#d4af37]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    📅
                  </span>

                  <p className="font-display text-sm font-bold text-[#d4af37]">
                    START DATE
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#f4e8c1]">
                  1 October 2026
                </p>
              </motion.div>

              {/* Duration */}
              <motion.div
                variants={staggerItem}
                className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#10182b] to-[#080b16] p-4 transition hover:border-[#d4af37]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    ⚡
                  </span>

                  <p className="font-display text-sm font-bold text-[#d4af37]">
                    DURATION
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#f4e8c1]">
                  72 Hours
                </p>
              </motion.div>

              {/* Venue */}
              <motion.div
                variants={staggerItem}
                className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#10182b] to-[#080b16] p-4 transition hover:border-[#d4af37]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    🌐
                  </span>

                  <p className="font-display text-sm font-bold text-[#d4af37]">
                    VENUE
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#f4e8c1]">
                  Online
                </p>
              </motion.div>

              {/* Team Size */}
              <motion.div
                variants={staggerItem}
                className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#10182b] to-[#080b16] p-4 transition hover:border-[#d4af37]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    🪄
                  </span>

                  <p className="font-display text-sm font-bold text-[#d4af37]">
                    TEAM SIZE
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#f4e8c1]">
                  2–4 Members
                </p>
              </motion.div>
            </motion.div>

            {/* Highlights Grid */}
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {HIGHLIGHTS.map((h) => (
                <motion.div
                  key={h.title}
                  variants={staggerItem}
                  className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#10182b] to-[#080b16] p-4 transition hover:border-[#d4af37]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {h.icon}
                    </span>

                    <p className="font-display text-sm font-bold text-[#d4af37]">
                      {h.title}
                    </p>
                  </div>

                  <p className="mt-2 font-sans text-xs leading-relaxed text-[#e8d7b5]/80">
                    {h.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Timeline Flow Bar */}
            <div className="mt-10 rounded-xl border border-[#d4af37]/40 bg-[#10182b]/80 p-5 backdrop-blur">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                THE HACKFEST JOURNEY
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#f4e8c1]">
                <span className="rounded border border-[#d4af37]/30 bg-[#24170f] px-2.5 py-1">
                  THE PITCHING SPELL
                </span>

                <span className="text-[#d4af37]">
                  →
                </span>

                <span className="rounded border border-[#d4af37]/30 bg-[#24170f] px-2.5 py-1">
                  THE QUESTS
                </span>

                <span className="text-[#d4af37]">
                  →
                </span>

                <span className="rounded border border-[#9d4edf] bg-[#5c3b80]/40 px-2.5 py-1">
                  TOP 50
                </span>

                <span className="text-[#d4af37]">
                  →
                </span>

                <span className="rounded border border-[#9d4edf] bg-[#5c3b80]/40 px-2.5 py-1">
                  TRIWIZARD CHALLENGE
                </span>

                <span className="text-[#d4af37]">
                  →
                </span>

                <span className="rounded border border-[#d4af37] bg-[#d4af37]/20 px-2.5 py-1 text-[#d4af37]">
                  TOP 15
                </span>

                <span className="text-[#d4af37]">
                  →
                </span>

                <span className="rounded border border-[#d4af37]/30 bg-[#24170f] px-2.5 py-1">
                  GRAND FINALE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <Reveal
          as="div"
          className="mt-16 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-r from-[#10182b] to-[#080b16] p-6 sm:p-8"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
            IMPORTANT DATES
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#d4af37]/20 bg-[#080b16]/70 p-5 text-center">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Hackfest Begins
              </p>

              <p className="mt-2 font-harry text-2xl font-bold text-[#f4e8c1]">
                1 October
              </p>

              <p className="mt-1 text-xs text-[#e8d7b5]/70">
                Idea & Pitch Submission
              </p>
            </div>

            <div className="rounded-xl border border-[#d4af37]/20 bg-[#080b16]/70 p-5 text-center">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Triwizard Challenge
              </p>

              <p className="mt-2 font-harry text-2xl font-bold text-[#f4e8c1]">
                16–18 October
              </p>

              <p className="mt-1 text-xs text-[#e8d7b5]/70">
                72-Hour Online Sprint
              </p>
            </div>

            <div className="rounded-xl border border-[#d4af37]/20 bg-[#080b16]/70 p-5 text-center">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Grand Finale
              </p>

              <p className="mt-2 font-harry text-2xl font-bold text-[#f4e8c1]">
                1 November
              </p>

              <p className="mt-1 text-xs text-[#e8d7b5]/70">
                Offline • Top 15 Teams
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}