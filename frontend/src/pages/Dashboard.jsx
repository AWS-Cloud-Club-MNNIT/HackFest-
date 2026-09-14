import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { motion } from "framer-motion";
import { User, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import DetailModal from "../components/common/DetailModal";
import TeamDetail from "../components/TeamDetail";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [invites, setInvites] = useState([]);
  const [processingInvite, setProcessingInvite] = useState(null);
  
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const getUserAndEvent = async () => {
      try {
        const response = await API.get("/auth/me");
        const fetchedUser = response.data.user;
        setUser(fetchedUser);

        if (fetchedUser?.role === "super_admin") {
          navigate("/super_admin");
          return;
        }

        const eventRes = await API.get("/events/active");
        setActiveEvent(eventRes.data);

        if (!fetchedUser.teamId) {
          const invitesRes = await API.get("/invites/received");
          setInvites(invitesRes.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    getUserAndEvent();
  }, [navigate]);

  const handleToggleAvailability = async (e) => {
    const isChecked = e.target.checked;
    setUpdatingAvailability(true);
    try {
      const res = await API.patch("/users/availability", { lookingForTeam: isChecked });
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    setProcessingInvite(inviteId);
    try {
      const res = await API.patch(`/invites/${inviteId}/accept`);
      toast.success("Successfully joined the team!");
      // Refresh user to get new teamId
      const userRes = await API.get("/auth/me");
      setUser(userRes.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept invite");
    } finally {
      setProcessingInvite(null);
      setSelectedTeam(null);
    }
  };

  const handleRejectInvite = async (inviteId) => {
    setProcessingInvite(inviteId);
    try {
      await API.patch(`/invites/${inviteId}/reject`);
      toast.success("Invite rejected");
      setInvites(prev => prev.filter(inv => inv._id !== inviteId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject invite");
    } finally {
      setProcessingInvite(null);
      setSelectedTeam(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#05070f] text-[#d4af37] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="tracking-widest uppercase text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <DashboardNavbar user={user} />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="text-[#d4af37] text-sm tracking-[0.3em] uppercase">
            Participant Dashboard
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Welcome, {user.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Registration Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#101522]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#d4af37]" />
                Registration Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">Account Verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">Profile Completed</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {user.teamId ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={user.teamId ? "text-gray-300" : "text-yellow-500 font-semibold"}>
                    {user.teamId ? "Team Assigned" : "No Team Assigned"}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-200 truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Institution</p>
                  <p className="font-medium text-gray-200 truncate">{user.college || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Availability Toggle (Only if not in a team) */}
            {!user.teamId && (
              <div className="bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl p-6 backdrop-blur-xl transition-all hover:border-[#d4af37]/60">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#d4af37]">Team Availability</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.lookingForTeam}
                      onChange={handleToggleAvailability}
                      disabled={updatingAvailability}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-400">
                  {user.lookingForTeam 
                    ? "You are currently visible to team leaders looking for members."
                    : "You are hidden from team leaders. Turn this on if you want to be discovered."}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-2 space-y-6">
            {!user.teamId ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-[#101522]/40 border border-white/5 rounded-3xl p-8 mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Your Next Step</h3>
                  <p className="text-gray-400 mb-8">You are not in a team yet. Choose how you want to participate in the event.</p>
                  
                  {/* Incoming Invites Section */}
                  {invites.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-[#d4af37] font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Pending Team Invites ({invites.length})
                      </h4>
                      <div className="space-y-3">
                        {invites.map((invite) => (
                          <div key={invite._id} className="bg-[#101522] border border-[#d4af37]/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h5 className="font-bold text-white text-lg flex items-center gap-2">
                                {invite.teamId.name}
                                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider">
                                  Invite
                                </span>
                              </h5>
                              <p className="text-xs text-gray-400 mt-1">
                                Domain: <span className="text-[#d4af37]">{invite.teamId.domain || "N/A"}</span> • 
                                Invited by: <span className="text-[#d4af37]">{invite.fromUserId.name}</span>
                              </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => setSelectedTeam(invite)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 rounded-lg text-sm font-bold transition"
                              >
                                <Eye className="w-4 h-4" /> View Team
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option A */}
                    <div className="bg-[#101522]/80 border border-[#d4af37]/40 rounded-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300 relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
                      </div>
                      <span className="px-2 py-1 text-[10px] tracking-[0.2em] font-bold text-black uppercase bg-[#d4af37] rounded-sm mb-4 inline-block">Option A</span>
                      <h3 className="text-2xl font-bold text-[#d4af37] mb-3">Create Team</h3>
                      <p className="text-gray-400 text-sm mb-6 min-h-[60px]">
                        Form a new team, become the Team Leader, and invite eligible participants to join you.
                      </p>
                      <button
                        onClick={() => navigate("/team/create")}
                        className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all font-semibold"
                      >
                        Create a New Team
                      </button>
                    </div>

                    {/* Option B */}
                    <div className="bg-[#101522]/80 border border-blue-500/40 rounded-2xl p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                      </div>
                      <span className="px-2 py-1 text-[10px] tracking-[0.2em] font-bold text-black uppercase bg-blue-500 rounded-sm mb-4 inline-block">Option B</span>
                      <h3 className="text-2xl font-bold text-blue-500 mb-3">Find a Team</h3>
                      <p className="text-gray-400 text-sm mb-6 min-h-[60px]">
                        Looking for a squad? Browse available teams that are actively recruiting and send a request.
                      </p>
                      <button
                        onClick={() => navigate("/team/find")}
                        className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all font-semibold"
                      >
                        Browse Available Teams
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-[#101522] border border-[#d4af37]/40 rounded-3xl p-8 text-center shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden">
                   <div className="w-20 h-20 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">You are part of a team</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">Access your team dashboard to view members, manage invites, and prepare for the event.</p>
                  <button
                    onClick={() => navigate("/team/my-team")}
                    className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#e6c65c] to-[#d4af37] text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                  >
                    Go to My Team
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </div>

      </main>

      {/* Invite Detail Modal */}
      <DetailModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title="Team Invitation Details"
      >
        {selectedTeam && (
          <TeamDetail 
            team={selectedTeam.teamId}
            actions={
              <>
                <button
                  onClick={() => handleRejectInvite(selectedTeam._id)}
                  disabled={processingInvite === selectedTeam._id}
                  className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold rounded-lg transition disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAcceptInvite(selectedTeam._id)}
                  disabled={processingInvite === selectedTeam._id}
                  className="px-6 py-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 font-bold rounded-lg transition disabled:opacity-50"
                >
                  Accept Invite
                </button>
              </>
            }
          />
        )}
      </DetailModal>

    </div>
  );
};

export default Dashboard;