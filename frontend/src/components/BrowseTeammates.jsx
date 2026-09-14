import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MailPlus } from "lucide-react";
import API from "../services/api";

const BrowseTeammates = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [skill, setSkill] = useState("");
  const [branch, setBranch] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (skill.trim()) params.append("skill", skill.trim());
      if (branch.trim()) params.append("branch", branch.trim());
      if (college.trim()) params.append("college", college.trim());

      const response = await API.get(
        `/users/looking-for-team?${params.toString()}`
      );

      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load teammates"
      );
    } finally {
      setLoading(false);
    }
  };

  const [isLeader, setIsLeader] = useState(false);

  const fetchCurrentUserAndTeam = async () => {
    try {
      const authRes = await API.get("/auth/me");
      const user = authRes.data.user;
      setCurrentUser(user);

      if (user.teamId) {
        const teamRes = await API.get(`/teams/${user.teamId}`);
        if (teamRes.data.leaderId._id === user._id) {
          setIsLeader(true);
        }
      }
    } catch (error) {
      // Not logged in or no team, that's fine
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUserAndTeam();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleInvite = async (toUserId) => {
    if (!currentUser) {
      return toast.error("Please login to invite teammates.");
    }
    if (!currentUser.teamId) {
      return toast.error("You must create a team first before you can invite others.");
    }

    try {
      await API.post("/invites", { teamId: currentUser.teamId, toUserId });
      toast.success("Invite sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invite");
    }
  };

  return (
    <section className="mt-10">

      {/* Heading */}
      <div className="mb-6">
        <p className="text-[#d4af37] text-sm tracking-widest uppercase">
          The Great Hall
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Find Your Teammates
        </h2>

        <p className="text-gray-400 mt-2">
          Find fellow builders who are looking for a team.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

          <input
            type="text"
            placeholder="Branch..."
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

          <input
            type="text"
            placeholder="College..."
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e6c65c] transition disabled:opacity-60"
        >
          {loading ? "Searching..." : "Find Teammates"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center mb-6">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && users.length === 0 && (
        <p className="text-gray-400 text-center">
          Searching the Great Hall...
        </p>
      )}

      {/* Users */}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-10 bg-[#101522] rounded-2xl border border-[#d4af37]/20">
          <p className="text-gray-400">
            No wizards found looking for a team.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {users.map((u) => (
          <div
            key={u._id}
            className="bg-[#101522] border border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/50 transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-[#d4af37]">
                {u.name}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {u.college || "College not added"}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                {u.branch || "Branch not added"}
                {u.year && ` • Year ${u.year}`}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {u.skills?.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(u._id);
                  toast.success("User ID copied to clipboard!");
                }}
                className={`py-2.5 rounded-lg border border-gray-600 text-gray-400 hover:text-white transition text-xs font-bold ${isLeader ? 'w-1/3' : 'w-full'}`}
              >
                Copy ID
              </button>
              
              {isLeader && (
                <button
                  onClick={() => handleInvite(u._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition"
                >
                  <MailPlus className="w-4 h-4" />
                  Invite
                </button>
              )}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default BrowseTeammates;