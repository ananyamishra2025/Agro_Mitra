// frontend/src/components/Navbar.jsx
export default function Navbar() {
  return (
    <header className="bg-[#071025] border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* left: brand */}
          <div className="flex items-center">
            <a href="#" className="text-lg font-bold text-white no-underline">Agro-Mitra</a>
          </div>

          {/* right: links (hidden on small screens) */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-300 hover:text-white">Home</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">Demo</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">Docs</a>
          </nav>

          {/* mobile button */}
          <div className="md:hidden">
            <button aria-label="menu" className="text-gray-300 hover:text-white bg-white/10 px-2 py-1 rounded">☰</button>
          </div>
        </div>
      </div>
    </header>
  );
}
