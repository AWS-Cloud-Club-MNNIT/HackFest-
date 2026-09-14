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
    <div>
      <h3 className="text-xl font-bold text-[#d4af37] mb-6">
        Broadcast Announcement
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 space-y-4 max-w-2xl"
      >
        <div>
          <label className="text-xs text-gray-400">Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="participants">All Participants</option>
            <option value="team_leaders">Team Leaders Only</option>
            <option value="all">Everyone (incl. Super Admins)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Reminder: team registrations close tonight at 11:59 PM!"
            className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="px-5 py-2.5 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send Broadcast"}
        </button>

        {lastResult && (
          <p className="text-sm text-emerald-400">
            Last broadcast reached {lastResult.count} user(s).
          </p>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-4 max-w-2xl">
        This creates an in-app notification for every user in the selected
        audience — they'll see it in their notification bell immediately,
        or on next refresh if they're offline.
      </p>
    </div>
  );
};

export default BroadcastTab;
