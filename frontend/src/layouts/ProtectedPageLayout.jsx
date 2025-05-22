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

      {/* <div className="flex flex-1 overflow-hidden"> */}

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      {/* </div> */}
    </div>
  );
}

export default ProtectedPageLayout;
