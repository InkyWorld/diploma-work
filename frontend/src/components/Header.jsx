import { FaPlane } from "react-icons/fa";
import { FiLogOut, FiSettings, FiSun } from "react-icons/fi";
import { shortWorkerName } from "../helpers/helpers";

const Header = ({ userName, userRole, onLogout }) => {
  return (
    // <header className="w-full flex items-center justify-between px-6 py-3 bg-gradient-to-br from-blue-400 via-blue-200 to-blue-400 text-white shadow-md">
    <header className="w-full flex items-center justify-between px-6 py-3 bg-gray-500 text-white shadow-md">
      {/* Ліворуч: Логотип і назва */}
      <div className="flex items-center gap-3 text-xl font-semibold">
        <FaPlane className="text-2xl" />
        <span className="hidden sm:block">AeroService</span>
      </div>

      {/* По центру: Роль */}
      {/* <div className="hidden sm:block text-sm font-medium tracking-wide text-blue-100">{userRole}</div> */}

      {/* Праворуч: Користувач та дії */}
      <div className="flex items-center gap-4">
        {/* Ініціали */}
        <div className="bg-white text-black px-2 py-0.5 rounded-4xl flex items-center justify-center font-bold shadow-inner">
          {shortWorkerName(userName)}
        </div>

        {/* Іконки: налаштування, тема */}
        {/* <button title="Налаштування">
          <FiSettings className="text-xl hover:text-blue-300 transition" />
        </button>
        <button title="Змінити тему">
          <FiSun className="text-xl hover:text-yellow-300 transition" />
        </button> */}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white font-medium transition"
        >
          <FiLogOut />
          <span className="hidden sm:block">Вийти</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
