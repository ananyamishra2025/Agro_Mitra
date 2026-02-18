import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
