const worker = {
  id: 1,
  name: "Іван Коваленко",
  shift: "morning",
  tasks: [
    {
      id: 101,
      title: "Огляд гідравлічної системи",
      status: "completed",
      assigned_at: "2025-04-21T08:30:00Z",
      completed_at: "2025-04-21T10:00:00Z",
    },
    {
      id: 104,
      title: "Перевірка тиску шин",
      status: "completed",
      assigned_at: "2025-04-21T10:30:00Z",
      completed_at: "2025-04-21T11:00:00Z",
    },
    {
      id: 105,
      title: "Перевірка електросистеми",
      status: "in_progress",
      assigned_at: "2025-04-22T07:45:00Z",
      completed_at: null,
    },
    {
      id: 106,
      title: "Читання параметрів системи навігації",
      status: "pending",
      assigned_at: "2025-04-22T08:10:00Z",
      completed_at: null,
    },
  ],
};

const WorkerDashboard = () => {
  const activeTasks = worker.tasks.filter((task) => task.status !== "completed");
  const completedTasks = worker.tasks.filter((task) => task.status === "completed");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👷 Вітаємо, {worker.name}!</h1>
      <p className="text-gray-600 mb-6">Зміна: {worker.shift}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">🕓 Активні завдання</h2>
        {activeTasks.length === 0 ? (
          <p className="text-gray-500">Немає активних завдань.</p>
        ) : (
          <ul className="space-y-4">
            {activeTasks.map((task) => (
              <li key={task.id} className="p-4 bg-white rounded-xl shadow flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">Призначено: {new Date(task.assigned_at).toLocaleString()}</p>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  {task.status === "in_progress" ? "Виконується" : "Очікує"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">✅ Завершені завдання</h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-500">Немає завершених завдань.</p>
        ) : (
          <ul className="space-y-4">
            {completedTasks.map((task) => (
              <li key={task.id} className="p-4 bg-gray-100 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">Завершено: {new Date(task.completed_at).toLocaleString()}</p>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-green-200 text-green-800">Завершено</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default WorkerDashboard;
