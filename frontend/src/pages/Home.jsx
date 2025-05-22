import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaPlane, FaTools, FaClipboardCheck } from "react-icons/fa";
import { GiMechanicGarage } from "react-icons/gi";
import { BiSolidLock } from "react-icons/bi";
import { formatRolePath, translateRole } from "../helpers/helpers";

function Home() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.currentUser);
  // console.log("Home", user);

  const handleActionClick = () => {
    if (user) {
      navigate(`/${formatRolePath(user.role)}`);
    } else {
      navigate("/login");
    }
  };

  // bg-radial from-blue-100 to-blue-300

  return (
    <div className="relative bg-[url('https://www.publicdomainpictures.net/pictures/370000/nahled/himmel-wolken-wetter-hintergrund-1601102999r1t.jpg')] bg-cover bg-center p-4 lg:p-8 h-full md:flex md:items-center md:justify-center overflow-y-auto">
      <div className="bg-white/70 rounded-lg p-4 mx-auto space-y-4">
        {/* Вступний блок */}
        <div className="p-4 rounded-2xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Ласкаво просимо до системи управління авіаційним обслуговуванням
          </h2>
          <p className="text-gray-700 text-md sm:text-lg">
            Наша система призначена для централізованого керування процесами технічного обслуговування літаків. Вона
            надає зручні інструменти для планування робіт, контролю виконання завдань, призначення персоналу, ведення
            електронної документації та моніторингу технічного стану авіаційної техніки. Завдяки інтуїтивному інтерфейсу
            та ролям користувачів, платформа забезпечує ефективну взаємодію між адміністраторами, інженерами,
            керівниками змін та виконавцями робіт.
          </p>
        </div>

        {/* Блоки переваг */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          <div className=" bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-black mb-2">🚀 Оптимізація роботи</h4>
            <p className="text-gray-700 mb-2">Зменшення часу на виконання завдань.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Автоматизація процесів</li>
              <li>Швидкий пошук</li>
              <li>Зручний інтерфейс</li>
            </ul>
          </div>

          <div className="bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-black mb-2">⏱ Контроль часу</h4>
            <p className="text-gray-700 mb-2">Відстеження виконання в реальному часі.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Планування</li>
              <li>Таймлайн завдань</li>
              <li>Нагадування</li>
            </ul>
          </div>

          <div className="hidden lg:block bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-black mb-2">✅ Управління процесами</h4>
            <p className="text-gray-700 mb-2">Координація робіт усіх учасників.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Ролі та доступи</li>
              <li>Централізовані дані</li>
              <li>Контроль статусів</li>
            </ul>
          </div>
        </div>

        {/* Авторизаційний блок */}
        <div className="rounded-2xl text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-2">
            {user ? (
              <span>
                🔓 Ви увійшли як: <span className="italic">{translateRole(user.role)}</span>
              </span>
            ) : (
              "🔒 Ви не увійшли у систему"
            )}
          </h1>
          <p className="text-gray-800 mb-4">
            {user
              ? `Вітаємо у системі ${user.full_name}, перейдіть до вашої панелі щоб розпочати роботу.`
              : "Для доступу до функцій системи увійдіть у свій обліковий запис."}
          </p>
          <button
            onClick={handleActionClick}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            {user ? "Перейти до панелі" : "Увійти"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
