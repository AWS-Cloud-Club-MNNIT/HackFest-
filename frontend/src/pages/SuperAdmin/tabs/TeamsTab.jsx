import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const TeamsTab = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

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
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-[#d4af37]">
          Teams ({teams.length})
        </h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All statuses</option>
          <option value="forming">Forming</option>
          <option value="complete">Complete</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading teams…</p>
        ) : teams.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No teams found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#d4af37]/20">
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Leader</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Checked In</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team._id}
                  className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5"
                >
                  <td className="py-3 px-4 text-white font-medium">
                    {team.name}
                    {team.lockedBySuperAdmin && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                        LOCKED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {team.eventId?.title || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {team.leaderId?.name || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {(team.members || []).length}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {team.domain || "—"}
                  </td>
                  <td className="py-3 px-4 capitalize text-gray-400">
                    {team.status}
                  </td>
                  <td className="py-3 px-4">
                    {team.checkedIn ? (
                      <span className="text-emerald-400 text-xs">Yes</span>
                    ) : (
                      <span className="text-gray-500 text-xs">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      disabled={busyId === team._id}
                      onClick={() => handleToggleLock(team)}
                      className="text-xs text-[#d4af37] hover:underline mr-3 disabled:opacity-50"
                    >
                      {team.lockedBySuperAdmin ? "Unlock" : "Lock"}
                    </button>
                    <button
                      disabled={busyId === team._id}
                      onClick={() => handleDelete(team)}
                      className="text-xs text-red-400 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamsTab;
