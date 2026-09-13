import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

const JOURNEY = [
  {
    number: '01',
    title: 'REGISTRATION',
    subtitle: 'The Owl Post',
    date: 'October 1–15, 2026',
    description:
      'Gather your team and register for HackFest 1.0. Get ready to enter a 72-hour journey of building, innovation, and cloud magic.',
    icon: '✉️',
  },
  {
    number: '02',
    title: 'ONLINE HACKATHON',
    subtitle: 'The 72-Hour Trial',
    date: '72 Hours',
    description:
      'Teams will work on real-world problem statements and build innovative solutions using AWS, AI/ML, Cloud, DevOps, Web, and Cybersecurity.',
    icon: '⚡',
  },
  {
    number: '03',
    title: 'EVALUATION',
    subtitle: 'The Wizarding Review',
    date: 'Mid-Evaluation',
    description:
      'Projects will be evaluated throughout the hackathon based on innovation, technical implementation, scalability, and impact.',
    icon: '🔮',
  },
  {
    number: '04',
    title: 'TOP 15 TEAMS',
    subtitle: 'The Chosen Fifteen',
    date: 'November 1, 2026',
    description:
      'The top 15 teams will be shortlisted from the online round and invited to represent their skills in the offline finale.',
    icon: '🏆',
  },
  {
    number: '05',
    title: 'OFFLINE FINALE',
    subtitle: 'The Great Hall',
    date: 'Offline Round',
    description:
      'The selected teams will face the final challenge before the jury and compete for the ultimate HackFest championship.',
    icon: '🏰',
  },
  {
    number: '06',
    title: 'THE CHAMPION',
    subtitle: 'The House Cup',
    date: 'Final Verdict',
    description:
      'One team will rise above the rest and claim the HackFest 1.0 championship and the ultimate House Cup.',
    icon: '👑',
  },
]

export default function SortingCeremony() {
  return (
    <section
      id="sorting"
      className="relative overflow-hidden bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/images/sorting_hat_ceremony_bg.jpg"
          alt="Hogwarts Great Hall"
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#080b16]/90 via-[#080b16]/75 to-[#080b16]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20 z-0" />

      {/* Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-[140px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <Reveal
            as="div"
            className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-[#10182b]/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] backdrop-blur-md"
          >
            <span className="text-base">⚡</span>
            <span>THE HACKFEST JOURNEY</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-4 font-harry text-5xl font-bold text-[#f4e8c1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-7xl"
          >
            The Journey Begins...
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 font-serif text-base leading-relaxed text-[#e8d7b5] sm:text-lg"
          >
            From the first registration to the final House Cup,
            experience every stage of HackFest 1.0.
          </Reveal>
        </div>

        {/* Journey Timeline */}
        <div className="relative mx-auto mt-16 max-w-5xl">

          {/* Central Timeline Line */}
          <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-[#d4af37]/10 via-[#d4af37] to-[#d4af37]/10 sm:left-1/2 sm:block sm:-translate-x-1/2" />

          <div className="space-y-10 sm:space-y-14">

            {JOURNEY.map((item, index) => {
              const isRight = index % 2 !== 0

              return (
                <motion.div
                  key={item.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className={`relative flex flex-col sm:flex-row ${isRight ? 'sm:justify-end' : 'sm:justify-start'
                    }`}
                >

                  {/* Timeline Node */}
                  <div className="absolute left-0 top-5 z-20 hidden h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#080b16] text-lg shadow-[0_0_20px_rgba(212,175,55,0.5)] sm:left-1/2 sm:flex sm:-translate-x-1/2">
                    {item.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`w-full pl-14 sm:w-[44%] sm:pl-0 ${isRight ? 'sm:pr-0' : 'sm:pr-0'
                      }`}
                  >
                    <motion.div
                      whileHover={{
                        y: -5,
                        scale: 1.015,
                      }}
                      className="relative overflow-hidden rounded-xl border border-[#d4af37]/40 bg-gradient-to-br from-[#10182b]/95 via-[#171329]/95 to-[#080b16]/95 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
                    >

                      {/* Golden Accent */}
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#d4af37] via-[#8c6a15] to-transparent" />

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <span className="font-display text-xs font-bold tracking-[0.3em] text-[#d4af37]">
                            {item.number}
                          </span>

                          <h3 className="mt-1 font-harry text-2xl font-bold tracking-wider text-[#f4e8c1] sm:text-3xl">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#8c6a15]">
                            {item.subtitle}
                          </p>
                        </div>

                        <span className="text-2xl">
                          {item.icon}
                        </span>
                      </div>

                      <div className="mt-4 inline-block rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                          {item.date}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-[#e8d7b5]/85 font-serif">
                        {item.description}
                      </p>

                    </motion.div>
                  </div>
                </motion.div>
              )
            })}

          </div>
        </div>

        {/* Bottom Quote */}
        <Reveal
          delay={0.2}
          className="mx-auto mt-16 max-w-3xl text-center"
        >
          <div className="rounded-xl border border-[#d4af37]/30 bg-[#10182b]/70 px-6 py-6 backdrop-blur-md">
            <p className="font-harry text-2xl text-[#f4e8c1] sm:text-3xl">
              72 Hours. 15 Teams. 1 House Cup.
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              Only one team can become the champion.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}