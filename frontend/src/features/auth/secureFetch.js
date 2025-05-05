import API_URL from "../../config";
import { logout, setAccessToken } from "../../redux/slices/authSlice";
import { store } from "../../redux/store";

const secureFetch = async function (url, options = {}) {
  //TODO: Отримуємо access token із сховища Redux
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  //TODO: Додаємо access token до заголовків
  const authOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  //TODO: Виконуємо первинний запит
  let response = await fetch(url, authOptions);
  console.log(response);

  //TODO: Якщо токен недійсний (401)
  if (response.status === 401) {
    console.log("401");
    const refreshToken = localStorage.getItem("refresh_token");
    console.log(refreshToken);

    //TODO Якщо refresh token відсутній — виходимо
    if (!refreshToken) {
      console.log("refresh token відсутній");
      // store.dispatch(logout());
      return response;
    }

    console.log("start");
    //TODO Пробуємо оновити токени
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh_token`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    console.log("refreshRes", refreshRes);

    //TODO: Якщо оновлення вдалося
    if (refreshRes.ok) {
      //TODO: Отримуємо нові токени
      const data = await refreshRes.json();
      console.log("New tokens", data);

      //TODO: Зберігаємо новий access token у Redux
      store.dispatch(setAccessToken(data.access_token));

      //TODO: Зберігаємо новий refresh token у local storage
      localStorage.setItem("refresh_token", data.refresh_token);

      //TODO: Повторюємо запит з новим токеном
      const retryOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${data.access_token}`,
        },
      };
      const retryRes = await fetch(url, retryOptions);
      return retryRes;
    } else {
      //TODO: Якщо refresh не спрацював — видаляємо токен і logout
      localStorage.removeItem("refresh_token");
      store.dispatch(logout());
    }
  }
  return response;
};

export default secureFetch;
