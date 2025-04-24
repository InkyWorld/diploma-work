import { Link, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { useDispatch } from "react-redux";
import Table from "../components/Table";

function Admin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <button className="bg-blue-600 text-white rounded-lg mb-4 p-2" onClick={() => navigate("/engineer")}>
        Go to engineer page
      </button>
      <Link to="tasks" className="bg-blue-600 text-white rounded-lg mb-4 p-2">
        Go to next page
      </Link>
      <div class="p-6 bg-gray-100 min-h-screen">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr class="bg-blue-600 text-white text-left">
                <th class="py-3 px-4">#</th>
                <th class="py-3 px-4">Ім’я</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Роль</th>
                <th class="py-3 px-4">Статус</th>
                <th class="py-3 px-4">Дія</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr class="border-b hover:bg-gray-50">
                <td class="py-2 px-4">1</td>
                <td class="py-2 px-4">Іван Петренко</td>
                <td class="py-2 px-4">ivan@example.com</td>
                <td class="py-2 px-4">Адміністратор</td>
                <td class="py-2 px-4">
                  <span class="px-2 py-1 text-sm rounded bg-green-100 text-green-800">Активний</span>
                </td>
                <td class="py-2 px-4 space-x-2">
                  <button class="text-blue-600 hover:underline">Редагувати</button>
                  <button class="text-red-600 hover:underline">Видалити</button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-2 px-4">2</td>
                <td class="py-2 px-4">Олена Коваленко</td>
                <td class="py-2 px-4">olena@example.com</td>
                <td class="py-2 px-4">Інженер</td>
                <td class="py-2 px-4">
                  <span class="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-800">В очікуванні</span>
                </td>
                <td class="py-2 px-4 space-x-2">
                  <button class="text-blue-600 hover:underline">Редагувати</button>
                  <button class="text-red-600 hover:underline">Видалити</button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-2 px-4">3</td>
                <td class="py-2 px-4">Андрій Сидоренко</td>
                <td class="py-2 px-4">andrii@example.com</td>
                <td class="py-2 px-4">Бригадир</td>
                <td class="py-2 px-4">
                  <span class="px-2 py-1 text-sm rounded bg-red-100 text-red-800">Заблокований</span>
                </td>
                <td class="py-2 px-4 space-x-2">
                  <button class="text-blue-600 hover:underline">Редагувати</button>
                  <button class="text-red-600 hover:underline">Видалити</button>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <Table /> */}
        </div>
      </div>
    </>
  );
}

export default Admin;
