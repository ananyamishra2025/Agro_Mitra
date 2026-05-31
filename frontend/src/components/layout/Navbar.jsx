import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Leaf, LogIn, Moon, Search, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../common/Button";

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const notifications = [
    "Crop advisory report is ready",
    "Weather changed in your area",
    "New learning resource added",
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-20 items-center justify-between gap-5 px-5 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="rounded-2xl bg-green-100 p-2.5">
            <Leaf className="text-green-700" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-green-700">
              Agro-Mitra
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Smart Agriculture System
            </p>
          </div>
        </Link>

        <div className="hidden flex-1 justify-center lg:flex">
          <label className="flex h-12 w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <Search size={18} className="text-slate-500" />
            <input className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Search anything..." />
            <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500">Ctrl + K</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`hidden rounded-xl px-4 py-2 text-sm font-black transition md:inline-flex ${
              location.pathname === "/" ? "bg-emerald-50 text-green-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>

          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowNotifications((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Bell size={19} />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-14 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
                <h3 className="font-black text-slate-950">Notifications</h3>
                <div className="mt-3 grid gap-2">
                  {notifications.map((item) => (
                    <div key={item} className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
                <Link to="/notifications" className="mt-3 inline-flex text-sm font-black text-emerald-700">
                  View notification center →
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setDarkMode((value) => !value)}
            className="hidden h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:grid"
            aria-label="Toggle light and dark mode"
          >
            {darkMode ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <Link to="/contact" className="hidden rounded-xl border border-green-700 bg-white px-5 py-3 font-bold text-green-800 shadow-md transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-lg xl:inline-flex">
            Contact
          </Link>

          <Button onClick={() => { window.location.href = "/account"; }}>
            <span className="inline-flex items-center gap-2">
              <LogIn size={18} />
              Sign In / Sign Up
            </span>
          </Button>

          <Link to="/profile" className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.06)] 2xl:flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <UserRound size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900">Ananya Mishra</p>
              <p className="text-xs font-medium text-slate-500">Farmer</p>
            </div>
            <ChevronDown size={18} className="text-slate-500" />
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
