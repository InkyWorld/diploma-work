import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import Header from "../components/Header";

function ProtectedPageLayout() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  console.log("ProtectedPageLayout", currentUser);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem("refresh_token");
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <Header userName={currentUser.full_name} userRole={currentUser.role} onLogout={handleLogout} />
      {/* <header className="bg-gray-600 text-white p-4 text-xl font-semibold flex justify-between">
        <h1 className="text-lg font-semibold">Header</h1>
        <div className="flex items-center gap-4">
          <span>👤 Ім’я користувача</span>
          <button className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-1 rounded" onClick={() => handleLogout()}>
            Вийти
          </button>
        </div>
      </header> */}

      <div className="flex flex-1 overflow-hidden">
        {/* <aside className="w-32 bg-white shadow-md p-4 overflow-y-auto md:w-64">
            <h2 className="text-lg font-bold mb-4">Sidebar</h2>
            <ul className="space-y-2">
              <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-500 cursor-pointer">Tasks</li>
              <li className="hover:text-blue-500 cursor-pointer">Reports</li>
              <li className="hover:text-blue-500 cursor-pointer">Settings</li>
            </ul>
          </aside> */}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProtectedPageLayout;
