import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed inset-0 bg-black/50 z-40 md:hidden
        ${open ? "block" : "hidden"}
        `}
        onClick={() => setOpen(false)}
      />

      <div
        className={`
        fixed z-50 md:static
        transform md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300
        `}
      >
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">

        <Header onMenuClick={() => setOpen(true)} />

        <main className="flex-1 p-6 bg-slate-900 light:bg-gray-50">
          {children}
        </main>

        <Footer />

      </div>
    </div>
  );
};

export default Layout;
