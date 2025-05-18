import { useState } from "react";

const testData = [
  {
    aircraft_code: "PSK",
    event_code: "024147-000",
    work_package_number_identifier: 74839,
    work_package_number: "PSK/L-310521-2",
    event_performance_number_identifier: 3505772,
    event_display_description: "REPLACE 024147-000/09052002152B8/W3505772 (AIRCRAFT BATTERY)",
    estimated_man_hours: 0,
    status: "N",
    completed: 1,
  },
];

export default function CompletedTasksSection({ shiftType, date }) {
  const [completedTasks, setCompletedTasks] = useState(testData);

  // useEffect(() => {
  //   getCompletedTasks(shiftType, date).then(setCompletedTasks);
  // }, [shiftType, date]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">✅ Виконані завдання</h2>

      {completedTasks.length === 0 ? (
        <p className="text-gray-500">Немає виконаних завдань для цієї зміни.</p>
      ) : (
        <div className="grid gap-4">
          {completedTasks.map((task) => (
            <div key={task.event_performance_number_identifier} className="border p-4 rounded-md shadow-sm bg-white">
              <p>
                <span className="font-semibold">Борт:</span> {task.aircraft_code}
              </p>
              <p>
                <span className="font-semibold">Код події:</span> {task.event_code}
              </p>
              <p>
                <span className="font-semibold">ID пакета:</span> {task.work_package_number_identifier}
              </p>
              <p>
                <span className="font-semibold">Пакет №:</span> {task.work_package_number}
              </p>
              <p>
                <span className="font-semibold">ID виконання події:</span> {task.event_performance_number_identifier}
              </p>
              <p>
                <span className="font-semibold">Опис:</span> {task.event_display_description}
              </p>
              <p>
                <span className="font-semibold">Оцінка людино-годин:</span> {task.estimated_man_hours}
              </p>
              <p>
                <span className="font-semibold">Статус:</span> {task.status}
              </p>
              <p>
                <span className="font-semibold">Виконано:</span> {task.completed === 1 ? "✅ Так" : "⏳ Ні"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
