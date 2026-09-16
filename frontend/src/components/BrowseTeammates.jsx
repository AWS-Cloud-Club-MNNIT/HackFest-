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
    <section className="mt-10 animate-magic-reveal">

      {/* Heading */}
      <div className="mb-8">
        <p className="text-[#d4af37] text-[10px] tracking-widest uppercase font-bold bg-[#d4af37]/10 inline-block px-3 py-1 rounded-full border border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)] mb-3">
          The Great Hall
        </p>

        <h2 className="text-4xl md:text-5xl font-bold font-harry text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
          Find Your Teammates
        </h2>

        <p className="text-[#e8d7b5]/70 mt-3 font-serif max-w-xl">
          Find fellow wizards who are looking for a team. Invite them to join your guild.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-[#10182b]/80 border border-[#d4af37]/20 rounded-3xl p-6 mb-10 backdrop-blur-md parchment-card shadow-[0_0_20px_rgba(212,175,55,0.05)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 focus:border-[#d4af37] outline-none text-[#e8d7b5] magic-input-focus transition-all duration-300 placeholder-[#e8d7b5]/40 font-sans shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
          />

          <input
            type="text"
            placeholder="Search skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 focus:border-[#d4af37] outline-none text-[#e8d7b5] magic-input-focus transition-all duration-300 placeholder-[#e8d7b5]/40 font-sans shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
          />

          <input
            type="text"
            placeholder="Branch..."
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 focus:border-[#d4af37] outline-none text-[#e8d7b5] magic-input-focus transition-all duration-300 placeholder-[#e8d7b5]/40 font-sans shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
          />

          <input
            type="text"
            placeholder="College..."
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/30 focus:border-[#d4af37] outline-none text-[#e8d7b5] magic-input-focus transition-all duration-300 placeholder-[#e8d7b5]/40 font-sans shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
          />

        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 font-bold hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-60 uppercase tracking-wider text-xs"
          >
            {loading ? "Searching..." : "Find Teammates"}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center mb-6 font-serif">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && users.length === 0 && (
        <div className="text-[#d4af37] text-center py-10 font-harry text-2xl animate-pulse tracking-wider">
          Searching the Great Hall...
        </div>
      )}

      {/* Users */}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-16 bg-[#10182b]/60 rounded-3xl border border-[#d4af37]/20 parchment-card max-w-2xl mx-auto">
          <p className="text-[#e8d7b5]/60 font-serif">
            No wizards found looking for a team. Try adjusting your search criteria.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {users.map((u) => (
          <div
            key={u._id}
            className="bg-[#10182b]/80 border border-[#d4af37]/20 rounded-3xl p-6 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col justify-between parchment-card group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-[#080b16] border border-[#d4af37]/30 flex items-center justify-center font-bold text-xl text-[#e8d7b5] group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-colors shadow-inner">
                    {u.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h3 className="text-2xl font-harry tracking-wide text-[#f4e8c1] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                      {u.name}
                    </h3>
                 </div>
              </div>

              <div className="space-y-1 mb-5 pl-1">
                <p className="text-[#e8d7b5]/70 text-sm font-serif flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold mt-0.5">•</span> {u.college || "College not added"}
                </p>
                <p className="text-[#e8d7b5]/50 text-xs font-serif flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold mt-0.5">•</span> {u.branch || "Branch not added"} {u.year && `| Year ${u.year}`}
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {u.skills?.slice(0,3).map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                  >
                    {item}
                  </span>
                ))}
                {u.skills?.length > 3 && (
                  <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-[#080b16] text-[#e8d7b5]/50 border border-[#d4af37]/10">
                    +{u.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#d4af37]/10 mt-auto">
              <button
                onClick={() => setSelectedUser(u)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors text-xs font-bold uppercase tracking-wider ${isLeader ? 'flex-1' : 'w-full'}`}
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              
              {isLeader && (
                <button
                  onClick={() => handleInvite(u._id)}
                  disabled={invitedUserIds.has(u._id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider disabled:opacity-60 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] ${
                    invitedUserIds.has(u._id)
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 hover:text-[#f4e8c1] hover:border-[#f4e8c1]'
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
                  className={`w-full px-6 py-3 font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(212,175,55,0.15)] ${
                    invitedUserIds.has(selectedUser._id)
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 hover:text-[#f4e8c1] hover:border-[#f4e8c1] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]'
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