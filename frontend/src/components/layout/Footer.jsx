const Footer = () => {
  return (
    <footer className="mt-16 border-t border-emerald-100/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-700">
          © {new Date().getFullYear()} Agro-Mitra. Designed for smarter, friendlier agriculture decisions.
        </p>
        <div className="flex flex-wrap gap-3 font-bold text-emerald-700">
          <span>AI Advisory</span>
          <span>•</span>
          <span>Voice Help</span>
          <span>•</span>
          <span>Crop Learning</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;