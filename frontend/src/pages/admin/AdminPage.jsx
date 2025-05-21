import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import TableHeaderCell from "../../components/TableHeaderCell";
import AdminTableRow from "../../features/admin/AdminTableRow";
import getAllUsers from "../../services/admin/getAllUsers";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../components/ErrorMessage";
import { useEffect, useState } from "react";
import AdminPageFilters, { applyAdminFilters } from "../../features/admin/AdminPageFilters";

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({ filter: searchParams.get("filter") || "all" });

  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  function handleChangeFilter(newFilter) {
    setQueryParams({ filter: newFilter });
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    retry: false, // 🔥 ВАЖЛИВО
  });

  if (isError) return <ErrorMessage message={error.message} onRetry={refetch} />;
  if (isLoading || !data) return <Loader />;

  const filteredData = applyAdminFilters(data, queryParams.filter);
  // console.log("filtered users", filteredData);
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Заголовок + кнопка */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Адмін-Панель</h1>
          <p className="text-gray-600 mt-2">Керування користувачами та статистика</p>
        </div>

        <Link
          to="users/create"
          // to="tasks"
          className="flex items-center self-center bg-blue-500 hover:bg-blue-700 text-white font-semibold text-md px-6 py-3 rounded-xl shadow-md transition"
        >
          ➕ Додати нового користувача
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Всі", count: data.length },
          { label: "Адміністратори", count: data.filter((u) => u.role === "admin").length },
          { label: "Інженери", count: data.filter((u) => u.role === "engineer").length },
          { label: "Техніки", count: data.filter((u) => u.role === "technician").length },
          { label: "Бригадири", count: data.filter((u) => u.role === "shift supervisor").length },
          { label: "Диспетчери", count: data.filter((u) => u.role === "flight dispatcher").length },
        ].map((item) => (
          <div key={item.label} className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center">
            <p className="text-gray-500 text-xs text-center">{item.label}</p>
            <h2 className="text-lg font-bold mt-1">{item.count}</h2>
          </div>
        ))}
      </div>

      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Пошук за ім'ям або email..."
          className="w-full md:w-1/3 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
      {/* Фільтрація */}
      <AdminPageFilters currentFilter={queryParams.filter} setFilter={handleChangeFilter} />

      {/* Таблиця користувачів */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <TableHeaderCell>Фото</TableHeaderCell>
              <TableHeaderCell>Ім'я</TableHeaderCell>
              <TableHeaderCell>Роль</TableHeaderCell>
              <TableHeaderCell styles="hidden md:table-cell">Email</TableHeaderCell>
              <TableHeaderCell styles="hidden lg:table-cell">Вік</TableHeaderCell>
              <TableHeaderCell styles="hidden lg:table-cell">Стать</TableHeaderCell>
              <TableHeaderCell>Дії</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <AdminTableRow key={user.email} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// додати функціонал invalidateQueries коли помилка 401(unauthorized)
