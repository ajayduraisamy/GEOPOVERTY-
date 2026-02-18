import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      className="
      w-64 bg-slate-800 dark:bg-slate-800 light:bg-gray-100
      text-white light:text-black
      hidden md:block
      min-h-screen p-4
      "
    >
      <nav className="space-y-4">

        <NavLink
          to="/dashboard"
          className="block p-2 rounded hover:bg-slate-700"
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/analyze"
          className="block p-2 rounded hover:bg-slate-700"
        >
          🛰 Analyze
        </NavLink>

        <NavLink
          to="/reports"
          className="block p-2 rounded hover:bg-slate-700"
        >
          📄 Reports
        </NavLink>

        <NavLink
          to="/profile"
          className="block p-2 rounded hover:bg-slate-700"
        >
          👤 Profile
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
