
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const MAX_MESSAGE_LENGTH = 500;

const BroadcastTab = () => {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("participants");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleMessageChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);
      setLastResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Message cannot be empty");
      return;
    }

    if (trimmedMessage.length < 5) {
      toast.error("Message must contain at least 5 characters");
      return;
    }

    setSending(true);

    try {
      const res = await API.post(
        "/super-admin/notifications/broadcast",
        {
          message: trimmedMessage,
          audience,
        }
      );

      toast.success(
        res.data?.message || "Broadcast sent successfully"
      );

      setLastResult(res.data);
      setMessage("");
      setShowPreview(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send broadcast"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a646]">
          Communication
        </p>

        <h3 className="mt-1 text-xl font-bold text-[#d4af37]">
          Broadcast Announcement
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Send important announcements to selected users.
        </p>
      </div>

      {/* Broadcast Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 space-y-5 max-w-2xl"
      >
        {/* Audience */}
        <div>
          <label
            htmlFor="broadcast-audience"
            className="text-xs text-gray-400"
          >
            Audience
          </label>

          <select
            id="broadcast-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="participants">
              All Participants
            </option>

            <option value="team_leaders">
              Team Leaders Only
            </option>

            <option value="all">
              Everyone (incl. Super Admins)
            </option>
          </select>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="broadcast-message"
              className="text-xs text-gray-400"
            >
              Message
            </label>

            <span
              className={`text-xs ${
                message.length >= MAX_MESSAGE_LENGTH
                  ? "text-red-400"
                  : "text-gray-500"
              }`}
            >
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>

          <textarea
            id="broadcast-message"
            required
            rows={5}
            value={message}
            onChange={handleMessageChange}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Write your announcement here..."
            className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-[#d4af37]/60"
          />
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          disabled={!message.trim()}
          className="text-xs text-[#d4af37] hover:underline disabled:opacity-40"
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>

        {/* Preview */}
        {showPreview && message.trim() && (
          <div className="rounded-xl border border-[#d4af37]/20 bg-[#080b16] p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#d4af37]">
              Notification Preview
            </p>

            <p className="mt-2 text-sm text-gray-200 whitespace-pre-wrap break-words">
              {message.trim()}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              Audience:{" "}
              {audience === "participants"
                ? "All Participants"
                : audience === "team_leaders"
                ? "Team Leaders Only"
                : "Everyone"}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="px-5 py-2.5 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Send Broadcast"}
        </button>

        {/* Result */}
        {lastResult && (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/5 p-3">
            <p className="text-sm text-emerald-400">
              Last broadcast reached{" "}
              {lastResult.count ?? 0} user(s).
            </p>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-4 max-w-2xl">
        This sends an in-app notification using the existing
        backend broadcast endpoint.
      </p>
    </div>
  );
};

export default BroadcastTab;