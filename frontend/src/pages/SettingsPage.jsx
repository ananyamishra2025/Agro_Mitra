import { Bell, Globe2, Lock, Moon, ShieldCheck, UserRound } from "lucide-react";
import Card from "../components/common/Card";

const settings = [
  {
    icon: <UserRound size={24} />,
    title: "Profile Settings",
    text: "Update your name, role, phone number, and farming profile.",
    control: "Edit Profile",
  },
  {
    icon: <Bell size={24} />,
    title: "Notification Preferences",
    text: "Choose alerts for weather, disease reports, advisory updates, and learning content.",
    control: "Manage Alerts",
  },
  {
    icon: <Moon size={24} />,
    title: "Theme",
    text: "Use light mode, dark mode, or follow your system preference.",
    control: "Light / Dark",
  },
  {
    icon: <Globe2 size={24} />,
    title: "Language",
    text: "Choose English, Hindi, Bengali, or other supported regional languages.",
    control: "Change Language",
  },
  {
    icon: <Lock size={24} />,
    title: "Security",
    text: "Manage password, Google login, account sessions, and two-step protection.",
    control: "Security Options",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Privacy and Data",
    text: "Control saved advisory records, image reports, and account data exports.",
    control: "Privacy Settings",
  },
];

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Website settings</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Manage Agro-Mitra settings</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Configure your account, notifications, language, security, theme, and
          saved agriculture data from one place.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((item) => (
          <Card key={item.title} className="p-6">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              {item.icon}
            </span>
            <h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2>
            <p className="mt-2 min-h-20 font-medium leading-7 text-slate-600">{item.text}</p>
            <button className="mt-5 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-800 shadow-sm transition hover:bg-emerald-50">
              {item.control}
            </button>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default SettingsPage;
