export default function Navbar() {
  return (
    <nav className="bg-[#071025] p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-white">Agro-Mitra</div>
        <div className="space-x-3">
          <a className="text-sm text-gray-300 hover:text-white" href="#">Home</a>
          <a className="text-sm text-gray-300 hover:text-white" href="#">Demo</a>
          <a className="text-sm text-gray-300 hover:text-white" href="#">Docs</a>
        </div>
      </div>
    </nav>
  );
}
