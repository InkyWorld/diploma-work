import { useState } from "react";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import getTasks from "../services/technician/getTasks";

const initialTasks = [
  {
    event_performance_number_identifier: 8147028,
    event_code: "8147028",
    event_display_description: "BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
    status: "N",
    completed: false,
  },
  {
    event_performance_number_identifier: 8147029,
    event_code: "8147029",
    event_display_description: "AFTER ARRIVAL CHECK CABIN FOR LOST ITEMS.",
    status: "N",
    completed: false,
  },
];

export default function WorkerTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"], //! Додати унікальне значення
    queryFn: getTasks,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 5, // 10 хвилин у кеші
  });

  if (isLoading) return <Loader />;
  console.log("my tasks", data);

  const handleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.event_performance_number_identifier === id ? { ...task, completed: true } : task))
    );
  };

  const currentDate = new Date().toLocaleDateString("uk-UA");
  const currentTime = new Date().toLocaleTimeString("uk-UA");
  const totalTasks = tasks.length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Вітаємо, Іван!</h1>
          <p className="text-gray-600">
            Дата: {currentDate}, {currentTime}
          </p>
          <p className="text-sm text-gray-500">Зміна: Ранкова</p>
        </div>
      </div>

      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg font-medium">
          Сьогодні у вас <strong>{totalTasks}</strong> завдань.
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Виконуйте завдання згідно з інструкціями та дотримуйтесь техніки безпеки.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Завдання</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.event_performance_number_identifier}
              className={`border rounded-xl p-4 shadow-sm transition ${task.completed ? "bg-green-50" : "bg-white"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{task.event_code}</h3>
                <span className={`text-sm font-medium ${task.completed ? "text-green-600" : "text-orange-600"}`}>
                  {task.completed ? "✅ Виконано" : "⏳ Очікує"}
                </span>
              </div>
              <p className="mb-3 text-gray-800">{task.event_display_description}</p>
              <button
                onClick={() => handleComplete(task.event_performance_number_identifier)}
                disabled={task.completed}
                className={`px-4 py-2 rounded font-medium ${
                  task.completed
                    ? "bg-green-300 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {task.completed ? "Виконано" : "Позначити як виконано"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
