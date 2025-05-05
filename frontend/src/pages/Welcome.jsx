import { Link } from "react-router-dom";

export default function Welcome() {
  const isAuthenticated = true;
  const userName = "admin";
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 via-blue-900 to-gray-900 flex items-center justify-center text-white">
      <div className="max-w-4xl w-full p-10 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-5xl font-bold mb-6 text-center">Aircraft Maintenance Control System</h1>
        <p className="text-lg text-gray-200 mb-8 text-center">
          Welcome to the centralized platform for managing aircraft maintenance operations. Streamline inspections,
          assign repair tasks, and monitor progress — all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h2 className="text-xl font-semibold mb-2">🧰 Maintenance Tasks</h2>
            <p className="text-gray-300">View and assign detailed service packages to engineers and workers.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h2 className="text-xl font-semibold mb-2">📅 Flight Scheduling</h2>
            <p className="text-gray-300">Monitor upcoming flights and ensure maintenance readiness before departure.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h2 className="text-xl font-semibold mb-2">👷 Role Management</h2>
            <p className="text-gray-300">Manage access for supervisors, engineers, and dispatchers.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition">
            <h2 className="text-xl font-semibold mb-2">📊 Reports & Logs</h2>
            <p className="text-gray-300">Generate performance reports and maintenance history logs.</p>
          </div>
        </div>

        {/* Авторизаційна частина */}
        <div className="bg-white/10 p-6 rounded-xl mt-8 text-center space-y-4">
          {isAuthenticated ? (
            <>
              <p className="text-gray-200">
                Ви увійшли як <span className="font-semibold text-white">ааааа</span>
              </p>
              <div className="flex justify-center flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Перейти до кабінету
                </Link>
                <button className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                  Вийти
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center flex-wrap gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Вхід
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    //   <div className="text-center px-6 py-12">
    //     {/* Логотип/Назва системи */}
    //     <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
    //       Ласкаво просимо до <span className="text-blue-600">Системи Технічного Обслуговування Літаків</span>
    //     </h1>

    //     {/* Опис системи */}
    //     <p className="text-lg text-gray-600 mb-8">
    //       Ця система призначена для ефективного управління технічним обслуговуванням літаків. У нас є все для того, щоб
    //       кожен користувач міг виконувати свої обов'язки в межах своєї ролі.
    //     </p>

    //     {/* Зображення фон */}
    //     {/* <div className="mb-6">
    //       <img
    //         src="https://skyavia.com.ua/small/right_68_tehnicheskoe-obsluzhivanie.jpg"
    //         alt="Airplane"
    //         className="w-full h-64 object-cover rounded-lg shadow-lg"
    //       />
    //     </div> */}

    //     {/* Кнопки для входу/реєстрації */}
    //     <div className="space-x-4">
    //       <a
    //         to="/login"
    //         className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
    //       >
    //         Вхід
    //       </a>
    //       <a
    //         to="/register"
    //         className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
    //       >
    //         Реєстрація
    //       </a>
    //     </div>
    //   </div>
    // </div>
  );
}

// const user = {
//   role: "admin",
// };
// const isAuthenticated = true;
// return (
//   <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
//     <div className="text-center px-6 py-12 bg-white rounded-3xl shadow-xl max-w-3xl w-full space-y-8">
//       {/* Назва системи */}
//       <h1 className="text-4xl font-extrabold text-gray-800">
//         Ласкаво просимо до <span className="text-blue-600">Системи Технічного Обслуговування Літаків</span>
//       </h1>

//       {/* Короткий опис */}
//       <p className="text-lg text-gray-600">
//         Наша система забезпечує контроль і підтримку всіх етапів технічного обслуговування літаків.
//       </p>

//       {/* Зображення */}
//       <div>
//         <img
//           src="https://skyavia.com.ua/small/right_68_tehnicheskoe-obsluzhivanie.jpg"
//           alt="Airplane Maintenance"
//           className="w-full h-64 object-cover rounded-xl shadow-lg"
//         />
//       </div>

//       {/* Авторизаційна частина */}
//       <div className="space-y-4">
//         {isAuthenticated ? (
//           <>
//             <p className="text-gray-700">
//               Ви увійшли як <span className="font-semibold">{user?.role}</span>
//             </p>
//             <div className="flex justify-center flex-wrap gap-4">
//               <Link
//                 to={`/${user?.role}`}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//               >
//                 Перейти до кабінету
//               </Link>
//               <button
//                 onClick={() => {}}
//                 className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
//               >
//                 Вийти
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex justify-center flex-wrap gap-4">
//             <Link
//               to="/login"
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//             >
//               Вхід
//             </Link>
//             <Link
//               to="/register"
//               className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
//             >
//               Реєстрація
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
