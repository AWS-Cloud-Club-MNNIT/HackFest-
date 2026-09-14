import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const HOUSES = [
  { name: 'Gryffindor', logo: '/images/house/gryffindor.png', borderColor: 'border-[#740001]/60', bg: 'bg-[#740001]/30', color: 'text-[#eeba30]' },
  { name: 'Slytherin', logo: '/images/house/slytherin.png', borderColor: 'border-[#1a472a]/60', bg: 'bg-[#1a472a]/30', color: 'text-[#aaaaaa]' },
  { name: 'Ravenclaw', logo: '/images/house/ravenclaw.png', borderColor: 'border-[#0e1a40]/60', bg: 'bg-[#0e1a40]/30', color: 'text-[#946b2d]' },
  { name: 'Hufflepuff', logo: '/images/house/hufflepuff.png', borderColor: 'border-[#ecb939]/60', bg: 'bg-[#372e29]/30', color: 'text-[#ecb939]' },
]

const STAGES = [
  { step: '01', title: 'Great Hall Gathering', desc: '15 Qualifying teams enter the venue for official welcome & project problem statement reveals.', icon: '🏰' },
  { step: '02', title: 'Final Magic Battle', desc: 'Non-stop hackathon sprint with cloud mages, mentor checkpoints, & instant cloud deployment.', icon: '⚡' },
  { step: '03', title: 'Grand Jury Judging', desc: 'Teams demonstrate live working prototypes directly to AWS experts & senior faculty judges.', icon: '⚖️' },
  { step: '04', title: 'Grand Finale & Rewards', desc: 'Announcement of the Champion Team, track winners, and distribution of prizes & goodies.', icon: '🏆' },
]

export default function ChampionshipSection() {
  return (
    <section id="championship" className="relative overflow-hidden bg-[#080b16] py-20 sm:py-32 border-t border-[#d4af37]/20">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/95 via-[#080b16]/80 to-[#080b16]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-15 z-0" />

      {/* Floating Candlelight Icons */}
      <div className="pointer-events-none absolute top-12 left-[20%] text-xl animate-candle opacity-80 z-0">🕯️</div>
      <div className="pointer-events-none absolute top-20 right-[25%] text-xl animate-candle opacity-90 z-0">🕯️</div>
      <div className="pointer-events-none absolute top-16 left-[50%] text-xl animate-candle opacity-85 z-0">🕯️</div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/60 bg-[#10182b]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-md">
            <span>🏰</span>
            <span>ROUND 2 • OFFLINE HOGWARTS CHAMPIONSHIP</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl sm:text-7xl font-bold tracking-wide text-[#f4e8c1] drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]"
          >
            The Hogwarts Championship
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-xl text-[#e8d7b5] font-serif leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-2xl mx-auto"
          >
            The chosen fifteen enter the Great Hall for the final offline challenge. 24 hours of continuous building, live mentor guidance, and intense competition under the enchanted ceiling.
          </Reveal>
        </div>

        {/* Four Houses Crest Display */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
          {HOUSES.map((h) => (
            <motion.div
              key={h.name}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2.5 rounded-xl border ${h.borderColor} ${h.bg} px-4 py-2 backdrop-blur-md shadow-lg`}
            >
              <img src={h.logo} alt={h.name} className="h-6 w-6 object-contain drop-shadow-[0_0_6px_rgba(252,211,77,0.4)]" />
              <span className={`font-harry text-sm sm:text-base font-bold ${h.color} tracking-wider`}>
                {h.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* 4 Stages Flow */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl border border-[#d4af37]/40 bg-gradient-to-b from-[#10182b]/95 via-[#1a130c]/90 to-[#080b16]/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md hover:border-[#d4af37] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-harry text-3xl font-bold text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                  {s.step}
                </span>
                <span className="text-3xl drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{s.icon}</span>
              </div>

              <h3 className="mt-4 font-harry text-xl font-bold text-[#f4e8c1]">
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
