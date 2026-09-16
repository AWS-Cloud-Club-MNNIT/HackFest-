import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const BroadcastTab = () => {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("participants");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setSending(true);
    try {
      const res = await API.post("/super-admin/notifications/broadcast", {
        message: message.trim(),
        audience,
      });
      toast.success(res.data.message);
      setLastResult(res.data);
      setMessage("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send broadcast"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-magic-reveal">
      <h3 className="text-3xl font-bold font-harry text-[#f4e8c1] mb-6 drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
        Broadcast Announcement
      </h3>

      <form
        onSubmit={handleSubmit}
        className="parchment-card relative bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl p-8 space-y-6 max-w-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all cursor-pointer"
          >
            <option value="participants">All Participants</option>
            <option value="team_leaders">Team Leaders Only</option>
            <option value="all">Everyone (incl. Super Admins)</option>
          </select>
        </div>

        <div className="relative z-10">
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Reminder: team registrations close tonight at 11:59 PM!"
            className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
          />
        </div>

        <div className="pt-2 relative z-10">
          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#c9a646] to-[#d8bd68] text-[#101729] rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {sending ? "Sending Announcement…" : "Send Broadcast"}
          </button>
        </div>

        {lastResult && (
          <p className="text-sm text-emerald-400 font-serif relative z-10">
            ✓ Last broadcast reached {lastResult.count} wizard(s).
          </p>
        )}
      </form>

      <p className="text-xs text-[#e8d7b5]/50 mt-6 max-w-2xl italic font-serif">
        This creates an in-app notification for every user in the selected
        audience — they'll receive the announcement via owl in their notification bell immediately,
        or on their next visit to the Great Hall.
      </p>
    </div>
  );
};

export default BroadcastTab;
