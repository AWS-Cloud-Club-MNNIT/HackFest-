import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
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
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviting, setInviting] = useState(false);

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

  const isLeader = user && team && user._id === team.leaderId._id;
  const isComplete = team?.status === "complete";
  const deadlinePassed = event && new Date() > new Date(event.registrationDeadline);
  const canEdit = isLeader && !deadlinePassed && !team?.lockedBySuperAdmin;

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteUserId.trim()) return;
    setInviting(true);
    try {
      await API.post("/invites", { teamId: team._id, toUserId: inviteUserId });
      toast.success("Invite sent successfully!");
      setShowInviteModal(false);
      setInviteUserId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invite");
    } finally {
      setInviting(false);
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
          <div className="parchment-card w-full max-w-md p-6 rounded-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-[#d4af37] mb-4 font-display">Summon Teammate</h3>
            <p className="text-sm text-gray-400 mb-6">Enter the User ID of the participant you wish to invite to {team.name}.</p>
            
            <form onSubmit={handleSendInvite}>
              <input
                type="text"
                placeholder="User ID..."
                required
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                className="w-full bg-[#05070f] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#e8d7b5] mb-6 focus:border-[#d4af37] outline-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition disabled:opacity-50"
                >
                  {inviting ? "Sending..." : "Send Invite"}
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
                      {member._id === team.leaderId._id && (
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

      </main>
    </div>
  );
}
