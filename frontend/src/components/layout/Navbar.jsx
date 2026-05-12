import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Advisory", path: "/advisory" },
    { name: "AI Chat", path: "/chat" },
    { name: "Voice", path: "/voice" },
    { name: "Learning", path: "/learning" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="bg-green-100 p-2 rounded-xl">
            <Leaf className="text-green-700" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-green-700">
              Agro-Mitra
            </h1>

            <p className="text-xs text-gray-500">
              Smart Agriculture System
            </p>
          </div>
        </Link>

        {/* CENTER NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">

          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`font-medium transition duration-300 hover:text-green-700 ${
                location.pathname === link.path
                  ? "text-green-700"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          <Button variant="secondary">
            Demo
          </Button>

          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
            A
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;