import ThemeToggle from "../ui/ThemeToggle";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="
      h-16 bg-slate-900 dark:bg-slate-900 light:bg-white
      flex items-center justify-between px-6 shadow
    ">

      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-blue-400">
          GEOPOVERTY AI
        </h1>

      </div>

      <div className="flex items-center gap-4">

        <ThemeToggle />

        <button
          className="px-3 py-1 bg-red-500 rounded text-sm"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Header;
