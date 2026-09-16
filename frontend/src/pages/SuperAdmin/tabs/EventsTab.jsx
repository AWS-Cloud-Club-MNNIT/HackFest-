
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
  isActive: true,
};

function EventsTab() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatDateTimeLocal = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const offset = parsedDate.getTimezoneOffset();
    const localDate = new Date(parsedDate.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  const fetchActiveConfig = async () => {
    try {
      setLoading(true);

      const response = await API.get("/super-admin/events");
      const events = response.data.events || [];

      if (events.length > 0) {
        const activeEvent = events[0];

        setEditingId(activeEvent._id);

        setForm({
          title: activeEvent.title || "",
          description: activeEvent.description || "",
          domains:
            activeEvent.domains?.length === 4
              ? activeEvent.domains
              : ["", "", "", ""],
          teamSizeMin: activeEvent.teamSizeMin ?? 2,
          teamSizeMax: activeEvent.teamSizeMax ?? 4,
          registrationDeadline: formatDateTimeLocal(
            activeEvent.registrationDeadline
          ),
          startDate: formatDateTimeLocal(activeEvent.startDate),
          endDate: formatDateTimeLocal(activeEvent.endDate),
          isActive: activeEvent.isActive ?? true,
        });
      } else {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (error) {
      console.error("Error fetching event configuration:", error);
      toast.error("Unable to load event configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveConfig();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleDomainChange = (index, value) => {
    setForm((previousForm) => {
      const updatedDomains = [...previousForm.domains];
      updatedDomains[index] = value;

      return {
        ...previousForm,
        domains: updatedDomains,
      };
    });
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Event title is required");
      return false;
    }

    if (form.domains.some((domain) => !domain.trim())) {
      toast.error("All four domains are required");
      return false;
    }

    const minTeamSize = Number(form.teamSizeMin);
    const maxTeamSize = Number(form.teamSizeMax);

    if (minTeamSize < 1 || maxTeamSize < 1) {
      toast.error("Team size must be at least 1");
      return false;
    }

    if (minTeamSize > maxTeamSize) {
      toast.error("Minimum team size cannot exceed maximum team size");
      return false;
    }

    if (
      form.registrationDeadline &&
      form.startDate &&
      new Date(form.registrationDeadline) >= new Date(form.startDate)
    ) {
      toast.error("Registration deadline must be before the start date");
      return false;
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) >= new Date(form.endDate)
    ) {
      toast.error("Start date must be before end date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        domains: form.domains.map((domain) => domain.trim()),
        teamSizeMin: Number(form.teamSizeMin),
        teamSizeMax: Number(form.teamSizeMax),
        registrationDeadline: form.registrationDeadline || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        isActive: form.isActive,
      };

      if (editingId) {
        await API.put(`/super-admin/events/${editingId}`, payload);
        toast.success("Event configuration updated successfully");
      } else {
        await API.post("/super-admin/events", payload);
        toast.success("Event configuration created successfully");
      }

      await fetchActiveConfig();
    } catch (error) {
      console.error("Error saving event configuration:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save event configuration"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your changes?"
    );

    if (!confirmed) return;

    await fetchActiveConfig();
    toast.success("Changes reset");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0c1322]/70 p-10 text-center text-sm text-gray-400">
        Loading event configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a646]">
          Event Management
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#e9dcbd]">
          Event Configuration
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Configure event details, competition domains, team sizes and dates.
        </p>
      </div>

      {/* Configuration Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#c9a646]/20 bg-[#101729]/80 p-6"
      >
        {/* Event Title */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Event Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="AWS SBG Hackfest 2026"
            required
            className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the event..."
            className="w-full resize-none rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
          />
        </div>

        {/* Domains */}
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Competition Domains
          </label>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {form.domains.map((domain, index) => (
              <input
                key={index}
                type="text"
                value={domain}
                onChange={(event) =>
                  handleDomainChange(index, event.target.value)
                }
                placeholder={`Domain ${index + 1}`}
                required
                className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
              />
            ))}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Enter exactly four competition domains.
          </p>
        </div>

        {/* Team Size */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Minimum Team Size
            </label>

            <input
              type="number"
              name="teamSizeMin"
              min="1"
              value={form.teamSizeMin}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Maximum Team Size
            </label>

            <input
              type="number"
              name="teamSizeMax"
              min="1"
              value={form.teamSizeMax}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
            />
          </div>
        </div>

        {/* Registration Deadline */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Registration Deadline
          </label>

          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
          />
        </div>

        {/* Event Dates */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Start Date
            </label>

            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              End Date
            </label>

            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a646]"
            />
          </div>
        </div>

        {/* Event Status */}
        <div className="rounded-xl border border-[#c9a646]/20 bg-[#080b16] p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(event) =>
                setForm((previousForm) => ({
                  ...previousForm,
                  isActive: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-[#d4af37]"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Active Event
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Allow participants to access this event.
              </p>
            </div>
          </label>

          <p
            className={`mt-3 text-xs ${
              form.isActive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {form.isActive
              ? "● Event is active"
              : "● Event is inactive"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl border border-[#c9a646]/40 bg-[#c9a646]/10 px-5 py-3 text-sm font-semibold text-[#e6d29b] transition hover:bg-[#c9a646]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Configuration"
                : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventsTab;