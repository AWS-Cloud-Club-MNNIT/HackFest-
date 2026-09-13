import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPLY_URL } from '../config'

// Custom Crisp Vector SVG Icons
const Icons = {
  Home: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Archives: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Sorting: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-7z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  Trials: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  HouseCup: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
  Prophet: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6z" />
    </svg>
  ),
}

const NAV_LINKS = [
  { name: 'Home', href: '#hero', icon: Icons.Home },
  { name: 'Archives', href: '#archives', icon: Icons.Archives },
  { name: 'Sorting', href: '#sorting', icon: Icons.Sorting },
  { name: 'Trials & Finale', href: '#trials', icon: Icons.Trials },
  { name: 'House Cup', href: '#house-points', icon: Icons.HouseCup },
  { name: 'Prophet', href: '#daily-prophet', icon: Icons.Prophet },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const scrollPos = window.scrollY + 120
      const sectionIds = NAV_LINKS.map((link) => link.href.replace('#', ''))

      if (window.scrollY < 100) {
        setActiveSection('hero')
        return
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (scrollPos >= top - 100) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (e, href) => {
    if (e) e.preventDefault()
    setMobileMenuOpen(false)
    const targetId = href.replace('#', '')
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.getElementById(targetId)
    if (element) {
      const topPos = element.getBoundingClientRect().top + window.scrollY - 75
      window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080b16]/95 backdrop-blur-lg py-3 shadow-[0_10px_35px_rgba(0,0,0,0.9)] border-b border-[#d4af37]/40'
          : 'bg-gradient-to-b from-[#080b16]/95 via-[#080b16]/60 to-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo & Hogwarts Crest */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-3.5 transition"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/70 bg-gradient-to-br from-[#24170f] via-[#10182b] to-[#080b16] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]">
            <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#080b16] text-[#d4af37]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#d4af37]">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-harry text-2xl font-bold tracking-wider text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                HOGWARTS
              </span>
              <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#f4e8c1] border border-[#d4af37]/40 tracking-wider">
                AWS SBG
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-widest text-[#e8d7b5]/70 uppercase font-sans">
              MNNIT Allahabad
            </span>
          </div>
        </a>

        {/* Clean, Uncluttered Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 xl:gap-8 lg:flex border border-[#d4af37]/35 rounded-full bg-[#10182b]/70 px-6 py-2 backdrop-blur-md shadow-inner">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeSection === sectionId
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] font-extrabold'
                    : 'text-[#e8d7b5]/80 hover:text-[#f4e8c1] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]'
                }`}
              >
                <span className="text-[#d4af37]">{link.icon}</span>
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f4e8c1] to-[#d4af37] shadow-[0_0_10px_#d4af37]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#sorting"
            onClick={(e) => handleNavClick(e, '#sorting')}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#f4e8c1] shadow-[0_0_20px_rgba(212,175,55,0.35)] transition duration-300 hover:border-[#f4e8c1] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.03]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Enter Magic</span>
              <svg className="h-3.5 w-3.5 text-[#d4af37] transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
              </svg>
            </span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/50 bg-[#10182b] text-[#e8d7b5] transition hover:border-[#d4af37] hover:text-[#d4af37] lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-[#d4af37]/40 bg-[#10182b]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-3.5 px-6 py-6 border-t border-[#d4af37]/20">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'text-[#d4af37] font-bold pl-3 border-l-2 border-[#d4af37]'
                        : 'text-[#e8d7b5]/80 hover:text-[#d4af37]'
                    }`}
                  >
                    <span className="text-[#d4af37]">{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                )
              })}
              <div className="pt-3 border-t border-[#d4af37]/20">
                <a
                  href="#sorting"
                  onClick={(e) => handleNavClick(e, '#sorting')}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#f4e8c1] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  <span>Enter The Magic</span>
                  <svg className="h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
