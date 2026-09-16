
import { useState } from "react";
import { User, Shield, Bell, Save } from "lucide-react";

function SettingsTab() {
  const [settings, setSettings] = useState({
    adminName: "Administrator",
    emailNotifications: true,
    systemNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "superAdminSettings",
      JSON.stringify(settings)
    );

    setSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#c9a646]">
          Configuration
        </p>

        <h2 className="mt-1 text-2xl font-bold text-[#e9dcbd]">
          Settings
        </h2>

        <p className="mt-2 text-sm text-[#758197]">
          Manage your administrator preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <section className="rounded-2xl border border-[#c9a646]/15 bg-[#0c1322]/80 p-6">
        <div className="mb-5 flex items-center gap-3">
          <User size={20} className="text-[#d8bd68]" />

          <h3 className="text-lg font-semibold text-[#e8d9b5]">
            Profile Settings
          </h3>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs text-[#8792a7]">
            Administrator Name
          </span>

          <input
            type="text"
            value={settings.adminName}
            onChange={(event) =>
              handleChange("adminName", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#101729] px-4 py-3 text-sm text-[#e8d9b5] outline-none focus:border-[#c9a646]/50"
          />
        </label>
      </section>

      {/* Notification Settings */}
      <section className="rounded-2xl border border-[#c9a646]/15 bg-[#0c1322]/80 p-6">
        <div className="mb-5 flex items-center gap-3">
          <Bell size={20} className="text-[#d8bd68]" />

          <h3 className="text-lg font-semibold text-[#e8d9b5]">
            Notification Settings
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#dce2eb]">
                Email Notifications
              </p>

              <p className="mt-1 text-xs text-[#68748a]">
                Receive important updates through email.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(event) =>
                handleChange(
                  "emailNotifications",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#c9a646]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#dce2eb]">
                System Notifications
              </p>

              <p className="mt-1 text-xs text-[#68748a]">
                Show system alerts in the dashboard.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.systemNotifications}
              onChange={(event) =>
                handleChange(
                  "systemNotifications",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#c9a646]"
            />
          </label>
        </div>
      </section>

      {/* Security Information */}
      <section className="rounded-2xl border border-[#c9a646]/15 bg-[#0c1322]/80 p-6">
        <div className="mb-3 flex items-center gap-3">
          <Shield size={20} className="text-[#d8bd68]" />

          <h3 className="text-lg font-semibold text-[#e8d9b5]">
            Security
          </h3>
        </div>

        <p className="text-sm text-[#8792a7]">
          Your account access is controlled by the authentication
          system.
        </p>

        <p className="mt-2 text-xs text-[#68748a]">
          Password and role management should be handled through
          the backend authentication module.
        </p>
      </section>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl border border-[#c9a646]/30 bg-[#c9a646]/10 px-5 py-3 text-sm font-semibold text-[#e5d19a] transition hover:bg-[#c9a646]/20"
        >
          <Save size={16} />
          Save Settings
        </button>

        {saved && (
          <span className="text-sm text-green-300">
            Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}

export default SettingsTab;