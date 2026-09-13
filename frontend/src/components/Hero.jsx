
import { motion } from 'framer-motion'
import OrbitChip from './visuals/OrbitChip'
import { staggerContainer, staggerItem } from './common/motion'

export default function Hero() {
  const handleEnterMagic = (e) => {
    e.preventDefault()

    const element = document.getElementById('sorting')

    if (element) {
      const topPos =
        element.getBoundingClientRect().top + window.scrollY - 75

      window.scrollTo({
        top: Math.max(0, topPos),
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#080b16] pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Hogwarts Castle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.88 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/images/hogwarts_castle_hero_bg.jpg"
          alt="Hogwarts Castle at Night"
          className="h-full w-full object-cover object-center"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/70 via-[#080b16]/40 to-[#080b16]/95" />
      </div>

      {/* Grid Texture */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-hogwarts-grid opacity-25" />

      {/* Ambient Golden Glow */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="pointer-events-none absolute -top-40 right-[-10%] z-0 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#d4af37]/35 via-[#5c3b80]/30 to-transparent blur-[140px]"
      />

      {/* Hero Content */}
      <motion.div
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6"
      >
        {/* Organizer Badge */}
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#d4af37]/80 bg-[#080b16]/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f4e8c1] shadow-[0_0_25px_rgba(212,175,55,0.4)] backdrop-blur-md"
        >
          <svg
            className="h-4 w-4 text-[#d4af37]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
          </svg>

          <span>AWS STUDENT BUILDER GROUP • MNNIT ALLAHABAD</span>
        </motion.div>
        
        <motion.img
          variants={staggerItem}
          src="/images/hackfest/hackfest_logo.png"
          alt="HackFest 1.0"
          className="mt-6 w-64 sm:w-80 md:w-[420px] lg:w-[500px] h-auto object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)]"
        />

        {/* Theme Label */}
        <motion.div
          variants={staggerItem}
          className="mt-1 flex items-center justify-center gap-3"
        >
          <span className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="font-display text-sm font-bold tracking-widest text-[#d4af37] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            72-HOURS HACKATHON
          </span>

          <span className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
        </motion.div>

        {/* Main Description */}
        <motion.p
          variants={staggerItem}
          className="mt-6 max-w-2xl rounded-xl border border-[#d4af37]/30 bg-[#080b16]/50 p-4 font-serif text-base leading-relaxed text-[#ffffff] drop-shadow-[0_3px_10px_rgba(0,0,0,0.98)] backdrop-blur-sm sm:text-xl"
        >
          A 72-hour online hackathon where
          undergraduate witches and wizards wield AWS's Magic
          Infrastructure across AI/ML, Cloud, DevOps, and Cybersecurity
          to solve real-world challenges.
        </motion.p>

        {/* Event Information */}
        <motion.div
          variants={staggerItem}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          {/* Date */}
          <span className="rounded-full border border-[#d4af37]/50 bg-[#080b16]/80 px-4 py-2 text-sm font-semibold text-[#f4e8c1] backdrop-blur-md">
            📅 1 OCTOBER 2026
          </span>

          {/* Duration */}
          <span className="rounded-full border border-[#d4af37]/50 bg-[#080b16]/80 px-4 py-2 text-sm font-semibold text-[#f4e8c1] backdrop-blur-md">
            ⚡ 72 HOURS
          </span>

          {/* Venue */}
          <span className="rounded-full border border-[#d4af37]/50 bg-[#080b16]/80 px-4 py-2 text-sm font-semibold text-[#f4e8c1] backdrop-blur-md">
            🌐 ONLINE
          </span>

          {/* Team Size */}
          <span className="rounded-full border border-[#d4af37]/50 bg-[#080b16]/80 px-4 py-2 text-sm font-semibold text-[#f4e8c1] backdrop-blur-md">
            🪄 2–4 MEMBERS
          </span>
        </motion.div>

        {/* Primary & Secondary CTAs */}
        <motion.div
          variants={staggerItem}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#sorting"
            onClick={handleEnterMagic}
            className="group relative flex items-center gap-2.5 rounded-md border-2 border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[#f4e8c1] shadow-[0_0_35px_rgba(212,175,55,0.6)] transition hover:border-[#ffffff] hover:shadow-[0_0_55px_rgba(212,175,55,0.9)]"
          >
            <span>REGISTER NOW</span>
            <svg className="h-4 w-4 text-[#d4af37] transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
            </svg>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#trials"
            className="flex items-center gap-2 rounded-md border border-[#d4af37]/80 bg-[#080b16]/90 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[#e8d7b5] backdrop-blur-md transition hover:border-[#d4af37] hover:bg-[#10182b] hover:text-[#f4e8c1]"
          >
            <span>EXPLORE HACKFEST</span>
            <svg className="h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Magic Matrix Visual */}
        <motion.div
          variants={staggerItem}
          className="mt-14 w-full sm:mt-18"
        >
          <OrbitChip />
        </motion.div>
      </motion.div>
    </section>
  )
}

