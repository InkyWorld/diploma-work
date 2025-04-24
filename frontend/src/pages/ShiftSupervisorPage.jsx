const testData = {
  date: "2025-04-21",
  workers: [
    {
      id: 1,
      name: "Іван Коваленко",
      shift: "morning",
      active: true,
      completed_tasks_today: 3,
      completed_tasks_week: 9,
    },
    {
      id: 2,
      name: "Олег Сніжко",
      shift: "night",
      active: true,
      completed_tasks_today: 1,
      completed_tasks_week: 4,
    },
    {
      id: 3,
      name: "Катерина Дніпрова",
      shift: "evening",
      active: false,
      completed_tasks_today: 0,
      completed_tasks_week: 0,
    },
  ],
  tasks: [
    {
      id: 101,
      title: "Огляд гідравлічної системи",
      status: "completed",
      assigned_to: 1,
      assigned_at: "2025-04-21T08:30:00Z",
      completed_at: "2025-04-21T10:00:00Z",
    },
    {
      id: 102,
      title: "Заміна фільтра масла",
      status: "in_progress",
      assigned_to: 2,
      assigned_at: "2025-04-21T09:00:00Z",
      completed_at: null,
    },
    {
      id: 103,
      title: "Тест акумуляторної системи",
      status: "pending",
      assigned_to: null,
      assigned_at: null,
      completed_at: null,
    },
  ],
};

const ForemanDashboard = () => {
  const activeWorkers = testData.workers.filter((w) => w.active);
  const currentTasks = testData.tasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const completedTasks = testData.tasks.filter((t) => t.status === "completed");

  const progress = testData.tasks.length > 0 ? Math.round((completedTasks.length / testData.tasks.length) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👷 Панель бригадира</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <p className="text-lg font-semibold">👷 Активні працівники</p>
          <p className="text-2xl">{activeWorkers.length}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <p className="text-lg font-semibold">📝 Поточні завдання</p>
          <p className="text-2xl">{currentTasks.length}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <p className="text-lg font-semibold">📈 Прогрес виконання</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm mt-1">{progress}% виконано</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition">
          ➕ Призначити завдання
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition">
          👥 Список працівників
        </button>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Список працівників</h2>
        <table className="min-w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Ім’я</th>
              <th className="p-3 border-b">Зміна</th>
              <th className="p-3 border-b">Активний</th>
              <th className="p-3 border-b">Завдань сьогодні</th>
              <th className="p-3 border-b">Завдань за тиждень</th>
            </tr>
          </thead>
          <tbody>
            {testData.workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{worker.name}</td>
                <td className="p-3 border-b capitalize">{worker.shift}</td>
                <td className="p-3 border-b">
                  {worker.active ? (
                    <span className="text-green-600 font-semibold">Так</span>
                  ) : (
                    <span className="text-red-500">Ні</span>
                  )}
                </td>
                <td className="p-3 border-b">{worker.completed_tasks_today}</td>
                <td className="p-3 border-b">{worker.completed_tasks_week}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForemanDashboard;
