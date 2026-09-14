import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, ShieldAlert } from "lucide-react";
import API from "../services/api";
import { io } from "socket.io-client";

const DashboardNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
      setUnreadCount((res.data || []).filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket = null;

    if (user) {
      fetchNotifications();
      
      // Initialize Socket
      socket = io(API.defaults.baseURL.replace('/api', ''));

      socket.emit("register", user._id);

      socket.on("notification:new", (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Optional: show a toast alert for the notification
        // toast.success(newNotif.message);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    <nav className="border-b border-[#d4af37]/20 px-6 py-4 flex justify-between items-center bg-[#080b16] sticky top-0 z-50">
      <Link to="/dashboard" className="group">
        <h1 className="text-xl font-bold text-[#d4af37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all">
          HACKFEST 1.0
        </h1>
        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
          Registration Portal
        </p>
      </Link>

      <div className="flex items-center gap-4 relative">
        {/* Notifications Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full border border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/10 transition relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 max-h-[400px] bg-[#10182b] border border-[#d4af37]/40 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-[#d4af37]/20 flex justify-between items-center bg-gradient-to-r from-[#10182b] to-[#1a233a]">
                <h3 className="text-[#d4af37] font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#e8d7b5] hover:text-[#d4af37] transition"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1 p-2 no-scrollbar">
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                      className={`p-3 rounded-lg mb-1 flex gap-3 cursor-pointer transition-colors ${
                        notif.read
                          ? "opacity-60 hover:bg-white/5"
                          : "bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border-l-2 border-[#d4af37]"
                      }`}
                    >
                      <div className="mt-1">{getIconForType(notif.type)}</div>
                      <div>
                        <p className={`text-sm ${!notif.read ? "text-[#e8d7b5]" : "text-gray-400"}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
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

        <button
          onClick={handleLogout}
          className="border border-[#d4af37]/40 px-4 py-2 text-sm rounded-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
