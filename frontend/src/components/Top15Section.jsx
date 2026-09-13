import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

// 15 Placeholder Slots for Upcoming Qualifiers
const PLACEHOLDER_SLOTS = Array.from({ length: 15 }, (_, i) => ({
  rank: i + 1,
  title: `Qualifier Slot #${i + 1}`,
  status: 'Awaiting Round 1 Results',
}))

export default function Top15Section() {
  const top3 = PLACEHOLDER_SLOTS.slice(0, 3)
  const remaining12 = PLACEHOLDER_SLOTS.slice(3)

  return (
    <section id="top-15" className="relative bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>🏆</span>
            <span>TOP 15 FINALISTS</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            THE CHOSEN FIFTEEN
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg text-[#e8d7b5]/90 font-serif leading-relaxed"
          >
            The top 15 qualifying teams will be officially announced here after The Triwizard Challenge evaluation is completed.
          </Reveal>

          {/* Pending Status Badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#10182b]/80 px-4 py-1.5 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
            <span>⏳</span>
            <span>QUALIFIERS ANNOUNCEMENT PENDING • TRIWIZARD CHALLENGE IN PROGRESS</span>
          </div>
        </div>

        {/* Podium View Placeholders for Top 3 */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 items-end">
          {/* Rank 2 Placeholder */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#aaaaaa]/50 bg-gradient-to-b from-[#10182b] to-[#080b16] p-6 text-center shadow-md md:order-1"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#aaaaaa]/10 text-2xl font-bold text-[#aaaaaa] border border-[#aaaaaa]/40">
              🥈
            </div>
            <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-[#aaaaaa]">
              QUALIFIER SLOT #2
            </span>
            <h3 className="mt-1 font-harry text-3xl font-bold text-[#f4e8c1]/60">
              To Be Announced
            </h3>
            <p className="mt-1 text-xs text-[#e8d7b5]/50 font-sans">Awaiting Triwizard Challenge Evaluation</p>
            <div className="mt-4 rounded bg-[#080b16]/70 p-2 text-xs font-semibold text-[#d4af37] border border-[#d4af37]/20">
              Score: Pending
            </div>
          </motion.div>

          {/* Rank 1 Placeholder */}
          <motion.div
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#d4af37]/60 bg-gradient-to-b from-[#24170f] via-[#10182b] to-[#080b16] p-8 text-center shadow-lg md:order-2 md:-translate-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10 text-3xl font-bold text-[#d4af37] border-2 border-[#d4af37]/50">
              🥇
            </div>
            <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              QUALIFIER SLOT #1 • TRIALS LEADER
            </span>
            <h3 className="mt-1 font-harry text-4xl font-bold text-[#f4e8c1]/70">
              To Be Announced
            </h3>
            <p className="mt-1 text-xs text-[#d3a625]/70 font-sans">Awaiting Owl Trial Evaluation</p>
            <div className="mt-4 rounded bg-[#d4af37]/10 p-2.5 text-xs font-bold text-[#d4af37] border border-[#d4af37]/30">
              Score: Pending
            </div>
          </motion.div>

          {/* Rank 3 Placeholder */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#946b2d]/50 bg-gradient-to-b from-[#10182b] to-[#080b16] p-6 text-center shadow-md md:order-3"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#946b2d]/10 text-2xl font-bold text-[#946b2d] border border-[#946b2d]/40">
              🥉
            </div>
            <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-[#946b2d]">
              QUALIFIER SLOT #3
            </span>
            <h3 className="mt-1 font-harry text-3xl font-bold text-[#f4e8c1]/60">
              To Be Announced
            </h3>
            <p className="mt-1 text-xs text-[#e8d7b5]/50 font-sans">Awaiting Owl Trial Evaluation</p>
            <div className="mt-4 rounded bg-[#080b16]/70 p-2 text-xs font-semibold text-[#d4af37] border border-[#d4af37]/20">
              Score: Pending
            </div>
          </motion.div>
        </div>

        {/* Remaining 12 Qualifier Slots Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {remaining12.map((t) => (
            <div
              key={t.rank}
              className="flex items-center justify-between rounded-lg border border-dashed border-[#d4af37]/30 bg-[#10182b]/60 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#080b16] font-harry text-sm font-bold text-[#d4af37]">
                  #{t.rank}
                </span>
                <div>
                  <h4 className="font-display text-xs font-bold text-[#f4e8c1]/70">Qualifier Slot #{t.rank}</h4>
                  <p className="text-[11px] text-[#e8d7b5]/50 font-sans">To Be Announced</p>
                </div>
              </div>

              <span className="rounded bg-[#d4af37]/10 px-2 py-1 text-[11px] font-semibold text-[#d4af37]/70 border border-[#d4af37]/20">
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
