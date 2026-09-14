import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const REWARDS = [
  {
    id: 'prize-pool',
    icon: '🏆',
    title: '₹1,00,000+ Prize Pool',
    description: 'Massive prize pool for overall winners, runner-ups, and top house teams.',
    accentColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    borderColor: 'border-[#d4af37]/40',
  },
  {
    id: 'certificates',
    icon: '📜',
    title: 'Official Certificates',
    description: 'Verified digital certificates of participation & achievement for all valid teams.',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    borderColor: 'border-[#38bdf8]/40',
  },
  {
    id: 'goodies',
    icon: '🎁',
    title: 'Goodies & Swag Kits',
    description: 'Exclusive HackFest t-shirts, stickers, badges, and cloud swag for participants.',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: 'border-[#f59e0b]/40',
  },
]

export default function RewardsSection() {
  return (
    <section
      id="rewards"
      className="relative overflow-hidden bg-[#080b16] py-16 sm:py-24 border-t border-[#d4af37]/20"
    >
      {/* Anchor for backward compatibility */}
      <div id="house-points" className="absolute top-0" />

      {/* Background Subtle Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-[#d4af37]/10 via-[#5c3b80]/15 to-transparent blur-[140px] z-0" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="div"
            className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/60 bg-[#10182b]/90 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)] backdrop-blur-md"
          >
            <span className="text-sm">🎁</span>
            <span>WHAT YOU GET</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-4xl sm:text-6xl font-bold tracking-wide text-[#f4e8c1] drop-shadow-[0_4px_15px_rgba(0,0,0,0.95)]"
          >
            Prizes & Rewards
          </Reveal>

          <Reveal
            as="p"
            delay={0.08}
            className="mt-3 font-serif text-sm sm:text-base text-[#e8d7b5]/90 max-w-xl mx-auto leading-relaxed"
          >
            Compete for cash rewards, earn official certificates, and take home exclusive HackFest swag kits!
          </Reveal>
        </div>

        {/* Simplified 3-Card Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {REWARDS.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl border ${reward.borderColor} bg-[#10182b]/80 p-6 backdrop-blur-xl transition-all duration-300`}
              style={{
                boxShadow: `0 8px 25px ${reward.glowColor}`,
              }}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
                  {reward.icon}
                </span>
                <h3 className="mt-4 font-harry text-2xl font-bold text-[#f4e8c1]">
                  {reward.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#e8d7b5]/80 font-sans leading-relaxed">
                  {reward.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Teaser Footer Note */}
        <div className="mt-8 text-center">
          <p className="font-serif text-xs italic text-[#d4af37]/80">
            ✨ Detailed prize breakdown & track rewards to be announced soon!
          </p>
        </div>
      </div>
    </section>
  )
}
