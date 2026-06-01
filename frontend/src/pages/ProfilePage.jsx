import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { changePassword, getCurrentUser, updateProfile } from "../api/authApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Lock, LogIn, Save, ShieldCheck, UserRound } from "lucide-react";

const initialProfile = {
  name: "",
  role: "farmer",
  phone: "",
  location: "",
  email: "",
  farmType: "",
  preferredLanguage: "English",
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("agroMitraToken")));

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setMessage("");
      setError("");

      try {
        const response = await getCurrentUser();
        const user = response.data.user;
        localStorage.setItem("agroMitraUser", JSON.stringify(user));
        setIsAuthenticated(true);
        setProfile({
          name: user.name || "",
          role: user.role || "farmer",
          phone: user.phone || "",
          email: user.email || "",
          location: user.profile?.location || "",
          farmType: user.profile?.farmType || "",
          preferredLanguage: user.profile?.preferredLanguage || "English",
        });
      } catch (requestError) {
        localStorage.removeItem("agroMitraToken");
        setIsAuthenticated(false);
        setError(requestError.response?.data?.message || "Please sign in to manage your profile.");
      } finally {
        setLoading(false);
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
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        profile: {
          location: profile.location,
          farmType: profile.farmType,
          preferredLanguage: profile.preferredLanguage,
        },
      });

      const user = response.data.user;
      localStorage.setItem("agroMitraUser", JSON.stringify(user));
      setMessage(response.message || "Profile updated successfully");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage(response.message || "Password changed successfully");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-lg font-bold text-slate-700 shadow-sm">
        Loading your secure profile...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Card className="max-w-xl p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <LogIn size={32} />
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-950">Sign in required</h1>
          <p className="mt-3 text-lg font-medium leading-8 text-slate-600">
            Your profile is connected to real authentication. Sign in or create an account to save farm data securely.
          </p>
          {error && <p className="mt-4 font-bold text-red-600">{error}</p>}
          <Link
            to="/account"
            className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
          >
            Sign In / Sign Up
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="font-extrabold uppercase tracking-[0.22em] text-emerald-700">Secure user profile</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">Manage your Agro-Mitra account</h1>
        <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          Your details are saved through JWT authentication and the backend user collection.
        </p>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-bold text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700">
          {error}
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
              <p className="font-medium text-slate-500">These details personalize dashboard, advisory, and support records.</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["role", "Role"],
              ["location", "Location"],
              ["farmType", "Farm Type"],
              ["preferredLanguage", "Preferred Language"],
            ].map(([field, label]) => (
              <label key={field} className={field === "location" ? "md:col-span-2" : ""}>
                <span className="text-sm font-black text-slate-700">{label}</span>
                <input
                  value={profile[field] || ""}
                  disabled={field === "email" || field === "role"}
                  onChange={handleProfileChange(field)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </label>
            ))}
            <Button className="md:w-fit" disabled={saving}>
              <span className="inline-flex items-center gap-2">
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </span>
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
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
              <Button className="w-full" disabled={saving}>Change Password</Button>
            </form>
          </Card>

          <Card className="p-7">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-sky-50 text-sky-700">
                <ShieldCheck size={28} />
              </span>
              <div>
                <h2 className="text-2xl font-black text-slate-950">Authentication</h2>
                <p className="font-medium text-slate-500">JWT session active for this account.</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Signed in as</p>
              <p className="mt-2 text-xl font-black text-slate-950">{profile.email}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
