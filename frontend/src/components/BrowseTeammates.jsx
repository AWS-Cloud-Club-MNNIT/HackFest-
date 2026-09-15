import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MailPlus, Eye, Check } from "lucide-react";
import API from "../services/api";
import DetailModal from "./common/DetailModal";
import ParticipantDetail from "./ParticipantDetail";
import { useAuthStore } from "../store/useAuthStore";

const BrowseTeammates = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [branch, setBranch] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitedUserIds, setInvitedUserIds] = useState(new Set());

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (name.trim()) params.append("name", name.trim());
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

  const fetchTeam = async () => {
    try {
      if (currentUser?.teamId) {
        const teamRes = await API.get(`/teams/${currentUser.teamId}`);
        if (teamRes.data.leaderId._id === currentUser._id || teamRes.data.leaderId === currentUser._id) {
          setIsLeader(true);
        }
      }
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [currentUser]);

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
      setInvitedUserIds(prev => new Set(prev).add(toUserId));
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none text-white"
          />

          <input
            type="text"
            placeholder="Search skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none text-white"
          />

          <input
            type="text"
            placeholder="Branch..."
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none text-white"
          />

          <input
            type="text"
            placeholder="College..."
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#080b16] border border-gray-700 focus:border-[#d4af37] outline-none text-white"
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
                {u.skills?.slice(0,3).map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20"
                  >
                    {item}
                  </span>
                ))}
                {u.skills?.length > 3 && (
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                    +{u.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUser(u)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition text-sm font-bold ${isLeader ? 'flex-1' : 'w-full'}`}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              
              {isLeader && (
                <button
                  onClick={() => handleInvite(u._id)}
                  disabled={invitedUserIds.has(u._id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition text-sm disabled:opacity-50 ${
                    invitedUserIds.has(u._id)
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-[#d4af37] text-black hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {invitedUserIds.has(u._id) ? <><Check className="w-4 h-4" /> Invited</> : <><MailPlus className="w-4 h-4" /> Invite</>}
                </button>
              )}
            </div>

          </div>
        ))}

      </div>

      <DetailModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Participant Details"
      >
        <ParticipantDetail 
          participant={selectedUser} 
          actions={
            <>
              {isLeader && selectedUser && (
                <button
                  onClick={() => {
                    handleInvite(selectedUser._id);
                    setSelectedUser(null);
                  }}
                  disabled={invitedUserIds.has(selectedUser._id)}
                  className={`px-6 py-2 font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                    invitedUserIds.has(selectedUser._id)
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-[#d4af37] text-black hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {invitedUserIds.has(selectedUser._id) ? <><Check className="w-4 h-4" /> Invited</> : "Invite to Team"}
                </button>
              )}
            </>
          }
        />
      </DetailModal>

    </section>
  );
};

export default BrowseTeammates;