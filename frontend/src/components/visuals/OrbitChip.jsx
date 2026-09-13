import { motion } from 'framer-motion'

// Six nodes arranged in a hexagon around the centre
const NODES = [
  { x: 50, y: 12, icon: 'bolt', label: 'Serverless', house: 'Gryffindor' },
  { x: 83, y: 31, icon: 'cloud', label: 'Cloud Spells', house: 'Ravenclaw' },
  { x: 83, y: 69, icon: 'db', label: 'Runic Data', house: 'Slytherin' },
  { x: 50, y: 88, icon: 'code', label: 'Build Magic', house: 'Hufflepuff' },
  { x: 17, y: 69, icon: 'network', label: 'Owl Network', house: 'Gryffindor' },
  { x: 17, y: 31, icon: 'terminal', label: 'Dev Potions', house: 'Ravenclaw' },
]

const icons = {
  bolt: <path d="M12 2 4 13h6l-1 9 9-13h-6l1-7Z" />,
  cloud: <path d="M7 17a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 8.06 4.5 4.5 0 0 1 17.5 17H7Z" />,
  db: <path d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Zm0 0v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />,
  code: <path d="m9 18-6-6 6-6m6 12 6-6-6-6" />,
  network: <path d="M12 2v6m0 0-5 4m5-4 5 4M5 12v6l7 4 7-4v-6" />,
  terminal: <path d="m5 7 5 5-5 5m6 0h8" />,
}

function NodeIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
      {icons[type]}
    </svg>
  )
}

export default function OrbitChip() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden="true">
      {/* Ambient glowing golden magic halo behind */}
      <div className="absolute inset-[6%] rounded-full bg-gradient-to-tr from-[#5c3b80]/40 via-[#d4af37]/25 to-transparent blur-[80px]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="magic-gold-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#9d4edf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Orbit Runic Constellation Lines */}
        {NODES.map((n, i) => (
          <g key={n.label}>
            <motion.line
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="url(#magic-gold-line)"
              strokeWidth="0.5"
              strokeDasharray="3 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, -12] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 + i * 0.08 },
                strokeDashoffset: { duration: 3.5, repeat: Infinity, ease: 'linear' },
              }}
            />
          </g>
        ))}

        {/* Inner & Outer Magic Circles */}
        <circle cx="50" cy="50" r="37" fill="none" stroke="#d4af37" strokeOpacity="0.3" strokeWidth="0.4" strokeDasharray="6 3" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#9d4edf" strokeOpacity="0.25" strokeWidth="0.3" />
      </svg>

      {/* Orbiting Runic Nodes */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.label}
          className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/60 bg-[#10182b]/95 text-[#f4e8c1] shadow-[0_0_18px_rgba(212,175,55,0.3)] backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-[#f4e8c1] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] sm:h-14 sm:w-14">
            <NodeIcon type={n.icon} />
          </div>
          <span className="mt-1 font-display text-[10px] font-semibold tracking-wider text-[#d4af37] opacity-80 group-hover:opacity-100 sm:text-xs">
            {n.label}
          </span>
        </motion.div>
      ))}

      {/* Central Hogwarts & AWS Matrix Seal */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#24170f] via-[#10182b] to-[#080b16] shadow-[0_0_50px_rgba(212,175,55,0.5)] sm:h-32 sm:w-32"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xl sm:text-2xl animate-candle">⚡</span>
        <span className="font-harry text-xl font-bold tracking-wider text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-2xl">
          HOGWARTS
        </span>
        <span className="text-[10px] font-bold tracking-widest text-[#f4e8c1] uppercase sm:text-[11px]">
          AWS HACKFEST
        </span>
      </motion.div>
    </div>
  )
}