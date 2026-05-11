import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children, currentPath }) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-8 top-28 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-amber-100 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-lime-100 blur-3xl" />
      </div>
      <Navbar currentPath={currentPath} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
