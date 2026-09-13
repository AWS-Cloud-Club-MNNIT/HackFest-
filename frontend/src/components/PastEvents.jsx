import { useRef } from 'react'
import { motion } from 'framer-motion'
import Reveal from './common/Reveal'
import { staggerContainer, staggerItem } from './common/motion'

// Vector SVG Icons
const Icons = {
  Train: (
    <svg className="h-7 w-7 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="m8 19-3 3" />
      <path d="m16 19 3 3" />
      <circle cx="8" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
    </svg>
  ),
  Lightning: (
    <svg className="h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
}

const EVENTS = [
  {
    name: 'AWS Cloud Club Induction Workshop',
    date: '21 Dec 2025',
    stat: 'Cloud & DevOps Mastery',
    body: 'The AWS Cloud Club Induction Workshop introduced wizards to cloud fundamentals and scalable system concepts through expert talks, AWS tools, practical industry workflows, and wizarding learning paths in Cloud Computing and DevOps.',
    icon: Icons.Train,
  },
  {
    name: 'AWS OPS-48 Hackathon',
    date: 'Mar 1–3, 2026',
    stat: '400+ Participating Wizards',
    body: 'OPS-48 was a 48-hour online spellcraft hackathon organized by the AWS Cloud Club at MNNIT Allahabad. The event featured AI/ML, Cybersecurity, Blockchain/Web3, and Full-Stack tracks with mandatory AWS cloud integration.',
    icon: Icons.Lightning,
  },
]

export default function PastEvents() {
  const scrollerRef = useRef(null)

  const scrollByCards = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({
      left: dir * (el.clientWidth * 0.8),
      behavior: 'smooth',
    })
  }

  return (
    <section id="past-events" className="relative overflow-hidden bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      {/* Real Vivid Hogwarts Express Steam Train Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/images/hogwarts_express_steam_train_bg.jpg"
          alt="Hogwarts Express Steam Train"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/80 via-[#080b16]/65 to-[#080b16]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20 z-0" />

      <div className="relative mx-auto max-w-6xl px-6 z-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/50 rounded-full px-4 py-1.5 bg-[#10182b]/80 backdrop-blur-md">
              {Icons.Train}
              <span>JOURNEY THROUGH PAST EVENTS</span>
            </Reveal>

            <Reveal
              as="h2"
              delay={0.05}
              className="mt-3 font-harry text-4xl font-bold text-[#f4e8c1] sm:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            >
              HOGWARTS EXPRESS
            </Reveal>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Scroll past events left"
              onClick={() => scrollByCards(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/60 text-[#d4af37] bg-[#10182b]/80 backdrop-blur-md transition hover:border-[#f4e8c1] hover:bg-[#d4af37]/20"
            >
              <ArrowIcon flip />
            </button>

            <button
              type="button"
              aria-label="Scroll past events right"
              onClick={() => scrollByCards(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/60 text-[#d4af37] bg-[#10182b]/80 backdrop-blur-md transition hover:border-[#f4e8c1] hover:bg-[#d4af37]/20"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <motion.div
          ref={scrollerRef}
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {EVENTS.map((ev) => (
            <motion.article
              key={ev.name}
              variants={staggerItem}
              whileHover={{ y: -6, scale: 1.01 }}
              className="w-[85%] flex-none snap-start overflow-hidden rounded-xl border border-[#d4af37]/50 bg-gradient-to-b from-[#10182b]/95 via-[#24170f]/90 to-[#080b16]/95 p-6 shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-md transition hover:border-[#d4af37] sm:w-[48%] lg:w-[45%]"
            >
              <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-4">
                <div>{ev.icon}</div>
                <span className="rounded-full border border-[#d4af37]/50 bg-[#080b16] px-3 py-1 text-xs font-semibold text-[#d4af37]">
                  {ev.date}
                </span>
              </div>

              <div className="mt-5">
                <h3 className="font-harry text-3xl font-bold text-[#f4e8c1]">
                  {ev.name}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-[#e8d7b5] font-sans">
                  {ev.body}
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 rounded bg-[#d4af37]/15 px-3 py-1 text-xs font-bold text-[#d4af37] border border-[#d4af37]/40">
                  {Icons.Lightning}
                  <span>{ev.stat}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ArrowIcon({ flip = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${flip ? 'rotate-180' : ''}`}
    >
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </svg>
  )
}