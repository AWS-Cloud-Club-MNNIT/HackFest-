
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../services/api";

const DOMAIN_CONFIG = [
  {
    key: "Full-Stack & Interactive Systems",
    shortName: "Full-Stack",
  },
  {
    key: "Cybersecurity",
    shortName: "Cybersecurity",
  },
  {
    key: "AI & Machine Learning",
    shortName: "AI & ML",
  },
  {
    key: "Blockchain & Web3",
    shortName: "Blockchain",
  },
];

const OverviewTab = ({ setActiveMenu }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/super-admin/dashboard");

      setDashboard(response.data?.dashboard || null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const domainData = useMemo(() => {
    const analytics = dashboard?.domainAnalytics || {};

    return DOMAIN_CONFIG.map((domain) => {
      const data = analytics[domain.key] || {};

      return {
        name: domain.key,
        shortName: domain.shortName,
        teams: Number(data.teams || 0),
        participants: Number(data.participants || 0),
      };
    });
  }, [dashboard]);

  const maxTeams = Math.max(
    ...domainData.map((domain) => domain.teams),
    1
  );

  const maxParticipants = Math.max(
    ...domainData.map((domain) => domain.participants),
    1
  );

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-lg text-gray-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="mb-4 text-red-400">{error}</p>

        <button
          onClick={fetchDashboard}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-xl bg-white/5 p-6 text-center text-gray-400">
        No dashboard data available.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers || 0,
      icon: "👥",
    },
    {
      title: "Total Teams",
      value: dashboard.totalTeams || 0,
      icon: "🛡️",
    },
    {
      title: "Total Events",
      value: dashboard.totalEvents || 0,
      icon: "🏆",
    },
    {
      title: "Active Events",
      value: dashboard.activeEvents || 0,
      icon: "⚡",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Dashboard Overview
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Monitor users, teams, events, and competition domains.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>

              <span className="text-xs text-gray-500">
                Overall
              </span>
            </div>

            <p className="text-sm text-gray-400">{stat.title}</p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Domain Analytics */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">
            Competition Domain Analytics
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Compare the number of teams and participants in each domain.
          </p>
        </div>

        <div className="space-y-8">
          {domainData.map((domain) => (
            <div key={domain.name} className="space-y-4">
              {/* Domain Heading */}
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h4 className="font-medium text-gray-200">
                  {domain.name}
                </h4>

                <div className="flex gap-3 text-xs">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-400">
                    {domain.teams} Teams
                  </span>

                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-400">
                    {domain.participants} Participants
                  </span>
                </div>
              </div>

              {/* Teams Bar */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-gray-400">
                  <span>Teams</span>
                  <span>{domain.teams}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${(domain.teams / maxTeams) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Participants Bar */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-gray-400">
                  <span>Participants</span>
                  <span>{domain.participants}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${(domain.participants / maxParticipants) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-gray-400">Checked-in Teams</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {dashboard.checkedInTeams || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-gray-400">Forming Teams</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {dashboard.formingTeams || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-gray-400">Complete Teams</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {dashboard.completeTeams || 0}
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Quick Actions
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveMenu?.("events")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            Manage Events
          </button>

          <button
            onClick={() => setActiveMenu?.("teams")}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Manage Teams
          </button>

          <button
            onClick={() => setActiveMenu?.("broadcast")}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Broadcast Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;