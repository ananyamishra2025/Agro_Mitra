import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f5fff5] to-[#eef7ee]">

      {/* TOP RIGHT GLOW */}
      <div className="fixed top-0 right-0 h-[500px] w-[500px] rounded-full bg-green-200/20 blur-3xl"></div>

      {/* BOTTOM LEFT GLOW */}
      <div className="fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-lime-200/20 blur-3xl"></div>

      {/* NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="relative z-10 flex-1 px-8 py-10">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;
