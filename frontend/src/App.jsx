import { useRef } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

import { Toaster } from 'react-hot-toast'

// Components
import Hero from './components/Hero'
import BrowseTeammates from './components/BrowseTeammates'
import AboutEvent from './components/AboutEvent'
import AboutClub from './components/AboutClub'
import ApplyNow from './components/ApplyNow'
import SortingCeremony from './components/SortingCeremony'
import HouseDomains from './components/HouseDomains'
import Top15Section from './components/Top15Section'
import ChampionshipSection from './components/ChampionshipSection'
import RewardsSection from './components/RewardsSection'
import PastEvents from './components/PastEvents'
import OrderOfBuilders from './components/OrderOfBuilders'
import DailyProphet from './components/DailyProphet'
import FAQ from './components/FAQ'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Dashboard from './pages/Dashboard'
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateTeam from './pages/CreateTeam'
import FindTeam from './pages/FindTeam'
import MyTeam from './pages/MyTeam'
import QRPass from './pages/QRPass'
import OrganizerScan from './pages/OrganizerScan'


// =====================================================
// Wrapper for the smooth layered card parallax effect
// =====================================================

function PageSection({ children, index }) {
  return (
    <div
      className="relative w-full bg-[#080b16]"
      style={{ zIndex: index }}
    >
      {children}
    </div>
  )
}

// =====================================================
// Homepage
// =====================================================

function Home() {
  return (
    <div className="relative min-h-screen bg-[#080b16] text-[#e8d7b5]">

      <Navbar />

      <main className="relative bg-[#080b16] overflow-hidden">

        <PageSection index={1}>
          <Hero />
        </PageSection>

        <PageSection index={2}>
          <AboutClub />
        </PageSection>

        <PageSection index={3}>
          <ApplyNow />
        </PageSection>

        <PageSection index={4}>
          <HouseDomains />
        </PageSection>

        <PageSection index={5}>
          <SortingCeremony />
        </PageSection>

        <PageSection index={6}>
          <AboutEvent />
        </PageSection>

        <PageSection index={7}>
          <Top15Section />
        </PageSection>

        <PageSection index={8}>
          <ChampionshipSection />
        </PageSection>

        <PageSection index={9}>
          <RewardsSection />
        </PageSection>

        <PageSection index={10}>
          <PastEvents />
        </PageSection>

        <PageSection index={11}>
          <OrderOfBuilders />
        </PageSection>

        <PageSection index={12}>
          <DailyProphet />
        </PageSection>

        <PageSection index={13}>
          <FAQ />
        </PageSection>

        <PageSection index={14}>
          <Footer />
        </PageSection>

      </main>
    </div>
  )
}

// =====================================================
// Main App
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#10182b',
            color: '#e8d7b5',
            border: '1px solid rgba(212, 175, 55, 0.3)',
          },
        }}
      />

      <Routes>

        {/* ============================================
            MAIN HACKFEST WEBSITE
        ============================================ */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ============================================
            USER DASHBOARD (any logged-in contestant)
        ============================================ */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ============================================
            SUPER ADMIN (super_admin role only)
        ============================================ */}

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ============================================
            TEAMMATES
        ============================================ */}

        <Route
          path="/browse-teammates"
          element={
            <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] p-6 max-w-6xl mx-auto">
              <BrowseTeammates />
            </div>
          }
        />

        {/* ============================================
            TEAM & CHECK-IN
        ============================================ */}

        <Route
          path="/team/create"
          element={
            <ProtectedRoute>
              <CreateTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team/find"
          element={
            <ProtectedRoute>
              <FindTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team/my-team"
          element={
            <ProtectedRoute>
              <MyTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team/qr-pass"
          element={<QRPass />}
        />

        <Route
          path="/organizer/scan"
          element={<OrganizerScan />}
        />



        {/* ============================================
            AUTHENTICATION
        ============================================ */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
