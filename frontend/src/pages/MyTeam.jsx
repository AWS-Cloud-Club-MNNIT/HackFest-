import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import BrowseTeammates from "../components/BrowseTeammates";
import { Users, UserMinus, QrCode, MailPlus, CheckCircle2, XCircle } from "lucide-react";

export default function MyTeam() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [event, setEvent] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [invitingId, setInvitingId] = useState(null);

  // Domain modal state
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [changingDomain, setChangingDomain] = useState(false);

  const fetchTeamData = async (userData) => {
    try {
      if (!userData.teamId) {
        setLoading(false);
        return;
      }

      const teamRes = await API.get(`/teams/${userData.teamId}`);
      setTeam(teamRes.data);

      const eventRes = await API.get("/events/active");
      setEvent(eventRes.data);

      if (teamRes.data.leaderId._id === userData._id) {
        const reqRes = await API.get(`/join-requests/team/${userData.teamId}`);
        setJoinRequests(reqRes.data);
      }
    } catch (error) {
      toast.error("Failed to load team data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await API.get("/auth/me");
        setUser(authRes.data.user);
        await fetchTeamData(authRes.data.user);
      } catch (error) {
        navigate("/login");
      }
    };
    init();
  }, [navigate]);

  const actualLeaderId = team?.leaderId?._id || team?.leaderId;
  const isLeader = user && team && user._id === actualLeaderId;
  const isComplete = team?.status === "complete";
  const deadlinePassed = event && new Date() > new Date(event.registrationDeadline);
  const canEdit = isLeader && !deadlinePassed && !team?.lockedBySuperAdmin;

  const handleSearchParticipants = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 2) {
      toast.error("Please enter at least 2 characters to search");
      return;
    }
    setSearching(true);
    try {
      const res = await API.get(`/users/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.users);
    } catch (error) {
      toast.error("Failed to search participants");
    } finally {
      setSearching(false);
    }
  };

  const handleSendInvite = async (userId) => {
    setInvitingId(userId);
    try {
      await API.post("/invites", { teamId: team._id, toUserId: userId });
      toast.success("Invite sent successfully!");
      // Optionally remove them from search results or mark as invited
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invite");
    } finally {
      setInvitingId(null);
    }
  };

  const handleChangeDomain = async (e) => {
    e.preventDefault();
    if (!newDomain) return;
    setChangingDomain(true);
    try {
      await API.patch(`/teams/${team._id}/domain`, { domain: newDomain });
      toast.success("Domain changed successfully!");
      setShowDomainModal(false);
      fetchTeamData(user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change domain");
    } finally {
      setChangingDomain(false);
    }
  };

  const handleToggleLookingForTeammates = async () => {
    try {
      await API.patch(`/teams/${team._id}/looking-for-teammates`, {
        lookingForTeammates: !team.lookingForTeammates
      });
      toast.success(`Team is now ${!team.lookingForTeammates ? 'looking for teammates' : 'hidden from discovery'}`);
      fetchTeamData(user);
    } catch (error) {
      toast.error("Failed to update team visibility");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await API.delete(`/teams/${team._id}/members/${memberId}`);
      toast.success("Member removed");
      fetchTeamData(user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await API.post(`/teams/${team._id}/leave`);
      toast.success("You have left the team");
      
      const authRes = await API.get("/auth/me");
      setUser(authRes.data.user);
      setTeam(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave team");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await API.patch(`/join-requests/${requestId}/accept`);
      toast.success("Member added to team!");
      fetchTeamData(user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await API.patch(`/join-requests/${requestId}/reject`);
      toast.success("Request rejected");
      fetchTeamData(user);
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b16] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // No Team Empty State
  if (!team) {
    return (
      <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">
        <DashboardNavbar user={user} />
        <main className="max-w-4xl mx-auto px-6 py-24 text-center flex flex-col items-center">
          <Users className="w-24 h-24 text-[#d4af37]/40 mb-6" />
          <h2 className="text-3xl font-bold font-display text-[#d4af37] mb-4">You have no team yet</h2>
          <p className="text-gray-400 max-w-lg mb-8">
            You are currently flying solo. Create your own guild or wait for an invitation from a team leader.
          </p>
          <Link 
            to="/team/create" 
            className="px-8 py-3 bg-[#d4af37] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition-all"
          >
            Create a Team
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">
      <DashboardNavbar user={user} />
      
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101522] border border-[#d4af37]/40 w-full max-w-lg p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#d4af37]">Direct Invite</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">Search for participants by their name or email to invite them directly.</p>
            
            <form onSubmit={handleSearchParticipants} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#05070f] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-white focus:border-[#d4af37] outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {searchResults.length === 0 && !searching && searchQuery && (
                <p className="text-center text-gray-500 py-4">No available participants found matching your query.</p>
              )}
              
              {searchResults.map(participant => (
                <div key={participant._id} className="flex justify-between items-center p-4 bg-[#05070f] border border-[#d4af37]/20 rounded-xl">
                  <div>
                    <h4 className="font-bold text-white">{participant.name}</h4>
                    <p className="text-xs text-gray-400">{participant.email}</p>
                    <div className="text-[10px] uppercase tracking-wider text-[#d4af37] mt-1">
                      {participant.college} • {participant.branch}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendInvite(participant._id)}
                    disabled={invitingId === participant._id || participant.teamId}
                    className="px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#d4af37]/20 transition disabled:opacity-50 text-sm font-bold"
                  >
                    {invitingId === participant._id ? "Inviting..." : "Invite"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Domain Change Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="parchment-card w-full max-w-md p-6 rounded-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-4 font-display">Change Domain</h3>
            <p className="text-sm text-gray-400 mb-6">Select a new domain for {team.name}.</p>
            
            <form onSubmit={handleChangeDomain}>
              <div className="space-y-3 mb-6">
                {event?.domains?.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setNewDomain(d)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                      newDomain === d
                        ? "bg-[#d4af37]/20 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        : "bg-[#10182b] border-[#d4af37]/20 hover:border-[#d4af37]/60"
                    }`}
                  >
                    <span className={`block font-bold ${newDomain === d ? "text-[#d4af37]" : "text-[#e8d7b5]"}`}>
                      {d}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingDomain || !newDomain || newDomain === team.domain}
                  className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition disabled:opacity-50"
                >
                  {changingDomain ? "Saving..." : "Save Domain"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold font-display text-[#d4af37]">{team.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border uppercase ${
                isComplete 
                  ? "bg-green-900/40 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]" 
                  : "bg-blue-900/40 text-blue-400 border-blue-500/50"
              }`}>
                {team.status}
              </span>
            </div>
            <p className="text-gray-400">
              Domain: <span className="text-[#e8d7b5] font-semibold">{team.domain}</span> • 
              Members: <span className="text-[#e8d7b5] font-semibold">{team.members.length} / {event?.teamSizeMax || 4}</span>
            </p>
          </div>

          {isComplete && (
            <Link 
              to="/team/qr-pass"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e5c158] px-6 py-3 font-bold text-[#05070f] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.7)]"
            >
              <QrCode className="w-5 h-5" />
              <span>View QR Pass</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Members List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-[#d4af37] font-display border-b border-[#d4af37]/20 pb-2">Roster</h3>
            
            {team.members.map((member) => (
              <div key={member._id} className="parchment-card p-5 rounded-xl flex justify-between items-center transition-all hover:border-[#d4af37]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#10182b] border border-[#d4af37]/40 flex items-center justify-center font-bold text-[#d4af37]">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#e8d7b5] flex items-center gap-2">
                      {member.name}
                      {member._id === actualLeaderId && (
                        <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded-sm tracking-widest uppercase">Leader</span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">{member.college || "No college"} • {member.branch || "No branch"}</p>
                  </div>
                </div>
                
                {canEdit && member._id !== user._id && (
                  <button 
                    onClick={() => handleRemoveMember(member._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                    title="Remove from team"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Controls Sidebar */}
          <div className="space-y-6">
            
            {/* Action Panel */}
            <div className="bg-[#101522] border border-[#d4af37]/20 rounded-xl p-6">
              <h3 className="font-bold text-[#d4af37] mb-4">Command Center</h3>
              
              <div className="space-y-3">
                {canEdit && (
                  <button 
                    onClick={() => {
                      setNewDomain(team.domain);
                      setShowDomainModal(true);
                    }}
                    className="w-full text-[#e8d7b5] border border-gray-600 bg-gray-800/50 py-2.5 rounded-lg hover:bg-gray-800 transition"
                  >
                    Change Domain
                  </button>
                )}

                {canEdit && (
                  <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                    <span className="text-sm text-gray-300">Looking for Teammates</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={team.lookingForTeammates || false}
                        onChange={handleToggleLookingForTeammates}
                        disabled={isComplete}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                    </label>
                  </div>
                )}
                {canEdit && !isComplete && (
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] py-2.5 rounded-lg hover:bg-[#d4af37]/20 transition"
                  >
                    <MailPlus className="w-4 h-4" />
                    <span>Invite Teammate</span>
                  </button>
                )}
                
                {!isLeader && (
                  <button 
                    onClick={handleLeaveTeam}
                    disabled={deadlinePassed || team.lockedBySuperAdmin}
                    className="w-full text-red-400 border border-red-900/50 bg-red-900/10 py-2.5 rounded-lg hover:bg-red-900/30 transition disabled:opacity-50"
                  >
                    Leave Team
                  </button>
                )}
                
                {deadlinePassed && (
                  <p className="text-xs text-red-400/80 text-center mt-4 border border-red-900/30 bg-red-900/10 p-2 rounded">
                    Deadline passed. Team is locked.
                  </p>
                )}
              </div>
            </div>

            {/* Incoming Requests (Leader Only) */}
            {isLeader && (
              <div className="bg-[#101522] border border-[#d4af37]/20 rounded-xl p-6">
                <h3 className="font-bold text-[#d4af37] mb-4">Join Requests</h3>
                
                {joinRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center py-4">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {joinRequests.map(req => (
                      <div key={req._id} className="p-3 border border-[#d4af37]/20 rounded-lg bg-[#05070f]">
                        <p className="text-sm font-semibold text-[#e8d7b5]">{req.fromUserId.name}</p>
                        <p className="text-[10px] text-gray-500 mb-3">{req.fromUserId.skills?.join(', ') || 'No skills listed'}</p>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptRequest(req._id)}
                            disabled={!canEdit || isComplete}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-900/30 text-green-400 py-1.5 rounded text-xs border border-green-900 hover:bg-green-900/50 transition disabled:opacity-30"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Accept
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(req._id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-900/30 text-red-400 py-1.5 rounded text-xs border border-red-900 hover:bg-red-900/50 transition"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Browse Participants Section (Leader Only) */}
        {isLeader && !isComplete && (
          <div className="mt-12 border-t border-[#d4af37]/20 pt-8">
            <BrowseTeammates />
          </div>
        )}
      </main>
    </div>
  );
}
