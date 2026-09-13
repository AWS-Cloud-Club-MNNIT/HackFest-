import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function QRPass() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const authRes = await API.get("/auth/me");
        const userData = authRes.data.user;
        setUser(userData);

        if (!userData.teamId) {
          toast.error("You are not in a team.");
          navigate("/dashboard");
          return;
        }

        const teamRes = await API.get(`/teams/${userData.teamId}`);
        const teamData = teamRes.data;
        setTeam(teamData);

        if (teamData.status !== "complete") {
          toast.error("Team is not complete. QR Pass is locked.");
          navigate("/team/my-team");
          return;
        }

        // Fetch QR token securely
        const qrRes = await API.get(`/teams/${userData.teamId}/qr`);
        setQrToken(qrRes.data.qrToken);

      } catch (error) {
        toast.error("Failed to load QR pass securely.");
        navigate("/team/my-team");
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, [navigate]);

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

      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">
        
        <div className="w-full mb-8">
          <Link 
            to="/team/my-team"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Team
          </Link>
        </div>

        <div className="parchment-card-light p-8 rounded-2xl w-full max-w-sm text-center relative overflow-hidden group">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8c6a15] via-[#e5c158] to-[#8c6a15]"></div>

          <h2 className="text-3xl font-bold font-display text-[#24170f] mt-4 mb-1">
            {team.name}
          </h2>
          <p className="text-sm font-semibold text-[#8c6a15] uppercase tracking-widest mb-8">
            {team.domain}
          </p>

          <div className="bg-white p-4 rounded-xl shadow-inner inline-block mb-8 relative">
            <QRCodeCanvas 
              value={qrToken || "invalid"} 
              size={200}
              level={"H"}
              fgColor={"#10182b"}
              bgColor={"#ffffff"}
            />
            {team.checkedIn && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-green-700 font-bold rounded-xl">
                <CheckCircle2 className="w-12 h-12 mb-2" />
                CHECKED IN
              </div>
            )}
          </div>

          <div className="text-left border-t border-[#b89228]/30 pt-6">
            <p className="text-xs font-bold text-[#8c6a15] uppercase tracking-wider mb-3">Verified Roster</p>
            <div className="space-y-2">
              {team.members.map(member => (
                <div key={member._id} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#24170f]">{member.name}</span>
                  {member._id === team.leaderId._id && (
                    <span className="text-[9px] bg-[#8c6a15]/10 text-[#8c6a15] px-2 py-0.5 rounded border border-[#8c6a15]/30">LEADER</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        <p className="text-gray-500 text-sm mt-8 text-center max-w-sm">
          Present this QR pass to the organizers at the check-in desk on the day of the event.
        </p>

      </main>
    </div>
  );
}
