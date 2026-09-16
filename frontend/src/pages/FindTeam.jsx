import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { Users, Search, Target, ShieldPlus, Eye, Check } from "lucide-react";
import DetailModal from "../components/common/DetailModal";
import TeamDetail from "../components/TeamDetail";
import { useAuthStore } from "../store/useAuthStore";

export default function FindTeam() {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [requesting, setRequesting] = useState(null);
  const [requestedTeamIds, setRequestedTeamIds] = useState(new Set());
  
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        let fetchedUser = user;
        if (!fetchedUser) {
          fetchedUser = await fetchUser();
        }

        if (fetchedUser.teamId) {
          toast.error("You are already in a team!");
          navigate("/team/my-team");
          return;
        }

        const teamsRes = await API.get("/teams/available");
        setTeams(teamsRes.data);
      } catch (error) {
        if (error.response?.status === 401 || error.status === 401) {
          navigate("/login");
        } else {
          toast.error("Failed to load available teams");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate, fetchUser]);

  const handleRequestJoin = async (teamId) => {
    setRequesting(teamId);
    try {
      await API.post("/join-requests", { teamId });
      toast.success("Join request sent successfully!");
      setRequestedTeamIds(prev => new Set(prev).add(teamId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(null);
      setSelectedTeam(null);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-500 tracking-widest uppercase text-sm">Searching...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] relative overflow-hidden">
      
      {/* Cinematic Background & Sparks */}
      <div className="cinematic-bg-overlay z-0" />
      <div className="absolute inset-0 bg-hogwarts-grid opacity-20 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#f4e8c1] rounded-full blur-[2px] animate-float z-0" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#d4af37] rounded-full blur-[1px] animate-star z-0" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 animate-magic-reveal">
        <DashboardNavbar user={user} />

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-10 text-center">
            <Target className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
            <h2 className="font-harry text-5xl sm:text-6xl font-bold text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
              Find Your Squad
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#e8d7b5]/70 mt-2 max-w-xl mx-auto">
              Browse teams that are actively looking for members. Send a request to join them and prepare for the hackathon.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-10 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#d4af37]/60" />
            </div>
            <input
              type="text"
              placeholder="Search by team name or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080b16]/60 border border-[#d4af37]/30 rounded-xl pl-12 pr-4 py-4 text-[#e8d7b5] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 magic-input-focus backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300"
            />
          </div>

          {filteredTeams.length === 0 ? (
            <div className="text-center py-16 bg-[#10182b]/60 rounded-3xl border border-[#d4af37]/20 parchment-card max-w-2xl mx-auto">
              <Users className="w-16 h-16 text-[#d4af37]/50 mx-auto mb-4" />
              <h3 className="text-2xl font-harry text-[#e8d7b5] tracking-wide">No teams found</h3>
              <p className="text-[#e8d7b5]/60 mt-2 font-serif">There are currently no teams looking for members.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <div key={team._id} className="bg-[#10182b]/80 border border-[#d4af37]/20 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col parchment-card group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-harry text-[#f4e8c1] mb-1 tracking-wider drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">{team.name}</h3>
                      <span className="inline-block px-2.5 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-[10px] uppercase tracking-widest font-bold rounded-full border border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                        {team.domain || "No Domain"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#d4af37]/10 text-[#d4af37] font-bold border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      {team.members.length}/4
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#d4af37]/10">
                    <div className="text-sm text-[#e8d7b5]/60 mb-5 space-y-1">
                      <span className="block font-serif">Leader: <span className="text-[#e8d7b5] font-sans font-semibold">{team.leaderId?.name}</span></span>
                      <span className="block font-serif">Status: <span className="text-green-400 font-sans font-semibold">Looking for members</span></span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors text-xs font-bold uppercase tracking-wider"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => handleRequestJoin(team._id)}
                        disabled={requesting === team._id || requestedTeamIds.has(team._id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] ${
                          requestedTeamIds.has(team._id) 
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30' 
                            : 'bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 hover:text-[#f4e8c1] hover:border-[#f4e8c1]'
                        }`}
                      >
                        {requesting === team._id ? "Sending..." : requestedTeamIds.has(team._id) ? <><Check className="w-4 h-4"/> Requested</> : "Request"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <DetailModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title="Team Details"
      >
        {selectedTeam && (
          <TeamDetail 
            team={selectedTeam} 
            actions={
              <button
                onClick={() => handleRequestJoin(selectedTeam._id)}
                disabled={requesting === selectedTeam._id || requestedTeamIds.has(selectedTeam._id)}
                className={`px-6 py-2 font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2 ${
                  requestedTeamIds.has(selectedTeam._id)
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {requesting === selectedTeam._id ? "Sending Request..." : requestedTeamIds.has(selectedTeam._id) ? <><Check className="w-4 h-4"/> Requested</> : "Request to Join Team"}
              </button>
            }
          />
        )}
      </DetailModal>
    </div>
  );
}
