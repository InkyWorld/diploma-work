import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

function ProtectedPageLayout() {
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col h-full w-full bg-white">
      <header className="bg-gray-600 text-white p-4 text-xl font-semibold flex justify-between">
        <h1 className="text-lg font-semibold">Header</h1>
        <div className="flex items-center gap-4">
          <span>👤 Ім’я користувача</span>
          <button
            className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-1 rounded"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Вийти
          </button>
        </div>
      </header>

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
