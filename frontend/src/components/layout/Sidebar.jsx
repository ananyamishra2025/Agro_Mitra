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
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

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
  ];

  return (
    <aside className="hidden lg:flex min-h-screen w-60 flex-col border-r border-green-100 bg-green-900 p-4 text-white shadow-xl shadow-green-950/10">

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
      <div className="mt-auto rounded-xl border border-white/10 bg-white/10 p-4">

        <h3 className="mb-2 font-bold text-lime-100">
          Agro-Mitra AI
        </h3>

        <p className="text-xs leading-5 text-green-50">
          AI-powered agriculture assistance platform
          for farmers, gardeners, and students.
        </p>

      </div>

    </aside>
  );
};

export default Sidebar;
