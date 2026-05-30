import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 rounded-2xl border border-emerald-100 bg-green-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.7fr_1fr]">
        <div>
          <h2 className="text-2xl font-black">Agro-Mitra</h2>
          <p className="mt-3 max-w-md text-sm font-medium leading-6 text-green-50">
            A smart agriculture assistance platform for crop advisory, AI help,
            learning resources, and farm decision support.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-semibold text-green-50">
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-lime-200" />
              +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-lime-200" />
              support@agromitra.in
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-lime-200" />
              Kolkata, West Bengal, India
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-black text-lime-100">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-green-50">
            <a href="/dashboard">Dashboard</a>
            <a href="/advisory">Crop Advisory</a>
            <a href="/learning">Learning Resources</a>
          </div>
        </div>

        <div>
          <h3 className="font-black text-lime-100">Support</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-green-50">
            <a href="/contact">Contact</a>
            <a href="/account">Sign In</a>
            <a href="/account">Register</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-sm font-semibold text-green-100">
        © {new Date().getFullYear()} Agro-Mitra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
