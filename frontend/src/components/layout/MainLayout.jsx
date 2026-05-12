import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

    </div>
  );
};

export default MainLayout;
