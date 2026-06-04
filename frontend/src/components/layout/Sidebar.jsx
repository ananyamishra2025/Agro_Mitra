import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Sprout,
  Bot,
  Mic,
  Image,
  BookOpen,
  History,
  Flower2,
  FlaskConical,
  Settings,
  UserRound,
  Headphones,
  Circle,
} from "lucide-react";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("agroMitraUser") || "null");
  } catch {
    return null;
  }
};

const Sidebar = () => {
  const location = useLocation();
  const user = getStoredUser();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Crop Advisory",
      path: "/advisory",
      icon: <Sprout size={18} />,
    },
    {
      name: "AI Chatbot",
      path: "/chat",
      icon: <Bot size={18} />,
    },
    {
      name: "Voice Assistant",
      path: "/voice",
      icon: <Mic size={18} />,
    },
    {
      name: "Image Detection",
      path: "/upload",
      icon: <Image size={18} />,
    },
    {
      name: "Learning Resources",
      path: "/learning",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Gardening Tips",
      path: "/gardening",
      icon: <Flower2 size={18} />,
    },
    {
      name: "History",
      path: "/history",
      icon: <History size={18} />,
    },
    {
      name: "Future Scope",
      path: "/future",
      icon: <FlaskConical size={18} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserRound size={18} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-60 flex-col border-r border-green-900 bg-gradient-to-b from-green-950 via-green-900 to-emerald-950 p-5 text-white shadow-xl shadow-green-950/10 lg:flex">

      {/* LOGO */}
      <div className="mb-8 flex items-center gap-3">

        <div className="rounded-xl bg-white/12 p-2.5 ring-1 ring-white/15">
          <Sprout className="text-lime-200" />
        </div>

        <div>
          <h1 className="text-xl font-black text-white">
            Agro-Mitra
          </h1>

          <p className="text-xs font-medium text-green-100">
            Smart Farming Platform
          </p>
        </div>

      </div>

      {/* MENU */}
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-green-200/80">Menu</p>

      <nav className="flex flex-col gap-1.5">

        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-300 ${
              location.pathname === item.path
                ? "bg-white text-green-900 shadow-md"
                : "text-green-50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

      </nav>

      {/* BOTTOM INFO */}
      <div className="mt-auto space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-lime-100 font-black text-green-900">
              A
            </span>
            <div>
              <h3 className="font-black text-white">{user?.name || "Guest User"}</h3>
              <p className="text-xs font-semibold text-green-100">{user?.role || "Farmer / Student"}</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs font-bold text-lime-100">
            <Circle size={8} fill="currentColor" />
            Online
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/10 p-4">

        <div className="mb-3 flex items-center gap-2">
          <Headphones size={18} className="text-lime-200" />
          <h3 className="font-bold text-lime-100">
            Need Help?
          </h3>
        </div>

        <p className="text-xs leading-5 text-green-50">
          We are here to assist your farming workflow.
        </p>

        <Link to="/contact" className="mt-4 inline-flex rounded-lg border border-white/30 px-4 py-2 text-xs font-black text-white transition hover:bg-white hover:text-green-900">
          Contact Support
        </Link>

        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
