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
    <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-white border-r border-green-100 shadow-sm p-6">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">

        <div className="bg-green-100 p-3 rounded-2xl">
          <Sprout className="text-green-700" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-green-700">
            Agro-Mitra
          </h1>

          <p className="text-sm text-gray-500">
            Smart Farming Platform
          </p>
        </div>

      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2">

        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition duration-300 font-medium ${
              location.pathname === item.path
                ? "bg-green-700 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

      </nav>

      {/* BOTTOM INFO */}
      <div className="mt-auto bg-green-50 rounded-2xl p-5 border border-green-100">

        <h3 className="font-semibold text-green-700 mb-2">
          Agro-Mitra AI
        </h3>

        <p className="text-sm text-gray-600">
          AI-powered agriculture assistance platform
          for farmers, gardeners, and students.
        </p>

      </div>

    </aside>
  );
};

export default Sidebar;