import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import BrowseTeammates from "../components/BrowseTeammates";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserMinus, QrCode, MailPlus, CheckCircle2, 
  XCircle, Eye, Settings, LogOut, Phone, Mail,
  ShieldAlert, MoreVertical, Globe, UserCheck
} from "lucide-react";
import DetailModal from "../components/common/DetailModal";
import ParticipantDetail from "../components/ParticipantDetail";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";

export default function MyTeam() {
  const navigate = useNavigate();
  const { user, fetchUser, updateUserField } = useAuthStore();
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications);
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
  
  const [selectedUser, setSelectedUser] = useState(null);

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

      const actualLeaderId = teamRes.data.leaderId?._id || teamRes.data.leaderId;
      if (actualLeaderId === userData._id) {
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
        let fetchedUser = user;
        if (!fetchedUser) {
          fetchedUser = await fetchUser();
        }
        await fetchTeamData(fetchedUser);
      } catch (error) {
        if (error.response?.status === 401 || error.status === 401) {
          navigate("/login");
        }
      }
    };
    init();
  }, [navigate, fetchUser]);

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
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invite");
    } finally {
      setInvitingId(null);
      setSelectedUser(null);
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
    const previousState = team.lookingForTeammates;
    
    // Optimistic Update
    setTeam(prev => ({ ...prev, lookingForTeammates: !previousState }));
    
    try {
      await API.patch(`/teams/${team._id}/looking-for-teammates`, {
        lookingForTeammates: !previousState
      });
      toast.success(`Team is now ${!previousState ? 'looking for teammates' : 'hidden from discovery'}`);
    } catch (error) {
      setTeam(prev => ({ ...prev, lookingForTeammates: previousState }));
      toast.error("Failed to update team visibility");
    }
  };

  const handleToggleStatus = async () => {
    const isComplete = team.status === 'complete';
    const previousStatus = team.status;
    const previousLooking = team.lookingForTeammates;

    // Optimistic Update
    setTeam(prev => ({
      ...prev,
      status: isComplete ? 'forming' : 'complete',
      lookingForTeammates: isComplete ? prev.lookingForTeammates : false
    }));

    try {
      await API.patch(`/teams/${team._id}/toggle-status`);
      toast.success(isComplete ? "Team marked as Forming" : "Team marked as Complete!");
    } catch (error) {
      setTeam(prev => ({
        ...prev,
        status: previousStatus,
        lookingForTeammates: previousLooking
      }));
      toast.error(error.response?.data?.message || "Failed to update team status");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    
    // Optimistic remove
    const memberToRemove = team.members.find(m => m._id === memberId);
    setTeam(prev => ({ ...prev, members: prev.members.filter(m => m._id !== memberId) }));
    
    try {
      await API.delete(`/teams/${team._id}/members/${memberId}`);
      toast.success("Member removed");
    } catch (error) {
      if (memberToRemove) {
        setTeam(prev => ({ ...prev, members: [...prev.members, memberToRemove] }));
      }
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await API.post(`/teams/${team._id}/leave`);
      toast.success("You have left the team");
      
      setTeam(null);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave team");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    // Optimistic UI update: Hide request immediately
    const reqToAccept = joinRequests.find(r => r._id === requestId);
    setJoinRequests(prev => prev.filter(r => r._id !== requestId));
    
    try {
      await API.patch(`/join-requests/${requestId}/accept`);
      toast.success("Member added to team!");
      fetchTeamData(user); // Get updated members roster
      fetchNotifications();
    } catch (error) {
      if (reqToAccept) {
        setJoinRequests(prev => [...prev, reqToAccept]);
      }
      toast.error(error.response?.data?.message || "Failed to accept request");
    } finally {
      setSelectedUser(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Optimistic UI update: Hide request immediately
    const reqToReject = joinRequests.find(r => r._id === requestId);
    setJoinRequests(prev => prev.filter(r => r._id !== requestId));
    
    try {
      await API.patch(`/join-requests/${requestId}/reject`);
      toast.success("Request rejected");
      fetchNotifications();
    } catch (error) {
      if (reqToReject) {
        setJoinRequests(prev => [...prev, reqToReject]);
      }
      toast.error("Failed to reject request");
    } finally {
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] flex flex-col relative overflow-hidden">
        <div className="cinematic-bg-overlay z-0" />
        <DashboardNavbar user={user} />
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 animate-pulse relative z-10">
          <div className="h-40 bg-[#d4af37]/5 rounded-3xl mb-8 border border-[#d4af37]/10"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-1/3 bg-[#d4af37]/10 rounded mb-4"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/10"></div>
              ))}
            </div>
            <div className="space-y-6">
               <div className="h-64 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/10"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No Team Empty State
  if (!team) {
    return (
      <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] flex flex-col relative overflow-hidden">
        <div className="cinematic-bg-overlay z-0" />
        <div className="absolute inset-0 bg-hogwarts-grid opacity-20 pointer-events-none z-0" />
        <DashboardNavbar user={user} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full relative z-10 animate-magic-reveal">
           {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Users className="w-24 h-24 text-[#d4af37] mx-auto mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
            <h2 className="text-5xl md:text-6xl font-bold font-harry text-[#f4e8c1] mb-6 drop-shadow-[0_4px_10px_rgba(212,175,55,0.2)] tracking-wide">
              Assemble Your Guild
            </h2>
            <p className="text-lg text-[#e8d7b5]/70 max-w-lg mb-10 leading-relaxed font-serif">
              You are currently adventuring solo. Create a new team to begin your journey, or join forces with an existing squad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/team/create" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 font-bold rounded-xl hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-1"
              >
                Create a Team
              </Link>
              <Link 
                to="/team/find" 
                className="w-full sm:w-auto px-8 py-4 bg-[#080b16]/60 border border-[#d4af37]/30 text-[#d4af37] font-bold rounded-xl hover:bg-[#d4af37]/10 transition-all hover:-translate-y-1"
              >
                Find a Team
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] flex flex-col relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5c3b80]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <DashboardNavbar user={user} />
      
      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#080b16] border border-[#d4af37]/40 w-full max-w-lg p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-[#e8d7b5] flex items-center gap-2">
                  <MailPlus className="w-6 h-6 text-[#d4af37]" /> Send Invite
                </h3>
                <button onClick={() => setShowInviteModal(false)} className="text-gray-500 hover:text-[#d4af37] transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-[#e8d7b5]/60 mb-6 font-serif">Search for participants by their name or email.</p>
              
              <form onSubmit={handleSearchParticipants} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-[#10182b] border border-[#d4af37]/20 rounded-xl px-4 py-3 text-[#e8d7b5] focus:border-[#d4af37] magic-input-focus outline-none transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c158] transition-colors disabled:opacity-50"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </form>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {searchResults.length === 0 && !searching && searchQuery && (
                  <p className="text-center text-gray-500 py-8">No available participants found.</p>
                )}
                
                {searchResults.map(participant => (
                  <div key={participant._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#10182b]/80 border border-[#d4af37]/10 rounded-xl gap-3 hover:border-[#d4af37]/30 transition-colors parchment-card">
                    <div>
                      <h4 className="font-bold text-[#e8d7b5]">{participant.name}</h4>
                      <p className="text-xs text-[#e8d7b5]/60 font-serif">{participant.email}</p>
                      <div className="text-[10px] uppercase tracking-wider text-[#d4af37] mt-1 font-bold">
                        {participant.college || 'No college'}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => {
                          setSelectedUser({ user: participant, action: 'invite' });
                          setShowInviteModal(false);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-xs font-bold"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => handleSendInvite(participant._id)}
                        disabled={invitingId === participant._id || participant.teamId}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#d4af37]/20 transition-colors disabled:opacity-50 text-xs font-bold"
                      >
                        {invitingId === participant._id ? "Inviting..." : "Invite"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Domain Change Modal */}
      <AnimatePresence>
        {showDomainModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#080b16] border border-[#d4af37]/40 w-full max-w-md p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
              <h3 className="text-2xl font-bold text-[#e8d7b5] mb-2 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#d4af37]" /> Change Domain
              </h3>
              <p className="text-sm text-[#e8d7b5]/60 mb-6 font-serif">Select a new domain for {team.name}.</p>
              
              <form onSubmit={handleChangeDomain}>
                <div className="space-y-3 mb-6">
                  {event?.domains?.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewDomain(d)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                        newDomain === d
                          ? "bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          : "bg-[#10182b] border-[#d4af37]/20 hover:border-[#d4af37]/40"
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
                    className="px-5 py-2.5 border border-[#d4af37]/20 rounded-xl text-[#e8d7b5]/60 hover:bg-[#d4af37]/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingDomain || !newDomain || newDomain === team.domain}
                    className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c158] transition-colors disabled:opacity-50"
                  >
                    {changingDomain ? "Saving..." : "Save Domain"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 relative z-10 space-y-8 animate-magic-reveal">
        
        {/* COMMAND CENTER HERO */}
        <div className="bg-[#10182b]/80 border border-[#d4af37]/30 rounded-3xl p-8 lg:p-12 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden group parchment-card">
           {/* Hero background FX */}
           <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#d4af37]/10 to-transparent pointer-events-none" />
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#d4af37]/20 blur-[100px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-150" />

           <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
              <div className="space-y-4 max-w-2xl">
                 <div className="flex items-center gap-3">
                   <span className="font-display px-3 py-1 text-[10px] tracking-widest font-bold text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30">
                     Command Center
                   </span>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border uppercase flex items-center gap-1 ${
                      isComplete 
                        ? "bg-green-900/20 text-green-400 border-green-500/30" 
                        : "bg-blue-900/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {team.status}
                    </span>
                 </div>
                 
                 <h1 className="font-harry text-5xl md:text-7xl font-bold text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                   {team.name}
                 </h1>
                 
                 <div className="flex flex-wrap gap-6 text-sm text-[#e8d7b5]/80 font-serif">
                   <div className="flex items-center gap-2">
                     <Globe className="w-4 h-4 text-[#d4af37]" />
                     <span>Domain: <strong className="text-[#d4af37] font-sans">{team.domain}</strong></span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-[#d4af37]" />
                     <span>Roster: <strong className="text-[#d4af37] font-sans">{team.members.length} / {event?.teamSizeMax || 4}</strong></span>
                   </div>
                   <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#d4af37]" />
                      <span>Role: <strong className="text-[#d4af37] font-sans">{isLeader ? "Team Leader" : "Member"}</strong></span>
                   </div>
                 </div>
              </div>

              {/* Top Level Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                 {isComplete && (
                    <Link 
                      to="/team/qr-pass"
                      className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c65c] px-6 py-3.5 font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] w-full sm:w-auto"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>View QR Pass</span>
                    </Link>
                  )}
                  {canEdit && !isComplete && (
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 px-6 py-3.5 font-bold shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all hover:text-[#f4e8c1] hover:border-[#f4e8c1] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] w-full sm:w-auto hover:scale-[1.02]"
                    >
                      <MailPlus className="w-5 h-5" />
                      <span>Invite Member</span>
                    </button>
                  )}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MEMBERS ROSTER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
               <h3 className="text-xl font-bold text-[#e8d7b5] flex items-center gap-2">
                 <Users className="w-5 h-5 text-[#d4af37]" /> Team Roster
               </h3>
               <span className="text-sm text-[#e8d7b5]/60">{team.members.length} members</span>
            </div>
            
            <div className="space-y-4">
              {team.members.map((member, index) => {
                 const isMemberLeader = member._id === actualLeaderId;
                 return (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.1 }}
                     key={member._id} 
                     className="bg-[#101522]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 sm:p-6 transition-all hover:border-[#d4af37]/30 hover:bg-[#101522] group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg"
                   >
                     {/* Identity Section */}
                     <div 
                        className="flex items-center gap-4 flex-1 cursor-pointer" 
                        onClick={() => setSelectedUser({ user: member, action: 'view' })}
                     >
                     <div className="relative">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${isMemberLeader ? 'bg-gradient-to-br from-[#d4af37] to-[#8a7224] text-[#080b16] shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[#080b16] border border-[#d4af37]/30 text-[#e8d7b5]'}`}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          {isMemberLeader && (
                             <div className="absolute -bottom-1 -right-1 bg-[#101522] rounded-full p-0.5">
                                <Settings className="w-4 h-4 text-[#d4af37]" />
                             </div>
                          )}
                       </div>
                       
                       <div>
                         <h4 className="font-bold text-lg text-[#e8d7b5] flex items-center gap-2">
                           {member.name}
                           {isMemberLeader && (
                             <span className="text-[9px] bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                               Leader
                             </span>
                           )}
                         </h4>
                         <p className="text-sm text-[#e8d7b5]/60 mt-0.5 font-serif">
                           {member.college || "No college"} {member.branch && `• ${member.branch}`}
                         </p>
                       </div>
                     </div>
                     
                     {/* Actions / Contact Section */}
                     <div className="flex items-center gap-3 w-full sm:w-auto border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                       
                       {/* Contact Info (Only populated if backend allows it) */}
                       {member.email ? (
                          <div className="flex gap-2">
                             <a 
                               href={`mailto:${member.email}`} 
                               onClick={e => e.stopPropagation()}
                               className="p-2.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/20 text-[#e8d7b5]/60 hover:bg-[#d4af37]/20 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all duration-300"
                               title="Send Email"
                             >
                                <Mail className="w-4 h-4" />
                             </a>
                             {member.phone && (
                               <a 
                                 href={`tel:${member.phone}`} 
                                 onClick={e => e.stopPropagation()}
                                 className="p-2.5 rounded-xl bg-[#080b16]/60 border border-[#d4af37]/20 text-[#e8d7b5]/60 hover:bg-[#d4af37]/20 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all duration-300"
                                 title="Call Phone"
                               >
                                  <Phone className="w-4 h-4" />
                               </a>
                             )}
                          </div>
                       ) : (
                          <div className="px-3 py-1.5 rounded bg-[#080b16]/60 border border-[#d4af37]/20 text-[10px] uppercase text-[#e8d7b5]/50 font-bold tracking-widest">
                             Contact Hidden
                          </div>
                       )}

                       {/* Management Controls */}
                       {canEdit && member._id !== user._id && (
                         <div className="relative group/menu ml-auto sm:ml-2">
                           <button className="p-2 text-gray-400 hover:text-white transition-colors">
                             <MoreVertical className="w-5 h-5" />
                           </button>
                           {/* Context Menu Dropdown */}
                           <div className="absolute right-0 top-full mt-2 w-48 bg-[#05070f] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden translate-y-2 group-hover/menu:translate-y-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveMember(member._id); }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                              >
                                <UserMinus className="w-4 h-4" /> Remove Member
                              </button>
                           </div>
                         </div>
                       )}
                     </div>
                   </motion.div>
                 );
              })}
            </div>
          </div>

          {/* SIDEBAR: TEAM ACTIVITY & SETTINGS */}
          <div className="space-y-6">
            
            {/* Team Settings Panel (Leader only) */}
            {(isLeader || !isLeader) && (
               <div className="bg-[#10182b]/80 backdrop-blur-sm border border-[#d4af37]/20 rounded-3xl p-6 parchment-card shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                  <h3 className="font-bold text-[#e8d7b5] mb-5 flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
                     <Settings className="w-5 h-5 text-[#d4af37]" /> Options
                  </h3>
                  
                  <div className="space-y-4">
                    {canEdit && (
                      <button 
                        onClick={() => {
                          setNewDomain(team.domain);
                          setShowDomainModal(true);
                        }}
                        className="w-full flex items-center justify-between text-[#e8d7b5] bg-[#080b16]/60 border border-[#d4af37]/20 py-3.5 px-4 rounded-xl hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-300"
                      >
                        <span className="font-medium text-sm font-serif">Change Domain</span>
                        <Globe className="w-4 h-4 text-[#d4af37]/60" />
                      </button>
                    )}

                    {canEdit && !isComplete && (
                      <div className="flex items-center justify-between bg-[#080b16]/60 border border-[#d4af37]/20 p-4 rounded-xl">
                        <div>
                           <span className="block text-sm font-medium text-[#e8d7b5]">Recruiting</span>
                           <span className="block text-xs text-[#e8d7b5]/60 mt-0.5 font-serif">Show team in discovery</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={team.lookingForTeammates || false}
                            onChange={handleToggleLookingForTeammates}
                          />
                          <div className="w-11 h-6 bg-[#10182b] border border-[#d4af37]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#080b16] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d4af37]/50 after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37] peer-checked:after:bg-[#080b16]"></div>
                        </label>
                      </div>
                    )}

                    {isLeader && team.members.length >= (event?.teamSizeMin || 2) && team.members.length <= (event?.teamSizeMax || 4) && (
                      <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        isComplete ? 'bg-green-900/20 border-green-500/30' : 'bg-[#d4af37]/5 border-[#d4af37]/30'
                      }`}>
                        <div>
                           <span className={`block text-sm font-bold ${isComplete ? 'text-green-400' : 'text-[#d4af37]'}`}>
                             {isComplete ? 'Team Complete' : 'Mark as Complete'}
                           </span>
                           <span className="block text-xs text-[#e8d7b5]/60 mt-1 font-serif">
                             {isComplete ? (team.members.length >= (event?.teamSizeMax || 4) ? 'Team is full and ready for submission' : 'Uncheck to recruit again') : 'Ready for submission?'}
                           </span>
                        </div>
                        {team.members.length < (event?.teamSizeMax || 4) && (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isComplete}
                              onChange={handleToggleStatus}
                            />
                            <div className="w-11 h-6 bg-[#10182b] border border-[#d4af37]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#080b16] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d4af37]/50 after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-checked:after:bg-[#080b16]"></div>
                          </label>
                        )}
                      </div>
                    )}
                    
                    {!isLeader && (
                      <button 
                        onClick={handleLeaveTeam}
                        disabled={deadlinePassed || team.lockedBySuperAdmin}
                        className="w-full flex items-center justify-between text-red-400 bg-red-500/5 border border-red-500/20 py-3 px-4 rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <span className="font-medium text-sm">Leave Team</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                    
                    {deadlinePassed && (
                      <div className="text-xs text-red-400/80 text-center mt-4 border border-red-900/30 bg-red-900/10 p-3 rounded-xl flex items-center justify-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        Registration Deadline Passed
                      </div>
                    )}
                  </div>
               </div>
            )}

            {/* Pending Requests / Activity (Leader Only) */}
            {isLeader && (
              <div className="bg-[#10182b]/80 backdrop-blur-sm border border-[#d4af37]/20 rounded-3xl p-6 parchment-card shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                <h3 className="font-bold text-[#e8d7b5] mb-5 flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
                   <UserCheck className="w-5 h-5 text-[#d4af37]" /> Pending Requests
                </h3>
                
                {joinRequests.length === 0 ? (
                  <div className="text-center py-6 bg-[#080b16]/60 rounded-xl border border-[#d4af37]/20 border-dashed">
                     <p className="text-sm text-[#e8d7b5]/60 font-serif">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {joinRequests.map(req => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        key={req._id} 
                        className="p-4 border border-[#d4af37]/30 rounded-xl bg-[#080b16]/80 flex flex-col gap-3 shadow-md hover:border-[#d4af37]/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-full bg-[#10182b] border border-[#d4af37]/20 flex items-center justify-center text-sm font-bold text-[#d4af37]">
                                {req.fromUserId.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-[#e8d7b5]">{req.fromUserId.name}</p>
                               <p className="text-[10px] text-[#e8d7b5]/60 font-serif">{req.fromUserId.skills?.slice(0,2).join(', ') || 'No skills listed'}</p>
                             </div>
                          </div>
                          <button
                            onClick={() => setSelectedUser({ user: req.fromUserId, action: 'request', reqId: req._id })}
                            className="text-xs flex items-center gap-1 bg-[#10182b] border border-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded-md hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-colors uppercase tracking-wider font-bold"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectRequest(req._id)}
                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-[#10182b] text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 transition-colors uppercase tracking-wider"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAcceptRequest(req._id)}
                            disabled={!canEdit || isComplete}
                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-colors disabled:opacity-30 uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                          >
                            Accept
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Browse Participants Section (Leader Only) */}
        {isLeader && !isComplete && (
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-px top-0" />
            <div className="pt-10">
               <BrowseTeammates />
            </div>
          </div>
        )}
      </main>

      {/* Reusable Participant Detail Modal */}
      <DetailModal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          // if we opened from the invite modal, show it again
          if (selectedUser?.action === 'invite' && searchResults.length > 0) {
             setShowInviteModal(true);
          }
        }}
        title="Participant Details"
      >
        {selectedUser && (
          <ParticipantDetail 
            participant={selectedUser.user}
            actions={
              <>
                {selectedUser.action === 'invite' && (
                  <button
                    onClick={() => handleSendInvite(selectedUser.user._id)}
                    className="w-full px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c158] transition-colors shadow-lg"
                  >
                    Invite to Team
                  </button>
                )}
                {selectedUser.action === 'request' && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => handleRejectRequest(selectedUser.reqId)}
                      className="flex-1 px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold rounded-xl transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(selectedUser.reqId)}
                      disabled={!canEdit || isComplete}
                      className="flex-1 px-4 py-3 bg-[#d4af37] text-black hover:bg-[#e5c158] font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </>
            }
          />
        )}
      </DetailModal>

    </div>
  );
}
