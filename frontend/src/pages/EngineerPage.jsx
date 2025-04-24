// function EngineerPage() {
//   return <div>EngineerPage page</div>;
// }

// export default EngineerPage;

const testData = [
  {
    id: 101,
    title: "ТО Boeing 737",
    aircraft: "Boeing 737",
    status: "pending",
    created_at: "2025-04-20",
    tasks: [
      { id: 1, description: "Перевірка шасі", duration: "2h" },
      { id: 2, description: "Огляд двигуна", duration: "3h" },
    ],
  },
  {
    id: 102,
    title: "ТО Airbus A320",
    aircraft: "Airbus A320",
    status: "in_progress",
    created_at: "2025-04-18",
    tasks: [{ id: 3, description: "Перевірка гальм", duration: "1.5h" }],
  },
  {
    id: 103,
    title: "ТО Airbus A330",
    aircraft: "Airbus A330",
    status: "in_progress",
    created_at: "2025-04-18",
    tasks: [{ id: 3, description: "Перевірка гальм", duration: "1.5h" }],
  },
];

const EngineerDashboard = () => {
  const total = testData.length;
  const pending = testData.filter((p) => p.status === "pending").length;
  const inProgress = testData.filter((p) => p.status === "in_progress").length;
  const completed = testData.filter((p) => p.status === "completed").length;

  const statusLabel = {
    pending: "Очікує",
    in_progress: "В роботі",
    completed: "Завершено",
  };

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-4">📊 Огляд технічного стану</h1>

      {/* Статистика */}
      <div className="flex flex-wrap -mx-2 mb-8">
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-blue-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">📦 Всього:</h2>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-yellow-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">⏱ Очікує:</h2>
            <p className="text-2xl font-bold">{pending}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-green-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">⚙️ В роботі:</h2>
            <p className="text-2xl font-bold">{inProgress}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
          <div className="bg-gray-100 rounded-xl p-4 shadow h-full flex justify-between items-center">
            <h2 className="text-xl font-medium whitespace-nowrap">✅ Завершено:</h2>
            <p className="text-2xl font-bold">{completed}</p>
          </div>
        </div>
      </div>

      {/* Список пакетів */}
      <h2 className="text-2xl font-bold mb-4">📋 Список пакетів</h2>
      <div className="space-y-4">
        {testData.map((pkg) => (
          <div key={pkg.id} className=" bg-blue-100 rounded-xl p-4 shadow hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-semibold">{pkg.title}</h3>
                <p className="text-sm text-gray-600">
                  Літак: {pkg.aircraft} | Створено: {pkg.created_at}
                </p>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-200">{statusLabel[pkg.status]}</span>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Завдання:</h4>
              <ul className="list-disc pl-5 text-sm">
                {pkg.tasks.map((task) => (
                  <li key={task.id}>
                    {task.description} — <span className="text-gray-500">{task.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Кнопка переходу до детального перегляду */}
            <div className="mt-4 text-right">
              <button className="text-blue-600 hover:underline text-sm">Детальніше →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineerDashboard;
