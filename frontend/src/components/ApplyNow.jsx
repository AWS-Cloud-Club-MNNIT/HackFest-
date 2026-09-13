import { motion } from 'framer-motion'
import Reveal from './common/Reveal'
import { staggerContainer, staggerItem } from './common/motion'

const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfC4wL7lV-O1e1214e582i70iB0sB8b2L3w1X8l9vO4N2Y6Q/viewform?usp=sf_link'

const DETAILS = [
  { label: 'Date', value: 'October 1, 2026' },
  { label: 'Duration', value: '72 Hours' },
  { label: 'Mode', value: 'Online' },
  { label: 'Team Size', value: '2–4 Members' },
  { label: 'Eligibility', value: 'Undergraduate Students' },
]

export default function ApplyNow() {
  return (
    <section
      id="invitation"
      className="relative overflow-hidden bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20"
    >
      {/* Background ambient magic glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 0.95, 1], rotate: [0, 90, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#d4af37]/15 via-[#5c3b80]/20 to-transparent blur-[160px]"
      />

      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-4xl px-6">

        {/* Hogwarts Acceptance Letter */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#f7efe1] via-[#e8d7b5] to-[#d8c29b] p-8 text-[#24170f] shadow-[0_0_50px_rgba(212,175,55,0.4)] sm:p-14"
        >

          {/* Wax Seal */}
          <div className="absolute top-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#740001] via-[#8b0000] to-[#3a0000] text-[#f4e8c1] shadow-[0_4px_15px_rgba(0,0,0,0.6)] border-2 border-[#d3a625]">
            <span className="font-harry text-3xl font-bold">H</span>
          </div>

          <div className="max-w-2xl text-left">

            <Reveal
              as="p"
              className="font-display text-xs font-bold uppercase tracking-widest text-[#8c6a15]"
            >
              📜 OFFICIAL HOGWARTS INVITATION
            </Reveal>

            <Reveal
              as="h2"
              delay={0.05}
              className="mt-2 font-harry text-4xl font-bold text-[#24170f] sm:text-6xl"
            >
              WE ARE PLEASED TO INFORM YOU...
            </Reveal>

            <Reveal
              as="p"
              delay={0.08}
              className="mt-4 text-base sm:text-lg leading-relaxed text-[#24170f]/90 font-serif"
            >
              You have received an official invitation to participate in
              HackFest 1.0, a 72-hour Harry Potter-themed online hackathon
              organized by the AWS Student Builder Group at MNNIT Allahabad.
              Gather your team, sharpen your skills, and prepare for the
              challenges ahead.
            </Reveal>

            {/* Register Button */}
            <Reveal delay={0.16} className="mt-8">
              <motion.a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-md border-2 border-[#b89228] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] px-9 py-4 text-sm font-bold uppercase tracking-widest text-[#f4e8c1] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition hover:border-[#f4e8c1] hover:shadow-[0_10px_40px_rgba(212,175,55,0.6)]"
              >
                <span>REGISTER FOR HACKFEST</span>
                <span className="text-lg">✉️</span>
              </motion.a>
            </Reveal>
          </div>

          {/* Event Details */}
          <motion.div
            variants={staggerContainer(0.08, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-12 grid grid-cols-2 gap-4 border-t border-[#b89228]/40 pt-8 sm:grid-cols-5"
          >
            {DETAILS.map((d) => (
              <motion.div
                key={d.label}
                variants={staggerItem}
                className="rounded-lg border border-[#b89228]/50 bg-[#f4e8c1]/70 px-3 py-3 text-center shadow-sm"
              >
                <p className="font-display text-sm font-bold text-[#24170f]">
                  {d.value}
                </p>

                <p className="mt-0.5 text-xs text-[#8c6a15] font-sans uppercase tracking-wider">
                  {d.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}