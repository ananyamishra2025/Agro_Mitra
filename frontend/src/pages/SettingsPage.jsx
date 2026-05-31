import { useEffect, useState } from "react";
import { Bell, Globe2, Lock, Moon, ShieldCheck, UserRound } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { getSettings, updateSettings } from "../api/settingsApi";

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();
  }, []);

  const updateNested = (section, key, value) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const saveSettings = async () => {
    const response = await updateSettings(settings);
    setMessage(response.message || "Settings saved successfully");
  };

  if (!settings) {
    return (
      <Card className="p-8">
        <p className="font-bold text-slate-600">Loading settings...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Website settings</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Manage Agro-Mitra settings</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Configure your profile, notifications, language, theme, security, and
          saved agriculture data.
        </p>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-bold text-emerald-800">
          {message}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
            <UserRound className="text-emerald-700" />
            Profile Settings
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Name"],
              ["role", "Role"],
              ["phone", "Phone"],
              ["location", "Location"],
            ].map(([key, label]) => (
              <label key={key}>
                <span className="text-sm font-black text-slate-700">{label}</span>
                <input
                  value={settings.profile[key] || ""}
                  onChange={(event) => updateNested("profile", key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
            <Bell className="text-emerald-700" />
            Notification Preferences
          </h2>
          <div className="mt-5 grid gap-4">
            {[
              ["weatherAlerts", "Weather alerts"],
              ["advisoryUpdates", "Advisory updates"],
              ["learningResources", "Learning resources"],
              ["enquiryReplies", "Support enquiry replies"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-bold text-slate-700">
                {label}
                <input
                  checked={settings.notifications[key]}
                  onChange={(event) => updateNested("notifications", key, event.target.checked)}
                  type="checkbox"
                  className="h-5 w-5"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
            <Moon className="text-emerald-700" />
            Theme and Language
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-sm font-black text-slate-700">Theme</span>
              <select
                value={settings.preferences.theme}
                onChange={(event) => updateNested("preferences", "theme", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                <option>light</option>
                <option>dark</option>
                <option>system</option>
              </select>
            </label>
            <label>
              <span className="flex items-center gap-2 text-sm font-black text-slate-700">
                <Globe2 size={16} />
                Language
              </span>
              <select
                value={settings.preferences.language}
                onChange={(event) => updateNested("preferences", "language", event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Bengali</option>
              </select>
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-950">
            <ShieldCheck className="text-emerald-700" />
            Privacy and Security
          </h2>
          <div className="mt-5 grid gap-4">
            {[
              ["saveHistory", "Save advisory and chatbot history"],
              ["allowPersonalization", "Allow personalized recommendations"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-bold text-slate-700">
                {label}
                <input
                  checked={settings.privacy[key]}
                  onChange={(event) => updateNested("privacy", key, event.target.checked)}
                  type="checkbox"
                  className="h-5 w-5"
                />
              </label>
            ))}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 font-bold text-emerald-800">
              <Lock className="mr-2 inline" size={18} />
              Password changes are available from Profile.
            </div>
          </div>
        </Card>
      </section>

      <Button onClick={saveSettings}>Save Settings</Button>
    </div>
  );
};

export default SettingsPage;
