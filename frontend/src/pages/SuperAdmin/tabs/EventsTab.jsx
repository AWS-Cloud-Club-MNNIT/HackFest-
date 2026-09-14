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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/super-admin/events");
      setEvents(res.data?.events || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      domains: event.domains?.length === 4 ? event.domains : ["", "", "", ""],
      teamSizeMin: event.teamSizeMin ?? 2,
      teamSizeMax: event.teamSizeMax ?? 4,
      registrationDeadline: event.registrationDeadline
        ? event.registrationDeadline.slice(0, 16)
        : "",
      startDate: event.startDate ? event.startDate.slice(0, 16) : "",
      endDate: event.endDate ? event.endDate.slice(0, 16) : "",
    });
    setShowForm(true);
  };

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
        toast.success("Event updated");
      } else {
        await API.post("/super-admin/events", payload);
        toast.success("Event created");
      }

      setShowForm(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    try {
      await API.delete(`/super-admin/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#d4af37]">Events</h3>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition"
        >
          + New Event
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl p-6 mb-8 space-y-4"
        >
          <h4 className="font-semibold text-white">
            {editingId ? "Edit Event" : "Create Event"}
          </h4>

          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">
              Domains (exactly 4)
            </label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {form.domains.map((domain, i) => (
                <input
                  key={i}
                  required
                  placeholder={`Domain ${i + 1}`}
                  value={domain}
                  onChange={(e) => handleDomainChange(i, e.target.value)}
                  className="bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">Min Team Size</label>
              <input
                type="number"
                min={1}
                required
                value={form.teamSizeMin}
                onChange={(e) =>
                  setForm({ ...form, teamSizeMin: e.target.value })
                }
                className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Max Team Size</label>
              <input
                type="number"
                min={1}
                required
                value={form.teamSizeMax}
                onChange={(e) =>
                  setForm({ ...form, teamSizeMax: e.target.value })
                }
                className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400">
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                required
                value={form.registrationDeadline}
                onChange={(e) =>
                  setForm({ ...form, registrationDeadline: e.target.value })
                }
                className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Start Date</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">End Date</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full mt-1 bg-[#080b16] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#d4af37] text-black rounded-lg text-sm font-bold hover:bg-[#e8c869] transition disabled:opacity-50"
            >
              {submitting ? "Saving…" : editingId ? "Update Event" : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-[#d4af37]/30 text-[#d4af37] rounded-lg text-sm font-bold hover:bg-[#d4af37]/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#101522] border border-[#d4af37]/30 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No events created yet. Click "New Event" to add one.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#d4af37]/20">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Domains</th>
                <th className="py-3 px-4">Team Size</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event._id}
                  className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5"
                >
                  <td className="py-3 px-4 font-medium text-white">
                    {event.title}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {(event.domains || []).join(", ")}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {event.teamSizeMin}–{event.teamSizeMax}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {event.registrationDeadline
                      ? new Date(event.registrationDeadline).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditForm(event)}
                      className="text-xs text-[#d4af37] hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventsTab;
