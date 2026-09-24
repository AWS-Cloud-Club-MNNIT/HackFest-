import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPLY_URL } from '../config'
import { Link } from "react-router-dom";

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
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#archives' },
  { name: 'Houses', href: '#sorting' },
  { name: 'Journey', href: '#journey' },
  { name: 'Trials', href: '#trials' },
  { name: 'Finale', href: '#championship' },
  { name: 'Rewards', href: '#rewards' },
  { name: 'Express', href: '#express' },
  { name: 'Prophet', href: '#daily-prophet' },
  { name: 'FAQ', href: '#faq' },
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
    
    // Use a small timeout to allow the mobile menu close animation to start
    // before calculating layout and scrolling, which prevents mobile browsers from dropping the scroll.
    setTimeout(() => {
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const element = document.getElementById(targetId)
      if (element) {
        const topPos = element.getBoundingClientRect().top + window.scrollY - 55
        window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' })
      }
    }, 50)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080b16]/95 backdrop-blur-xl py-2 shadow-[0_10px_35px_rgba(0,0,0,0.9)] border-b border-[#d4af37]/30'
          : 'bg-gradient-to-b from-[#080b16]/95 via-[#080b16]/60 to-transparent py-3'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand Logo - AWS MNNIT */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex cursor-pointer items-center gap-2.5 transition"
        >
          <img
            src="/images/aws_mnnit_logo.png"
            alt="AWS MNNIT Logo"
            className="h-9 sm:h-11 w-auto object-contain transition duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.classList.remove('hidden')
                e.currentTarget.nextElementSibling.classList.add('flex')
              }
            }}
          />
          {/* Fallback badge if image file is not yet placed by user */}
          <div className="hidden items-center gap-1.5 rounded-xl border border-[#d4af37]/50 bg-[#10182b] px-2.5 py-1 text-[#d4af37] font-bold text-xs tracking-wider cursor-pointer">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#d4af37]">
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
            </svg>
            <span>AWS MNNIT</span>
          </div>

          <div className="hidden flex-col sm:flex cursor-pointer">
            <span className="font-display text-sm font-extrabold tracking-wider text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              AWS MNNIT
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#e8d7b5]/70 uppercase font-sans">
              Student Builder Group
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-3.5 xl:gap-5 lg:flex border border-[#d4af37]/25 rounded-full bg-[#080b16]/85 px-5 py-1.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          {NAV_LINKS.slice(0, 5).map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeSection === sectionId
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative cursor-pointer text-[11px] xl:text-[12px] font-semibold tracking-wide transition-all duration-300 select-none ${
                  isActive
                    ? 'text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] font-bold'
                    : 'text-[#e8d7b5]/75 hover:text-[#f4e8c1]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            )
          })}

          <div className="relative group">
            <button className="flex items-center gap-1 cursor-pointer text-[11px] xl:text-[12px] font-semibold tracking-wide text-[#e8d7b5]/75 hover:text-[#f4e8c1] transition-all duration-300 select-none py-1">
              More
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            
            <div className="absolute top-full right-0 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
              <div className="flex flex-col min-w-[120px] bg-[#080b16]/95 border border-[#d4af37]/30 rounded-xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                {NAV_LINKS.slice(5).map((link) => {
                  const sectionId = link.href.replace('#', '')
                  const isActive = activeSection === sectionId
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`block cursor-pointer text-[11px] xl:text-[12px] font-semibold tracking-wide transition-all duration-200 select-none px-3 py-2 rounded-lg ${
                        isActive
                          ? 'text-[#d4af37] bg-[#d4af37]/10 font-bold'
                          : 'text-[#e8d7b5]/75 hover:text-[#d4af37] hover:bg-[#d4af37]/5'
                      }`}
                    >
                      {link.name}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Professional Desktop CTA Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/login"
            className="cursor-pointer text-xs font-semibold tracking-wider text-[#e8d7b5]/85 transition hover:text-[#d4af37]"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="group relative cursor-pointer inline-flex items-center justify-center overflow-hidden rounded-full border border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] px-5 py-1.5 text-xs font-bold tracking-wider text-[#f4e8c1] shadow-[0_0_18px_rgba(212,175,55,0.35)] transition duration-300 hover:border-[#f4e8c1] hover:shadow-[0_0_28px_rgba(212,175,55,0.6)] hover:scale-[1.03]"
          >
            <span className="relative z-10 flex items-center gap-1.5 cursor-pointer">
              <span>Register</span>
              <svg className="h-3.5 w-3.5 text-[#d4af37] transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
              </svg>
            </span>
          </Link>
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
                    className={`flex items-center text-sm font-semibold tracking-wider transition-all ${
                      isActive
                        ? 'text-[#d4af37] font-bold pl-3 border-l-2 border-[#d4af37]'
                        : 'text-[#e8d7b5]/80 hover:text-[#d4af37]'
                    }`}
                  >
                    <span>{link.name}</span>
                  </a>
                )
              })}
              <div className="pt-3 flex flex-col gap-2.5 border-t border-[#d4af37]/20">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-md border border-[#d4af37]/60 bg-[#080b16] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#e8d7b5]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#d4af37] bg-gradient-to-r from-[#24170f] via-[#5c3b80] to-[#24170f] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#f4e8c1] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  <span>Register</span>
                  <svg className="h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
