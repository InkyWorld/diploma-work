import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import Loader from "../../components/Loader";
import { setAccessToken, setCurrentUser, setRole } from "../../redux/slices/authSlice";

export default function AuthProvider({ children }) {
  console.log("AUTH PROVIDER");
  //TODO: 1. Встановлення isLoading одразу в true для правильного відпрацювання
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    //TODO: Отримання refresh_token з local storage
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("refreshroken from storage", refreshToken);

    //TODO: Якщо refresh_token немає, завершити завантаження і перейти до children(App)
    if (!refreshToken) {
      console.log("Go to children");
      setIsLoading(false);
      return;
    }
    //TODO: Оголошуємо асинхронну функцію всередині useEffect
    const fetchUsers = async () => {
      try {
        console.log("START REFRESH TOKEN");
        //TODO: Запит на оновлення токенів
        const res = await fetch(`${API_URL}/api/auth/refresh_token`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        console.log(res);
        if (!res.ok) throw new Error("Failed to refresh tokens");

        const data = await res.json();
        console.log("new tokens", data);
        //TODO: Запис access токена в Redux
        dispatch(setAccessToken(data.access_token));
        //TODO: Запис refresh токена в local storage
        localStorage.setItem("refresh_token", data.refresh_token);

        //TODO: Запит на отримання ролі користувача
        const meResponse = await fetch(`${API_URL}/api/general/me`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        console.log("meResponse", meResponse);

        if (!meResponse.ok) throw new Error("Failed to fetch me");

        const meData = await meResponse.json();
        console.log(meData);
        //TODO: Запис даних поточного користувача в Redux
        dispatch(setCurrentUser(meData));
        //TODO: Запис role в Redux
        dispatch(setRole(meData.role));
      } catch (error) {
        console.error(error);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) return <Loader />;
  return children; // Рендерити дочірні компоненти після перевірки
}

// const fakeFetch = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ message: "Успішна відповідь з фейкового бекенда" });
//     }, 3000); // 3 секунди затримки
//   });
// };

// useEffect(() => {
//   fakeFetch()
//     .then((response) => {
//       console.log(response);
//     })
//     .finally(() => {
//       setIsLoading(false);
//     });
// }, []);
