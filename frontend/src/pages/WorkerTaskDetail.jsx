import { useState } from "react";
import { useNavigate } from "react-router-dom";

const taskData = {
  id: 105,
  title: "Перевірка електросистеми",
  description: "Перевірити напругу на контактах, ізоляцію проводів та стабільність напруги при навантаженні.",
  status: "in_progress",
  assigned_at: "2025-04-22T07:45:00Z",
  due_at: "2025-04-22T12:00:00Z", // Час і дата, відведені на завдання
  completed_at: null,
};

const WorkerTaskDetail = () => {
  const navigate = useNavigate();

  const [task, setTask] = useState(taskData);

  const markAsCompleted = () => {
    // Тут буде API запит у реальному додатку
    setTask({
      ...task,
      status: "completed",
      completed_at: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Деталі завдання</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p className="text-gray-700">{task.description}</p>

        <div className="text-sm text-gray-600">
          <p>
            <strong>Статус:</strong>{" "}
            {task.status === "completed" ? "Завершено" : task.status === "in_progress" ? "Виконується" : "Очікує"}
          </p>
          <p>
            <strong>Призначено:</strong> {new Date(task.assigned_at).toLocaleString()}
          </p>
          {task.completed_at && (
            <p>
              <strong>Завершено:</strong> {new Date(task.completed_at).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Час виконання:</strong> {new Date(task.due_at).toLocaleString()}
          </p>{" "}
          {/* Виведення часу і дати виконання */}
        </div>

        {task.status !== "completed" && (
          <button
            onClick={markAsCompleted}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            ✅ Позначити як виконане
          </button>
        )}

        <button onClick={() => navigate(-1)} className="text-blue-600 underline mt-4 block">
          ← Назад до завдань
        </button>
      </div>
    </div>
  );
};

export default WorkerTaskDetail;
