import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

// Crisp Vector SVG Icons for Wizard Teams
const TeamIcons = {
  Web: (
    <svg className="h-8 w-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Design: (
    <svg className="h-8 w-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Marketing: (
    <svg className="h-8 w-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Technical: (
    <svg className="h-8 w-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
}

const BUILDERS = [
  { name: 'Web Team', role: 'Web Development & Frontend Guild', wizardClass: 'Web Wizards', icon: TeamIcons.Web, color: 'border-[#d4af37]' },
  { name: 'Design Team', role: 'UI/UX & Creative Arts Guild', wizardClass: 'Design Wizards', icon: TeamIcons.Design, color: 'border-[#d4af37]' },
  { name: 'Marketing & PR Team', role: 'Outreach, Media & Communications Guild', wizardClass: 'Media Wizards', icon: TeamIcons.Marketing, color: 'border-[#d4af37]' },
  { name: 'Technical Team', role: 'Cloud, DevOps & Hackathon Systems Guild', wizardClass: 'Technical Wizards', icon: TeamIcons.Technical, color: 'border-[#d4af37]' },
]

export default function OrderOfBuilders() {
  return (
    <section id="order" className="relative bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <svg className="h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
            </svg>
            <span>AWS SBG LEADERSHIP</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            THE ORDER OF BUILDERS
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg text-[#e8d7b5]/90 font-serif leading-relaxed"
          >
            The dedicated wizarding teams of the AWS Student Builder Group at MNNIT Allahabad orchestrating the Hogwarts Hackfest experience.
          </Reveal>
        </div>

        {/* 4 Required Teams Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BUILDERS.map((b) => (
            <motion.div
              key={b.name}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative overflow-hidden rounded-xl border-2 ${b.color} bg-gradient-to-b from-[#10182b] via-[#24170f] to-[#080b16] p-6 shadow-[0_0_20px_rgba(212,175,55,0.2)] text-center`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/60 bg-[#080b16] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                {b.icon}
              </div>

              <span className="mt-4 inline-block rounded-full bg-[#d4af37]/15 px-3 py-1 text-[11px] font-bold text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-widest font-sans">
                {b.wizardClass}
              </span>

              <h3 className="mt-3 font-harry text-3xl font-bold text-[#f4e8c1]">
                {b.name}
              </h3>

              <p className="mt-1 text-xs text-[#e8d7b5]/80 font-sans font-medium">
                {b.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
