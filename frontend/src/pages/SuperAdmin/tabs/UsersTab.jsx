
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/super-admin/users");
      setUsers(res.data?.users || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        user.name,
        user.email,
        user.college,
        user.branch,
        user.year,
        user.domain,
        user.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isBlocked) ||
        (statusFilter === "blocked" && user.isBlocked);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleToggleBlock = async (user) => {
    setBusyId(user._id);

    try {
      const res = await API.patch(
        `/super-admin/users/${user._id}/toggle-block`
      );

      const updated = res.data.user;

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                isBlocked: updated.isBlocked,
              }
            : item
        )
      );

      toast.success(res.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update user"
      );
    } finally {
      setBusyId(null);
    }
  };

  const getDomain = (user) => {
    if (user.domain) return user.domain;

    if (Array.isArray(user.domains)) {
      return user.domains.join(", ");
    }

    return "Not specified";
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
          <p className="p-6 text-sm text-gray-400">
            Loading participants...
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            No participants match your search.
          </p>
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
              {filtered.map((user) => (
                <>
                  <tr
                    key={user._id}
                    className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5"
                  >
                    <td className="py-3 px-4 text-white whitespace-nowrap">
                      {user.name || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {user.email || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {user.college || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {getDomain(user)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.isBlocked
                            ? "bg-red-500/10 text-red-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === user._id
                                ? null
                                : user._id
                            )
                          }
                          className="text-xs text-[#d4af37] hover:underline"
                        >
                          {expandedId === user._id
                            ? "Hide Details"
                            : "View Details"}
                        </button>

                        {user.role === "super_admin" ? (
                          <span className="text-xs text-gray-600">
                            —
                          </span>
                        ) : (
                          <button
                            disabled={busyId === user._id}
                            onClick={() => handleToggleBlock(user)}
                            className={`text-xs hover:underline disabled:opacity-50 ${
                              user.isBlocked
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {busyId === user._id
                              ? "..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {expandedId === user._id && (
                    <tr
                      key={`${user._id}-details`}
                      className="bg-[#080b16]/70 border-b border-[#d4af37]/20"
                    >
                      <td colSpan={6} className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Detail
                            label="Full Name"
                            value={user.name}
                          />

                          <Detail
                            label="Email"
                            value={user.email}
                          />

                          <Detail
                            label="College"
                            value={user.college}
                          />

                          <Detail
                            label="Branch"
                            value={user.branch}
                          />

                          <Detail
                            label="Year"
                            value={user.year}
                          />

                          <Detail
                            label="Role"
                            value={user.role}
                          />

                          <Detail
                            label="Domain"
                            value={getDomain(user)}
                          />

                          <Detail
                            label="Skills"
                            value={
                              Array.isArray(user.skills)
                                ? user.skills.join(", ")
                                : user.skills
                            }
                          />

                          <Detail
                            label="User ID"
                            value={user._id}
                          />

                          <Detail
                            label="Account Status"
                            value={
                              user.isBlocked ? "Blocked" : "Active"
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="border border-white/10 rounded-lg p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-gray-200 mt-1 break-words">
      {value || "Not specified"}
    </p>
  </div>
);

export default UsersTab;