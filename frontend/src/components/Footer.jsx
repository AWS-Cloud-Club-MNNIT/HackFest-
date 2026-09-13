import { APPLY_URL } from '../config'

export default function Footer() {
  const scrollToTop = (e) => {
    if (e) e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (e, href) => {
    if (e) e.preventDefault()
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
    <footer className="relative overflow-hidden bg-[#05070f] pt-16 pb-12 text-[#e8d7b5]/80 border-t border-[#d4af37]/30">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#5c3b80]/20 via-[#d4af37]/10 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-hogwarts-grid opacity-15" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#d4af37]/60 bg-[#10182b] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-harry text-3xl font-bold text-[#f4e8c1] tracking-wider">
                    HOGWARTS SBG<span className="text-[#d4af37]">.</span>
                  </h3>
                  <p className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider font-sans">
                    AWS Student Builder Group • MNNIT Allahabad
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-xs leading-relaxed text-[#e8d7b5]/80 font-sans">
                Empowering student builders at MNNIT Allahabad through hands-on cloud spellcraft, collaborative hackathons, and real-world project mastery.
              </p>

              {/* Campus Location Badge */}
              <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#d4af37]/40 bg-[#10182b]/80 px-4 py-1.5 text-xs text-[#f4e8c1]">
                <svg className="h-4 w-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>MNNIT Allahabad Campus, Prayagraj</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-harry text-xl font-bold uppercase tracking-wider text-[#d4af37]">
              HOGWARTS NAV
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs font-semibold uppercase tracking-wider font-sans">
              <li>
                <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="transition hover:text-[#d4af37]">
                  🏰 Entrance (Home)
                </a>
              </li>
              <li>
                <a href="#archives" onClick={(e) => handleNavClick(e, '#archives')} className="transition hover:text-[#d4af37]">
                  📜 Archives (About SBG)
                </a>
              </li>
              <li>
                <a href="#sorting" onClick={(e) => handleNavClick(e, '#sorting')} className="transition hover:text-[#d4af37]">
                  🎩 Sorting Ceremony
                </a>
              </li>
              <li>
                <a href="#trials" onClick={(e) => handleNavClick(e, '#trials')} className="transition hover:text-[#d4af37]">
                  ⚡ The Triwizard Challenge
                </a>
              </li>
              <li>
                <a href="#top-15" onClick={(e) => handleNavClick(e, '#top-15')} className="transition hover:text-[#d4af37]">
                  🏆 Top 15 Qualifiers
                </a>
              </li>
              <li>
                <a href="#championship" onClick={(e) => handleNavClick(e, '#championship')} className="transition hover:text-[#d4af37]">
                  🏰 Grand Finale
                </a>
              </li>
              <li>
                <a href="#house-points" onClick={(e) => handleNavClick(e, '#house-points')} className="transition hover:text-[#d4af37]">
                  🏆 House Points & Cup
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social & Community Links */}
          <div className="lg:col-span-4">
            <h4 className="font-harry text-xl font-bold uppercase tracking-wider text-[#d4af37]">
              COMMUNITY & SOCIALS
            </h4>
            <p className="mt-4 text-xs text-[#e8d7b5]/80 leading-relaxed font-sans">
              Have questions or want to join the builder community? Connect with our team on official social channels.
            </p>

            {/* Social Icons Grid */}
            <div className="mt-5 flex items-center gap-3">
              {/* Meetup */}
              <a
                href="https://www.meetup.com/aws-cloud-club-at-nit-allahabad/"
                target="_blank"
                rel="noreferrer"
                aria-label="Meetup"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/40 bg-[#10182b] text-[#e8d7b5] transition hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.34 10.04c-.37-.08-.75.05-.98.34l-3.32 4.1-2.45-3.3c-.24-.32-.65-.48-1.04-.42a1.07 1.07 0 0 0-.86.73L9.12 16.5l-2.07-4.14a1.05 1.05 0 0 0-1.42-.47c-.4.2-.61.64-.52 1.08l2.97 6.77c.18.42.6.7 1.06.7.46 0 .87-.27 1.06-.68l1.79-5.11 2.8 3.77c.23.31.6.49 1 .49.07 0 .15 0 .22-.02.46-.09.83-.43.95-.9l2.76-7.85c.14-.44-.06-.92-.47-1.08z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/awscloudclubmnnit"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/40 bg-[#10182b] text-[#e8d7b5] transition hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/aws-cloud-club-mnnit-allahabad"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/40 bg-[#10182b] text-[#e8d7b5] transition hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                </svg>
              </a>
            </div>

            <div className="mt-6">
              <a
                href="#sorting"
                onClick={(e) => handleNavClick(e, '#sorting')}
                className="inline-flex items-center gap-2 rounded-md border border-[#d4af37] bg-[#d4af37]/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#f4e8c1] transition hover:bg-[#d4af37] hover:text-[#080b16]"
              >
                <span>Get Sorted & Register</span>
                <span>⚡</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-[#e8d7b5]/60 sm:flex-row font-sans">
          <p>© {new Date().getFullYear()} AWS Student Builder Group, MNNIT Allahabad. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span>Crafted with magic for campus builders</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 text-[#d4af37] transition hover:text-[#f4e8c1]"
            >
              <span>Back to top</span>
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
