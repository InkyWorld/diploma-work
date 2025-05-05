import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  console.log("RequireAuth check");
  const accessToken = useSelector((state) => state.auth.accessToken);
  const role = useSelector((state) => state.auth.role);
  console.log(accessToken, role);

  if (!accessToken) {
    console.log("redirect to login");
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    // ❌ Роль не дозволена — перенаправити на forbidden
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <>
      {console.log("OUTLET")}
      <div className="fixed top-0 bg-red-400">Protected route</div>
      <Outlet />
    </>
  );
}

export default RequireAuth;
