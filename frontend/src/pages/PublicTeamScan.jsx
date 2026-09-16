import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { Users, ShieldCheck, AlertTriangle } from "lucide-react";

export default function PublicTeamScan() {
  const { qrToken } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get(`/teams/scan/${qrToken}`);
        setTeam(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or Expired QR Pass");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [qrToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b16] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5] flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-md bg-[#10182b] border border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8c6a15] via-[#e5c158] to-[#8c6a15]"></div>

        {error ? (
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Scan Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/" className="text-[#d4af37] hover:underline">Return to Home</Link>
          </div>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <ShieldCheck className="w-16 h-16 text-[#d4af37] mx-auto mb-4" />
            <h2 className="font-harry text-4xl text-[#d4af37] mb-2">{team.name}</h2>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Domain: {team.domain}
            </p>
            
            <div className="bg-[#05070f] rounded-xl p-4 text-left border border-white/5 mb-6">
              <div className="flex items-center gap-2 mb-4 text-[#d4af37] font-bold border-b border-white/10 pb-2">
                <Users className="w-4 h-4" /> Team Roster ({team.members.length})
              </div>
              <div className="space-y-3">
                {team.members.map(member => (
                  <div key={member._id} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-200">{member.name}</span>
                    <span className="text-xs text-gray-500">{member.college}</span>
                  </div>
                ))}
              </div>
            </div>

            {team.checkedIn ? (
              <div className="bg-green-900/20 text-green-400 border border-green-500/30 p-3 rounded-lg font-bold">
                TEAM CHECKED IN
              </div>
            ) : (
              <div className="bg-blue-900/20 text-blue-400 border border-blue-500/30 p-3 rounded-lg font-bold">
                READY FOR CHECK-IN
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
