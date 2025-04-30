import { useDispatch } from "react-redux";
import handleLogin from "../features/auth/Login";
import { Link, useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <form className="w-full max-w-96 mx-auto  mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Вхід в систему</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Логін (Email)</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Введіть email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Введіть пароль"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        onClick={(e) => {
          e.preventDefault();
          handleLogin({ login: "admin@example.com", password: "admin" }, navigate, dispatch);
        }}
      >
        Увійти
      </button>
    </form>
  );
}

export default LoginPage;
