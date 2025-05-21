import { useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import getShiftPlan from "../../services/shift-supervisor/getShiftPlan";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import getAllWorkers from "../../services/shift-supervisor/getAllWorkers";
import assignWorkersToTask from "../../services/shift-supervisor/assignWorkersToTask";
import { toast } from "react-hot-toast";
import ButtonBack from "../../components/ButtonBack";
import EventCard from "../../components/EventCard";
import { shortWorkerName } from "../../helpers/helpers";

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

// function shortWorkerName(fullName) {
//   const nameWords = fullName.split(" ");
//   if (nameWords.length < 3) return fullName;
//   else {
//     return [nameWords[0], nameWords[1].slice(0, 1) + ".", nameWords[2].slice(0, 1) + "."].join(" ");
//   }
// }

export default function AssignWorkersPage() {
  const { packageId, taskId, turnaroundId } = useParams();
  // console.log(packageId, taskId, turnaroundId);
  const navigate = useNavigate();

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
      toast.success(`Завдання ${formParams.eventId} призначено для виконання`);
      navigate(-1);
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
    mutate({ eventId: currentEvent.event_performance_number_identifier, shift: shift, workersIds: assignedWorkersIds });
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ButtonBack />
      <h2 className="text-2xl font-bold mb-4 text-center">
        Деталі завдання #{currentEvent.event_performance_number_identifier}
      </h2>

      <EventCard data={currentEvent} />

      <h3 className="text-xl font-semibold my-3">Оберіть працівників для призначення на завдання:</h3>
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

      <button
        onClick={handleSubmit}
        disabled={isPending || !assignedWorkersIds.length}
        className="w-full mt-6 px-6 py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Призначити вибраних працівників
      </button>
    </div>
  );
}
