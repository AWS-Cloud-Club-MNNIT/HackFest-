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
    <div className="animate-magic-reveal">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold font-harry text-[#f4e8c1] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Hackathon Configuration & Domains</h3>
        <p className="text-sm text-[#e8d7b5]/60 font-serif">Manage the global settings and domains for the event.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="parchment-card relative bg-[#101522]/80 border border-[#d4af37]/30 rounded-2xl p-8 mb-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Hackathon Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
          />
        </div>

        <div className="relative z-10">
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
          />
        </div>

        <div className="relative z-10">
          <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">
            Registration Domains (Exactly 4)
          </label>
          <p className="text-[10px] text-[#e8d7b5]/50 mb-2 italic">These are the Hogwarts Houses or domains participants can register for.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            {form.domains.map((
domain, i) => (
              <input
                key={i}
                required
                placeholder={`Domain ${i + 1}`}
                value={domain}
                onChange={(e) => handleDomainChange(i, e.target.value)}
                className="bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Min Team Size</label>
            <input
              type="number"
              min={1}
              required
              value={form.teamSizeMin}
              onChange={(e) => setForm({ ...form, teamSizeMin: e.target.value })}
              className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Max Team Size</label>
            <input
              type="number"
              min={1}
              required
              value={form.teamSizeMax}
              onChange={(e) => setForm({ ...form, teamSizeMax: e.target.value })}
              className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-[#e8d7b5]/30"
            />
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              required
              value={form.registrationDeadline}
              onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
              className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">Start Date</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider font-serif">End Date</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full mt-2 bg-[#080b16]/80 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-sm text-[#f4e8c1] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#d4af37]/20 relative z-10 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#c9a646] to-[#d8bd68] text-[#101729] rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitting ? 'Saving Configuration…' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsTab;
