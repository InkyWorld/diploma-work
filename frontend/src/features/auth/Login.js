import API_URL from "../../config";
import { setAccessToken, setRole } from "../../redux/slices/authSlice";

const handleLogin = async function (credentials, navigate, dispatch) {
  const tokenResponse = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await tokenResponse.json();
  console.log(data);
  dispatch(setAccessToken(data.access_token));
  localStorage.setItem("refresh_token", data.refresh_token);

  const meResponse = await fetch(`${API_URL}/api/general/me`, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });
  const meData = await meResponse.json();
  console.log(meData.role);
  dispatch(setRole(meData.role));
  if (meData.role === "admin") navigate("/admin");
  else if (meData.role === "dispatcher") navigate("/dispatcher");
  else if (meData.role === "supervisor") navigate("/supervisor");
  else if (meData.role === "technician") navigate("/technician");
  else navigate("/forbidden");
};

export default handleLogin;
