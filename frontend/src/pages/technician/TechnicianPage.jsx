import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getTasks from "../../services/technician/getTasks";
import { useSelector } from "react-redux";
import markTaskDone from "../../services/technician/markTaskDone";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import TechnicianPageFilters, { applyTechnicianFilters } from "../../features/technician/TechnicianPageFilters";
import EventCard from "../../components/EventCard";

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

  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({ filter: searchParams.get("filter") || "pending" });
  useEffect(() => setSearchParams(queryParams), [queryParams]);

  function handleChangeFilter(newFilter) {
    setQueryParams({ filter: newFilter });
  }

  if (isLoading) return <Loader />;
  console.log("my tasks", data);
  const filteredData = applyTechnicianFilters(data, queryParams.filter);
  console.log("filteredData", filteredData);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Вітаємо, {currentUser.full_name}!</h1>
          <p className="text-lg text-gray-500">Зміна: {shift === "day" ? "Денна" : "Нічна"}</p>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-lg font-medium">
          Кількість завдань на сьогодні: <strong>{data.filter((task) => task.completed === false).length}</strong>
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Виконуйте завдання згідно з інструкціями та дотримуйтесь техніки безпеки.
        </p>
      </section>

      <TechnicianPageFilters currentFilter={queryParams.filter} setFilter={handleChangeFilter} />

      <section className="space-y-4  p-4">
        {!filteredData.length && queryParams.filter !== "done" && (
          <p className="text-center text-lg font-medium">
            На даний момент у вас немає активних завдань для виконання. Будь ласка, перевірте пізніше або зверніться до
            керівника зміни.
          </p>
        )}
        {!filteredData.length && queryParams.filter === "done" && (
          <p className="text-center text-lg font-medium">
            Ви ще не виконали жодного завдання. Виконані завдання з’являться тут після завершення. Бажаємо успіхів у
            роботі!
          </p>
        )}
        {filteredData.length > 0 &&
          filteredData.map((itemData) => (
            <EventCard
              key={itemData.event_performance_number_identifier}
              data={itemData}
              buttonText="Позначити як виконане"
              isLoading={isPending}
              handleClick={() => mutate({ taskId: itemData.event_performance_number_identifier, shift: shift })}
            />
          ))}
      </section>
    </div>
  );
}

{
  /* <EventCard
  data={{
    completed: false,
    estimated_man_hours: 0,
    event_code: "024147-000",
    event_display_description: "AFTER ARRIVAL CHECK CABIN FOR LOST ITEMS.",
    event_performance_number_identifier: 8147029,
    status: "N",
  }}
/>; */
}
