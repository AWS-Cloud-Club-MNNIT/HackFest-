import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await API.get("/auth/me");
        const currentUser = response.data.user;

        if (currentUser.role !== "super_admin") {
          navigate("/dashboard");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b16] text-[#d4af37] flex items-center justify-center font-serif">
        Verifying Headmaster Access...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">

      {/* Navbar */}
      <nav className="border-b border-[#d4af37]/30 bg-[#101522]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="text-xl font-bold text-[#d4af37] tracking-wider font-harry">
              SUPER ADMIN PORTAL
            </h1>
            <p className="text-xs text-gray-400">
              HackFest 1.0 Control Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-[#d4af37] hover:underline"
          >
            User View
          </button>

          <button
            onClick={handleLogout}
            className="border border-[#d4af37]/50 px-4 py-2 rounded-lg text-xs font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase rounded-full bg-[#d4af37]/10 px-3 py-1 border border-[#d4af37]/30">
            👑 Headmaster Access Granted
          </span>

          <h2 className="text-4xl font-bold mt-3 text-white">
            Welcome, {user.name}
          </h2>

          <p className="text-gray-400 mt-1">
            Super Admin Control Panel for HackFest 1.0
          </p>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
            <p className="text-gray-400 text-sm">Account Role</p>
            <h3 className="text-2xl font-bold text-[#d4af37] mt-2 capitalize">
              Super Admin
            </h3>
            <p className="text-xs text-gray-500 mt-1">Full System Rights</p>
          </div>

          <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
            <p className="text-gray-400 text-sm">Email Address</p>
            <h3 className="text-lg font-semibold text-white mt-2 truncate">
              {user.email}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">✓ Authorized Admin</p>
          </div>

          <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
            <p className="text-gray-400 text-sm">System Status</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-2">
              Active & Live
            </h3>
            <p className="text-xs text-gray-500 mt-1">MongoDB & API Connected</p>
          </div>

        </div>

        {/* Admin Tools Section */}
        <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-[#d4af37] mb-4">
            Super Admin Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60">
              <h4 className="font-semibold text-white">Participant Management</h4>
              <p className="text-sm text-gray-400 mt-1">
                View all registered wizards, assign teams, and manage blocked users.
              </p>
              <button
                onClick={() => navigate("/browse-teammates")}
                className="mt-4 px-4 py-2 bg-[#d4af37]/15 text-[#d4af37] rounded-lg text-xs font-bold border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-black transition"
              >
                Browse All Wizards
              </button>
            </div>

            <div className="border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60">
              <h4 className="font-semibold text-white">Hackathon Settings</h4>
              <p className="text-sm text-gray-400 mt-1">
                Manage event schedules, house leaderboards, and announcements.
              </p>
              <span className="inline-block mt-4 text-xs text-gray-500">
                System operational
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SuperAdmin;
