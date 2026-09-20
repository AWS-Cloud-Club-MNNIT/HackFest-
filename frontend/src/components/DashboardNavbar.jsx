import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, ShieldAlert, Menu, X } from "lucide-react";
import API from "../services/api";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";

const DashboardNavbar = ({ user: propUser }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const storeUser = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  const user = storeUser || propUser;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let socket = null;

    if (user) {
      fetchNotifications();

      socket = io(API.defaults.baseURL.replace('/api', ''));

      socket.emit("register", user._id);

      socket.on("notification:new", (newNotif) => {
        addNotification(newNotif);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user, fetchNotifications, addNotification]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getIconForType = (type) => {
    switch (type) {
      case "invite_received":
      case "invite_accepted":
        return <Check className="w-4 h-4 text-green-400" />;
      case "member_left":
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case "domain_changed":
      case "deadline_reminder":
        return <ShieldAlert className="w-4 h-4 text-[#d4af37]" />;
      default:
        return <Bell className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <nav className="border-b border-[#d4af37]/30 px-6 py-4 flex justify-between items-center bg-[#080b16]/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] sticky top-0 z-50 transition-all duration-500">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

        <Link to="/dashboard" className="group flex items-center gap-2.5 transition">
          <img
            src="/images/aws_mnnit_logo.png"
            alt="AWS MNNIT Logo"
            className="h-9 w-auto object-contain transition duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="flex-col hidden sm:flex">
            <h1 className="font-harry text-2xl font-bold text-[#f4e8c1] tracking-wider group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all">
              HACKFEST 1.0
            </h1>
            <p className="font-display text-[10px] font-semibold text-[#d4af37] tracking-widest uppercase font-sans -mt-1">
              AWS MNNIT Portal
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-5 border border-[#d4af37]/25 rounded-full bg-[#080b16]/85 px-6 py-2 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          <Link to="/dashboard" className="text-[12px] font-semibold tracking-wide text-[#e8d7b5]/75 hover:text-[#d4af37] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300">
            Dashboard
          </Link>
          {user?.teamId ? (
            <Link to="/team/my-team" className="text-[12px] font-semibold tracking-wide text-[#e8d7b5]/75 hover:text-[#d4af37] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300">
              My Team
            </Link>
          ) : (
            <>
              <Link to="/team/create" className="text-[12px] font-semibold tracking-wide text-[#e8d7b5]/75 hover:text-[#d4af37] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300">
                Create Team
              </Link>
              <Link to="/team/find" className="text-[12px] font-semibold tracking-wide text-[#e8d7b5]/75 hover:text-[#d4af37] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-300">
                Find Team
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 relative">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 border border-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 shadow-[0_0_12px_rgba(239,68,68,0.8)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 max-h-[400px] bg-[#10182b]/95 backdrop-blur-xl border border-[#d4af37]/40 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-4 border-b border-[#d4af37]/20 flex justify-between items-center bg-gradient-to-r from-[#10182b] to-[#1a233a]">
                  <h3 className="text-[#d4af37] font-semibold text-sm tracking-widest uppercase">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-bold text-[#e8d7b5]/70 hover:text-[#d4af37] transition-colors uppercase tracking-wider"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-1 p-2 no-scrollbar">
                  {loading ? (
                    <div className="p-6 flex justify-center">
                      <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-[#e8d7b5]/50 text-sm font-serif italic">
                      The owls have brought no letters yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                        className={`p-3 rounded-xl mb-2 flex gap-3 cursor-pointer transition-all duration-300 ${
                          notif.read
                            ? "opacity-60 hover:bg-white/5"
                            : "bg-[#d4af37]/5 hover:bg-[#d4af37]/15 border-l-2 border-[#d4af37] shadow-[inset_4px_0_10px_rgba(212,175,55,0.05)]"
                        }`}
                      >
                        <div className="mt-1">{getIconForType(notif.type)}</div>
                        <div>
                          <p className={`text-sm ${!notif.read ? "text-[#e8d7b5] font-medium" : "text-[#e8d7b5]/70"}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-[#e8d7b5]/40 mt-1.5 tracking-wider">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Dashboard (super_admin only) */}
          {user?.role === "super_admin" && (
            <button
              onClick={() => navigate("/super-admin")}
              className="hidden md:inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-5 py-1.5 text-xs font-bold tracking-wider text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition duration-300 hover:bg-emerald-500/20 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
            >
              Admin Dashboard
            </button>
          )}

          <button
            onClick={handleLogout}
            className="group relative cursor-pointer hidden md:inline-flex items-center justify-center overflow-hidden rounded-full border border-[#d4af37]/60 bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] px-5 py-1.5 text-xs font-bold tracking-wider text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)] transition duration-300 hover:border-[#f4e8c1] hover:text-[#f4e8c1] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Logout
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 right-0 bg-[#080b16]/95 backdrop-blur-xl border-b border-[#d4af37]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-40 p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <Link onClick={() => setMobileMenuOpen(false)} to="/dashboard" className="text-sm font-bold tracking-wider text-[#e8d7b5] border-l-2 border-[#d4af37] pl-3 py-1">
            Dashboard
          </Link>
          {user?.teamId ? (
            <Link onClick={() => setMobileMenuOpen(false)} to="/team/my-team" className="text-sm font-semibold tracking-wide text-[#e8d7b5]/80 hover:text-[#d4af37] pl-3 py-1">
              My Team
            </Link>
          ) : (
            <>
              <Link onClick={() => setMobileMenuOpen(false)} to="/team/create" className="text-sm font-semibold tracking-wide text-[#e8d7b5]/80 hover:text-[#d4af37] pl-3 py-1">
                Create Team
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/team/find" className="text-sm font-semibold tracking-wide text-[#e8d7b5]/80 hover:text-[#d4af37] pl-3 py-1">
                Find Team
              </Link>
            </>
          )}
          {user?.role === "super_admin" && (
            <Link
              onClick={() => setMobileMenuOpen(false)}
              to="/super-admin"
              className="text-sm font-bold tracking-wider text-emerald-400 border-l-2 border-emerald-500 pl-3 py-1"
            >
              Admin Dashboard
            </Link>
          )}
          <div className="border-t border-[#d4af37]/20 my-2 pt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-center py-2 rounded-md border border-[#d4af37]/40 bg-red-500/10 text-red-400 font-bold tracking-wider text-sm hover:bg-red-500/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;