import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import API from "../../services/api";
import UsersTab from "./tabs/UsersTab";
import TeamsTab from "./tabs/TeamsTab";
import BroadCastTab from "./tabs/BroadCastTab";
import EventsTab from "./tabs/EventsTab";
import OverviewTab from "./tabs/OverviewTab";
import ActivityLogsTab from "./tabs/ActivityLogsTab";
import SettingsTab from "./tabs/SettingsTab";

import { Bell, LogOut } from "lucide-react";
import { useNotificationStore } from "../../store/useNotificationStore";
import { useAuthStore } from "../../store/useAuthStore";

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: "⌂",
  },
  {
    id: "events",
    label: "Domains & Config",
    icon: "▤",
  },
  {
    id: "users",
    label: "Users",
    icon: "♙",
  },
  {
    id: "teams",
    label: "Teams",
    icon: "♜",
  },
  {
    id: "broadcast",
    label: "Broadcast",
    icon: "✦",
  },
  {
  id: "activity-logs",
  label: "Activity Logs",
  icon: "◷",
  },
];

// =============================================================
// STAT CARD
// =============================================================

function StatCard({ icon, label, value, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-[#c9a646]/20
        bg-[#101729]/80
        p-5
        backdrop-blur-xl
        shadow-[0_15px_50px_rgba(0,0,0,0.25)]
      "
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c9a646]/5 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9da8bd]">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold text-[#f2dfb0]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#7f8aa0]">
            {description}
          </p>
        </div>

        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl
            border border-[#c9a646]/20
            bg-[#c9a646]/10
            text-xl text-[#d7b85a]
          "
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================
// STATUS BADGE
// =============================================================

function StatusBadge({ status }) {
  const statusStyles = {
    draft: "bg-gray-500/10 text-gray-300 border-gray-500/20",
    upcoming: "bg-blue-400/10 text-blue-300 border-blue-400/20",
    ongoing: "bg-green-400/10 text-green-300 border-green-400/20",
    completed: "bg-purple-400/10 text-purple-300 border-purple-400/20",
    cancelled: "bg-red-400/10 text-red-300 border-red-400/20",
  };

  return (
    <span
      className={`
        rounded-full border px-3 py-1
        text-[10px] font-bold uppercase tracking-wider
        ${statusStyles[status] || statusStyles.draft}
      `}
    >
      {status}
    </span>
  );
}

// =============================================================
// SUPER ADMIN DASHBOARD
// =============================================================

function SuperAdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ===========================================================
  // NOTIFICATIONS
  // ===========================================================

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  // ===========================================================
  // DASHBOARD STATE
  // ===========================================================

  const [dashboard, setDashboard] = useState(null);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ===========================================================
  // FETCH DASHBOARD
  // ===========================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/super-admin/stats");
      const data = response.data;

      setDashboard(data.dashboard);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================
  // FETCH EVENTS
  // ===========================================================

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);

      const response = await API.get("/super-admin/events");
      const data = response.data;

      setEvents(data.events || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load events.");
    } finally {
      setEventsLoading(false);
    }
  };

  // ===========================================================
  // INITIAL LOAD
  // ===========================================================

  useEffect(() => {
    fetchDashboard();
    fetchEvents();
    fetchNotifications();
  }, []);

  // ===========================================================
  // CLOSE NOTIFICATION DROPDOWN WHEN CLICKING OUTSIDE
  // ===========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ===========================================================
  // REFRESH
  // ===========================================================

  const handleRefresh = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchEvents(),
      fetchNotifications(),
    ]);

    showSuccess("Dashboard refreshed");
  };

  // ===========================================================
  // SUCCESS MESSAGE
  // ===========================================================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ===========================================================
  // DELETE EVENT
  // ===========================================================

  const handleDeleteEvent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/super-admin/events/${id}`);

      await fetchEvents();
      await fetchDashboard();

      showSuccess("Event deleted successfully");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ===========================================================
  // LOGOUT
  // ===========================================================

  const handleLogout = () => {
    /*
      This is only the UI-side logout for now.

      Malika's authentication system will later decide:
      - how token is stored
      - how user role is checked
      - how logout works
    */

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  // ===========================================================
  // FORMAT DATE
  // ===========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===========================================================
  // PAGE CONTENT
  // ===========================================================

  const renderContent = () => {
    // Hide mobile menu on tab navigation
    const handleNavigate = (tab) => {
      setActiveMenu(tab);
      setMobileMenuOpen(false);
    };

    if (activeMenu === "overview") {
      return <OverviewTab onNavigateTab={handleNavigate} />;
    }

    if (activeMenu === "events") {
      return <EventsTab />;
    }

    if (activeMenu === "users") {
      return <UsersTab />;
    }

    if (activeMenu === "teams") {
      return <TeamsTab />;
    }

    if (activeMenu === "broadcast") {
      return <BroadCastTab />;
    }

    if (activeMenu === "settings") {
      return <SettingsTab />;
    }

    if (activeMenu === "activity-logs") {
     return <ActivityLogsTab />;
    }

    return null;
  };

  // ===========================================================
  // RENDER
  // ===========================================================

  return (
    <div className="hogwarts-background min-h-screen text-[#e8d7b5]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_70%_10%,rgba(83,62,145,0.18),transparent_35%)]
          "
        />

        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_20%_80%,rgba(201,166,70,0.06),transparent_30%)]
          "
        />

        {/* stars */}
        <div className="absolute left-[10%] top-[15%] text-[#d8bd68]/30">
          ✦
        </div>

        <div className="absolute left-[35%] top-[8%] text-[#d8bd68]/20">
          ✧
        </div>

        <div className="absolute right-[15%] top-[25%] text-[#d8bd68]/30">
          ✦
        </div>

        <div className="absolute right-[35%] bottom-[20%] text-[#d8bd68]/20">
          ✧
        </div>

        {/* subtle castle silhouette */}
        <div
          className="
            absolute bottom-0 left-1/2
            h-[260px] w-[900px]
            -translate-x-1/2
            opacity-[0.035]
          "
        >
          <div className="absolute bottom-0 left-[15%] h-[170px] w-[180px] bg-[#d8bd68]" />

          <div className="absolute bottom-0 left-[38%] h-[220px] w-[230px] bg-[#d8bd68]" />

          <div className="absolute bottom-0 right-[15%] h-[150px] w-[180px] bg-[#d8bd68]" />

          <div className="absolute bottom-[170px] left-[18%] h-[120px] w-[30px] bg-[#d8bd68]" />

          <div className="absolute bottom-[220px] left-[44%] h-[150px] w-[40px] bg-[#d8bd68]" />

          <div className="absolute bottom-[150px] right-[18%] h-[110px] w-[30px] bg-[#d8bd68]" />
        </div>
      </div>

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header
        className="
          fixed left-0 right-0 top-0 z-50
          h-[72px]
          border-b border-[#d4af37]/20
          bg-[#080b16]/80
          backdrop-blur-xl
          shadow-[0_4px_30px_rgba(0,0,0,0.5)]
        "
      >
        <div className="flex h-full items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img
              src="/images/aws_mnnit_logo.png"
              alt="AWS MNNIT Logo"
              className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div>
              <p className="font-harry text-3xl font-bold tracking-wider text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                AWS SBG
              </p>

              <p className="font-display text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-sans">
                Super Admin Ministry
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT HEADER
          ================================================= */}

          <div className="flex items-center gap-4">
            {/* QR Scanner */}
            <button
              onClick={() => window.open("/organizer/scan", "_blank")}
              className="
                hidden sm:flex items-center gap-2
                rounded-lg
                border border-[#c9a646]/50
                bg-[#c9a646]/10
                px-4 py-2
                text-xs font-bold text-[#d4af37]
                shadow-[0_0_10px_rgba(212,175,55,0.15)]
                transition
                hover:bg-[#c9a646]/20
                hover:text-[#e7d49d]
                hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
              "
            >
              <span className="text-sm">📷</span> Scanner
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="
                rounded-lg
                border border-[#c9a646]/20
                px-4 py-2
                text-xs text-[#aab3c4]
                transition
                hover:border-[#c9a646]/50
                hover:text-[#e7d49d]
              "
            >
              ↻ Refresh
            </button>

            {/* =================================================
                NOTIFICATION BELL
            ================================================= */}

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() =>
                  setNotificationOpen((previous) => !previous)
                }
                className="
                  relative flex h-10 w-10 items-center justify-center
                  rounded-full
                  border border-[#c9a646]/20
                  bg-[#171d31]
                  text-[#b9a66b]
                  transition
                  hover:border-[#c9a646]/50
                  hover:text-[#e8d49d]
                "
                aria-label="Notifications"
              >
                <Bell size={18} />

                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1
                      flex h-5 min-w-5 items-center justify-center
                      rounded-full
                      border-2 border-[#080d19]
                      bg-red-500
                      px-1
                      text-[9px] font-bold text-white
                    "
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* =================================================
                  NOTIFICATION DROPDOWN
              ================================================= */}

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.15 }}
                    className="
                      absolute right-0 top-12 z-[100]
                      w-[340px]
                      overflow-hidden
                      rounded-2xl
                      border border-[#c9a646]/20
                      bg-[#0b1220]
                      shadow-[0_20px_70px_rgba(0,0,0,0.55)]
                    "
                  >
                    {/* Dropdown Header */}
                    <div
                      className="
                        flex items-center justify-between
                        border-b border-white/5
                        px-4 py-4
                      "
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#e8d9b5]">
                          Notifications
                        </p>

                        <p className="mt-1 text-[10px] text-[#68748a]">
                          {unreadCount > 0
                            ? `${unreadCount} unread notification${
                                unreadCount > 1 ? "s" : ""
                              }`
                            : "You're all caught up"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="
                            text-[10px]
                            text-[#c9a646]
                            transition
                            hover:text-[#e8d49d]
                          "
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[360px] overflow-y-auto">
                      {!notifications ||
                      notifications.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                          <Bell
                            size={28}
                            className="mx-auto text-[#59657a]"
                          />

                          <p className="mt-3 text-sm text-[#8792a7]">
                            No notifications
                          </p>

                          <p className="mt-1 text-[10px] text-[#59657a]">
                            New notifications will appear here.
                          </p>
                        </div>
                      ) : (
                        notifications
                          .slice(0, 10)
                          .map((notification) => (
                            <button
                              key={
                                notification._id ||
                                notification.id
                              }
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(
                                    notification._id ||
                                      notification.id
                                  );
                                }
                              }}
                              className={`
                                flex w-full gap-3
                                border-b border-white/[0.04]
                                px-4 py-4
                                text-left
                                transition
                                hover:bg-white/[0.03]
                                ${
                                  !notification.read
                                    ? "bg-[#c9a646]/[0.04]"
                                    : ""
                                }
                              `}
                            >
                              {/* Notification Icon */}
                              <div
                                className="
                                  mt-0.5 flex h-8 w-8 shrink-0
                                  items-center justify-center
                                  rounded-lg
                                  bg-[#c9a646]/10
                                  text-[#d8bd68]
                                "
                              >
                                <Bell size={14} />
                              </div>

                              {/* Notification Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-[#dce2eb]">
                                    {notification.title ||
                                      "Notification"}
                                  </p>

                                  {!notification.read && (
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                                  )}
                                </div>

                                <p className="mt-1 text-[11px] leading-5 text-[#78849a]">
                                  {notification.message ||
                                    notification.description ||
                                    "You have a new notification."}
                                </p>
                              </div>
                            </button>
                          ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* =================================================
                ADMINISTRATOR / PROFILE MENU
            ================================================= */}

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((previous) => !previous)}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-2 py-1.5
                  transition
                  hover:bg-white/[0.03]
                "
                aria-label="Administrator menu"
              >
                {/* Administrator text */}
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-[#e8d8ae]">
                    Administrator
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-[#68748b]">
                    Super Admin
                  </p>
                </div>

                {/* Profile icon */}
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    border border-[#c9a646]/30
                    bg-[#171d31]
                    text-[#d8bd68]
                    transition
                    hover:border-[#c9a646]/60
                  "
                >
                  ♙
                </div>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    transition={{ duration: 0.15 }}
                    className="
                      absolute right-0 top-14 z-[100]
                      w-[230px]
                      overflow-hidden
                      rounded-2xl
                      border border-[#c9a646]/20
                      bg-[#0b1220]
                      shadow-[0_20px_70px_rgba(0,0,0,0.55)]
                    "
                  >
                    {/* Profile information */}
                    <div className="border-b border-white/5 px-4 py-4">
                      <p className="text-sm font-semibold text-[#e8d9b5]">
                        Administrator
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-wider text-[#68748a]">
                        Super Admin
                      </p>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="
                        flex w-full items-center gap-3
                        px-4 py-3
                        text-left
                        text-sm text-[#9da8bd]
                        transition
                        hover:bg-red-500/5
                        hover:text-red-300
                      "
                    >
                      <LogOut size={17} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 transition-all ml-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden top-[72px]"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed bottom-0 left-0 top-[72px] z-40
          w-[245px]
          border-r border-[#d4af37]/20
          bg-[#10182b]/95
          backdrop-blur-xl
          transition-transform duration-300
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 py-6">
          {/* Brand */}
          <div className="mb-8 px-3">
            <p className="font-harry text-3xl font-bold tracking-widest text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              HOGWARTS
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#e8d7b5]/60 font-serif">
              Magic Control Chamber
            </p>
          </div>

          {/* Main navigation */}
          <nav className="space-y-2">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#59647a]">
              Administration
            </p>

            {menuItems.map((item) => {
              const active = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    group relative flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-left text-sm
                    transition-all duration-200
                    ${
                      active
                        ? "border border-[#d4af37]/30 bg-[#d4af37]/15 text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(212,175,55,0.1)]"
                        : "border border-transparent text-[#e8d7b5]/60 hover:bg-[#d4af37]/5 hover:text-[#e8d7b5]"
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="
                        absolute bottom-2 left-0 top-2
                        w-[4px]
                        rounded-r-full
                        bg-[#d4af37]
                        shadow-[0_0_10px_rgba(212,175,55,0.8)]
                      "
                    />
                  )}

                  <span
                    className={`
                      flex h-8 w-8 items-center justify-center
                      rounded-lg
                      ${
                        active
                          ? "bg-[#d4af37]/20 text-[#d4af37] drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]"
                          : "bg-black/30 text-[#e8d7b5]/40"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="my-6 border-t border-[#c9a646]/10" />

          {/* Bottom navigation */}
          <div className="space-y-2">
            {/* Settings */}
            <button
              onClick={() => {
                setActiveMenu("settings");
                setMobileMenuOpen(false);
              }}
              className="
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-sm text-[#7e899e]
                transition
                hover:bg-white/[0.03]
                hover:text-[#d2d8e3]
              "
            >
              <span className="flex h-8 w-8 items-center justify-center">
                ⚙
              </span>

              Settings
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-sm text-[#7e899e]
                transition
                hover:bg-red-500/5
                hover:text-red-300
              "
            >
              <span className="flex h-8 w-8 items-center justify-center">
                ↪
              </span>

              Logout
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto px-3">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#d4af37]/60 font-bold">
              AWS Student Builder Group
            </p>

            <p className="mt-1 text-[9px] text-[#e8d7b5]/40 font-serif">
              MNNIT Allahabad
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="relative z-10 min-h-screen pt-[72px] lg:pl-[245px]">
        <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">
          {/* Messages */}

          <AnimatePresence>
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="
                  mb-5 flex items-center justify-between
                  rounded-xl
                  border border-red-400/20
                  bg-red-500/5
                  px-4 py-3
                  text-sm text-red-300
                "
              >
                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="text-red-300/60 hover:text-red-300"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Success */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="
                  mb-5 rounded-xl
                  border border-green-400/20
                  bg-green-500/5
                  px-4 py-3
                  text-sm text-green-300
                "
              >
                ✓ {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end animate-magic-reveal">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] bg-[#d4af37]/10 inline-block px-3 py-1 rounded-full border border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                ⚡ Magic Control Chamber
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-wide font-harry text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                Good morning, Administrator
              </h1>

              <p className="mt-3 text-base text-[#e8d7b5]/70 font-serif">
                Here's what's happening in Hackfest.
              </p>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// =============================================================
// OVERVIEW
// =============================================================

function Overview({
  dashboard,
  events,
  loading,
  onCreateEvent,
  onNavigate,
  formatDate,
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="▤"
          label="Total Events"
          value={loading ? "—" : dashboard?.totalEvents ?? 0}
          description="Events in system"
        />

        <StatCard
          icon="◉"
          label="Active Events"
          value={loading ? "—" : dashboard?.activeEvents ?? 0}
          description="Currently active"
        />

        <StatCard
          icon="♙"
          label="Users"
          value={loading ? "—" : dashboard?.totalUsers ?? "—"}
          description="User module"
        />

        <StatCard
          icon="♜"
          label="Teams"
          value={loading ? "—" : dashboard?.totalTeams ?? "—"}
          description="Team module"
        />
      </div>

      {/* Lower section */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent events */}

        <section
          className="
            rounded-2xl
            border border-[#c9a646]/15
            bg-[#0c1322]/80
            p-6
            backdrop-blur-xl
          "
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9a646]">
                Activity
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#e8d9b5]">
                Recent Events
              </h2>
            </div>

            <button
              onClick={() => onNavigate("events")}
              className="
                text-xs text-[#8d99ae]
                transition hover:text-[#d8bd68]
              "
            >
              View all →
            </button>
          </div>

          {events.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-3 text-3xl opacity-40">
                📜
              </div>

              <p className="text-sm text-[#778298]">
                No events created yet.
              </p>

              <button
                onClick={onCreateEvent}
                className="mt-4 text-xs text-[#d8bd68] hover:underline"
              >
                Create your first event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="
                    flex flex-col gap-3
                    rounded-xl
                    border border-white/[0.05]
                    bg-white/[0.02]
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-[#c9a646]/10
                        text-[#d8bd68]
                      "
                    >
                      📜
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#dce2eb]">
                        {event.name}
                      </p>

                      <p className="mt-1 text-xs text-[#68748a]">
                        {formatDate(event.date)}
                        {event.venue
                          ? ` • ${event.venue}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={event.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}

        <section
          className="
            rounded-2xl
            border border-[#c9a646]/15
            bg-[#0c1322]/80
            p-6
            backdrop-blur-xl
          "
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a646]">
            Administration
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#e8d9b5]">
            Quick Actions
          </h2>

          <div className="mt-6 space-y-3">
            <QuickAction
              icon="+"
              title="Create Event"
              description="Create a new hackathon event"
              onClick={onCreateEvent}
            />

            <QuickAction
              icon="♙"
              title="View Users"
              description="Manage registered users"
              onClick={() => onNavigate("users")}
            />

            <QuickAction
              icon="♜"
              title="View Teams"
              description="Manage hackathon teams"
              onClick={() => onNavigate("teams")}
            />

            <QuickAction
              icon="📷"
              title="QR Scanner"
              description="Scan QR codes for team check-in"
              onClick={() => window.location.href = "/organizer/scan"}
            />

            <QuickAction
              icon="✦"
              title="Broadcast"
              description="Send an announcement"
              onClick={() => onNavigate("broadcast")}
            />
          </div>
        </section>
      </div>

      {/* System status */}

      <section
        className="
          rounded-2xl
          border border-[#c9a646]/10
          bg-[#0a101d]/70
          p-5
        "
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />

            <span className="text-xs text-[#8792a7]">
              Backend connected
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="text-xs text-[#59657b]">
            MongoDB • API • Admin Panel
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================
// QUICK ACTION
// =============================================================

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-center gap-4
        rounded-xl
        border border-white/[0.05]
        bg-white/[0.02]
        p-3
        text-left
        transition
        hover:border-[#c9a646]/20
        hover:bg-[#c9a646]/5
      "
    >
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-lg
          bg-[#c9a646]/10
          text-lg text-[#d8bd68]
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#d5dce7]">
          {title}
        </p>

        <p className="mt-1 truncate text-[11px] text-[#657188]">
          {description}
        </p>
      </div>

      <span className="text-[#59657a]">→</span>
    </button>
  );
}

// =============================================================
// EVENTS PAGE
// =============================================================

function EventsPage({
  events,
  loading,
  onCreate,
  onEdit,
  onDelete,
  formatDate,
}) {
  const handleExport = () => {
    if (!events || events.length === 0) {
      alert("No events available to export.");
      return;
    }

    const headers = [
      "Name",
      "Description",
      "Date",
      "Venue",
      "Registration Deadline",
      "Max Participants",
      "Status",
      "Active",
    ];

    const rows = events.map((event) => [
      event.name || "",
      event.description || "",
      event.date
        ? new Date(event.date).toLocaleDateString()
        : "",
      event.venue || "",
      event.registrationDeadline
        ? new Date(
            event.registrationDeadline
          ).toLocaleDateString()
        : "",
      event.maxParticipants ?? "",
      event.status || "",
      event.isActive ? "Yes" : "No",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hackfest-events.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a646]">
            Event Management
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#e9dcbd]">
            Hackfest Events
          </h2>

          <p className="mt-2 text-sm text-[#758197]">
            Create, update and manage your events.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="
              rounded-xl
              border border-[#c9a646]/30
              bg-[#c9a646]/5
              px-5 py-3
              text-sm font-semibold
              text-[#d8bd68]
              transition
              hover:bg-[#c9a646]/15
            "
          >
            ↓ Export Events
          </button>

          <button
            onClick={onCreate}
            className="
              rounded-xl
              border border-[#c9a646]/30
              bg-[#c9a646]/10
              px-5 py-3
              text-sm font-semibold
              text-[#e5d19a]
              transition
              hover:bg-[#c9a646]/20
            "
          >
            + Create Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-[#0c1322]/70 p-12 text-center text-sm text-[#78849a]">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0c1322]/70 p-12 text-center">
          <div className="text-4xl opacity-40">
            📜
          </div>

          <p className="mt-4 text-[#aab3c2]">
            No events found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <motion.div
              key={event._id}
              layout
              className="
                rounded-2xl
                border border-[#c9a646]/10
                bg-[#0c1322]/80
                p-5
                backdrop-blur-xl
              "
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-xl
                      border border-[#c9a646]/15
                      bg-[#c9a646]/10
                      text-xl
                    "
                  >
                    📜
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-[#e2e7ef]">
                        {event.name}
                      </h3>

                      <StatusBadge status={event.status} />
                    </div>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a869b]">
                      {event.description ||
                        "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#68748a]">
                      <span>
                        📅 {formatDate(event.date)}
                      </span>

                      {event.venue && (
                        <span>⌖ {event.venue}</span>
                      )}

                      {event.maxParticipants && (
                        <span>
                          ♙ {event.maxParticipants} participants
                        </span>
                      )}

                      <span>
                        {event.isActive
                          ? "● Active"
                          : "○ Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    className="
                      rounded-lg
                      border border-blue-400/20
                      bg-blue-400/5
                      px-4 py-2
                      text-xs text-blue-300
                      transition
                      hover:bg-blue-400/10
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(event._id)}
                    className="
                      rounded-lg
                      border border-red-400/20
                      bg-red-400/5
                      px-4 py-2
                      text-xs text-red-300
                      transition
                      hover:bg-red-400/10
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================
// COMING SOON
// =============================================================

function ComingSoonPage({ icon, title }) {
  return (
    <div
      className="
        flex min-h-[500px]
        items-center justify-center
        rounded-2xl
        border border-[#c9a646]/10
        bg-[#0c1322]/70
      "
    >
      <div className="text-center">
        <div className="text-5xl opacity-30">
          {icon}
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-[#ddd2b5]">
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#69758a]">
          This module is ready in the Super Admin interface.
          Backend integration will be connected when the
          corresponding team module is merged.
        </p>

        <div className="mt-5 inline-flex rounded-full border border-[#c9a646]/15 bg-[#c9a646]/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b89b50]">
          Awaiting team integration
        </div>
      </div>
    </div>
  );
}

// =============================================================
// EVENT MODAL
// =============================================================

function EventModal({
  form,
  editing,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 15,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 15,
        }}
        className="
          max-h-[90vh]
          w-full max-w-2xl
          overflow-y-auto
          rounded-2xl
          border border-[#c9a646]/20
          bg-[#0b1220]
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
        "
      >
        {/* Modal header */}

        <div
          className="
            sticky top-0 z-10
            flex items-center justify-between
            border-b border-white/5
            bg-[#0b1220]/95
            px-6 py-5
            backdrop-blur-xl
          "
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9a646]">
              Hogwarts Administration
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#e6d8b9]">
              {editing ? "Edit Event" : "Create Event"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              bg-white/5
              text-[#8994a8]
              hover:text-white
            "
          >
            ✕
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          <FormField label="Event Name">
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="AWS SBG Hackfest 2026"
              className="input-style"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              placeholder="Describe the event..."
              className="input-style resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Event Date">
              <input
                required
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={onChange}
                className="input-style"
              />
            </FormField>

            <FormField label="Venue">
              <input
                name="venue"
                value={form.venue}
                onChange={onChange}
                placeholder="MNNIT Allahabad"
                className="input-style"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Registration Deadline">
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={form.registrationDeadline}
                onChange={onChange}
                className="input-style"
              />
            </FormField>

            <FormField label="Maximum Participants">
              <input
                type="number"
                min="1"
                name="maxParticipants"
                value={form.maxParticipants}
                onChange={onChange}
                placeholder="100"
                className="input-style"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Status">
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="input-style"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="ongoing">
                  Ongoing
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </FormField>

            <label
              className="
                flex cursor-pointer
                items-center gap-3
                rounded-xl
                border border-white/5
                bg-white/[0.02]
                px-4
              "
            >
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                className="h-4 w-4 accent-[#c9a646]"
              />

              <div>
                <p className="text-sm text-[#d3dbe6]">
                  Active Event
                </p>

                <p className="text-[10px] text-[#657188]">
                  Allow the event to remain active
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-white/5 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border border-white/10
                px-5 py-3
                text-sm text-[#8994a8]
                hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-xl
                border border-[#c9a646]/40
                bg-[#c9a646]/10
                px-5 py-3
                text-sm font-semibold
                text-[#e6d29b]
                hover:bg-[#c9a646]/20
              "
            >
              {editing
                ? "Save Changes"
                : "Create Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// =============================================================
// FORM FIELD
// =============================================================

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7e899d]">
        {label}
      </span>

      {children}
    </label>
  );
}

export default SuperAdminDashboard;