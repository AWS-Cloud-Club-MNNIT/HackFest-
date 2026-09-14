import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

// SVG Crest Icons for each House (Compact size)
const HouseEmblems = {
  Gryffindor: (
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
      <path
        d="M32 4L10 14v18c0 14.5 9.5 25.5 22 28 12.5-2.5 22-13.5 22-28V14L32 4z"
        fill="url(#gryffindorGrad)"
        stroke="#ffd700"
        strokeWidth="2"
      />
      <path
        d="M32 16c-4 0-7 3-7 7 0 3 2 5.5 4.5 6.5C28 32 26 36 24 39h16c-2-3-4-7-5.5-9.5 2.5-1 4.5-3.5 4.5-6.5 0-4-3-7-7-7z"
        fill="#ffd700"
        opacity="0.9"
      />
      <circle cx="32" cy="23" r="2.5" fill="#740001" />
      <path d="M26 44h12l-2 5h-8l-2-5z" fill="#ffd700" />
      <defs>
        <linearGradient id="gryffindorGrad" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#990000" />
          <stop offset="1" stopColor="#400000" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Ravenclaw: (
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
      <path
        d="M32 4L10 14v18c0 14.5 9.5 25.5 22 28 12.5-2.5 22-13.5 22-28V14L32 4z"
        fill="url(#ravenclawGrad)"
        stroke="#38bdf8"
        strokeWidth="2"
      />
      <path
        d="M32 16l-10 10 10 16 10-16L32 16zm-5 11l5-5 5 5-5 7-5-7z"
        fill="#38bdf8"
        opacity="0.9"
      />
      <path d="M20 22l-5 5 5 5M44 22l5 5-5 5" stroke="#f4e8c1" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="ravenclawGrad" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e2a47" />
          <stop offset="1" stopColor="#05101e" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Hufflepuff: (
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
      <path
        d="M32 4L10 14v18c0 14.5 9.5 25.5 22 28 12.5-2.5 22-13.5 22-28V14L32 4z"
        fill="url(#hufflepuffGrad)"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <path
        d="M32 17c-5 0-9 4-9 9 0 7 9 17 9 17s9-10 9-17c0-5-4-9-9-9zm0 12a3 3 0 110-6 3 3 0 010 6z"
        fill="#f59e0b"
        opacity="0.95"
      />
      <path d="M22 42c4-2 7 0 10-2 3 2 6 0 10 2" stroke="#f4e8c1" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="hufflepuffGrad" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#78350f" />
          <stop offset="1" stopColor="#1c1917" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Slytherin: (
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
      <path
        d="M32 4L10 14v18c0 14.5 9.5 25.5 22 28 12.5-2.5 22-13.5 22-28V14L32 4z"
        fill="url(#slytherinGrad)"
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d="M32 16c-4 0-7 2.5-7 6 0 5 8 5 8 10 0 3.5-3 5.5-7 5.5m0-21.5v2.5m7 19v2.5"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect x="25" y="38" width="14" height="10" rx="2" fill="#aaaaaa" />
      <defs>
        <linearGradient id="slytherinGrad" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064e3b" />
          <stop offset="1" stopColor="#022c22" />
        </linearGradient>
      </defs>
    </svg>
  ),
}

const HOUSES_DATA = [
  {
    id: 'gryffindor',
    name: 'Gryffindor',
    domainTitle: 'AI & Machine Learning',
    domainCode: 'AI / ML',
    motto: 'Courage & Intelligence',
    tagline: '"Where Bold Ideas Become Intelligent."',
    logoImg: '/images/house/gryffindor.png',
    emblem: HouseEmblems.Gryffindor,
    glowColor: 'rgba(211, 166, 37, 0.35)',
    bgGradient: 'from-[#2a0808]/90 via-[#180918]/80 to-[#080b16]',
    borderColor: 'border-[#d3a625]/40',
    hoverBorder: 'hover:border-[#ffd700]',
    textColor: 'text-[#f4e8c1]',
    badgeBg: 'bg-[#740001]/60 text-[#ffd700] border-[#d3a625]/40',
    keywords: ['Neural Networks', 'LLMs & GenAI', 'Deep Learning', 'Computer Vision'],
  },
  {
    id: 'ravenclaw',
    name: 'Ravenclaw',
    domainTitle: 'Web Development & Software',
    domainCode: 'Web Dev / Software Eng',
    motto: 'Knowledge & Logic',
    tagline: '"Where Knowledge Builds the Future."',
    logoImg: '/images/house/ravenclaw.png',
    emblem: HouseEmblems.Ravenclaw,
    glowColor: 'rgba(56, 189, 248, 0.35)',
    bgGradient: 'from-[#08182b]/90 via-[#0c1f38]/80 to-[#080b16]',
    borderColor: 'border-[#38bdf8]/35',
    hoverBorder: 'hover:border-[#38bdf8]',
    textColor: 'text-[#e0f2fe]',
    badgeBg: 'bg-[#0e1a40]/70 text-[#38bdf8] border-[#38bdf8]/40',
    keywords: ['Full-Stack Web', 'Cloud Architecture', 'Scalable APIs', 'DevOps & CI/CD'],
  },
  {
    id: 'hufflepuff',
    name: 'Hufflepuff',
    domainTitle: 'Social Impact & Sustainability',
    domainCode: 'Social Impact / EdTech',
    motto: 'Loyalty & Community',
    tagline: '"Where Technology Creates Impact."',
    logoImg: '/images/house/hufflepuff.png',
    emblem: HouseEmblems.Hufflepuff,
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bgGradient: 'from-[#241a08]/90 via-[#1f170b]/80 to-[#080b16]',
    borderColor: 'border-[#f59e0b]/35',
    hoverBorder: 'hover:border-[#f59e0b]',
    textColor: 'text-[#fef3c7]',
    badgeBg: 'bg-[#372e29]/80 text-[#f59e0b] border-[#f59e0b]/40',
    keywords: ['EdTech & Literacy', 'Green Tech', 'Healthcare', 'Community Solutions'],
  },
  {
    id: 'slytherin',
    name: 'Slytherin',
    domainTitle: 'Cybersecurity & FinTech',
    domainCode: 'Cybersecurity / FinTech',
    motto: 'Ambition & Precision',
    tagline: '"Where Strategy Meets Innovation."',
    logoImg: '/images/house/slytherin.png',
    emblem: HouseEmblems.Slytherin,
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgGradient: 'from-[#062419]/90 via-[#0a1c15]/80 to-[#080b16]',
    borderColor: 'border-[#10b981]/35',
    hoverBorder: 'hover:border-[#10b981]',
    textColor: 'text-[#d1fae5]',
    badgeBg: 'bg-[#1a472a]/70 text-[#10b981] border-[#10b981]/40',
    keywords: ['Zero-Trust Security', 'Blockchain Protocols', 'Ethical Hacking', 'FinTech Shields'],
  },
]

export default function HouseDomains() {
  const [hoveredHouse, setHoveredHouse] = useState(null)

  return (
    <section
      id="sorting"
      className="relative overflow-hidden bg-[#080b16] py-16 sm:py-20 border-t border-[#d4af37]/20"
    >
      {/* Background Glow Texture */}
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20 z-0" />

      {/* Ambient Pulsing Aura */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#d4af37]/10 via-[#5c3b80]/15 to-transparent blur-[140px] z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Storytelling Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal
            as="div"
            className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-[#10182b]/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)] backdrop-blur-md"
          >
            <span className="text-xs">🏰</span>
            <span>THE HOUSES AWAIT</span>
          </Reveal>

          <Reveal
            as="p"
            delay={0.03}
            className="mt-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#e8d7b5]/80 uppercase font-sans"
          >
            FOUR HOUSES. FOUR DOMAINS. ONE HACKFEST.
          </Reveal>

          <Reveal
            as="h2"
            delay={0.06}
            className="mt-2 font-harry text-4xl sm:text-6xl font-bold tracking-wide text-[#f4e8c1] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]"
          >
            Choose Your House
          </Reveal>

          <Reveal
            as="p"
            delay={0.09}
            className="mt-3 font-serif text-sm sm:text-lg text-[#e8d7b5]/90 leading-relaxed max-w-xl mx-auto"
          >
            Every problem requires a different kind of magic. Discover the four houses of HackFest and find the domain where your ideas belong.
          </Reveal>
        </div>

        {/* Compact Banners Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {HOUSES_DATA.map((house) => {
            const isHovered = hoveredHouse === house.id
            const isAnyHovered = hoveredHouse !== null

            return (
              <motion.div
                key={house.id}
                onMouseEnter={() => setHoveredHouse(house.id)}
                onMouseLeave={() => setHoveredHouse(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                animate={{
                  scale: isHovered ? 1.015 : isAnyHovered && !isHovered ? 0.985 : 1,
                  opacity: isAnyHovered && !isHovered ? 0.7 : 1,
                }}
                className={`group relative overflow-hidden rounded-xl border ${house.borderColor} ${house.hoverBorder} bg-gradient-to-b ${house.bgGradient} p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.7)] transition-all duration-300`}
                style={{
                  boxShadow: isHovered
                    ? `0 10px 30px ${house.glowColor}, inset 0 0 15px ${house.glowColor}`
                    : '0 6px 20px rgba(0,0,0,0.6)',
                }}
              >
                {/* Subtle Floating Sparkles background on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  {/* Top Row: Crest Emblem + House Name & Code Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] flex items-center justify-center">
                        <img
                          src={house.logoImg}
                          alt={`${house.name} Logo`}
                          className="h-10 sm:h-12 w-auto object-contain"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.triedAlt) {
                              e.currentTarget.dataset.triedAlt = 'true'
                              e.currentTarget.src = `/images/houses/${house.id}.png`
                            } else {
                              e.currentTarget.style.display = 'none'
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.classList.remove('hidden')
                              }
                            }
                          }}
                        />
                        <div className="hidden">
                          {house.emblem}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-harry text-2xl sm:text-3xl font-bold tracking-wider text-[#f4e8c1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {house.name}
                        </h3>
                        <p className="text-[10px] font-semibold tracking-widest text-[#d4af37] uppercase font-sans">
                          {house.motto}
                        </p>
                      </div>
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase border ${house.badgeBg} shadow-sm`}>
                      {house.domainCode}
                    </span>
                  </div>

                  {/* Middle Content: Domain Title & Tagline */}
                  <div className="mt-3.5">
                    <h4 className={`text-base sm:text-lg font-bold font-display ${house.textColor} tracking-wide group-hover:text-[#ffffff] transition-colors`}>
                      {house.domainTitle}
                    </h4>

                    <p className="mt-1 font-serif text-xs sm:text-sm italic text-[#e8d7b5]/85">
                      {house.tagline}
                    </p>
                  </div>

                  {/* Technology Keywords */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {house.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded border border-[#d4af37]/20 bg-[#080b16]/70 px-2 py-0.5 text-[11px] font-medium text-[#e8d7b5] backdrop-blur-sm group-hover:border-[#d4af37]/45 group-hover:text-[#f4e8c1] transition"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
