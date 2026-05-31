import { useEffect, useState } from "react";
import { changePassword } from "../api/authApi";
import { getSettings, updateSettings } from "../api/settingsApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Lock, Save, UserRound } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "Ananya Mishra",
    role: "Farmer / Student",
    phone: "",
    location: "Kolkata, West Bengal",
    email: "ananya.mishra@example.com",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("agroMitraUser") || "null");

    const loadProfile = async () => {
      try {
        const response = await getSettings();
        setProfile((current) => ({
          ...current,
          ...response.data.profile,
          name: savedUser?.name || response.data.profile.name || current.name,
          email: savedUser?.email || current.email,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswords((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const response = await updateSettings({ profile });
    localStorage.setItem("agroMitraUser", JSON.stringify({ ...profile, id: "demoUser" }));
    setMessage(response.message || "Profile updated successfully");
  };

  const savePassword = async (event) => {
    event.preventDefault();
    const response = await changePassword({
      email: profile.email,
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswords({ currentPassword: "", newPassword: "" });
    setMessage(response.message || "Password changed successfully");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">User profile</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Manage your Agro-Mitra profile</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Edit your account details, farming role, location, and password.
        </p>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-bold text-emerald-800">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <UserRound size={28} />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Edit Profile</h2>
              <p className="font-medium text-slate-500">These details personalize dashboard and support records.</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["role", "Role"],
              ["location", "Location"],
            ].map(([field, label]) => (
              <label key={field} className={field === "location" ? "md:col-span-2" : ""}>
                <span className="text-sm font-black text-slate-700">{label}</span>
                <input
                  value={profile[field] || ""}
                  onChange={handleProfileChange(field)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            ))}
            <Button className="md:w-fit">
              <span className="inline-flex items-center gap-2">
                <Save size={18} />
                Save Profile
              </span>
            </Button>
          </form>
        </Card>

        <Card className="p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-lime-50 text-lime-700">
              <Lock size={28} />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Change Password</h2>
              <p className="font-medium text-slate-500">Update your account security.</p>
            </div>
          </div>

          <form onSubmit={savePassword} className="mt-7 space-y-4">
            <input
              value={passwords.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Current password"
              type="password"
            />
            <input
              value={passwords.newPassword}
              onChange={handlePasswordChange("newPassword")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="New password"
              type="password"
            />
            <Button className="w-full">Change Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
