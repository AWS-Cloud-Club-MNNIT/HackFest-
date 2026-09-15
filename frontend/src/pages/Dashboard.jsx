import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { motion } from "framer-motion";
import { User, CheckCircle2, AlertCircle, Eye, Users, ChevronRight, PlusCircle, Search } from "lucide-react";
import DetailModal from "../components/common/DetailModal";
import TeamDetail from "../components/TeamDetail";
import { HOUSES_DATA } from "../components/HouseDomains";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [invites, setInvites] = useState([]);
  const [processingInvite, setProcessingInvite] = useState(null);
  
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [hoveredHouse, setHoveredHouse] = useState(null);

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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="font-display font-bold text-[#d4af37] text-xs sm:text-sm tracking-[0.3em] uppercase">
            PARTICIPANT DASHBOARD
          </p>
          <h2 className="font-harry text-5xl md:text-6xl font-bold mt-2 text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Welcome, {user.name}
          </h2>
        </motion.div>

        {/* The Four Houses / Domains */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-display tracking-wider text-[#e8d7b5]">Explore Domains</h3>
            <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-widest px-3 py-1 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30">Select a path</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HOUSES_DATA.map((house, idx) => {
              const isHovered = hoveredHouse === house.id;
              const isAnyHovered = hoveredHouse !== null;
              return (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredHouse(house.id)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  onClick={() => navigate(`/team/find?domain=${house.id}`)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border ${house.borderColor} ${house.hoverBorder} bg-gradient-to-b ${house.bgGradient} p-5 backdrop-blur-xl transition-all duration-300`}
                  style={{
                    boxShadow: isHovered
                      ? `0 10px 30px ${house.glowColor}, inset 0 0 15px ${house.glowColor}`
                      : '0 6px 20px rgba(0,0,0,0.4)',
                    transform: isHovered ? 'scale(1.02)' : isAnyHovered && !isHovered ? 'scale(0.98)' : 'scale(1)',
                    opacity: isAnyHovered && !isHovered ? 0.6 : 1,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                  
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="h-14 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                       <img
                          src={house.logoImg}
                          alt={`${house.name} Logo`}
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.triedAlt) {
                              e.currentTarget.dataset.triedAlt = 'true'
                              e.currentTarget.src = `/images/houses/${house.id}.png`
                            } else {
                              e.currentTarget.style.display = 'none'
                            }
                          }}
                        />
                    </div>
                    <h4 className="font-harry text-3xl font-bold tracking-wider text-[#f4e8c1] mb-2">{house.name}</h4>
                    <span className={`text-[9px] font-bold tracking-widest uppercase border ${house.badgeBg} px-2.5 py-0.5 rounded-full mb-3 shadow-sm`}>
                      {house.domainCode}
                    </span>
                    <p className={`text-xs font-medium font-display ${house.textColor} tracking-wide group-hover:text-white transition-colors`}>
                      {house.domainTitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

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
                    ? "You are currently visible to team leaders."
                    : "Turn this on if you want to be discovered."}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Actions / Team Details */}
          <div className="lg:col-span-2 space-y-6">
            {!user.teamId ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="h-full flex flex-col"
              >
                <div className="bg-[#101522]/40 border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-[#d4af37]" />
                    <h3 className="text-2xl font-semibold text-white">Team Formation</h3>
                  </div>
                  
                  {/* Incoming Invites Section */}
                  {invites.length > 0 && (
                    <div className="mb-8 p-5 bg-[#d4af37]/5 border border-[#d4af37]/30 rounded-2xl">
                      <h4 className="text-[#d4af37] font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                        Pending Invites ({invites.length})
                      </h4>
                      <div className="space-y-3">
                        {invites.map((invite) => (
                          <div key={invite._id} className="bg-[#101522] border border-[#d4af37]/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h5 className="font-bold text-white text-lg">{invite.teamId.name}</h5>
                              <p className="text-xs text-gray-400 mt-1">
                                Domain: <span className="text-[#d4af37]">{invite.teamId.domain || "N/A"}</span> • 
                                Invited by: <span className="text-[#d4af37]">{invite.fromUserId.name}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedTeam(invite)}
                              className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 rounded-lg text-sm font-bold transition flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Create Team Card */}
                    <div 
                      onClick={() => navigate("/team/create")}
                      className="group cursor-pointer bg-[#101522]/80 border border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col"
                    >
                      <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d4af37] group-hover:text-black transition-colors text-[#d4af37]">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">Create Team</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-1">
                        Form a new team, become the Leader, and invite members to join your quest.
                      </p>
                      <div className="flex items-center text-[#d4af37] text-sm font-bold uppercase tracking-wider">
                        Get Started <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Find Team Card */}
                    <div 
                      onClick={() => navigate("/team/find")}
                      className="group cursor-pointer bg-[#101522]/80 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-500">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Find a Team</h3>
                      <p className="text-gray-400 text-sm mb-6 flex-1">
                        Looking for a squad? Browse available teams actively recruiting members.
                      </p>
                      <div className="flex items-center text-blue-500 text-sm font-bold uppercase tracking-wider">
                        Browse Teams <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full"
              >
                <div className="bg-gradient-to-br from-[#10182b] to-[#080b16] border border-[#d4af37]/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Users className="w-48 h-48 text-[#d4af37]" />
                  </div>
                  
                  <span className="inline-block px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 self-start">
                    Team Status Active
                  </span>
                  
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 relative z-10">
                    You're part of a team
                  </h3>
                  
                  <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md relative z-10">
                    Your team dashboard is ready. Collaborate with your members, manage invitations, and prepare for the hackathon journey.
                  </p>
                  
                  <button
                    onClick={() => navigate("/team/my-team")}
                    className="self-start px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e6c65c] to-[#d4af37] text-black font-bold text-sm sm:text-base hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    Go to My Team <ChevronRight className="w-5 h-5" />
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