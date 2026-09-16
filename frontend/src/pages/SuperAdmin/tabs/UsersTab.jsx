
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#d4af37]">
            Participants ({filtered.length}/{users.length})
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            View and manage registered participants.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white w-full sm:w-72 focus:outline-none focus:border-[#d4af37]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#d4af37]/20 bg-[#080b16] px-3 py-2 text-sm text-white"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-gray-400">
            Loading participants...
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">
            No participants match your search.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#d4af37]/20">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
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