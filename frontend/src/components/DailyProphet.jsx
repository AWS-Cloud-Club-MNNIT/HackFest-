import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const ARTICLES = [
  {
    date: 'LATEST DECREE • SEPT 2026',
    headline: 'THE SORTING HAT SPEAKS: HACKFEST REGISTRATIONS NOW OPEN AT HOGWARTS!',
    lead: 'Teams across MNNIT Allahabad receive their formal invitation letters to participate in the grandest tech trials of the season.',
    badge: 'BREAKING NEWS',
  },
  {
    date: 'TRIAL RULEBOOK',
    headline: 'MANDATORY AWS CLOUD INTEGRATION DECREED FOR ALL QUALIFYING PROJECTS',
    lead: 'The Ministry of Cloud Technology orders all competing teams to deploy working prototypes utilizing serverless or containerized AWS infrastructure.',
    badge: 'MINISTRY DECREE',
  },
  {
    date: 'GREAT HALL NOTICE',
    headline: 'TOP 15 QUALIFIERS TO GAIN ENTRANCE TO OFFLINE 24-HOUR HACKATHON SPRINT',
    lead: 'Only the fifteen highest scoring teams from Round 1 Owl Trials will step onto the Great Hall floor for the final offline championship.',
    badge: 'SCHEDULE ANNOUNCEMENT',
  },
]

export default function DailyProphet() {
  return (
    <section id="daily-prophet" className="relative bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>📰</span>
            <span>WIZARDING GAZETTE</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            THE DAILY PROPHET
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg text-[#e8d7b5]/90 font-serif leading-relaxed"
          >
            Official announcements, decrees, and live updates straight from the AWS Student Builder Group at MNNIT Allahabad.
          </Reveal>
        </div>

        {/* Newspaper Layout Grid */}
        <div className="mt-14 overflow-hidden rounded-2xl border-4 border-[#b89228] bg-gradient-to-b from-[#f7efe1] via-[#e8d7b5] to-[#d8c29b] p-6 sm:p-10 text-[#24170f] shadow-[0_0_50px_rgba(212,175,55,0.4)]">
          {/* Newspaper Masthead */}
          <div className="border-b-4 border-[#24170f] pb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8c6a15]">
              VOL. 2026 • SPECIAL EDITION • MNNIT CAMPUS GAZETTE
            </span>
            <h3 className="mt-2 font-harry text-5xl font-bold text-[#24170f] sm:text-7xl tracking-wider">
              THE DAILY PROPHET
            </h3>
            <div className="mt-2 flex items-center justify-between border-t border-b border-[#24170f] py-1 text-[11px] font-bold uppercase tracking-wider text-[#8c6a15] font-sans">
              <span>PRICING: Free Invite</span>
              <span>READ & DISTRIBUTE</span>
              <span>MNNIT ALLAHABAD</span>
            </div>
          </div>

          {/* Articles Columns */}
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {ARTICLES.map((art, idx) => (
              <motion.article
                key={art.headline}
                whileHover={{ scale: 1.02 }}
                className={`flex flex-col justify-between ${
                  idx !== ARTICLES.length - 1 ? 'md:border-r md:border-[#24170f]/30 md:pr-6' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#740001] px-2 py-0.5 text-[10px] font-bold text-[#f4e8c1] tracking-wider">
                      {art.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#8c6a15] font-sans">{art.date}</span>
                  </div>

                  <h4 className="mt-4 font-harry text-3xl font-bold text-[#24170f] leading-snug">
                    {art.headline}
                  </h4>

                  <p className="mt-3 text-xs leading-relaxed text-[#24170f]/90 font-serif font-semibold">
                    {art.lead}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#24170f]/20 pt-3 text-right">
                  <span className="text-[10px] font-bold text-[#8c6a15] font-sans uppercase">
                    Read Decree →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
