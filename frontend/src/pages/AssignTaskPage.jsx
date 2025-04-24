import React, { useState } from "react";

const initialWorkers = [
  {
    id: 1,
    name: "Іван Коваленко",
    shift: "morning",
    active: true,
    completed_tasks_today: 3,
    completed_tasks_week: 9,
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
    ],
  },
  {
    id: 2,
    name: "Олег Сніжко",
    shift: "night",
    active: true,
    completed_tasks_today: 1,
    completed_tasks_week: 4,
    tasks: [
      {
        id: 102,
        title: "Заміна фільтра масла",
        status: "in_progress",
        assigned_at: "2025-04-21T09:00:00Z",
        completed_at: null,
      },
    ],
  },
  {
    id: 3,
    name: "Катерина Дніпрова",
    shift: "evening",
    active: false,
    completed_tasks_today: 0,
    completed_tasks_week: 0,
    tasks: [],
  },
];

const AssignTaskPage = () => {
  const [workers, setWorkers] = useState(initialWorkers);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const handleAssignTask = () => {
    if (!taskTitle || !selectedWorkerId) {
      alert("Заповніть всі поля");
      return;
    }

    const newTask = {
      id: Date.now(), // тимчасовий ID
      title: taskTitle,
      status: "pending",
      assigned_at: new Date().toISOString(),
      completed_at: null,
    };

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === parseInt(selectedWorkerId) ? { ...worker, tasks: [...worker.tasks, newTask] } : worker
      )
    );

    alert(`Завдання "${taskTitle}" призначено!`);
    setTaskTitle("");
    setSelectedWorkerId("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 Призначити нове завдання</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <div className="mb-4">
          <label className="block font-medium mb-1">Назва завдання</label>
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            type="text"
            placeholder="Наприклад: Перевірка шасі"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Оберіть працівника</label>
          <select
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Оберіть --</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name} ({worker.shift}) {worker.active ? "🟢" : "🔴"}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssignTask}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ✅ Призначити
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">👷 Список працівників та їхні завдання</h2>

      <div className="space-y-6">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-gray-100 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold">{worker.name}</h3>
                <p className="text-sm text-gray-600">
                  Зміна: {worker.shift} | Статус: {worker.active ? "🟢 Активний" : "🔴 Неактивний"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Сьогодні виконано: {worker.completed_tasks_today} <br />
                За тиждень: {worker.completed_tasks_week}
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-700">
                  <th className="py-1">#</th>
                  <th>Назва</th>
                  <th>Статус</th>
                  <th>Призначено</th>
                  <th>Завершено</th>
                </tr>
              </thead>
              <tbody>
                {worker.tasks.map((task, i) => (
                  <tr key={task.id} className="border-t border-gray-300">
                    <td className="py-1">{i + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.status === "completed" ? "✅" : task.status === "in_progress" ? "🔧" : "🕓"}</td>
                    <td>{new Date(task.assigned_at).toLocaleString()}</td>
                    <td>{task.completed_at ? new Date(task.completed_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {worker.tasks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-2 text-center text-gray-500">
                      Завдань немає
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignTaskPage;
