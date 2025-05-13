import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaPlane, FaTools, FaClipboardCheck } from "react-icons/fa";
import { GiMechanicGarage } from "react-icons/gi";
import { BiSolidLock } from "react-icons/bi";
import Header from "../components/Header";

function Home() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.currentUser);
  // const user = null;
  console.log("Home", user);

  const handleActionClick = () => {
    if (user) {
      navigate("/admin"); // або /engineer, /supervisor залежно від ролі
    } else {
      navigate("/login");
    }
  };

  // bg-radial from-blue-100 to-blue-300

  return (
    // <div className="min-h-screen bg-white p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
    <div className="h-screen bg-white p-4 sm:p-8 lg:flex lg:items-center lg:justify-center overflow-y-scroll">
      <div className="mx-auto space-y-6">
        {/* Вступний блок */}
        <div className="rounded-2xl px-6 text-center">
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
          <div className=" bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-black mb-2">🚀 Оптимізація роботи</h4>
            <p className="text-gray-700 mb-2">Зменшення часу на виконання завдань.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Автоматизація процесів</li>
              <li>Швидкий пошук</li>
              <li>Зручний інтерфейс</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-black mb-2">⏱ Контроль часу</h4>
            <p className="text-gray-700 mb-2">Відстеження виконання в реальному часі.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Планування</li>
              <li>Таймлайн завдань</li>
              <li>Нагадування</li>
            </ul>
          </div>

          <div className="hidden lg:block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
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
        <div className="rounded-2xl p-4 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-black mb-2">
            {user ? <span>🔓 Ви увійшли як: {user.role}</span> : "🔒 Ви не увійшли у систему"}
          </h1>
          <p className="text-gray-800 mb-4">
            {user
              ? "Вітаємо у системі XYZ, перейдіть до вашої панелі щоб розпочати роботу."
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

{
  /* Header */
}
{
  /* <header className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white shadow-md">
        <div className="flex items-center gap-2 text-xl font-bold">
          <FaPlane className="text-2xl" />
          AeroService
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-inner">
              {user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <button
              onClick={() => {
                // Викликайте logout-функцію тут
                // localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white flex items-center gap-1"
            >
              Вийти
            </button>
          </div>
        )}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Увійти
          </button>
        )}
      </header> */
}
{
  /* <Header
        userName="Андрій Андрійович Сидоренко"
        userRole="admin"
        onLogout={() => console.log("Logout triggered")}
      /> */
}

{
  /* Welcome / Auth Info Card */
}

{
  /* <div className="w-full max-w-4xl mb-6 text-sm text-gray-700 flex justify-between items-center border border-blue-100 bg-white rounded-lg px-4 py-2 shadow-sm">
          <span>
            {user ? (
              <>
                🔓 Ви увійшли як: <strong>{user.role}</strong>
              </>
            ) : (
              <>🔒 Ви не увійшли у систему</>
            )}
          </span>
          <button onClick={handleActionClick} className="text-blue-700 hover:underline font-medium">
            {user ? "Перейти до панелі" : "Увійти"}
          </button>
        </div> */
}
