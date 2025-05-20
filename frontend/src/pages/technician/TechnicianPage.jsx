import { useState } from "react";
import Loader from "../../components/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getTasks from "../../services/technician/getTasks";
import { useSelector } from "react-redux";
import markTaskDone from "../../services/technician/markTaskDone";
import toast from "react-hot-toast";

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

function getShift() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 8 && hour <= 20) {
    console.log("Зараз денна зміна");
    return "day";
  } else {
    console.log("Зараз нічна зміна");
    return "night";
  }
}

export default function TechnicianPage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  // console.log(currentUser);

  const shift = getShift();
  // console.log("current shift", shift);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", currentUser.email],
    queryFn: getTasks,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 5, // 10 хвилин у кеші
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ taskId, shift }) => markTaskDone(taskId, shift),
    onSuccess: (_, formParams) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentUser.email] });
      toast.success(`Work #${formParams.taskId} mark as done`);
    },
  });

  if (isLoading) return <Loader />;
  console.log("my tasks", data);

  // const currentDate = new Date().toLocaleDateString("uk-UA");
  // const currentTime = new Date().toLocaleTimeString("uk-UA");
  // const totalTasks = tasks.length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Вітаємо, {currentUser.full_name}!</h1>
          {/* <p className="text-gray-600">
            Дата: {currentDate}, {currentTime}
          </p> */}
          <p className="text-lg text-gray-500">Зміна: {shift === "day" ? "Денна" : "Нічна"}</p>
        </div>
      </div>

      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg font-medium">
          Сьогодні у вас <strong>{data.length}</strong> завдань.
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Виконуйте завдання згідно з інструкціями та дотримуйтесь техніки безпеки.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Завдання</h2>
        <ul className="space-y-4">
          {data.map((task) => (
            <li
              key={task.event_performance_number_identifier}
              className={`border rounded-xl p-4 shadow-sm transition ${
                task.completed ? "bg-green-50 border-green-400" : "bg-white border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">#{task.event_performance_number_identifier}</h3>
                <span className={`text-sm font-medium ${task.completed ? "text-green-600" : "text-orange-600"}`}>
                  {task.completed ? "✅ Виконано" : "⏳ Очікує"}
                </span>
              </div>
              {/* <h3 className="font-semibold text-lg mb-2">#{task.event_performance_number_identifier}</h3> */}
              <p className="mb-1 text-gray-800">
                <span className="font-semibold">Код події:</span> {task.event_code}
              </p>
              <p className="mb-1 text-gray-800">
                <span className="font-semibold">Опис:</span> {task.event_display_description}
              </p>
              <p className="mb-3 text-gray-800">
                <span className="font-semibold">Статус:</span> {task.status}
              </p>
              <button
                onClick={() => mutate({ taskId: task.event_performance_number_identifier, shift: shift })}
                disabled={isPending || task.completed}
                className={`px-4 py-2 rounded font-medium ${
                  task.completed
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {task.completed ? "Виконано" : "Позначити як виконано"}
              </button>
              {/* {!task.completed && (
                <button
                  onClick={() => mutate({ taskId: task.event_performance_number_identifier, shift: shift })}
                  disabled={isPending}
                  className="px-4 py-2 rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Позначити як виконано
                </button>
              )} */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
