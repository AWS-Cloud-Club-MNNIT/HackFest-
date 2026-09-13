import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const HOUSES_STANDING = [
  { rank: '-', house: 'Gryffindor', emblem: '🦁', points: 0, status: 'Point Tally Pending', color: 'text-[#d3a625]', border: 'border-[#d3a625]', bg: 'from-[#740001]/30 to-[#080b16]' },
  { rank: '-', house: 'Slytherin', emblem: '🐍', points: 0, status: 'Point Tally Pending', color: 'text-[#aaaaaa]', border: 'border-[#aaaaaa]', bg: 'from-[#1a472a]/30 to-[#080b16]' },
  { rank: '-', house: 'Ravenclaw', emblem: '🦅', points: 0, status: 'Point Tally Pending', color: 'text-[#946b2d]', border: 'border-[#946b2d]', bg: 'from-[#0e1a40]/30 to-[#080b16]' },
  { rank: '-', house: 'Hufflepuff', emblem: '🦡', points: 0, status: 'Point Tally Pending', color: 'text-[#ecb939]', border: 'border-[#ecb939]', bg: 'from-[#372e29]/30 to-[#080b16]' },
]

export default function HouseLeaderboard() {
  return (
    <section id="house-points" className="relative bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>🏆</span>
            <span>HOUSE LEADERBOARD</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            HOUSE POINTS & HOUSE CUP
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base sm:text-lg text-[#e8d7b5]/90 font-serif leading-relaxed"
          >
            Teams will earn House Points as they submit projects in The Triwizard Challenge and compete in Grand Finale. The house with the highest total score will claim the House Cup!
          </Reveal>

          {/* Pending Tally Status */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#10182b]/80 px-4 py-1.5 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
            <span>⏳</span>
            <span>POINT TALLY BEGINS WITH ROUND 1 SUBMISSIONS</span>
          </div>
        </div>

        {/* Distinction Clarification Panel */}
        <div className="mt-10 rounded-xl border-2 border-[#d4af37]/60 bg-gradient-to-r from-[#24170f] via-[#10182b] to-[#24170f] p-6 text-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <h3 className="font-harry text-2xl font-bold text-[#d4af37] tracking-wider">
            UNDERSTANDING THE COMPETITION REWARDS
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-left">
            <div className="rounded-lg border border-[#d4af37]/30 bg-[#080b16]/70 p-4">
              <span className="text-2xl">🏆</span>
              <h4 className="mt-2 font-display text-sm font-bold text-[#f4e8c1]">CHAMPION TEAM</h4>
              <p className="mt-1 text-xs text-[#e8d7b5]/80 font-sans">
                The overall winning team that secures #1 place in the final offline Great Hall hackathon.
              </p>
            </div>

            <div className="rounded-lg border border-[#d4af37]/30 bg-[#080b16]/70 p-4">
              <span className="text-2xl">🏰</span>
              <h4 className="mt-2 font-display text-sm font-bold text-[#f4e8c1]">HOUSE CUP WINNER</h4>
              <p className="mt-1 text-xs text-[#e8d7b5]/80 font-sans">
                The house that accumulates the highest total house points across all team submissions.
              </p>
            </div>

            <div className="rounded-lg border border-[#d4af37]/30 bg-[#080b16]/70 p-4">
              <span className="text-2xl">🎁</span>
              <h4 className="mt-2 font-display text-sm font-bold text-[#f4e8c1]">HOUSE CUP GOODIES</h4>
              <p className="mt-1 text-xs text-[#e8d7b5]/80 font-sans">
                Exclusive goodies awarded to the winning team associated with the victorious House Cup house.
              </p>
            </div>
          </div>
        </div>

        {/* Initial 0 Points Leaderboard State */}
        <div className="mt-12 space-y-4">
          {HOUSES_STANDING.map((item) => {
            return (
              <motion.div
                key={item.house}
                whileHover={{ scale: 1.005 }}
                className={`relative overflow-hidden rounded-xl border-2 ${item.border} bg-gradient-to-r ${item.bg} p-5 shadow-md`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.emblem}</span>
                    <div>
                      <h3 className="font-harry text-3xl font-bold text-[#f4e8c1]">
                        {item.house}
                      </h3>
                      <p className="text-xs text-[#e8d7b5]/70 font-sans">
                        Teams Registering & Sorting Now
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-harry text-3xl font-bold ${item.color}`}>
                      0 PTS
                    </span>
                    <p className="text-[11px] text-[#d4af37] font-sans font-semibold">
                      Tally Begins In Round 1
                    </p>
                  </div>
                </div>

                {/* Progress Bar (Initial State) */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#080b16] border border-[#d4af37]/20">
                  <div className="h-full w-0 bg-[#d4af37]" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
