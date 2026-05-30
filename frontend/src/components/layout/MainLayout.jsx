import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fbf6] text-slate-900">
      <Navbar />

      <div className="flex">
        <Sidebar />
        <main className="relative z-10 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
