import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { Users, Wand2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function CreateTeam() {
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const preselectedDomain = searchParams.get("domain") || "";

  const [formData, setFormData] = useState({
    name: "",
    domain: preselectedDomain,
    lookingForTeammates: true,
  });

  // Verify Auth & Fetch Event
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await API.get("/auth/me");
        const userData = authRes.data.user;
        setUser(userData);

        if (userData.teamId) {
          toast.error("You are already in a team!");
          navigate("/team/my-team");
          return;
        }

        const eventRes = await API.get("/events/active");
        setEvent(eventRes.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          toast.error("Failed to load active hackathon details.");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Team name is required");
    if (!formData.domain) return toast.error("Please select a domain/house");
    if (!event) return toast.error("No active event found");

    setSubmitting(true);
    try {
      await API.post("/teams", {
        name: formData.name,
        domain: formData.domain,
        eventId: event._id,
        lookingForTeammates: formData.lookingForTeammates,
      });
      await fetchUser(); // Ensure global state is synced with the new teamId
      toast.success("Team forged successfully! Welcome Leader.");
      navigate("/team/my-team");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b16] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
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

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10 text-center">
            <Wand2 className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
            <h2 className="font-harry text-5xl sm:text-6xl font-bold text-[#f4e8c1] tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
              Forge Your Guild
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#e8d7b5]/70 mt-2 max-w-xl mx-auto">
              Assemble your team and choose your house. As the creator, you will be the Team Leader with exclusive powers to manage invites and final submissions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="parchment-card rounded-3xl p-8 md:p-10 max-w-2xl mx-auto">
            
            {/* Team Name */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 transition-colors">
                Team Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. The CodeCrafters"
                  className="w-full bg-[#080b16]/60 border border-[#d4af37]/30 rounded-xl pl-12 pr-4 py-3.5 text-[#e8d7b5] placeholder-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 magic-input-focus outline-none backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Domain Selection */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 transition-colors">
                Select Your Domain (House)
              </label>
              {preselectedDomain && (
                <p className="text-[#e8d7b5]/60 text-sm mb-4 font-serif">
                  You selected <strong>{preselectedDomain}</strong> from the dashboard. You can change it below if needed.
                </p>
              )}
              
              {!event?.domains || event.domains.length === 0 ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-3">
                  <p>No domains configured by organizer.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.domains.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setFormData({ ...formData, domain })}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        formData.domain === domain
                          ? "bg-[#d4af37]/15 border-[#d4af37] shadow-[inset_4px_0_15px_rgba(212,175,55,0.1),0_0_15px_rgba(212,175,55,0.2)]"
                          : "bg-[#080b16]/60 border-[#d4af37]/30 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/5"
                      }`}
                    >
                      <span className={`block font-bold ${formData.domain === domain ? "text-[#d4af37]" : "text-[#e8d7b5]"}`}>
                        {domain}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Looking for Teammates Toggle */}
            <div className="mb-8 flex items-center justify-between bg-[#080b16]/60 p-5 rounded-xl border border-[#d4af37]/30 backdrop-blur-md">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors">
                  Looking for Teammates
                </label>
                <p className="text-sm text-[#e8d7b5]/60 font-serif">
                  If enabled, your team will appear in the available teams list for others to request to join.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.lookingForTeammates}
                  onChange={(e) => setFormData({ ...formData, lookingForTeammates: e.target.checked })}
                />
                <div className="w-14 h-7 bg-[#10182b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#d4af37]"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-[#d4af37]/20">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#24170f] via-[#5c3b80]/40 to-[#24170f] text-[#d4af37] border border-[#d4af37]/50 font-bold py-4 rounded-xl hover:text-[#f4e8c1] hover:border-[#f4e8c1] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-70 mt-2"
              >
                {submitting ? "Forging..." : "Create & Continue to Invites"}
              </button>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
}
