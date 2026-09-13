import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const STAGES = [
  { step: '01', title: 'Great Hall Gathering', desc: '15 Qualifying teams enter the venue for official welcome & project problem statement reveals.', icon: '🏰' },
  { step: '02', title: 'Final Magic Battle', desc: 'Non-stop hackathon sprint with cloud mages, mentor checkpoints, & instant cloud deployment.', icon: '⚡' },
  { step: '03', title: 'Grand Jury Judging', desc: 'Teams demonstrate live working prototypes directly to AWS experts & senior faculty judges.', icon: '⚖️' },
  { step: '04', title: 'House Cup & Trophy Reveal', desc: 'Announcement of the Champion Team, victorious House Cup winner, & goodies distribution.', icon: '🏆' },
]

export default function ChampionshipSection() {
  return (
    <section id="championship" className="relative overflow-hidden bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      {/* Real Cinematic Hogwarts Great Hall Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.88 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/images/great_hall_championship_bg.jpg"
          alt="Hogwarts Great Hall Interior"
          className="h-full w-full object-cover object-center"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/90 via-[#080b16]/75 to-[#080b16]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-15 z-0" />

      {/* Floating Candlelight Icons */}
      <div className="pointer-events-none absolute top-12 left-[20%] text-xl animate-candle opacity-80 z-0">🕯️</div>
      <div className="pointer-events-none absolute top-20 right-[25%] text-xl animate-candle opacity-90 z-0">🕯️</div>
      <div className="pointer-events-none absolute top-16 left-[50%] text-xl animate-candle opacity-85 z-0">🕯️</div>

      <div className="relative mx-auto max-w-6xl px-6 z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>🏰</span>
            <span>ROUND 2 • OFFLINE HOGWARTS CHAMPIONSHIP</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            THE HOGWARTS CHAMPIONSHIP
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg text-[#e8d7b5] font-serif leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            The chosen fifteen enter the Great Hall for the final offline challenge. 24 hours of continuous building, live mentor guidance, and intense competition under the enchanted ceiling.
          </Reveal>
        </div>

        {/* Great Hall Banners Display */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <div className="rounded-md border border-[#d3a625]/60 bg-[#740001]/40 px-4 py-2 text-xs font-bold text-[#d3a625] backdrop-blur-md shadow-md">
            🦁 GRYFFINDOR BANNER
          </div>
          <div className="rounded-md border border-[#aaaaaa]/60 bg-[#1a472a]/40 px-4 py-2 text-xs font-bold text-[#aaaaaa] backdrop-blur-md shadow-md">
            🐍 SLYTHERIN BANNER
          </div>
          <div className="rounded-md border border-[#946b2d]/60 bg-[#0e1a40]/40 px-4 py-2 text-xs font-bold text-[#946b2d] backdrop-blur-md shadow-md">
            🦅 RAVENCLAW BANNER
          </div>
          <div className="rounded-md border border-[#ecb939]/60 bg-[#372e29]/40 px-4 py-2 text-xs font-bold text-[#ecb939] backdrop-blur-md shadow-md">
            🦡 HUFFLEPUFF BANNER
          </div>
        </div>

        {/* 4 Stages Flow */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <motion.div
              key={s.step}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden rounded-xl border border-[#d4af37]/50 bg-gradient-to-b from-[#10182b]/95 via-[#24170f]/90 to-[#080b16]/95 p-6 shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-md hover:border-[#d4af37]"
            >
              <div className="flex items-center justify-between">
                <span className="font-harry text-3xl font-bold text-[#d4af37] opacity-80">
                  {s.step}
                </span>
                <span className="text-3xl">{s.icon}</span>
              </div>

              <h3 className="mt-4 font-display text-lg font-bold text-[#f4e8c1]">
                {s.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#e8d7b5]/85 font-sans">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
