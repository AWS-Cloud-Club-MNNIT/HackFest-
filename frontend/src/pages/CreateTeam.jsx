import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { Users, Wand2 } from "lucide-react";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
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
      });
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
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">
      <DashboardNavbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <Wand2 className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
          <h2 className="text-4xl font-bold font-display text-[#d4af37]">
            Forge Your Guild
          </h2>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">
            Assemble your team and choose your house. As the creator, you will be the Team Leader with exclusive powers to manage invites and final submissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="parchment-card rounded-2xl p-8 max-w-2xl mx-auto">
          
          {/* Team Name */}
          <div className="mb-8">
            <label className="block text-[#d4af37] font-semibold mb-2">
              Team Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-[#d4af37]/60" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. The CodeCrafters"
                className="w-full bg-[#05070f]/80 border border-[#d4af37]/30 rounded-lg pl-10 pr-4 py-3 text-[#e8d7b5] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Domain Selection */}
          <div className="mb-8">
            <label className="block text-[#d4af37] font-semibold mb-4">
              Select Your Domain (House)
            </label>
            
            {!event?.domains || event.domains.length === 0 ? (
              <p className="text-red-400 text-sm">No domains configured by organizer.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.domains.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setFormData({ ...formData, domain })}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      formData.domain === domain
                        ? "bg-[#d4af37]/20 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        : "bg-[#10182b] border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/5"
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

          <div className="pt-4 border-t border-[#d4af37]/20">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#24170f] via-[#d4af37] to-[#24170f] text-[#05070f] font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Forging..." : "Create & Continue to Invites"}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
