import toast from "react-hot-toast";
import API_URL from "../../config";
import { setAccessToken, setCurrentUser, setRole } from "../../redux/slices/authSlice";

const login = async function (credentials, navigate, dispatch) {
  try {
    const tokenResponse = await fetch(`${API_URL}/api/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(credentials),
      //? ADMIN
      // body: new URLSearchParams({
      //   username: "zz@z.z",
      //   password: "zz",
      // }),
      //? SUPERVISOR
      // body: new URLSearchParams({
      //   username: "feyafe5296@deusa7.com",
      //   password: "123456",
      // }),
      //? TECHNICIAN
      // body: new URLSearchParams({
      //   username: "cobom53304@deusa7.com",
      //   password: "123456",
      // }),
      //? DISPATCHER
      // body: new URLSearchParams({
      //   username: "jigav79188@hazhab.com",
      //   password: "123456",
      // }),
      //? ENGINEER
      // body: new URLSearchParams({
      //   username: "casix84989@hazhab.com",
      //   password: "123456",
      // }),
    });
    if (!tokenResponse.ok) {
      throw new Error("Failed to fetch tokens");
    }
    const data = await tokenResponse.json();
    console.log(data);
    //TODO: 1. Access token зберігаємо в Redux
    dispatch(setAccessToken(data.access_token));
    //TODO: 2. Refresh token зберігаємо в localStorage
    localStorage.setItem("refresh_token", data.refresh_token);

    const meResponse = await fetch(`${API_URL}/api/general/me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    console.log("meResponse", meResponse);
    if (!meResponse.ok) {
      throw new Error("Failed to fetch me data");
    }

    const meData = await meResponse.json();
    console.log(meData);

    dispatch(setCurrentUser(meData));
    dispatch(setRole(meData.role));
    toast.success("Ви успішно увійшли в систему");

    if (meData.role === "admin") navigate("/admin");
    else if (meData.role === "flight dispatcher") navigate("/flight-dispatcher");
    else if (meData.role === "engineer") navigate("/engineer");
    else if (meData.role === "shift supervisor") navigate("/shift-supervisor");
    else if (meData.role === "technician") navigate("/technician");
    else navigate("/forbidden");
  } catch (error) {
    console.error("Login error:", error.message);
    toast.error("Не вдалося увійти в систему, перевірте введений пароль та email");
  }
};

export default login;
