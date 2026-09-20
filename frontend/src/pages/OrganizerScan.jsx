import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Html5QrcodeScanner } from "html5-qrcode";
import API from "../services/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { ScanFace, CheckCircle, XCircle } from "lucide-react";

export default function OrganizerScan() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [scannedTeam, setScannedTeam] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [scanSessionKey, setScanSessionKey] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await API.get("/auth/me");
        if (authRes.data.user.role !== "super_admin") {
          toast.error("Unauthorized! Organizer access only.");
          navigate("/dashboard");
          return;
        }
        setUser(authRes.data.user);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (!loading && user) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        async (decodedText) => {
          // Pause scanner to avoid multiple hits if possible
          try {
            scanner.pause();
          } catch (e) {
            // Ignore error if not scanning from camera (e.g., file upload)
          }
          handleQRScan(decodedText, scanner);
        },
        (error) => {
          // Ignore frequent scan errors when no QR is in view
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [loading, user, scanSessionKey]);

  const handleQRScan = async (decodedText, scanner) => {
    setScanError(null);
    setScannedTeam(null);
    try {
      let token = decodedText;
      if (decodedText.includes('/scan/')) {
        const parts = decodedText.split('/scan/');
        token = parts[parts.length - 1];
      }
      const res = await API.post('/super-admin/verify-qr', { qrToken: token });
      setScannedTeam(res.data);
    } catch (error) {
      setScanError(error.response?.data?.message || "Invalid QR Code");
    } finally {
      // Resume scanner if error, else wait for check-in action
      if (scanner && !scannedTeam) {
        setTimeout(() => {
          try { scanner.resume(); } catch (e) {}
        }, 2000);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!scannedTeam) return;
    setCheckingIn(true);
    try {
      await API.patch(`/super-admin/teams/${scannedTeam._id}/checkin`);
      toast.success(`${scannedTeam.name} marked as Checked-In!`);
      
      // Update local state to show checked-in
      setScannedTeam(prev => ({ ...prev, checkedIn: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check-in team");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleReset = () => {
    setScannedTeam(null);
    setScanError(null);
    // Increment key to trigger scanner remount without page reload
    setScanSessionKey(prev => prev + 1);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#080b16] text-[#e8d7b5]">
      <DashboardNavbar user={user} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        
        <div className="mb-8 text-center">
          <ScanFace className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
          <h2 className="text-3xl font-bold font-display text-[#d4af37]">Scanner Terminal</h2>
          <p className="text-gray-400">Scan participant QR Passes to verify and check-in teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Scanner Area */}
          <div key={`scanner-wrapper-${scanSessionKey}`} className="bg-[#10182b] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl overflow-hidden relative">
            <style dangerouslySetInnerHTML={{__html: `
              #reader {
                border: none !important;
              }
              #reader__dashboard_section_csr span {
                color: #e8d7b5 !important;
                font-family: inherit;
              }
              #reader__dashboard_section_swaplink {
                color: #d4af37 !important;
                text-decoration: underline !important;
                margin-top: 10px;
                display: block;
              }
              #reader button {
                background-color: #d4af37 !important;
                color: #10182b !important;
                border: none !important;
                padding: 10px 20px !important;
                border-radius: 8px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                margin: 10px 5px !important;
                transition: all 0.2s !important;
                font-family: inherit;
              }
              #reader button:hover {
                background-color: #c9a646 !important;
                transform: translateY(-1px);
              }
              #reader__dashboard_section_csr div {
                border: 2px dashed #d4af37 !important;
                border-radius: 12px;
                padding: 1rem !important;
                background-color: rgba(212, 175, 55, 0.05);
              }
              #reader__dashboard_section_csr input[type="file"] {
                color: #e8d7b5 !important;
              }
              #reader img {
                margin: auto;
              }
            `}} />
            <div id="reader" className="w-full bg-[#080b16] rounded-xl overflow-hidden"></div>
          </div>

          {/* Results Area */}
          <div className="parchment-card p-6 rounded-2xl flex flex-col justify-center min-h-[300px]">
            
            {!scannedTeam && !scanError && (
              <div className="text-center text-gray-500">
                <ScanFace className="w-16 h-16 opacity-20 mx-auto mb-4" />
                <p>Awaiting scan...</p>
              </div>
            )}

            {scanError && (
              <div className="text-center text-red-400 animate-in fade-in zoom-in">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="font-bold text-xl mb-2">Scan Failed</h3>
                <p className="text-sm">{scanError}</p>
                <button 
                  onClick={handleReset}
                  className="mt-6 border border-red-500 text-red-400 px-6 py-2 rounded-lg hover:bg-red-500/10"
                >
                  Scan Again
                </button>
              </div>
            )}

            {scannedTeam && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-4 border-b border-[#d4af37]/20 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#d4af37]">{scannedTeam.name}</h3>
                    <p className="text-sm text-gray-400">Domain: {scannedTeam.domain}</p>
                  </div>
                  {scannedTeam.checkedIn ? (
                    <span className="bg-green-900/40 text-green-400 border border-green-500/50 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Checked In
                    </span>
                  ) : (
                    <span className="bg-blue-900/40 text-blue-400 border border-blue-500/50 px-3 py-1 rounded text-xs font-bold uppercase">
                      Ready
                    </span>
                  )}
                </div>

                <div className="mb-6 space-y-2">
                  <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Members ({scannedTeam.members.length})</p>
                  {scannedTeam.members.map(m => (
                    <div key={m._id} className="text-sm flex justify-between bg-[#05070f] p-2 rounded border border-[#d4af37]/10">
                      <span>{m.name}</span>
                      <span className="text-gray-500 text-xs">{m.college}</span>
                    </div>
                  ))}
                </div>

                {!scannedTeam.checkedIn ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleReset}
                      className="flex-1 py-3 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCheckIn}
                      disabled={checkingIn}
                      className="flex-1 py-3 bg-[#d4af37] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition disabled:opacity-50"
                    >
                      {checkingIn ? "Processing..." : "Mark Checked-In"}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 bg-[#10182b] border border-[#d4af37]/40 text-[#d4af37] font-bold rounded-lg hover:bg-[#d4af37]/10 transition"
                  >
                    Scan Next Team
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
