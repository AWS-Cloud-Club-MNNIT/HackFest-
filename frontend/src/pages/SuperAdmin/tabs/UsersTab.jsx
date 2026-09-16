import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/super-admin/users");
      setUsers(res.data?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.college?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleToggleBlock = async (user) => {
    setBusyId(user._id);
    try {
      const res = await API.patch(
        `/super-admin/users/${user._id}/toggle-block`
      );
      const updated = res.data.user;
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBlocked: updated.isBlocked } : u
        )
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="animate-magic-reveal">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h3 className="text-3xl font-bold font-harry text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
          Users ({users.length})
        </h3>
        <input
          placeholder="Search name, email, college…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-2.5 text-sm text-[#f4e8c1] w-full sm:w-80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
        />
      </div>

      <div className="parchment-card relative bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl overflow-hidden overflow-x-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading users…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No users match your search.</p>
        ) : (
            <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#d4af37]/10 text-[#d4af37] font-serif tracking-widest text-xs uppercase border-b border-[#d4af37]/30">
                <th className="py-4 px-6 font-semibold">Name</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">College</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5 transition-colors group"
                >
                  <td className="py-4 px-6 text-[#f4e8c1] font-medium">{u.name}</td>
                  <td className="py-4 px-6 text-[#e8d7b5]/60">{u.email}</td>
                  <td className="py-4 px-6 text-[#e8d7b5]/60">
                    {u.college || "—"}
                  </td>
                  <td className="py-4 px-6 capitalize text-[#e8d7b5]/60">
                    {u.role === "super_admin" ? (
                      <span className="text-[#d4af37] font-semibold drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">Super Admin</span>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border ${
                        u.isBlocked
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.role === "super_admin" ? (
                      <span className="text-xs text-[#e8d7b5]/30 italic">—</span>
                    ) : (
                      <button
                        disabled={busyId === u._id}
                        onClick={() => handleToggleBlock(u)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                          u.isBlocked 
                            ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" 
                            : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        {busyId === u._id
                          ? "…"
                          : u.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    )}
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

export default UsersTab;
