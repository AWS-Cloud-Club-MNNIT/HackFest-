import { motion } from 'framer-motion'
import Reveal from './common/Reveal'
import { staggerContainer, staggerItem } from './common/motion'
import { useRef } from 'react'

const CARDS = [
  {
    title: 'Codex I: Hands-on Learning',
    body: 'Master practical cloud spells and real-world architectures through immersive builder labs and hands-on guidance.',
    icon: '📜',
    span: 'sm:col-span-2',
  },
  {
    title: 'Codex II: Cloud Computing',
    body: 'Develop high-level mastery in serverless, databases, and DevOps with access to AWS resources and expert council.',
    icon: '⚡',
  },
  {
    title: 'Codex III: Collaborative Guild',
    body: 'Learn, build, and forge powerful teams alongside fellow wizards, sharing knowledge across all branches.',
    icon: '🏰',
  },
  {
    title: 'Codex IV: Wizarding Workshops',
    body: 'Participate in intense technical workshops, expert masterclasses, and interactive hackathons held at Hogwarts.',
    icon: '🔮',
  },
  {
    title: 'Codex V: Career & Networks',
    body: 'Connect with industry arch-mages, mentors, and global cloud champions while unlocking high-tier career paths.',
    icon: '🏆',
    span: 'sm:col-span-2',
  },
]

function SpotlightCard({ card }) {
  const divRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      variants={staggerItem}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`group relative overflow-hidden rounded-xl border border-[#d4af37]/40 bg-gradient-to-br from-[#10182b] via-[#080b16] to-[#24170f] p-6 transition-all duration-300 hover:border-[#d4af37] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] ${card.span ?? ''}`}
    >
      {/* Golden Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(212, 175, 55, 0.15), transparent 40%)',
        }}
      />

      {/* Wax Seal / Parchment Emblem Accent */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#d4af37]/60 bg-[#24170f]/90 text-2xl shadow-[0_0_12px_rgba(212,175,55,0.3)]">
          {card.icon}
        </div>
        <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-semibold text-[#d4af37] uppercase tracking-widest font-sans">
          AWS SBG Archive
        </span>
      </div>

      <div className="relative z-10 mt-5">
        <h3 className="font-display text-xl font-bold text-[#f4e8c1] tracking-wide">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#e8d7b5]/80 font-sans">{card.body}</p>
      </div>

      {/* Parchment Corner Ornament */}
      <div className="absolute bottom-2 right-2 text-xs opacity-30 group-hover:opacity-80 text-[#d4af37]">
        ✦
      </div>
    </motion.div>
  )
}

export default function AboutClub() {
  return (
    <section id="archives" className="relative overflow-hidden bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#5c3b80]/20 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <Reveal as="div" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>📜</span>
            <span>THE HOGWARTS ARCHIVES</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-4xl font-bold text-[#f4e8c1] sm:text-6xl text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            AWS Student Builder Group • MNNIT Allahabad
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg leading-relaxed text-[#e8d7b5]/90 font-serif"
          >
            The AWS Student Builder Group at MNNIT Allahabad is an official AWS-affiliated body dedicated to raising cloud pioneers. Through ancient builder codices, hands-on hackathons, and collaborative wizardry, we equip students to engineer real-world systems.
          </Reveal>
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CARDS.map((c) => (
            <SpotlightCard key={c.title} card={c} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}