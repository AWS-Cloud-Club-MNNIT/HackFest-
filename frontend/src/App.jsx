import Hero from './components/Hero'
import AboutEvent from './components/AboutEvent'
import AboutClub from './components/AboutClub'
import ApplyNow from './components/ApplyNow'
import SortingCeremony from './components/SortingCeremony'
import Top15Section from './components/Top15Section'
import ChampionshipSection from './components/ChampionshipSection'
import HouseLeaderboard from './components/HouseLeaderboard'
import PastEvents from './components/PastEvents'
import OrderOfBuilders from './components/OrderOfBuilders'
import DailyProphet from './components/DailyProphet'
import FAQ from './components/FAQ'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Wrapper for the smooth layered card parallax scroll effect
function PageSection({ children, index }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6])

  return (
    <motion.div
      ref={ref}
      className="relative w-full"
      style={{ zIndex: index }}
    >
      <motion.div
        style={{ y, scale, opacity }}
        className="w-full origin-top bg-[#080b16] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function App() {
  return (
    <div className="relative min-h-screen bg-[#080b16] text-[#e8d7b5]">
      <Navbar />
      <main className="relative bg-[#080b16] overflow-hidden">
        <PageSection index={1}><Hero /></PageSection>
        <PageSection index={2}><AboutClub /></PageSection>
        <PageSection index={3}><ApplyNow /></PageSection>
        <PageSection index={4}><SortingCeremony /></PageSection>
        <PageSection index={5}><AboutEvent /></PageSection>
        <PageSection index={6}><Top15Section /></PageSection>
        <PageSection index={7}><ChampionshipSection /></PageSection>
        <PageSection index={8}><HouseLeaderboard /></PageSection>
        <PageSection index={9}><PastEvents /></PageSection>
        <PageSection index={10}><OrderOfBuilders /></PageSection>
        <PageSection index={11}><DailyProphet /></PageSection>
        <PageSection index={12}><FAQ /></PageSection>
        <PageSection index={13}><Footer /></PageSection>
      </main>
    </div>
  )
}

export default App