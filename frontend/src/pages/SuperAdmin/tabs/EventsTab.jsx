import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../../services/api";

const emptyForm = {
  title: "",
  description: "",
  domains: ["", "", "", ""],
  teamSizeMin: 2,
  teamSizeMax: 4,
  registrationDeadline: "",
  startDate: "",
  endDate: "",
};

const EventsTab = () => {
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchActiveConfig = async () => {
    try {
      setLoading(true);
      const res = await API.get("/super-admin/events");
      const events = res.data?.events || [];
      
      if (events.length > 0) {
        const activeEvent = events[0]; // Assuming only one active event is managed
        setEditingId(activeEvent._id);
        setForm({
          title: activeEvent.title || "",
          description: activeEvent.description || "",
          domains: activeEvent.domains?.length === 4 ? activeEvent.domains : ["", "", "", ""],
          teamSizeMin: activeEvent.teamSizeMin ?? 2,
          teamSizeMax: activeEvent.teamSizeMax ?? 4,
          registrationDeadline: activeEvent.registrationDeadline
            ? activeEvent.registrationDeadline.slice(0, 16)
            : "",
          startDate: activeEvent.startDate ? activeEvent.startDate.slice(0, 16) : "",
          endDate: activeEvent.endDate ? activeEvent.endDate.slice(0, 16) : "",
        });
      } else {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load hackathon configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveConfig();
  }, []);

  const handleDomainChange = (index, value) => {
    setForm((prev) => {
      const domains = [...prev.domains];
      domains[index] = value;
      return { ...prev, domains };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.domains.some((d) => !d.trim())) {
      toast.error("All 4 domains are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        teamSizeMin: Number(form.teamSizeMin),
        teamSizeMax: Number(form.teamSizeMax),
      };

      if (editingId) {
        await API.put(`/super-admin/events/${editingId}`, payload);
        toast.success("Configuration updated successfully!");
      } else {
        const res = await API.post("/super-admin/events", payload);
        toast.success("Hackathon Configuration initialized!");
        setEditingId(res.data.event._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save configuration");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading Configuration…</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#d4af37]">Hackathon Configuration & Domains</h3>
        <p className="text-sm text-gray-400">Manage the global settings and domains for the event.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 mb-8 space-y-6"
      >
        <div>
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Hackathon Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text+[#d4af37] uppercase tracking-wider">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text+[#d4af37] uppercase tracking-wider">
            Registration Domains (Exactly 4)
          </label>
          <p className="text-[10px] text-gray-500 mb-2">These are the domains participants can register for.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            {form.domains.map((
domain, i) => (
              <input
                key={i}
                required
                placeholder={`Domain ${i + 1}`}
                value={domain}
                onChange={(e) => handleDomainChange(i, e.target.value)}
                className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Min Team Size</label>
            <input
              type="number"
              min={1}
              required
              value={form.teamSizeMin}
              onChange={(e) => setForm({ ...form, teamSizeMin: e.target.value })}
              className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Max Team Size</label>
            <input
              type="number"
              min={1}
              required
              value={form.teamSizeMax}
              onChange={(e) => setForm({ ...form, teamSizeMax: e.target.value })}
              className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text+[#d4af37] uppercase tracking-wider">
            Registration Domains (Exactly 4)
          </label>
          <p className="text-[10px] text-gray-500 mb-2">These are the domains participants can register for.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            {form.domains.map((
domain, i) => (
              <input
                key={i}
                required
                placeholder={`Domain ${i + 1}`}
                value={domain}
                onChange={(e) => handleDomainChange(i, e.target.value)}
                className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              required
              value={form.registrationDeadline}
              onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
              className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Start Date</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">End Date</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full mt-2 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#d4af37]/20">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 bg-[#d4af37] text-black rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition disabled:opacity-50"
          >
            {submitting ? 'Saving Configuration…' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsTab;
