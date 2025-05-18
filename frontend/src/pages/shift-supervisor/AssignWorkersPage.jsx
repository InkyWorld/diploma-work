import { useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import getShiftPlan from "../../services/shift-supervisor/getShiftPlan";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import getAllWorkers from "../../services/shift-supervisor/getAllWorkers";
import assignWorkersToTask from "../../services/shift-supervisor/assignWorkersToTask";

const mockWorkers = [
  {
    id: 6,
    full_name: "kkkkkkkkkk",
    email: "kkkk@aaa.com",
    img_profile:
      "https://res.cloudinary.com/dnt2jlkno/image/upload/c_fit,h_250,w_250/v1747051288/users_avatar/kkkk%40aaa.com/t4jroig1fiitr4cxbynj",
  },
  {
    id: 9,
    full_name: "TECHNICIAN",
    email: "yipav44034@hazhab.com",
    img_profile:
      "https://res.cloudinary.com/dnt2jlkno/image/upload/c_fit,h_250,w_250/v1747242801/users_avatar/yipav44034%40hazhab.com/keht7rigskdbwttqi1cn",
  },
];

const mockTask = {
  event_performance_number_identifier: 8147020,
  event_display_description:
    "8147020/BEFORE DEPARTURE PERFORM BEFORE DEPARTURE WORKS IN ACCORDING WITH ATTACHED DOCUMENT.",
  estimated_man_hours: 2,
  completed: false,
};
function shortWorkerName(fullName) {
  const nameWords = fullName.split(" ");
  if (nameWords.length < 3) return fullName;
  else {
    return [nameWords[0], nameWords[1].slice(0, 1) + ".", nameWords[2].slice(0, 1) + "."].join(" ");
  }
}

export default function AssignWorkersPage() {
  const { packageId, taskId, turnaroundId } = useParams();
  // console.log(packageId, taskId, turnaroundId);

  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const shift = searchParams.get("shift");
  console.log("AssignWorkersPage search params", date, shift);

  const [arrivedDate, arrivedFlight, station, departureFlight] = turnaroundId.split("|");

  const [assignedWorkersIds, setAssignedWorkersIds] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["shiftPlan", { date: date, shift: shift }],
    queryFn: getShiftPlan,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 5, // 10 хвилин у кеші
  });

  const { data: workers, isLoading: isWorkersLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: getAllWorkers,
    // staleTime: 1000 * 60 * 5, // 5 хвилин
    cacheTime: 1000 * 60 * 5, // 10 хвилин у кеші
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ eventId, shift, workersIds }) => assignWorkersToTask(eventId, shift, workersIds),
    onSuccess: (response, formParams) => {
      console.log("Завдання присвоєно:", response);
      console.log("Що передали в mutate:", formParams);
      // queryClient.invalidateQueries({ queryKey: ["shiftPlan", formParams] });
    },
  });

  if (isLoading || isWorkersLoading) return <Loader />;

  const normalize = (value) => (value === "null" ? null : value);

  const foundTurnaround = data.find(
    (item) =>
      item.turnaround.arrived_date === arrivedDate &&
      item.turnaround.aircraft === station &&
      item.turnaround.arrived_flight_name === normalize(arrivedFlight) &&
      item.turnaround.next_departure_flight_name === normalize(departureFlight)
  );
  console.log(`SEARCED OBJECT`, foundTurnaround);

  const currentPackage = foundTurnaround.work_package.find((pack) => pack.package_number_internal === packageId);
  const currentEvent = currentPackage.events.find((event) => event.event_performance_number_identifier === +taskId);
  // const currentEvent = currentPackage.events.find((event) => event.event_code === taskId);
  // console.log("currentPackage", currentPackage, currentEvent);

  function handleAssignWorker(workerId) {
    setAssignedWorkersIds((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    );
  }

  function handleSubmit() {
    console.log("Призначено працівників:", assignedWorkersIds);
    // Тут ти викликаєш API: PATCH /assign-task-to-workers
    // mutate(currentEvent.event_performance_number_identifier, shift, assignedWorkersIds);
    mutate({ eventId: currentEvent.event_performance_number_identifier, shift: shift, workersIds: assignedWorkersIds });
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Деталі завдання #{currentEvent.event_performance_number_identifier}
      </h2>

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-6">
        <p>
          <span className="font-semibold">Ідентифікаційний номер події:</span>{" "}
          {currentEvent.event_performance_number_identifier}
        </p>
        <p>
          <span className="font-semibold">Код події:</span> {currentEvent.event_code}
        </p>
        <p>
          <span className="font-semibold">Опис:</span> {currentEvent.event_display_description}
        </p>
        <p>
          <span className="font-semibold">Людино-години:</span> {currentEvent.estimated_man_hours}
        </p>
        <p>
          <span className="font-semibold">Статус:</span> {currentEvent.completed ? "Виконано" : "Не виконано"}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-3">Оберіть працівників для призначення на завдання:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => handleAssignWorker(worker.id)}
            className={`cursor-pointerborder border p-3 rounded-md flex items-center shadow-sm space-x-2 ${
              assignedWorkersIds.includes(worker.id)
                ? "bg-green-100 border-green-400"
                : "bg-white border-gray-200 hover:border-blue-600"
            }`}
          >
            <img src={worker.img_profile} alt={worker.full_name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{shortWorkerName(worker.full_name)}</p>
              <p className="text-sm text-gray-600">{worker.email}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workers.map((worker) => {
          // Скорочення імені до "Прізвище І.Б."
          const nameParts = worker.full_name.trim().split(" ");
          let displayName = worker.full_name;
          if (nameParts.length === 3) {
            displayName = `${nameParts[2]} ${nameParts[0][0]}.${nameParts[1][0]}.`;
          }

          const isAssigned = assignedWorkerIds.includes(worker.id);

          return (
            <div
              key={worker.id}
              onClick={() => handleAssignWorker(worker.id)}
              className={`relative bg-white shadow-lg rounded-xl p-5 flex flex-col items-center transition border-2 ${
                isAssigned
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-xl"
              } cursor-pointer group`}
            >
              <p className="font-bold text-lg text-center mb-1">{displayName}</p>
              <p className="text-sm text-gray-500 text-center mb-3">{worker.email}</p>
              <button
                type="button"
                className={`mt-auto px-4 py-1 rounded-full text-sm font-semibold transition ${
                  isAssigned
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
                }`}
              >
                {isAssigned ? "Обрано" : "Обрати"}
              </button>
            </div>
          );
        })}
      </div> */}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 px-6 py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Призначити вибраних працівників
      </button>
    </div>
  );
}
