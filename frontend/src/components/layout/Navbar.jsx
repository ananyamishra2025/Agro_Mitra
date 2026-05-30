import { Link, useLocation } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";
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
        <div className="flex items-center gap-3">

          <Link to="/contact" className="hidden rounded-xl border border-green-700 bg-white px-5 py-3 font-bold text-green-800 shadow-md transition hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-lg lg:inline-flex">
            Contact
          </Link>

          <Button onClick={() => { window.location.href = "/account"; }}>
            <span className="inline-flex items-center gap-2">
              <LogIn size={18} />
              Sign In / Sign Up
            </span>
          </Button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
