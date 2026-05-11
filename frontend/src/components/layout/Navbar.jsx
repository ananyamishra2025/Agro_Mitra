import { useState } from "react";
import { isActivePath, navigateTo } from "../../utils/navigation";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Advisory", path: "/advisory" },
  { label: "Chat", path: "/chat" },
  { label: "Learning", path: "/learning" },
];

export default function Navbar({ currentPath = "/" }) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (path) => {
    navigateTo(path);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNavigate("/")}
            className="group flex items-center gap-3 text-left"
            aria-label="Go to Agro-Mitra home"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-500 text-2xl text-white shadow-lg shadow-emerald-600/25 transition group-hover:scale-105">
              🌾
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight text-slate-900">
                Agro-Mitra
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Smart farming UI
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 p-1 lg:flex">
            {navItems.map((item) => {
              const active = isActivePath(currentPath, item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-white/70 hover:text-emerald-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => handleNavigate("/dashboard")}
            className="hidden rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700 md:inline-flex"
          >
            Open app →
          </button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-slate-700 shadow-sm lg:hidden"
          >
            ☰
          </button>
        </div>

        {open && (
          <nav className="grid gap-2 pb-5 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-bold ${
                  isActivePath(currentPath, item.path)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/80 text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
