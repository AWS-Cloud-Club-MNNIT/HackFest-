import { useEffect, useState } from "react";
import API from "../../../services/api";

const StatCard = ({ label, value, highlight }) => (
  <div className="parchment-card relative overflow-hidden bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-1">
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d4af37]/5 blur-2xl pointer-events-none" />
    <p className="text-[#e8d7b5]/60 text-xs font-bold uppercase tracking-[0.2em]">{label}</p>
    <h3
      className={`text-4xl font-harry tracking-wide mt-3 ${
        highlight ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" : "text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
      }`}
    >
      {value}
    </h3>
  </div>
);

const OverviewTab = ({ onNavigateTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/super-admin/dashboard");
        setStats(res.data?.dashboard || null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard overview"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Users" value={loading ? "…" : stats?.totalUsers ?? "—"} />
        <StatCard label="Total Teams" value={loading ? "…" : stats?.totalTeams ?? "—"} />
        <StatCard label="Total Events" value={loading ? "…" : stats?.totalEvents ?? "—"} />
        <StatCard
          label="Active Events"
          value={loading ? "…" : stats?.activeEvents ?? "—"}
          highlight
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-6">{error}</p>
      )}

      <div className="parchment-card relative overflow-hidden bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl p-8 shadow-xl mt-8">
        <h3 className="text-2xl font-harry tracking-wide text-[#f4e8c1] mb-6 drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Quick Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab("events")}
            className="group relative overflow-hidden border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left transition-all hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="font-semibold text-[#f4e8c1] font-serif relative z-10">Manage Events</h4>
            <p className="text-sm text-[#e8d7b5]/60 mt-2 relative z-10">
              Create and configure hackathon events.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("teams")}
            className="group relative overflow-hidden border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left transition-all hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="font-semibold text-[#f4e8c1] font-serif relative z-10">Manage Teams</h4>
            <p className="text-sm text-[#e8d7b5]/60 mt-2 relative z-10">
              Lock rosters, review check-ins, remove teams.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("broadcast")}
            className="group relative overflow-hidden border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left transition-all hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="font-semibold text-[#f4e8c1] font-serif relative z-10">Send Announcement</h4>
            <p className="text-sm text-[#e8d7b5]/60 mt-2 relative z-10">
              Broadcast a notification to participants.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
