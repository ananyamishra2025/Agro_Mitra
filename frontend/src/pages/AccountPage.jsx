import { useState } from "react";
import { Eye, Leaf, Lock, LogIn, Mail, MessageSquare, Mic, Sprout, User, UserPlus } from "lucide-react";
import authFarm from "../assets/images/auth-farm-landscape.png";

const benefits = [
  {
    icon: <Sprout size={28} />,
    title: "AI Powered Advisory",
    text: "Get smart recommendations for crops, fertilizers and more.",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "24/7 AI Assistant",
    text: "Chat with our AI assistant for instant farming help.",
  },
  {
    icon: <Mic size={28} />,
    title: "Voice Assistance",
    text: "Upload or speak your queries in your own language.",
  },
];

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const FacebookIcon = () => (
  <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path
      fill="#fff"
      d="M15.33 12.71l.34-2.63h-2.5V8.4c0-.76.21-1.28 1.28-1.28h1.34V4.78c-.65-.1-1.31-.15-1.97-.15-2.01 0-3.39 1.23-3.39 3.48v1.97H8.16v2.63h2.27v6.66h2.74v-6.66h2.16z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg aria-hidden="true" className="h-7 w-7 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.54 12.79c-.02-2.18 1.78-3.23 1.86-3.28-1.02-1.49-2.6-1.69-3.15-1.71-1.33-.14-2.62.79-3.3.79-.69 0-1.73-.77-2.85-.75-1.46.02-2.82.87-3.57 2.2-1.54 2.66-.39 6.57 1.08 8.72.74 1.05 1.6 2.23 2.73 2.19 1.1-.04 1.51-.7 2.84-.7 1.32 0 1.69.7 2.84.67 1.19-.02 1.94-1.06 2.65-2.12.85-1.2 1.19-2.39 1.2-2.45-.03-.01-2.31-.88-2.33-3.56z" />
    <path d="M14.37 6.39c.6-.75 1-1.77.89-2.81-.87.04-1.95.6-2.58 1.34-.56.65-1.06 1.71-.93 2.7.98.08 2-.49 2.62-1.23z" />
  </svg>
);

const AccountPage = () => {
  const [mode, setMode] = useState("signin");
  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen bg-[#f7fbf6] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.15)] lg:grid-cols-[0.95fr_1fr]">
        <section className="relative overflow-hidden bg-emerald-50 p-8 sm:p-12 lg:p-16">
          <img
            src={authFarm}
            alt="Green agriculture field with hills"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-emerald-50/82 to-white/38" />

          <div className="relative z-10 flex min-h-full flex-col">
            <a href="/" className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-green-700">
                <Leaf size={34} />
              </span>
              <div>
                <h1 className="text-3xl font-black text-green-700">Agro-Mitra</h1>
                <p className="font-medium text-slate-600">Smart Agriculture System</p>
              </div>
            </a>

            <div className="mt-24 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100/90 px-4 py-2 text-sm font-bold text-green-800">
                <Sprout size={17} />
                Welcome to Agro-Mitra
              </div>

              <h2 className="mt-8 text-5xl font-black leading-tight text-slate-950">
                Smart Solutions for <span className="text-green-700">Better Agriculture</span>
              </h2>

              <p className="mt-7 max-w-md text-xl font-medium leading-9 text-slate-700">
                Your intelligent farming companion, providing expert crop
                advisory, AI support, voice assistance and learning resources.
              </p>

              <div className="mt-10 grid gap-7">
                {benefits.map((item) => (
                  <div key={item.title} className="flex items-center gap-5 rounded-2xl bg-white/76 p-3 shadow-sm backdrop-blur-sm">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50/85 text-emerald-700 shadow-sm">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                      <p className="mt-1 max-w-sm font-semibold leading-6 text-slate-700">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid place-items-center bg-white px-6 py-12 sm:px-10">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.10)] sm:p-10">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-950">
                {isSignIn ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="mt-3 text-lg font-medium text-slate-600">
                {isSignIn ? "Sign in to continue to your account" : "Sign up to start saving your farm data"}
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 border-b border-slate-200 text-center font-black">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`border-b-2 pb-4 transition ${
                  isSignIn ? "border-green-700 text-green-700" : "border-transparent text-slate-500"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`border-b-2 pb-4 transition ${
                  !isSignIn ? "border-green-700 text-green-700" : "border-transparent text-slate-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form className="mt-8 space-y-6">
              {!isSignIn && (
                <div>
                  <label className="text-sm font-black text-slate-800">Full Name</label>
                  <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
                    <span className="grid w-14 place-items-center bg-emerald-50 text-emerald-700">
                      <User size={20} />
                    </span>
                    <input className="min-h-14 flex-1 px-4 font-medium outline-none" placeholder="Enter your full name" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-black text-slate-800">Email Address</label>
                <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
                  <span className="grid w-14 place-items-center bg-emerald-50 text-emerald-700">
                    <Mail size={20} />
                  </span>
                  <input className="min-h-14 flex-1 px-4 font-medium outline-none" placeholder="Enter your email" />
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-800">Password</label>
                <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
                  <span className="grid w-14 place-items-center bg-emerald-50 text-emerald-700">
                    <Lock size={20} />
                  </span>
                  <input className="min-h-14 flex-1 px-4 font-medium outline-none" placeholder="Enter your password" type="password" />
                  <span className="grid w-14 place-items-center text-slate-500">
                    <Eye size={21} />
                  </span>
                </div>
              </div>

              {isSignIn && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-3 font-medium text-slate-700">
                    <input className="h-4 w-4 rounded border-slate-300" type="checkbox" />
                    Remember me
                  </label>
                  <button type="button" className="font-bold text-green-700">Forgot Password?</button>
                </div>
              )}

              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-5 py-4 text-lg font-black text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-800"
              >
                {isSignIn ? <LogIn size={24} /> : <UserPlus size={24} />}
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="my-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm font-medium text-slate-500">
              <span className="h-px bg-slate-200" />
              or continue with
              <span className="h-px bg-slate-200" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button type="button" className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-lg font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <GoogleIcon />
                Google
              </button>
              <button type="button" className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-lg font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <FacebookIcon />
                Facebook
              </button>
              <button type="button" className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-lg font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <AppleIcon />
                Apple
              </button>
            </div>

            <p className="mt-8 text-center font-medium text-slate-500">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setMode(isSignIn ? "signup" : "signin")}
                className="ml-2 font-black text-green-700"
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
