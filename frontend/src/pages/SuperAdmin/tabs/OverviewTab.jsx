import { useEffect, useState } from "react";
import API from "../../../services/api";

const StatCard = ({ label, value, highlight }) => (
  <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
    <p className="text-gray-400 text-sm">{label}</p>
    <h3
      className={`text-2xl font-bold mt-2 ${
        highlight ? "text-emerald-400" : "text-[#d4af37]"
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

      <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-[#d4af37] mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab("events")}
            className="border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left hover:border-[#d4af37]/50 transition"
          >
            <h4 className="font-semibold text-white">Manage Events</h4>
            <p className="text-sm text-gray-400 mt-1">
              Create and configure hackathon events.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("teams")}
            className="border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left hover:border-[#d4af37]/50 transition"
          >
            <h4 className="font-semibold text-white">Manage Teams</h4>
            <p className="text-sm text-gray-400 mt-1">
              Lock rosters, review check-ins, remove teams.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("broadcast")}
            className="border border-[#d4af37]/20 rounded-xl p-5 bg-[#080b16]/60 text-left hover:border-[#d4af37]/50 transition"
          >
            <h4 className="font-semibold text-white">Send Announcement</h4>
            <p className="text-sm text-gray-400 mt-1">
              Broadcast a notification to participants.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
