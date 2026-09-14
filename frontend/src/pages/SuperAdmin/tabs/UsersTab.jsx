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
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-[#d4af37]">
          Users ({users.length})
        </h3>
        <input
          placeholder="Search name, email, college…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white w-full sm:w-72"
        />
      </div>

      <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading users…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No users match your search.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#d4af37]/20">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5"
                >
                  <td className="py-3 px-4 text-white">{u.name}</td>
                  <td className="py-3 px-4 text-gray-400">{u.email}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {u.college || "—"}
                  </td>
                  <td className="py-3 px-4 capitalize text-gray-400">
                    {u.role}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.isBlocked
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role === "super_admin" ? (
                      <span className="text-xs text-gray-600">—</span>
                    ) : (
                      <button
                        disabled={busyId === u._id}
                        onClick={() => handleToggleBlock(u)}
                        className={`text-xs hover:underline disabled:opacity-50 ${
                          u.isBlocked ? "text-emerald-400" : "text-red-400"
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
