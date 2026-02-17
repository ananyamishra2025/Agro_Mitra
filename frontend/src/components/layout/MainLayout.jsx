import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
