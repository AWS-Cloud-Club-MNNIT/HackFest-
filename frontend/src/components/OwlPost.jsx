import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './common/Reveal'

export default function OwlPost() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
    }, 4000)
  }

  return (
    <section id="owl-post" className="relative bg-[#080b16] py-24 sm:py-32 border-t border-[#d4af37]/20">
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-20" />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Reveal as="div" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            <span>🦉</span>
            <span>OWL POST DISPATCH</span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 font-harry text-5xl font-bold text-[#f4e8c1] sm:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            SEND AN OWL
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 text-base text-[#e8d7b5]/90 font-serif leading-relaxed"
          >
            Have a question about the Triwizard Challenge, House sorting, or event logistics? Dispatch an owl message to the AWS SBG team.
          </Reveal>
        </div>

        {/* Parchment Form */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="mt-12 overflow-hidden rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#10182b] via-[#24170f] to-[#080b16] p-8 sm:p-12 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
        >
          {submitted ? (
            <div className="py-12 text-center">
              <div className="text-6xl mb-4 animate-candle">🦉</div>
              <h3 className="font-harry text-4xl font-bold text-[#f4e8c1]">
                OWL DISPATCHED SUCCESSFULLY!
              </h3>
              <p className="mt-2 text-sm text-[#d4af37] font-sans">
                Your message is flying across the Hogwarts grounds to our builder mages. We will reply promptly via parchment email!
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-md border border-[#d4af37] bg-[#d4af37]/20 px-6 py-2 text-xs font-bold uppercase text-[#f4e8c1]"
              >
                Send Another Owl
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#d4af37] font-sans">
                    Wizard / Team Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Godric Gryffindor"
                    className="mt-2 w-full rounded-lg border border-[#d4af37]/40 bg-[#080b16]/90 p-3.5 text-sm text-[#f4e8c1] placeholder-[#e8d7b5]/40 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#d4af37] font-sans">
                    Owl Post Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="wizard@mnnit.ac.in"
                    className="mt-2 w-full rounded-lg border border-[#d4af37]/40 bg-[#080b16]/90 p-3.5 text-sm text-[#f4e8c1] placeholder-[#e8d7b5]/40 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#d4af37] font-sans">
                  Parchment Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Inquire about House registration, the Triwizard Challenge, or team details..."
                  className="mt-2 w-full rounded-lg border border-[#d4af37]/40 bg-[#080b16]/90 p-3.5 text-sm text-[#f4e8c1] placeholder-[#e8d7b5]/40 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>

              <div className="text-center pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-md border-2 border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] px-9 py-3.5 text-xs font-bold uppercase tracking-widest text-[#f4e8c1] shadow-[0_0_25px_rgba(212,175,55,0.4)] transition hover:border-[#f4e8c1]"
                >
                  <span>SEND OWL</span>
                  <span className="text-base">🦉</span>
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
