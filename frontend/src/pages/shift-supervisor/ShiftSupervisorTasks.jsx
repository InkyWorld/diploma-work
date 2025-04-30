const todayTasks = [
  {
    id: 101,
    title: "Перевірка гальмівної системи",
    aircraft: "UR-ABC",
    time: "09:00",
    duration: 2.5,
  },
  {
    id: 102,
    title: "Огляд двигуна",
    aircraft: "UR-DEF",
    time: "11:00",
    duration: 3,
  },
  // ...
];

function ShiftSupervisorTasks() {
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

      <div className="bg-white shadow p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">🗓️ Завдання на сьогодні</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayTasks.map((task) => (
            <div key={task.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <p className="text-lg font-semibold mb-2">{task.title}</p>
              <p className="text-sm text-gray-600 mb-1">✈️ Літак: {task.aircraft}</p>
              <p className="text-sm text-gray-600 mb-1">🕒 Час: {task.time}</p>
              <p className="text-sm text-gray-600 mb-2">⚙️ Тривалість: {task.duration} год</p>
              <button
                onClick={() => navigate(`/foreman/assign/${task.id}`)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                ➕ Призначити завдання
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShiftSupervisorTasks;
