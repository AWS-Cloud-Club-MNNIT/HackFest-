import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const TeamsTab = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get("/super-admin/teams", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setTeams(res.data?.teams || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleToggleLock = async (team) => {
    setBusyId(team._id);
    try {
      const endpoint = team.lockedBySuperAdmin ? "unlock" : "lock";
      const res = await API.patch(`/super-admin/teams/${team._id}/${endpoint}`);
      setTeams((prev) =>
        prev.map((t) => (t._id === team._id ? res.data.team : t))
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update team");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (team) => {
    if (
      !window.confirm(
        `Delete team "${team.name}"? This cannot be undone.`
      )
    )
      return;

    setBusyId(team._id);
    try {
      await API.delete(`/super-admin/teams/${team._id}`);
      setTeams((prev) => prev.filter((t) => t._id !== team._id));
      toast.success("Team deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete team");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="animate-magic-reveal">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h3 className="text-3xl font-bold font-harry text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
          Teams ({teams.length})
        </h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="forming">Forming</option>
          <option value="complete">Complete</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div className="parchment-card relative bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl overflow-hidden overflow-x-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading teams…</p>
        ) : teams.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No teams found.</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#d4af37]/10 text-[#d4af37] font-serif tracking-widest text-xs uppercase border-b border-[#d4af37]/30">
                <th className="py-4 px-6 font-semibold">Team</th>
                <th className="py-4 px-6 font-semibold">Event</th>
                <th className="py-4 px-6 font-semibold">Leader</th>
                <th className="py-4 px-6 font-semibold text-center">Members</th>
                <th className="py-4 px-6 font-semibold">Domain</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-center">Checked In</th>
                <th className="py-4 px-6 font-semibold text-center">History</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const history = team.memberHistory || [];
                // "Open" quits: left/removed and not yet rejoined.
                const openQuits = history.filter((h) => !h.rejoined);
                const isExpanded = expandedId === team._id;

                return (
                  <Fragment key={team._id}>
                    <tr className={`border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5 transition-colors group ${isExpanded ? 'bg-[#d4af37]/5' : ''}`}>
                      <td className="py-4 px-6 text-[#f4e8c1] font-medium">
                        {team.name}
                        {team.lockedBySuperAdmin && (
                          <span className="ml-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                            LOCKED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[#e8d7b5]/60">
                        {team.eventId?.title || "—"}
                      </td>
                      <td className="py-4 px-6 text-[#e8d7b5]/60">
                        {team.leaderId?.name || "—"}
                      </td>
                      <td className="py-4 px-6 text-[#e8d7b5]/60 text-center font-bold">
                        {(team.members || []).length}
                      </td>
                      <td className="py-4 px-6 text-[#e8d7b5]/60">
                        {team.domain || "—"}
                      </td>
                      <td className="py-4 px-6 capitalize text-[#e8d7b5]/60 font-serif">
                        {team.status}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {team.checkedIn ? (
                          <span className="text-emerald-400 text-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded-md">Yes</span>
                        ) : (
                          <span className="text-[#e8d7b5]/30 text-xs italic">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {history.length === 0 ? (
                          <span className="text-[#e8d7b5]/30 text-xs italic">—</span>
                        ) : (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : team._id)
                            }
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            {openQuits.length > 0
                              ? `${openQuits.length} pending`
                              : `${history.length} resolved`}
                            {isExpanded ? " ▲" : " ▼"}
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          disabled={busyId === team._id}
                          onClick={() => handleToggleLock(team)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 mr-2 transition-all disabled:opacity-50"
                        >
                          {team.lockedBySuperAdmin ? "Unlock" : "Lock"}
                        </button>
                        <button
                          disabled={busyId === team._id}
                          onClick={() => handleDelete(team)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {isExpanded && history.length > 0 && (
                      <tr className="bg-[#080b16]/60 border-b border-[#d4af37]/30 shadow-inner">
                        <td colSpan={9} className="py-4 px-6">
                          <div className="space-y-2">
                            {history
                              .slice()
                              .reverse()
                              .map((h, idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#101522]/80 border border-[#d4af37]/20 rounded-xl px-4 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                                  >
                                    <div className="text-[#e8d7b5]/60 font-serif">
                                      <span className="text-[#f4e8c1] font-semibold text-sm">
                                        {h.userId?.name || h.name || "Unknown wizard"}
                                      </span>{" "}
                                      <span className="text-[#e8d7b5]/40 italic">
                                        ({h.userId?.email || h.email || "no owl address"})
                                      </span>{" "}
                                      <span
                                        className={
                                          h.action === "left"
                                            ? "text-yellow-400 font-semibold"
                                            : "text-red-400 font-semibold"
                                        }
                                      >
                                        {h.action === "left" ? "left the team" : "was removed"}
                                      </span>{" "}
                                      <span className="text-[#e8d7b5]/40 text-[10px]">
                                        on{" "}
                                        {h.at
                                          ? new Date(h.at).toLocaleString()
                                          : "—"}
                                      </span>
                                    </div>
                                    <div>
                                      {h.rejoined ? (
                                        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                                          Rejoined
                                        </span>
                                      ) : h.userId?.isBlocked ? (
                                        <span className="text-red-400 font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10">
                                          Blocked
                                        </span>
                                      ) : (
                                        <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                                          Available to re-add
                                        </span>
                                      )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamsTab;